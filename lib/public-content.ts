import "server-only";

import { unstable_cache } from "next/cache";
import { listAuthors, resolveAuthors } from "@/lib/authors";
import { serializeArticle } from "@/lib/articles";
import { PUBLIC_ARTICLES_TAG, PUBLIC_PRODUCTS_TAG, PRODUCT_CATEGORIES_TAG, RESOURCE_TAXONOMY_TAG } from "@/lib/cache-tags";
import {
  isD1ReadModelReady,
  readD1ArticleBySlug,
  readD1Articles,
  readD1ArticlePage,
  readD1ArticleHighlights,
  readD1ArticleCategoryCounts,
  readD1ProductPage,
  readD1ProductHighlights,
  readD1ProductCategorySummaries,
  type D1ArticleFilters,
  type D1ProductFilters,
  readD1ProductBySlug,
  readD1Products,
} from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
import { getProductCategories } from "@/lib/product-categories";
import { parseJson } from "@/lib/d1";
import { STUDY_MAJOR_ID } from "@/lib/resource-taxonomy";
import { serializeProduct } from "@/lib/products";
import { getResourceTaxonomy, resolveArticleAssignment } from "@/lib/resource-taxonomy";
import type { PublicArticle, PublicProduct, ResourceTaxonomy } from "@/lib/types";

export type PublicArticleDataset = {
  articles: PublicArticle[];
  resourceCategories: ResourceTaxonomy;
};

function taxonomyWithCounts(taxonomy: ResourceTaxonomy, articles: PublicArticle[]): PublicArticleDataset {
  const resourceCategories: ResourceTaxonomy = {
    majors: taxonomy.majors.map((item) => ({ ...item, count: 0 })),
    subcategories: taxonomy.subcategories.map((item) => ({ ...item, count: 0 })),
  };
  const normalizedArticles = articles.map((article) => {
    const subcategory = resourceCategories.subcategories.find((item) => item.id === article.subcategoryId);
    const majorCategoryId = subcategory?.parentId ?? article.majorCategoryId;
    const major = resourceCategories.majors.find((item) => item.id === majorCategoryId);
    if (major) major.count += 1;
    if (subcategory) subcategory.count += 1;
    return { ...article, majorCategoryId, ...(subcategory ? { subcategoryId: subcategory.id } : {}) };
  });
  return { articles: normalizedArticles, resourceCategories };
}

async function readPublishedArticlesFromFirestore(): Promise<PublicArticleDataset> {
  const snapshot = await firestore()
    .collection("articles")
    .where("published", "==", true)
    .get();
  const resourceCategories = await getResourceTaxonomy({
    articleDocuments: snapshot.docs,
  });
  const articles = snapshot.docs.map((document) => ({
    ...serializeArticle(document),
    ...resolveArticleAssignment(document.data(), resourceCategories),
  }));
  return { articles, resourceCategories };
}

async function hydrateAuthors(articles: PublicArticle[]): Promise<PublicArticle[]> {
  if (!articles.some((article) => article.author?.managed)) return articles;
  try { return resolveAuthors(articles, await listAuthors()); }
  catch (error) {
    console.warn("Using saved author details because profiles are unavailable.", error);
    return articles;
  }
}

async function readPublishedArticles(): Promise<PublicArticleDataset> {
  try {
    if (!(await isD1ReadModelReady("articles"))) throw new Error("D1 article read model is not ready");
    const [articles, taxonomy] = await Promise.all([readD1Articles(), getCachedNavigationTaxonomy()]);
    return taxonomyWithCounts(taxonomy, await hydrateAuthors(articles));
  } catch (error) {
    console.warn("Using cached Firestore article fallback because D1 is unavailable or not ready.", error);
    const dataset = await readPublishedArticlesFromFirestore();
    return { ...dataset, articles: await hydrateAuthors(dataset.articles) };
  }
}

async function readActiveProductsFromFirestore(): Promise<PublicProduct[]> {
  const snapshot = await firestore()
    .collection("products")
    .where("status", "==", "active")
    .get();
  return snapshot.docs.map(serializeProduct);
}

