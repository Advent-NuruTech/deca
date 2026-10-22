import "server-only";

import { unstable_cache } from "next/cache";
import { listAuthors, resolveAuthors } from "@/lib/authors";
import { serializeArticle } from "@/lib/articles";
import { PUBLIC_ARTICLES_TAG, PUBLIC_PRODUCTS_TAG, RESOURCE_TAXONOMY_TAG } from "@/lib/cache-tags";
import {
  isD1ReadModelReady,
  readD1ArticleBySlug,
  readD1Articles,
  readD1ProductBySlug,
  readD1Products,
} from "@/lib/d1-public-store";
import { firestore } from "@/lib/firestore";
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
