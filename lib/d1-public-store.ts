import "server-only";

import { FieldValue, type DocumentData, type DocumentSnapshot } from "firebase-admin/firestore";
import { revalidateTag, unstable_cache } from "next/cache";
import { d1All, d1Batch, d1First, d1Run, parseJson } from "@/lib/d1";
import { serializeArticle } from "@/lib/articles";
import { firestore } from "@/lib/firestore";
import { serializeProduct } from "@/lib/products";
import { studyMaterialUrl } from "@/lib/study-materials";
import type { PublicArticle, PublicProduct } from "@/lib/types";

export type PublicReadModelArea = "articles" | "products";

const READ_MODEL_STATE_COLLECTION = "systemState";
const READ_MODEL_STATE_TAGS: Record<PublicReadModelArea, string> = {
  articles: "d1-read-model-state-articles",
  products: "d1-read-model-state-products",
};

function readModelStateReference(area: PublicReadModelArea) {
  return firestore().collection(READ_MODEL_STATE_COLLECTION).doc(`d1-public-${area}`);
}

async function readFirestoreReadModelClean(area: PublicReadModelArea): Promise<boolean> {
  const state = await readModelStateReference(area).get();
  return state.data()?.dirty !== true;
}

const getCachedArticleReadModelClean = unstable_cache(
  () => readFirestoreReadModelClean("articles"),
  ["d1-read-model-state-articles-v1"],
  { revalidate: 60, tags: [READ_MODEL_STATE_TAGS.articles] },
);

const getCachedProductReadModelClean = unstable_cache(
  () => readFirestoreReadModelClean("products"),
  ["d1-read-model-state-products-v1"],
  { revalidate: 60, tags: [READ_MODEL_STATE_TAGS.products] },
);