async function readActiveProducts(): Promise<PublicProduct[]> {
  try {
    if (!(await isD1ReadModelReady("products"))) throw new Error("D1 product read model is not ready");
    return await readD1Products();
  } catch (error) {
    console.warn("Using cached Firestore product fallback because D1 is unavailable or not ready.", error);
    return readActiveProductsFromFirestore();
  }
}

export const getCachedPublishedArticles = unstable_cache(
  readPublishedArticles,
  ["published-articles-dataset-v1"],
  {
    revalidate: 300,
    tags: [PUBLIC_ARTICLES_TAG, RESOURCE_TAXONOMY_TAG],
  },
);

export const getCachedActiveProducts = unstable_cache(
  readActiveProducts,
  ["active-products-dataset-v1"],
  { revalidate: 300, tags: [PUBLIC_PRODUCTS_TAG] },
);

export const getCachedNavigationTaxonomy = unstable_cache(
  () => getResourceTaxonomy({ includeCounts: false }),
  ["navigation-taxonomy-v1"],
  { revalidate: 300, tags: [RESOURCE_TAXONOMY_TAG] },
);

// These bounded D1 reads retain the existing Firestore fallback when the read model is unavailable.
export const getCachedD1ProductPage = unstable_cache(async (filters: D1ProductFilters, page: number, limit: number) => {
  if (!(await isD1ReadModelReady("products"))) throw new Error("D1 product read model is not ready");
  return readD1ProductPage(filters, page, limit);
}, ["public-product-page-v1"], { revalidate: 300, tags: [PUBLIC_PRODUCTS_TAG] });

const getCachedD1ArticleCategoryCounts = unstable_cache(
  () => readD1ArticleCategoryCounts(), ["public-article-category-counts-v1"],
  { revalidate: 300, tags: [PUBLIC_ARTICLES_TAG, RESOURCE_TAXONOMY_TAG] },
);

export const getCachedD1ArticlePage = unstable_cache(async (filters: D1ArticleFilters, page: number, limit: number) => {
  if (!(await isD1ReadModelReady("articles"))) throw new Error("D1 article read model is not ready");
  const [result, taxonomy, counts] = await Promise.all([readD1ArticlePage(filters, page, limit), getCachedNavigationTaxonomy(), getCachedD1ArticleCategoryCounts()]);
  const resourceCategories: ResourceTaxonomy = {
    majors: taxonomy.majors.map((item) => ({ ...item, count: 0 })),
    subcategories: taxonomy.subcategories.map((item) => ({ ...item, count: 0 })),
  };
  for (const row of counts) {
    const legacySlug = (row.major === STUDY_MAJOR_ID ? row.legacy_study_category : row.legacy_category)?.toLowerCase();
    const sub = resourceCategories.subcategories.find((item) => item.id === row.subcategory) ?? (!row.subcategory ? resourceCategories.subcategories.find((item) => item.parentId === row.major && item.slug === legacySlug) : undefined);
    const major = resourceCategories.majors.find((item) => item.id === (sub?.parentId ?? row.major));
    if (sub) sub.count += Number(row.count);
    if (major) major.count += Number(row.count);
  }
  const articles = taxonomyWithCounts(taxonomy, result.items.map((article) => {
    if (article.subcategoryId) return article;
    const legacySlug = (article.majorCategoryId === STUDY_MAJOR_ID ? article.studyCategory : article.category)?.toLowerCase();
    const sub = taxonomy.subcategories.find((item) => item.parentId === article.majorCategoryId && item.slug === legacySlug);
    return sub ? { ...article, subcategoryId: sub.id } : article;
  })).articles;
  return { ...result, items: await hydrateAuthors(articles), resourceCategories };
}, ["public-article-page-v1"], { revalidate: 300, tags: [PUBLIC_ARTICLES_TAG, RESOURCE_TAXONOMY_TAG] });

export const getCachedPublicProductCategories = unstable_cache(async () => {
  try {
    if (!(await isD1ReadModelReady("products"))) throw new Error("D1 product read model is not ready");
    const [categories, summaries] = await Promise.all([getProductCategories({ includeCounts: false }), readD1ProductCategorySummaries()]);
    return categories.map((category) => {
      const summary = summaries.find((item) => item.category === category.id);
      const images = parseJson<string[]>(summary?.images_json, []);
      return { ...category, count: Number(summary?.count ?? 0), image: images[0] };
    });
  } catch (error) {
    console.warn("Using Firestore product category fallback because D1 is unavailable or not ready.", error);
    return getProductCategories({ includeInactive: false });
  }
}, ["public-product-category-summaries-v1"], { revalidate: 300, tags: [PRODUCT_CATEGORIES_TAG, PUBLIC_PRODUCTS_TAG] });

