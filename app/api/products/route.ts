import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PUBLIC_CACHE_CONTROL, PUBLIC_PRODUCTS_TAG } from "@/lib/cache-tags";
import {
  beginD1ReadModelUpdate,
  deleteD1Product,
  markD1ReadModelReady,
  syncD1ProductDocument,
} from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
import { getCachedActiveProducts } from "@/lib/public-content";
import {
  assertUniqueProductSlug,
  productSlug,
  serializeProduct,
  serializeValue,
  validateProductBody,
  withCreateTimestamps,
} from "@/lib/products";
import { validateProductCategory } from "@/lib/product-categories";
import { richTextToPlainText } from "@/lib/rich-text";

type StoredRecord = Record<string, unknown>;

function timestamp(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value && typeof value.toMillis === "function") {
    return value.toMillis();
  }
  const parsed = typeof value === "string" ? Date.parse(value) : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("scope") === "admin";
    if (adminView) await requireAdmin(request);
    const category = request.nextUrl.searchParams.get("category")?.trim().toLowerCase() ?? "";
    const search = request.nextUrl.searchParams.get("search")?.trim().toLowerCase() ?? "";
    const featured = request.nextUrl.searchParams.get("featured");
    const status = request.nextUrl.searchParams.get("status")?.trim().toLowerCase() ?? "";
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 12));

    const availableProducts = adminView
      ? (await firestore().collection("products").get()).docs.map((document) => serializeProduct(document) as unknown as StoredRecord)
      : await getCachedActiveProducts() as unknown as StoredRecord[];
    const matching = availableProducts
      .filter((product) => !status || product.status === status)
      .filter((product) => !category || product.category === category)
      .filter((product) => featured === null || Boolean(product.featured) === (featured === "true"))
      .filter((product) => {
        if (!search) return true;
        return `${product.name ?? ""} ${richTextToPlainText(String(product.description ?? ""))}`.toLowerCase().includes(search);
      })
      .sort((left, right) => timestamp(right.createdAt) - timestamp(left.createdAt));

    const total = matching.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const products = matching.slice((currentPage - 1) * limit, currentPage * limit).map(serializeValue);

    return NextResponse.json(
      { products, total, totalPages, currentPage },
      adminView ? undefined : { headers: { "Cache-Control": PUBLIC_CACHE_CONTROL } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A valid JSON product body is required");
    }
    const data = validateProductBody(body);
    await validateProductCategory(data);
    const slug = productSlug(data.name as string);
    await assertUniqueProductSlug(slug);
    const syncD1 = await beginD1ReadModelUpdate("products");
    let reference;
    try {
      reference = await firestore()
        .collection("products")
        .add(withCreateTimestamps({ ...data, slug }));
    } catch (error) {
      if (syncD1) await markD1ReadModelReady("products").catch(() => undefined);
      throw error;
    }
    const created = await reference.get();
    if (syncD1) {
      try {
        await syncD1ProductDocument(created);
        await markD1ReadModelReady("products");
      } catch (error) {
        const rollback = await Promise.allSettled([reference.delete(), deleteD1Product(reference.id)]);
        if (rollback[1]?.status === "fulfilled") {
          await markD1ReadModelReady("products").catch(() => undefined);
        }
        if (rollback[0]?.status === "rejected") {
          throw new Error(
            `Product creation failed and Firestore rollback also failed: ${rollback[0].reason instanceof Error ? rollback[0].reason.message : "unknown rollback error"}`,
            { cause: error },
          );
        }
        throw error;
      }
    }
    revalidateTag(PUBLIC_PRODUCTS_TAG, { expire: 0 });
    return NextResponse.json(serializeProduct(created), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
