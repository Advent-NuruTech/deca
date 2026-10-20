import "server-only";

import slugify from "slugify";
import { FieldValue, type DocumentData, type QueryDocumentSnapshot } from "firebase-admin/firestore";
import { HttpError } from "@/lib/auth";
import { firestore } from "@/lib/firestore";
import type { ResourceMajorCategory, ResourceSubcategory, ResourceTaxonomy } from "@/lib/types";

export const ARTICLES_MAJOR_ID = "articles-blogs";
export const STUDY_MAJOR_ID = "study-library";
const CONFIG_ID = "_config";

const DEFAULT_MAJORS = [
  { id: ARTICLES_MAJOR_ID, kind: "major" as const, name: "Articles & Blogs", slug: "articles-blogs", order: 0 },
  { id: STUDY_MAJOR_ID, kind: "major" as const, name: "Study Library", slug: "study-library", order: 1 },
];

const DEFAULT_ARTICLE_SUBCATEGORIES = [
  ["faith", "Faith Blogs"],
  ["recipe", "Cookery & Recipes"],
  ["agriculture", "Agriculture Tips"],
  ["homeschooling", "Homeschooling"],
] as const;

type TaxonomyRecord = {
  id: string;
  kind: "major" | "subcategory";
  parentId?: string;
  name: string;
  slug: string;
  order: number;
};