export const getCachedD1Home = unstable_cache(async () => {
  if (!(await isD1ReadModelReady("articles")) || !(await isD1ReadModelReady("products"))) throw new Error("D1 read models are not ready");
  const resourceTaxonomy = await getCachedNavigationTaxonomy();
  const slugs = ["faith", "recipe", "agriculture", "homeschooling"];
  const [highlights, latestStudies, featuredSeeds] = await Promise.all([
    Promise.all(slugs.map((slug) => {
      const subcategory = resourceTaxonomy.subcategories.find((item) => item.slug === slug);
      return readD1ArticleHighlights(subcategory ? { subcategory: subcategory.id, legacySubcategory: subcategory.slug, subcategoryParent: subcategory.parentId } : { legacy: slug }, 1);
    })),
    readD1ArticleHighlights({ major: STUDY_MAJOR_ID }, 12),
    readD1ProductHighlights({ category: "seeds", featured: true }, 3),
  ]);
  const articles = await hydrateAuthors([...highlights.flat(), ...latestStudies]);
  const byId = new Map(articles.map((article) => [article.id, article]));
  return {
    featuredFaith: highlights[0][0] ? byId.get(highlights[0][0].id) ?? null : null,
    featuredRecipe: highlights[1][0] ? byId.get(highlights[1][0].id) ?? null : null,
    featuredAgriculture: highlights[2][0] ? byId.get(highlights[2][0].id) ?? null : null,
    featuredHomeschool: highlights[3][0] ? byId.get(highlights[3][0].id) ?? null : null,
    latestStudies: latestStudies.map((item) => byId.get(item.id) ?? item), resourceTaxonomy, featuredSeeds,
  };
}, ["public-home-highlights-v1"], { revalidate: 300, tags: [PUBLIC_ARTICLES_TAG, PUBLIC_PRODUCTS_TAG, RESOURCE_TAXONOMY_TAG] });

export const getCachedPublishedArticleBySlug = unstable_cache(
  async (slug: string): Promise<PublicArticle | null> => {
    try {
      if (!(await isD1ReadModelReady("articles"))) throw new Error("D1 article read model is not ready");
      const [article, taxonomy] = await Promise.all([readD1ArticleBySlug(slug), getCachedNavigationTaxonomy()]);
      if (!article) return null;
      return (await hydrateAuthors(taxonomyWithCounts(taxonomy, [article]).articles))[0];
    } catch (error) {
      console.warn("Using Firestore article-detail fallback because D1 is unavailable or not ready.", error);
      const snapshot = await firestore().collection("articles").where("slug", "==", slug).limit(1).get();
      const document = snapshot.docs[0];
      if (!document || document.data().published !== true) return null;
      const taxonomy = await getCachedNavigationTaxonomy();
      return (await hydrateAuthors([{ ...serializeArticle(document), ...resolveArticleAssignment(document.data(), taxonomy) }]))[0];
    }
  },
  ["published-article-by-slug-v1"],
  {
    revalidate: 300,
    tags: [PUBLIC_ARTICLES_TAG, RESOURCE_TAXONOMY_TAG],
  },
);

export const getCachedActiveProductBySlug = unstable_cache(
  async (slug: string): Promise<PublicProduct | null> => {
    try {
      if (!(await isD1ReadModelReady("products"))) throw new Error("D1 product read model is not ready");
      return await readD1ProductBySlug(slug);
    } catch (error) {
      console.warn("Using Firestore product-detail fallback because D1 is unavailable or not ready.", error);
      const snapshot = await firestore().collection("products").where("slug", "==", slug).limit(1).get();
      const document = snapshot.docs[0];
      return document && document.data().status === "active" ? serializeProduct(document) : null;
    }
  },
  ["active-product-by-slug-v1"],
  { revalidate: 300, tags: [PUBLIC_PRODUCTS_TAG] },
);
