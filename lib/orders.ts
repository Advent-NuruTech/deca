import "server-only";

import { FieldValue, type DocumentData, type DocumentSnapshot } from "firebase-admin/firestore";
import { HttpError } from "@/lib/auth";
import { serializeValue } from "@/lib/products";
import type { OrderCustomer, PublicOrder } from "@/lib/types";

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;

export type ValidatedOrderInput = {
  customer: OrderCustomer;
  items: Array<{ product: string; quantity: number; variantId?: string }>;
  notes?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredString(record: Record<string, unknown>, key: string, max: number): string {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) throw new HttpError(400, `${key} is required`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new HttpError(400, `${key} is too long`);
  return trimmed;
}

function optionalString(record: Record<string, unknown>, key: string, max: number): string | undefined {
  const value = record[key];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new HttpError(400, `${key} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new HttpError(400, `${key} is too long`);
  return trimmed || undefined;
}

export function validateOrderBody(value: unknown): ValidatedOrderInput {
  if (!isRecord(value)) throw new HttpError(400, "A JSON order body is required");
  if (!isRecord(value.customer)) throw new HttpError(400, "customer is required");
  const customerInput = value.customer;
  const email = requiredString(customerInput, "email", 254).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, "email is invalid");
  const phone = requiredString(customerInput, "phone", 40);
  if (!/^[0-9+\-\s()]+$/.test(phone)) throw new HttpError(400, "phone is invalid");
  if (!isRecord(customerInput.address)) throw new HttpError(400, "address is required");
  const addressInput = customerInput.address;

  const customer: OrderCustomer = {
    name: requiredString(customerInput, "name", 120),
    email,
    phone,
    address: {
      street: requiredString(addressInput, "street", 240),
      city: requiredString(addressInput, "city", 120),
      county: requiredString(addressInput, "county", 120),
      postalCode: optionalString(addressInput, "postalCode", 30),
      country: optionalString(addressInput, "country", 80) ?? "Kenya",
    },
  };

  if (!Array.isArray(value.items) || value.items.length === 0 || value.items.length > 50) {
    throw new HttpError(400, "items must contain between 1 and 50 products");
  }
  const items = value.items.map((item, index) => {
    if (!isRecord(item)) throw new HttpError(400, `items[${index}] is invalid`);
    const product = requiredString(item, "product", 200);
    const quantity = item.quantity;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
      throw new HttpError(400, `items[${index}].quantity is invalid`);
    }
    const variantId = optionalString(item, "variantId", 100);
    return { product, quantity, ...(variantId ? { variantId } : {}) };
  });
  if (new Set(items.map((item) => JSON.stringify([item.product, item.variantId ?? null]))).size !== items.length) {
    throw new HttpError(400, "Each product option may appear only once");
  }

  return { customer, items, notes: optionalString(value, "notes", 2000) };
}

export function validateStatusBody(value: unknown) {
  if (!isRecord(value)) throw new HttpError(400, "A JSON status body is required");
  const orderStatus = value.orderStatus;
  const paymentStatus = value.paymentStatus;
  if (orderStatus !== undefined && (typeof orderStatus !== "string" || !orderStatus.trim() || orderStatus.length > 100)) {
    throw new HttpError(400, "Invalid order status");
  }
  if (paymentStatus !== undefined && !PAYMENT_STATUSES.includes(paymentStatus as (typeof PAYMENT_STATUSES)[number])) {
    throw new HttpError(400, "Invalid payment status");
  }
  if (orderStatus === undefined && paymentStatus === undefined) {
    throw new HttpError(400, "orderStatus or paymentStatus is required");
  }
  return { orderStatus, paymentStatus };
}

export function createOrderNumber() {
  return `FTI-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
}

export function orderTimestamps() {
  return { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };
}

export function serializeOrder(document: DocumentSnapshot<DocumentData>): PublicOrder {
  return serializeValue({ _id: document.id, id: document.id, ...document.data() }) as PublicOrder;
}

export function timestamp(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }
  const parsed = typeof value === "string" ? Date.parse(value) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}