function titleFromSlug(value: string) {
  return value.split("-").filter(Boolean).map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`).join(" ");
}

function cleanSlug(value: string) {
  const slug = slugify(value, { lower: true, strict: true });
  if (!slug) throw new HttpError(400, "Category name must contain letters or numbers");
  return slug;
}

function recordFromDocument(document: QueryDocumentSnapshot<DocumentData>): TaxonomyRecord | null {
  const data = document.data();
  if ((data.kind !== "major" && data.kind !== "subcategory") || typeof data.name !== "string" || typeof data.slug !== "string") return null;
  if (data.kind === "subcategory" && typeof data.parentId !== "string") return null;
  return {
    id: document.id,
    kind: data.kind,
    ...(data.kind === "subcategory" ? { parentId: data.parentId } : {}),
    name: data.name.trim(),
    slug: data.slug.trim().toLowerCase(),
    order: Number(data.order ?? 0),
  };
}

function legacyAssignment(data: DocumentData, records: TaxonomyRecord[]) {
  const legacyCategory = String(data.category ?? "").trim().toLowerCase();
  const isStudy = data.isDownloadable === true || legacyCategory === "study";
  const majorCategoryId = isStudy ? STUDY_MAJOR_ID : ARTICLES_MAJOR_ID;
  const legacySubcategory = String(isStudy ? data.studyCategory ?? "" : legacyCategory).trim().toLowerCase();
  const subcategory = records.find((item) => item.kind === "subcategory" && item.parentId === majorCategoryId && item.slug === legacySubcategory);
  return { majorCategoryId, ...(subcategory ? { subcategoryId: subcategory.id } : {}) };
}

export function resolveArticleAssignment(data: DocumentData, taxonomy: ResourceTaxonomy) {
  const majorExists = taxonomy.majors.some((item) => item.id === data.majorCategoryId);
  const subcategory = taxonomy.subcategories.find((item) => item.id === data.subcategoryId);
  if (majorExists && (!subcategory || subcategory.parentId === data.majorCategoryId)) {
    return {
      majorCategoryId: String(data.majorCategoryId),
      ...(subcategory ? { subcategoryId: subcategory.id } : {}),
    };
  }
  return legacyAssignment(data, [...taxonomy.majors, ...taxonomy.subcategories]);
}

async function initialRecords(articleDocuments?: QueryDocumentSnapshot<DocumentData>[]) {
  const db = firestore();
  const [legacyCategories, articles] = await Promise.all([
    db.collection("categories").get(),
    articleDocuments
      ? Promise.resolve(articleDocuments)
      : db.collection("articles").get().then((snapshot) => snapshot.docs),
  ]);
  const records: TaxonomyRecord[] = [...DEFAULT_MAJORS];
  DEFAULT_ARTICLE_SUBCATEGORIES.forEach(([slug, name], order) => records.push({
    id: `articles-${slug}`,
    kind: "subcategory",
    parentId: ARTICLES_MAJOR_ID,
    name,
    slug,
    order,
  }));

  const studyNames = new Map<string, string>();
  for (const document of legacyCategories.docs) {
    const data = document.data();
    if (typeof data.slug === "string" && data.slug.trim()) {
      const slug = cleanSlug(data.slug);
      studyNames.set(slug, typeof data.name === "string" && data.name.trim() ? data.name.trim() : titleFromSlug(slug));
    }
  }
  for (const article of articles) {
    const data = article.data();
    if ((data.isDownloadable === true || data.category === "study") && typeof data.studyCategory === "string" && data.studyCategory.trim()) {
      const slug = cleanSlug(data.studyCategory);
      if (!studyNames.has(slug)) studyNames.set(slug, titleFromSlug(slug));
    }
  }
  [...studyNames].forEach(([slug, name], order) => records.push({
    id: `study-${slug}`,
    kind: "subcategory",
    parentId: STUDY_MAJOR_ID,
    name,
    slug,
    order,
  }));
  return { records, articles };
}

async function commitInChunks(operations: Array<(batch: FirebaseFirestore.WriteBatch) => void>) {
  for (let index = 0; index < operations.length; index += 450) {
    const batch = firestore().batch();
    operations.slice(index, index + 450).forEach((operation) => operation(batch));
    await batch.commit();
  }
}

export async function getResourceTaxonomy(options: {
  initialize?: boolean;
  includeDrafts?: boolean;
  includeCounts?: boolean;
  articleDocuments?: QueryDocumentSnapshot<DocumentData>[];
} = {}): Promise<ResourceTaxonomy> {
  const db = firestore();
  const collection = db.collection("resourceCategories");
  const snapshot = await collection.get();
  const configExists = snapshot.docs.some((document) => document.id === CONFIG_ID);
  let records = snapshot.docs.map(recordFromDocument).filter((item): item is TaxonomyRecord => item !== null);
  let articleDocuments = options.articleDocuments;

  if (!configExists) {
    const initial = await initialRecords(articleDocuments);
    records = initial.records;
    articleDocuments = initial.articles;
    if (options.initialize) {
      const operations: Array<(batch: FirebaseFirestore.WriteBatch) => void> = records.map((record) => (batch) => {
        const { id, ...data } = record;
        batch.set(collection.doc(id), { ...data, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      });
      for (const article of initial.articles) {
        const data = article.data();
        if (typeof data.majorCategoryId === "string") continue;
        const assignment = legacyAssignment(data, records);
        operations.push((batch) => batch.update(article.ref, { ...assignment, taxonomyMigratedAt: FieldValue.serverTimestamp() }));
      }
      await commitInChunks(operations);
      await collection.doc(CONFIG_ID).set({ version: 2, initializedAt: FieldValue.serverTimestamp() });
    }
  } else if (options.initialize) {
    articleDocuments ??= (await db.collection("articles").get()).docs;
    const operations = articleDocuments
      .filter((article) => typeof article.data().majorCategoryId !== "string")
      .map((article) => (batch: FirebaseFirestore.WriteBatch) => batch.update(article.ref, {
        ...legacyAssignment(article.data(), records),
        taxonomyMigratedAt: FieldValue.serverTimestamp(),
      }));
    await commitInChunks(operations);
  }

  const majorCounts = new Map<string, number>();
  const subcategoryCounts = new Map<string, number>();
  const baseTaxonomy: ResourceTaxonomy = {
    majors: records.filter((item) => item.kind === "major").map((item) => ({ ...item, kind: "major", count: 0 } as ResourceMajorCategory)),
    subcategories: records.filter((item) => item.kind === "subcategory").map((item) => ({ ...item, kind: "subcategory", parentId: item.parentId!, count: 0 } as ResourceSubcategory)),
  };
  if (options.includeCounts !== false) {
    articleDocuments ??= (await db.collection("articles").get()).docs;
    const visible = articleDocuments.filter((item) => options.includeDrafts || item.data().published === true);
    for (const article of visible) {
      const assignment = resolveArticleAssignment(article.data(), baseTaxonomy);
      majorCounts.set(assignment.majorCategoryId, (majorCounts.get(assignment.majorCategoryId) ?? 0) + 1);
      if (assignment.subcategoryId) subcategoryCounts.set(assignment.subcategoryId, (subcategoryCounts.get(assignment.subcategoryId) ?? 0) + 1);
    }
  }
  baseTaxonomy.majors.forEach((item) => { item.count = majorCounts.get(item.id) ?? 0; });
  baseTaxonomy.subcategories.forEach((item) => { item.count = subcategoryCounts.get(item.id) ?? 0; });
  baseTaxonomy.majors.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  baseTaxonomy.subcategories.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return baseTaxonomy;
}

export async function validateResourceAssignment(
  metadata: Record<string, unknown>,
  existing: DocumentData = {},
) {
  const taxonomy = await getResourceTaxonomy({ initialize: true, includeDrafts: true });
  const requestedMajor = metadata.majorCategoryId ?? existing.majorCategoryId;
  const requestedSubcategory = metadata.subcategoryId ?? existing.subcategoryId;
  const fallback = resolveArticleAssignment({ ...existing, ...metadata }, taxonomy);
  const majorCategoryId = typeof requestedMajor === "string" && requestedMajor ? requestedMajor : fallback.majorCategoryId;
  const major = taxonomy.majors.find((item) => item.id === majorCategoryId);
  if (!major) throw new HttpError(400, "Select a valid major resource category");
  if (requestedSubcategory === null || requestedSubcategory === "") {
    if (Object.keys(existing).length) metadata.subcategoryId = FieldValue.delete();
    else delete metadata.subcategoryId;
  } else if (typeof requestedSubcategory === "string") {
    const subcategory = taxonomy.subcategories.find((item) => item.id === requestedSubcategory);
    if (!subcategory || subcategory.parentId !== majorCategoryId) throw new HttpError(400, "Select a subcategory inside the chosen major category");
    metadata.subcategoryId = subcategory.id;
  } else if (!Object.keys(existing).length && fallback.subcategoryId) {
    metadata.subcategoryId = fallback.subcategoryId;
  }
  metadata.majorCategoryId = majorCategoryId;
}

export async function updateArticlesForTaxonomyChange(
  predicate: (data: DocumentData) => boolean,
  updates: Record<string, unknown>,
) {
  const articles = await firestore().collection("articles").get();
  const operations = articles.docs.filter((item) => predicate(item.data())).map((item) => (batch: FirebaseFirestore.WriteBatch) => {
    batch.update(item.ref, { ...updates, updatedAt: FieldValue.serverTimestamp() });
  });
  await commitInChunks(operations);
  return operations.length;
}

export async function assertUniqueCategorySlug(kind: "major" | "subcategory", slug: string, parentId?: string, excludingId?: string) {
  const snapshot = await firestore().collection("resourceCategories").get();
  const duplicate = snapshot.docs.some((document) => {
    if (document.id === excludingId) return false;
    const data = document.data();
    return data.kind === kind && data.slug === slug && (kind === "major" || data.parentId === parentId);
  });
  if (duplicate) throw new HttpError(409, "A category with this name already exists here");
}

export function categorySlug(name: string) {
  return cleanSlug(name);
}
