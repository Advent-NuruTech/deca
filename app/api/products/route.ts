import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import {
  assertUniqueProductSlug,
  productSlug,
  serializeProduct,
  serializeValue,
  validateProductBody,
  withCreateTimestamps,
} from "@/lib/products";

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

    const snapshot = await firestore().collection("products").get();
    const matching = snapshot.docs
      .map((document) => serializeProduct(document) as unknown as StoredRecord)
      .filter((product) => adminView || product.status === "active")
      .filter((product) => !status || product.status === status)
      .filter((product) => !category || product.category === category)
      .filter((product) => featured === null || Boolean(product.featured) === (featured === "true"))
      .filter((product) => {
        if (!search) return true;
        return `${product.name ?? ""} ${product.description ?? ""}`.toLowerCase().includes(search);
      })
      .sort((left, right) => timestamp(right.createdAt) - timestamp(left.createdAt));

    const total = matching.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    const products = matching.slice((currentPage - 1) * limit, currentPage * limit).map(serializeValue);

    return NextResponse.json({ products, total, totalPages, currentPage });
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
    const slug = productSlug(data.name as string);
    await assertUniqueProductSlug(slug);
    const reference = await firestore()
      .collection("products")
      .add(withCreateTimestamps({ ...data, slug }));
    const created = await reference.get();
    return NextResponse.json(serializeProduct(created), { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
