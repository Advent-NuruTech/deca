import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PRODUCT_CATEGORIES_TAG, PUBLIC_CACHE_CONTROL } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
import {
  assertUniqueProductCategorySlug,
  getProductCategories,
  productCategorySlug,
} from "@/lib/product-categories";

export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("scope") === "admin";
    if (adminView) await requireAdmin(request);
    const countFor = request.nextUrl.searchParams.get("countFor");
    if (adminView && countFor) {
      const count = await firestore().collection("products").where("category", "==", countFor).count().get();
      return NextResponse.json({ count: count.data().count });
    }
    const categories = await getProductCategories(adminView
      ? { initialize: true, includeInactive: true, includeCounts: request.nextUrl.searchParams.get("light") !== "true" }
      : { includeInactive: false });
    return NextResponse.json(
      { categories },
      adminView ? undefined : { headers: { "Cache-Control": PUBLIC_CACHE_CONTROL } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await getProductCategories({ initialize: true, includeInactive: true, includeCounts: false });
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A JSON category body is required");
    }
    const name = body && typeof body === "object" && typeof (body as Record<string, unknown>).name === "string"
      ? String((body as Record<string, unknown>).name).trim()
      : "";
    if (!name || name.length > 100) throw new HttpError(400, "Category name must be between 1 and 100 characters");
    const slug = productCategorySlug(name);
    await assertUniqueProductCategorySlug(slug);
    const collection = firestore().collection("productCategories");
    const categories = await getProductCategories({ includeInactive: true, includeCounts: false });
    const reference = collection.doc();
    const order = categories.length;
    await reference.set({
      name,
      slug,
      order,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(PRODUCT_CATEGORIES_TAG, { expire: 0 });
    return NextResponse.json({ id: reference.id, name, slug, order, count: 0 }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
