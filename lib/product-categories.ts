import "server-only";

import slugify from "slugify";
import { FieldValue, type DocumentData, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { HttpError } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import type { ProductCategory } from "@/lib/types";

const CONFIG_ID = "_config";
const DEFAULT_CATEGORIES = [
  { id: "seeds", name: "Organic Seeds", slug: "seeds", order: 0 },
  { id: "produce", name: "Fresh Produce", slug: "produce", order: 1 },
  { id: "other", name: "Other Products", slug: "other", order: 2 },
] as const;

function recordFromDocument(document: QueryDocumentSnapshot<DocumentData>): ProductCategory | null {
  const data = document.data();
  if (typeof data.name !== "string" || typeof data.slug !== "string") return null;
  return {
    id: document.id,
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    order: Number(data.order ?? 0),
    count: 0,
  };
}

export function productCategorySlug(name: string) {
  const slug = slugify(name, { lower: true, strict: true });
  if (!slug) throw new HttpError(400, "Category name must contain letters or numbers");
  return slug;
}

export async function getProductCategories(options: {
  initialize?: boolean;
  includeInactive?: boolean;
  includeCounts?: boolean;
  productDocuments?: QueryDocumentSnapshot<DocumentData>[];
} = {}): Promise<ProductCategory[]> {
  const db = firestore();
  const collection = db.collection("productCategories");
  const snapshot = await collection.get();
  const configured = snapshot.docs.some((document) => document.id === CONFIG_ID);
  let categories = snapshot.docs
    .filter((document) => document.id !== CONFIG_ID)
    .map(recordFromDocument)
    .filter((item): item is ProductCategory => item !== null);

  if (!configured) {
    const known = new Map(categories.map((item) => [item.id, item]));
    for (const category of DEFAULT_CATEGORIES) {
      if (!known.has(category.id)) known.set(category.id, { ...category, count: 0 });
    }
    categories = [...known.values()];
    if (options.initialize) {
      const batch = db.batch();
      for (const category of categories) {
        const { id, count: _count, ...data } = category;
        batch.set(collection.doc(id), {
          ...data,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      batch.set(collection.doc(CONFIG_ID), { version: 1, initializedAt: FieldValue.serverTimestamp() });
      await batch.commit();
    }
  }

  if (options.includeCounts !== false) {
    const products = options.productDocuments ?? (await db.collection("products").get()).docs;
    for (const product of products) {
      if (!options.includeInactive && product.data().status !== "active") continue;
      const category = categories.find((item) => item.id === product.data().category);
      if (category) category.count += 1;
    }
  }

  return categories.sort((left, right) => left.order - right.order || left.name.localeCompare(right.name));
}

export async function assertUniqueProductCategorySlug(slug: string, excludingId?: string) {
  const snapshot = await firestore().collection("productCategories").get();
  const duplicate = snapshot.docs.some((document) =>
    document.id !== excludingId && document.data().slug === slug,
  );
  if (duplicate) throw new HttpError(409, "A product category with this name already exists");
}

export async function validateProductCategory(
  metadata: Record<string, unknown>,
  existing: DocumentData = {},
) {
  const categories = await getProductCategories({ initialize: true, includeInactive: true, includeCounts: false });
  const categoryId = metadata.category ?? existing.category ?? "seeds";
  if (typeof categoryId !== "string" || !categories.some((item) => item.id === categoryId)) {
    throw new HttpError(400, "Select a valid product category");
  }
  metadata.category = categoryId;
}

export async function updateProductsForCategoryChange(sourceId: string, replacementId: string) {
  const products = await firestore().collection("products").get();
  const matching = products.docs.filter((product) => product.data().category === sourceId);
  for (let index = 0; index < matching.length; index += 450) {
    const batch = firestore().batch();
    matching.slice(index, index + 450).forEach((product) => batch.update(product.ref, {
      category: replacementId,
      updatedAt: FieldValue.serverTimestamp(),
    }));
    await batch.commit();
  }
  return matching.length;
}
