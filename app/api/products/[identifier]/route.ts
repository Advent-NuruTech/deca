import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PUBLIC_CACHE_CONTROL, PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
import { getCachedActiveProductBySlug } from "@/lib/public-content";
import {
  assertUniqueProductSlug,
  productSlug,
  serializeProduct,
  validateProductBody,
  withUpdateTimestamp,
} from "@/lib/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    const { identifier } = await params;
    const product = await getCachedActiveProductBySlug(identifier);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    return NextResponse.json(product, { headers: { "Cache-Control": PUBLIC_CACHE_CONTROL } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    await requireAdmin(request);
    const { identifier } = await params;
    const reference = firestore().collection("products").doc(identifier);
    const existing = await reference.get();
    if (!existing.exists) throw new HttpError(404, "Product not found");

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A valid JSON product body is required");
    }
    const data = validateProductBody(body, true);
    const input = body as Record<string, unknown>;
    for (const key of ["features", "brand", "model", "seoTitle", "seoDescription", "seedType"] as const) {
      if (key in input && (input[key] === "" || input[key] === null)) data[key] = FieldValue.delete();
    }
    if ("originalPrice" in input && input.originalPrice === null) data.originalPrice = FieldValue.delete();
    if (typeof data.name === "string") {
      const slug = productSlug(data.name);
      await assertUniqueProductSlug(slug, identifier);
      data.slug = slug;
    }
    await reference.update(withUpdateTimestamp(data));
    const updated = await reference.get();
    revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    return NextResponse.json(serializeProduct(updated));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> },
) {
  try {
    await requireAdmin(request);
    const { identifier } = await params;
    const reference = firestore().collection("products").doc(identifier);
    const existing = await reference.get();
    if (!existing.exists) throw new HttpError(404, "Product not found");
    await reference.delete();
    revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
