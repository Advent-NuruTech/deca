import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin, requireAuth } from "@/lib/auth";
import { PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
import {
  createOrderNumber,
  orderTimestamps,
  serializeOrder,
  SHIPPING_RATES,
  timestamp,
  validateOrderBody,
} from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body: unknown = await request.json().catch(() => null);
    const input = validateOrderBody(body);
    const database = firestore();
    const orderReference = database.collection("orders").doc();
    const productReferences = input.items.map((item) => database.collection("products").doc(item.product));

    await database.runTransaction(async (transaction) => {
      const products = await Promise.all(productReferences.map((reference) => transaction.get(reference)));
      const items = products.map((product, index) => {
        const requested = input.items[index];
        if (!product.exists) throw new HttpError(400, "A product in your cart was not found");
        const data = product.data() ?? {};
        const quantity = requested.quantity;
        const stockQuantity = Number(data.stockQuantity ?? 0);
        if (data.status !== "active" || data.inStock !== true || !Number.isFinite(stockQuantity) || stockQuantity < quantity) {
          throw new HttpError(400, `Insufficient stock for ${String(data.name ?? "a cart item")}`);
        }
        const price = Number(data.price);
        if (!Number.isFinite(price) || price < 0) throw new Error("A product has an invalid price");
        transaction.update(product.ref, {
          stockQuantity: FieldValue.increment(-quantity),
          inStock: stockQuantity - quantity > 0,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return {
          product: product.id,
          name: String(data.name ?? "Product"),
          price,
          quantity,
          image: Array.isArray(data.images) && typeof data.images[0] === "string" ? data.images[0] : "",
        };
      });
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = SHIPPING_RATES[input.shippingMethod];
      transaction.set(orderReference, {
        userId: user.uid,
        orderNumber: createOrderNumber(),
        customer: input.customer,
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
        paymentMethod: input.paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
        shippingMethod: input.shippingMethod,
        ...(input.notes ? { notes: input.notes } : {}),
        ...orderTimestamps(),
      });
    });

    revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    return NextResponse.json(serializeOrder(await orderReference.get()), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const status = request.nextUrl.searchParams.get("status")?.trim() ?? "";
    const paymentStatus = request.nextUrl.searchParams.get("paymentStatus")?.trim() ?? "";
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 20));
    const snapshot = await firestore().collection("orders").get();
    const matching = snapshot.docs
      .filter((document) => !status || document.data().orderStatus === status)
      .filter((document) => !paymentStatus || document.data().paymentStatus === paymentStatus)
      .sort((left, right) => timestamp(right.data().createdAt) - timestamp(left.data().createdAt));
    const total = matching.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const orders = matching.slice((currentPage - 1) * limit, currentPage * limit).map(serializeOrder);
    return NextResponse.json({ orders, totalPages, currentPage, total });
  } catch (error) {
    return errorResponse(error);
  }
}
