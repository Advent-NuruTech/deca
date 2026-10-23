import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PRODUCT_CATEGORIES_TAG, PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import { beginD1ReadModelUpdate, replaceD1Products } from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
import {
  assertUniqueProductCategorySlug,
  getProductCategories,
  productCategorySlug,
  updateProductsForCategoryChange,
} from "@/lib/product-categories";
import { serializeProduct } from "@/lib/products";

async function jsonBody(request: NextRequest) {
  try {
    const value: unknown = await request.json();
    return value && typeof value === "object" ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await getProductCategories({ initialize: true, includeInactive: true, includeCounts: false });
    const { id } = await params;
    const reference = firestore().collection("productCategories").doc(id);
    const existing = await reference.get();
    if (!existing.exists || id === "_config") throw new HttpError(404, "Category not found");
    const body = await jsonBody(request);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 100) throw new HttpError(400, "Category name must be between 1 and 100 characters");
    const slug = productCategorySlug(name);
    await assertUniqueProductCategorySlug(slug, id);
    await reference.update({ name, slug, updatedAt: FieldValue.serverTimestamp() });
    revalidateTag(PRODUCT_CATEGORIES_TAG, { expire: 0 });
    return NextResponse.json({ id, ...existing.data(), name, slug });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const categories = await getProductCategories({ initialize: true, includeInactive: true, includeCounts: false });
    const { id } = await params;
    const category = categories.find((item) => item.id === id);
    if (!category) throw new HttpError(404, "Category not found");
    const count = (await firestore().collection("products").where("category", "==", id).count().get()).data().count;
    const body = await jsonBody(request);
    const replacementId = typeof body.replacementId === "string" ? body.replacementId : "";
    if (count > 0 && !categories.some((item) => item.id === replacementId && item.id !== id)) {
      throw new HttpError(409, "Choose another category to receive the products before deleting this one");
    }

    const syncD1 = count > 0 ? await beginD1ReadModelUpdate("products") : false;
    if (count > 0) await updateProductsForCategoryChange(id, replacementId);
    await firestore().collection("productCategories").doc(id).delete();
    if (syncD1) {
      try {
        const active = await firestore().collection("products").where("status", "==", "active").get();
        await replaceD1Products(active.docs.map(serializeProduct));
      } catch (error) {
        console.error("Product category deletion succeeded; D1 products remain disabled until resynchronized.", error);
      }
    }
    revalidateTag(PRODUCT_CATEGORIES_TAG, { expire: 0 });
    revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    return NextResponse.json({ message: "Category deleted", replacementId: replacementId || null });
  } catch (error) {
    return errorResponse(error);
  }
}
