import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PUBLIC_CACHE_CONTROL, PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import {
  beginD1ReadModelUpdate,
  deleteD1Product,
  markD1ReadModelReady,
  syncD1ProductDocument,
} from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
import { getCachedActiveProductBySlug } from "@/lib/public-content";
import {
  assertUniqueProductSlug,
  productSlug,
  serializeProduct,
  validateProductBody,
  withUpdateTimestamp,
} from "@/lib/products";
import { validateProductCategory } from "@/lib/product-categories";

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
    await validateProductCategory(data, existing.data());
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
    const syncD1 = await beginD1ReadModelUpdate("products");
    let updated;
    try {
      await reference.update(withUpdateTimestamp(data));
      updated = await reference.get();
      if (syncD1) {
        await syncD1ProductDocument(updated);
        await markD1ReadModelReady("products");
      }
    } catch (error) {
      try {
        await reference.set(existing.data() ?? {});
        if (syncD1) {
          await syncD1ProductDocument(existing);
          await markD1ReadModelReady("products");
        }
      } catch (rollbackError) {
        throw new Error(
          `Product update failed and rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : "unknown rollback error"}`,
          { cause: error },
        );
      }
      throw error;
    }
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
    const syncD1 = await beginD1ReadModelUpdate("products");
    try {
      await reference.delete();
      if (syncD1) {
        await deleteD1Product(identifier);
        await markD1ReadModelReady("products");
      }
    } catch (error) {
      try {
        await reference.set(existing.data() ?? {});
        if (syncD1) {
          await syncD1ProductDocument(existing);
          await markD1ReadModelReady("products");
        }
      } catch (rollbackError) {
        throw new Error(
          `Product deletion failed and rollback also failed: ${rollbackError instanceof Error ? rollbackError.message : "unknown rollback error"}`,
          { cause: error },
        );
      }
      throw error;
    }
    revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
