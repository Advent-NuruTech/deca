import { FieldValue } from "firebase-admin/firestore";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { errorResponse, HttpError, requireAdmin } from "@/lib/auth";
import { PUBLIC_ARTICLES_TAG, RESOURCE_TAXONOMY_TAG } from "@/lib/cache-tags";
import {
  beginD1ReadModelUpdate,
  publicArticleFromDocument,
  replaceD1Articles,
} from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
import {
  assertUniqueCategorySlug,
  categorySlug,
  getResourceTaxonomy,
  updateArticlesForTaxonomyChange,
} from "@/lib/resource-taxonomy";

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
    await getResourceTaxonomy({ initialize: true, includeDrafts: true });
    const { id } = await params;
    const reference = firestore().collection("resourceCategories").doc(id);
    const existing = await reference.get();
    if (!existing.exists || (existing.data()?.kind !== "major" && existing.data()?.kind !== "subcategory")) throw new HttpError(404, "Category not found");
    const current = existing.data()!;
    const body = await jsonBody(request);
    const updates: Record<string, unknown> = {};
    if ("name" in body) {
      const name = typeof body.name === "string" ? body.name.trim() : "";
      if (!name || name.length > 100) throw new HttpError(400, "Category name must be between 1 and 100 characters");
      const slug = categorySlug(name);
      await assertUniqueCategorySlug(current.kind, slug, current.parentId, id);
      updates.name = name;
      updates.slug = slug;
    }
    if (current.kind === "subcategory" && "parentId" in body) {
      const parentId = typeof body.parentId === "string" ? body.parentId : "";
      const parent = await firestore().collection("resourceCategories").doc(parentId).get();
      if (!parent.exists || parent.data()?.kind !== "major") throw new HttpError(400, "Select a valid major category");
      updates.parentId = parentId;
      if (parentId !== current.parentId) {
        await assertUniqueCategorySlug("subcategory", String(updates.slug ?? current.slug), parentId, id);
        await updateArticlesForTaxonomyChange((data) => data.subcategoryId === id, { majorCategoryId: parentId });
      }
    }
    if (!Object.keys(updates).length) throw new HttpError(400, "No supported category changes were provided");
    updates.updatedAt = FieldValue.serverTimestamp();
    await reference.update(updates);
    revalidateTag(RESOURCE_TAXONOMY_TAG, { expire: 0 });
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json({ id, ...current, ...updates });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    const taxonomy = await getResourceTaxonomy({ initialize: true, includeDrafts: true });
    const { id } = await params;
    const reference = firestore().collection("resourceCategories").doc(id);
    const existing = await reference.get();
    if (!existing.exists || (existing.data()?.kind !== "major" && existing.data()?.kind !== "subcategory")) throw new HttpError(404, "Category not found");
    const category = existing.data()!;
    const body = await jsonBody(request);
    const replacementId = typeof body.replacementId === "string" ? body.replacementId : "";
    let replacementSubcategory: (typeof taxonomy.subcategories)[number] | undefined;
    let replacementMajor: (typeof taxonomy.majors)[number] | undefined;

    if (category.kind === "subcategory") {
      const assigned = taxonomy.subcategories.find((item) => item.id === id)?.count ?? 0;
      if (assigned > 0) {
        replacementSubcategory = taxonomy.subcategories.find((item) => item.id === replacementId && item.id !== id);
        if (!replacementSubcategory) throw new HttpError(409, "Choose another subcategory to receive the resources before deleting this one");
      }
    } else {
      const children = taxonomy.subcategories.filter((item) => item.parentId === id);
      const assigned = taxonomy.majors.find((item) => item.id === id)?.count ?? 0;
      if (children.length || assigned > 0) {
        replacementMajor = taxonomy.majors.find((item) => item.id === replacementId && item.id !== id);
        if (!replacementMajor) throw new HttpError(409, "Choose another major category to receive its subcategories and resources before deleting this one");
      }
    }

    const syncD1 = await beginD1ReadModelUpdate("articles");
    if (category.kind === "subcategory") {
      if (replacementSubcategory) {
        await updateArticlesForTaxonomyChange((data) => data.subcategoryId === id, {
          majorCategoryId: replacementSubcategory.parentId,
          subcategoryId: replacementSubcategory.id,
        });
      }
    } else {
      const children = taxonomy.subcategories.filter((item) => item.parentId === id);
      if (replacementMajor) {
        const db = firestore();
        for (const child of children) await db.collection("resourceCategories").doc(child.id).update({ parentId: replacementMajor.id, updatedAt: FieldValue.serverTimestamp() });
        await updateArticlesForTaxonomyChange((data) => data.majorCategoryId === id, { majorCategoryId: replacementMajor.id });
      }
    }
    await reference.delete();
    if (syncD1) {
      try {
        const published = await firestore().collection("articles").where("published", "==", true).get();
        await replaceD1Articles(published.docs.map(publicArticleFromDocument));
      } catch (error) {
        console.error("Category deletion succeeded; D1 articles remain disabled until resynchronized.", error);
      }
    }
    revalidateTag(RESOURCE_TAXONOMY_TAG, { expire: 0 });
    revalidateTag(PUBLIC_ARTICLES_TAG, { expire: 0 });
    return NextResponse.json({ message: "Category deleted", replacementId: replacementId || null });
  } catch (error) {
    return errorResponse(error);
  }
}
