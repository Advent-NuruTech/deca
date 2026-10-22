import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin, requireAuth } from "@/lib/auth";
import { PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import {
  beginD1ReadModelUpdate,
  markD1ReadModelReady,
  syncD1ProductDocument,
} from "@/lib/d1-public-store";
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
    const productReferences = [...new Set(input.items.map((item) => item.product))].map((id) => database.collection("products").doc(id));

    await database.runTransaction(async (transaction) => {
      const products = await Promise.all(productReferences.map ( (reference) => transaction.get(reference)));
      const byId = new Map(products.map((product) => [product.id, product]));
      const updates = new Map<string, { variants?: Array<{ id: string; name: string; price: number; stockQuantity: number; image?: string }>; stockQuantity: number }>();
      const items = input.items.map((requested) => {
        const product = byId.get(requested.product);
        if (!product?.exists) throw new HttpError(400, "A product in your cart was not found");
        const data = product.data() ?? {};
        const variants = Array.isArray(data.variants) ? data.variants : [];
        const update = updates.get(product.id) ?? { variants: variants.length ? variants.map((v) => ({ ...v })) : undefined, stockQuantity: Number(data.stockQuantity ?? 0) };
        if (data.status !== "active") throw new HttpError(400, `Product ${String(data.name)} is unavailable`);
        const variant = update.variants?.find((v) => v.id === requested.variantId);
        if ((update.variants && !variant) || (!update.variants && requested.variantId)) throw new HttpError(400, `Please select an available option for ${String(data.name)}`);
        const stock = variant ? variant.stockQuantity : update.stockQuantity;
        if ((!variant && data.inStock !== true) || !Number.isFinite(stock) || stock < requested.quantity) throw new HttpError(400, `Insufficient stock for ${String(data.name)}${variant ? ` (${variant.name})` : ""}`);
        const price = Number(variant ? variant.price : data.price);
        if (!Number.isFinite(price) || price <= 0) throw new Error("A product has an invalid price");
        if (variant) variant.stockQuantity -= requested.quantity;
        else update.stockQuantity -= requested.quantity;
        updates.set(product.id, update);
        return { product: product.id, ...(variant ? { variantId: variant.id, variantName: variant.name } : {}), name: String(data.name ?? "Product"), price, quantity: requested.quantity, image: variant?.image || (Array.isArray(data.images) && typeof data.images[0] === "string" ? data.images[0] : "") };
      });
      for (const [id, update] of updates) {
        const stockQuantity = update.variants ? update.variants.reduce((sum, v) => sum + v.stockQuantity, 0) : update.stockQuantity;
        transaction.update(byId.get(id)!.ref, { ...(update.variants ? { variants: update.variants } : {}), stockQuantity, inStock: stockQuantity > 0, updatedAt: FieldValue.serverTimestamp() });
      }
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

    const syncD1 = await beginD1ReadModelUpdate("products");
    if (syncD1) {
      try {
        const updatedProducts = await database.getAll(...productReferences);
        await Promise.all(updatedProducts.map(syncD1ProductDocument));
        await markD1ReadModelReady("products");
      } catch (error) {
        console.error("Order completed safely in Firestore; D1 product projection remains disabled until resynchronized.", error);
      }
    }

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
