import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PUBLIC_CACHE_CONTROL, RESOURCE_TAXONOMY_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
import { getCachedNavigationTaxonomy } from "@/lib/public-content";
import {
  assertUniqueCategorySlug,
  categorySlug,
  getResourceTaxonomy,
} from "@/lib/resource-taxonomy";

export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("scope") === "admin";
    if (adminView) await requireAdmin(request);
    const taxonomy = adminView
      ? await getResourceTaxonomy({ initialize: true, includeDrafts: true })
      : await getCachedNavigationTaxonomy();
    return NextResponse.json(
      taxonomy,
      adminView ? undefined : { headers: { "Cache-Control": PUBLIC_CACHE_CONTROL } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    await getResourceTaxonomy({ initialize: true, includeDrafts: true });
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "A JSON category body is required");
    }
    if (!body || typeof body !== "object") throw new HttpError(400, "A category body is required");
    const input = body as Record<string, unknown>;
    const kind = input.kind;
    if (kind !== "major" && kind !== "subcategory") throw new HttpError(400, "kind must be major or subcategory");
    const name = typeof input.name === "string" ? input.name.trim() : "";
    if (!name || name.length > 100) throw new HttpError(400, "Category name must be between 1 and 100 characters");
    const slug = categorySlug(name);
    const parentId = kind === "subcategory" && typeof input.parentId === "string" ? input.parentId : undefined;
    if (kind === "subcategory") {
      const parent = await firestore().collection("resourceCategories").doc(parentId ?? "").get();
      if (!parent.exists || parent.data()?.kind !== "major") throw new HttpError(400, "Select a valid major category");
    }
    await assertUniqueCategorySlug(kind, slug, parentId);
    const collection = firestore().collection("resourceCategories");
    const siblings = await collection.where("kind", "==", kind).get();
    const reference = collection.doc();
    await reference.set({
      kind,
      name,
      slug,
      ...(parentId ? { parentId } : {}),
      order: siblings.size,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    revalidateTag(RESOURCE_TAXONOMY_TAG, { expire: 0 });
    return NextResponse.json({ id: reference.id, kind, name, slug, parentId, order: siblings.size, count: 0 }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