async function setFirestoreReadModelDirty(area: PublicReadModelArea, dirty: boolean): Promise<void> {
  await readModelStateReference(area).set(
    { dirty, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  revalidateTag(READ_MODEL_STATE_TAGS[area], { expire: 0 });
}

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  legacy_category: string | null;
  legacy_study_category: string | null;
  major_category_id: string;
  subcategory_id: string | null;
  tags_json: string;
  author_json: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords_json: string;
  published_at: string | null;
  views: number;
  is_downloadable: number;
  file_key: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  features: string | null;
  category: PublicProduct["category"];
  price: number;
  original_price: number | null;
  images_json: string;
  in_stock: number;
  stock_quantity: number;
  specifications_json: string;
  brand: string | null;
  model: string | null;
  featured: number;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords_json: string;
  organic_certified: number;
  harvest_date: string | null;
  seed_type: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function nullable(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

function iso(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return null;
}

function articleParams(article: PublicArticle): unknown[] {
  return [
    article.id, article.slug, article.title, article.excerpt,
    nullable(article.featuredImage), nullable(article.category), nullable(article.studyCategory),
    article.majorCategoryId, nullable(article.subcategoryId), JSON.stringify(article.tags ?? []),
    JSON.stringify(article.author ?? {}), nullable(article.seoTitle), nullable(article.seoDescription),
    JSON.stringify(article.seoKeywords ?? []), iso(article.publishedAt), Number(article.views ?? 0),
    article.isDownloadable ? 1 : 0, nullable(article.fileKey), nullable(article.fileName),
    nullable(article.fileType), iso(article.createdAt), iso(article.updatedAt),
  ];
}

function productParams(product: PublicProduct): unknown[] {
  return [
    product.id, product.slug, product.name, product.description, nullable(product.features),
    product.category, Number(product.price), product.originalPrice == null ? null : Number(product.originalPrice),
    JSON.stringify(product.images ?? []), product.inStock ? 1 : 0, Number(product.stockQuantity ?? 0),
    JSON.stringify({ ...(product.specifications ?? {}), __variants: product.variants ?? [] }), nullable(product.brand), nullable(product.model),
    product.featured ? 1 : 0, nullable(product.seoTitle), nullable(product.seoDescription),
    JSON.stringify(product.seoKeywords ?? []), product.organicCertified ? 1 : 0,
    iso(product.harvestDate), nullable(product.seedType), iso(product.createdAt), iso(product.updatedAt),
  ];
}

const ARTICLE_UPSERT = `INSERT INTO public_articles (
  id, slug, title, excerpt, featured_image, legacy_category, legacy_study_category,
  major_category_id, subcategory_id, tags_json, author_json, seo_title, seo_description,
  seo_keywords_json, published_at, views, is_downloadable, file_key, file_name, file_type,
  created_at, updated_at
) VALUES (${Array.from({ length: 22 }, () => "?").join(",")})
ON CONFLICT(id) DO UPDATE SET
  slug=excluded.slug, title=excluded.title, excerpt=excluded.excerpt,
  featured_image=excluded.featured_image, legacy_category=excluded.legacy_category,
  legacy_study_category=excluded.legacy_study_category,
  major_category_id=excluded.major_category_id, subcategory_id=excluded.subcategory_id,
  tags_json=excluded.tags_json, author_json=excluded.author_json, seo_title=excluded.seo_title,
  seo_description=excluded.seo_description, seo_keywords_json=excluded.seo_keywords_json,
  published_at=excluded.published_at, views=excluded.views,
  is_downloadable=excluded.is_downloadable, file_key=excluded.file_key,
  file_name=excluded.file_name, file_type=excluded.file_type,
  created_at=excluded.created_at, updated_at=excluded.updated_at`;

const PRODUCT_UPSERT = `INSERT INTO public_products (
  id, slug, name, description, features, category, price, original_price, images_json,
  in_stock, stock_quantity, specifications_json, brand, model, featured, seo_title,
  seo_description, seo_keywords_json, organic_certified, harvest_date, seed_type,
  created_at, updated_at
) VALUES (${Array.from({ length: 23 }, () => "?").join(",")})
ON CONFLICT(id) DO UPDATE SET
  slug=excluded.slug, name=excluded.name, description=excluded.description,
  features=excluded.features, category=excluded.category, price=excluded.price,
  original_price=excluded.original_price, images_json=excluded.images_json,
  in_stock=excluded.in_stock, stock_quantity=excluded.stock_quantity,
  specifications_json=excluded.specifications_json, brand=excluded.brand, model=excluded.model,
  featured=excluded.featured, seo_title=excluded.seo_title,
  seo_description=excluded.seo_description, seo_keywords_json=excluded.seo_keywords_json,
  organic_certified=excluded.organic_certified, harvest_date=excluded.harvest_date,
  seed_type=excluded.seed_type, created_at=excluded.created_at, updated_at=excluded.updated_at`;

export async function isD1ReadModelReady(area: PublicReadModelArea): Promise<boolean> {
  const firestoreModelClean = area === "articles"
    ? await getCachedArticleReadModelClean()
    : await getCachedProductReadModelClean();
  if (!firestoreModelClean) return false;
  const row = await d1First<{ ready: number }>(
    "SELECT ready FROM public_read_model_state WHERE area = ? LIMIT 1",
    [area],
  );
  return row?.ready === 1;
}

/** Returns false when the read-model schema is not installed, allowing a safe Firestore fallback. */
export async function beginD1ReadModelUpdate(area: PublicReadModelArea): Promise<boolean> {
  // Persist this first so a D1 outage can never leave a stale projection enabled.
  await setFirestoreReadModelDirty(area, true);
  try {
    await d1Run(
      `INSERT INTO public_read_model_state(area, ready, updated_at) VALUES (?, 0, datetime('now'))
       ON CONFLICT(area) DO UPDATE SET ready = 0, updated_at = datetime('now')`,
      [area],
    );
    return true;
  } catch (error) {
    console.warn(`D1 ${area} read model is unavailable; Firestore fallback remains active.`, error);
    return false;
  }
}

export async function markD1ReadModelReady(area: PublicReadModelArea): Promise<void> {
  await d1Run(
    `INSERT INTO public_read_model_state(area, ready, updated_at) VALUES (?, 1, datetime('now'))
     ON CONFLICT(area) DO UPDATE SET ready = 1, updated_at = datetime('now')`,
    [area],
  );
  await setFirestoreReadModelDirty(area, false);
}

export async function readD1Articles(): Promise<PublicArticle[]> {
  const rows = await d1All<ArticleRow>("SELECT * FROM public_articles ORDER BY published_at DESC, id");
  return rows.map((row) => ({
    id: row.id, _id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt,
    content: "", featuredImage: row.featured_image ?? undefined,
    category: row.legacy_category ?? "", studyCategory: row.legacy_study_category ?? undefined,
    majorCategoryId: row.major_category_id, subcategoryId: row.subcategory_id ?? undefined,
    tags: parseJson(row.tags_json, []), author: parseJson(row.author_json, { uid: "", name: "Admin", email: "" }),
    seoTitle: row.seo_title ?? undefined, seoDescription: row.seo_description ?? undefined,
    seoKeywords: parseJson(row.seo_keywords_json, []), published: true,
    publishedAt: row.published_at ?? undefined, views: Number(row.views),
    isDownloadable: row.is_downloadable === 1, fileKey: row.file_key ?? undefined,
    ...(row.file_key ? { fileUrl: studyMaterialUrl(row.file_key) } : {}),
    fileName: row.file_name ?? undefined, fileType: row.file_type ?? undefined,
    createdAt: row.created_at ?? undefined, updatedAt: row.updated_at ?? undefined,
  }));
}

export async function readD1ArticleBySlug(slug: string): Promise<PublicArticle | null> {
  const rows = await d1All<ArticleRow>("SELECT * FROM public_articles WHERE slug = ? LIMIT 1", [slug]);
  return rows.length ? (await rowsToArticles(rows))[0] : null;
}

async function rowsToArticles(rows: ArticleRow[]): Promise<PublicArticle[]> {
  return rows.map((row) => ({
    id: row.id, _id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt,
    content: "", featuredImage: row.featured_image ?? undefined,
    category: row.legacy_category ?? "", studyCategory: row.legacy_study_category ?? undefined,
    majorCategoryId: row.major_category_id, subcategoryId: row.subcategory_id ?? undefined,
    tags: parseJson(row.tags_json, []), author: parseJson(row.author_json, { uid: "", name: "Admin", email: "" }),
    seoTitle: row.seo_title ?? undefined, seoDescription: row.seo_description ?? undefined,
    seoKeywords: parseJson(row.seo_keywords_json, []), published: true,
    publishedAt: row.published_at ?? undefined, views: Number(row.views),
    isDownloadable: row.is_downloadable === 1, fileKey: row.file_key ?? undefined,
    ...(row.file_key ? { fileUrl: studyMaterialUrl(row.file_key) } : {}),
    fileName: row.file_name ?? undefined, fileType: row.file_type ?? undefined,
    createdAt: row.created_at ?? undefined, updatedAt: row.updated_at ?? undefined,
  }));
}

export async function readD1Products(): Promise<PublicProduct[]> {
  return rowsToProducts(await d1All<ProductRow>("SELECT * FROM public_products ORDER BY created_at DESC, id"));
}

export async function readD1ProductBySlug(slug: string): Promise<PublicProduct | null> {
  const rows = await d1All<ProductRow>("SELECT * FROM public_products WHERE slug = ? LIMIT 1", [slug]);
  return rows.length ? rowsToProducts(rows)[0] : null;
}

function rowsToProducts(rows: ProductRow[]): PublicProduct[] {
  return rows.map((row) => ({
    id: row.id, _id: row.id, slug: row.slug, name: row.name, description: row.description,
    features: row.features ?? undefined, category: row.category, price: Number(row.price),
    originalPrice: row.original_price == null ? undefined : Number(row.original_price),
    images: parseJson(row.images_json, []), inStock: row.in_stock === 1,
    stockQuantity: Number(row.stock_quantity), specifications: Object.fromEntries(Object.entries(parseJson<Record<string, unknown>>(row.specifications_json, {})).filter(([key]) => key !== "__variants")) as Record<string, string>,
    variants: parseJson<{ __variants?: PublicProduct["variants"] }>(row.specifications_json, {}).__variants ?? [],
    brand: row.brand ?? undefined, model: row.model ?? undefined, featured: row.featured === 1,
    seoTitle: row.seo_title ?? undefined, seoDescription: row.seo_description ?? undefined,
    seoKeywords: parseJson(row.seo_keywords_json, []), status: "active",
    organicCertified: row.organic_certified === 1, harvestDate: row.harvest_date ?? undefined,
    seedType: row.seed_type ?? undefined, createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
  }));
}

export async function syncD1Article(article: PublicArticle): Promise<void> {
  if (!article.published) {
    await d1Run("DELETE FROM public_articles WHERE id = ?", [article.id]);
    return;
  }
  await d1Run(ARTICLE_UPSERT, articleParams(article));
}

export async function syncD1ArticleDocument(document: DocumentSnapshot<DocumentData>): Promise<void> {
  const data = document.data() ?? {};
  if (data.published !== true) {
    await d1Run("DELETE FROM public_articles WHERE id = ?", [document.id]);
    return;
  }
  await syncD1Article(publicArticleFromDocument(document));
}

export function publicArticleFromDocument(document: DocumentSnapshot<DocumentData>): PublicArticle {
  const data = document.data() ?? {};
  return {
    ...serializeArticle(document),
    majorCategoryId: String(data.majorCategoryId ?? (data.isDownloadable === true || data.category === "study" ? "study-library" : "articles-blogs")),
    subcategoryId: typeof data.subcategoryId === "string" ? data.subcategoryId : undefined,
  };
}

export async function deleteD1Article(id: string): Promise<void> {
  await d1Run("DELETE FROM public_articles WHERE id = ?", [id]);
}

export async function syncD1ProductDocument(document: DocumentSnapshot<DocumentData>): Promise<void> {
  const data = document.data() ?? {};
  if (data.status !== "active") {
    await d1Run("DELETE FROM public_products WHERE id = ?", [document.id]);
    return;
  }
  await d1Run(PRODUCT_UPSERT, productParams(serializeProduct(document)));
}

export async function deleteD1Product(id: string): Promise<void> {
  await d1Run("DELETE FROM public_products WHERE id = ?", [id]);
}

export async function replaceD1Articles(articles: PublicArticle[]): Promise<void> {
  await d1Run("DELETE FROM public_articles");
  for (let index = 0; index < articles.length; index += 100) {
    await d1Batch(articles.slice(index, index + 100).map((article) => ({ sql: ARTICLE_UPSERT, params: articleParams(article) })));
  }
  await markD1ReadModelReady("articles");
}

export async function replaceD1Products(products: PublicProduct[]): Promise<void> {
  await d1Run("DELETE FROM public_products");
  for (let index = 0; index < products.length; index += 100) {
    await d1Batch(products.slice(index, index + 100).map((product) => ({ sql: PRODUCT_UPSERT, params: productParams(product) })));
  }
  await markD1ReadModelReady("products");
}
