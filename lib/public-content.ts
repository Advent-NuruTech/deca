import "server-only";

import { unstable_cache } from "next/cache";
import { serializeArticle } from "@/lib/articles";
import { PUBLIC_ARTICLES_TAG, PUBLIC_PRODUCTS_TAG, RESOURCE_TAXONOMY_TAG } from "@/lib/cache-tags";
import { firestore } from "@/lib/firestore";
import { serializeProduct } from "@/lib/products";
import { getResourceTaxonomy, resolveArticleAssignment } from "@/lib/resource-taxonomy";
import type { PublicArticle, PublicProduct, ResourceTaxonomy } from "@/lib/types";

export type PublicArticleDataset = {
  articles: PublicArticle[];
  resourceCategories: ResourceTaxonomy;
};

async function readPublishedArticles(): Promise<PublicArticleDataset> {
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

async function readActiveProducts(): Promise<PublicProduct[]> {
  const snapshot = await firestore()
    .collection("products")
    .where("status", "==", "active")
    .get();
  return snapshot.docs.map(serializeProduct);
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
    const snapshot = await firestore()
      .collection("articles")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    const document = snapshot.docs[0];
    if (!document || document.data().published !== true) return null;
    const taxonomy = await getCachedNavigationTaxonomy();
    return {
      ...serializeArticle(document),
      ...resolveArticleAssignment(document.data(), taxonomy),
    };
  },
  ["published-article-by-slug-v1"],
  {
    revalidate: 300,
    tags: [PUBLIC_ARTICLES_TAG, RESOURCE_TAXONOMY_TAG],
  },
);

export const getCachedActiveProductBySlug = unstable_cache(
  async (slug: string): Promise<PublicProduct | null> => {
    const snapshot = await firestore()
      .collection("products")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    const document = snapshot.docs[0];
    return document && document.data().status === "active"
      ? serializeProduct(document)
      : null;
  },
  ["active-product-by-slug-v1"],
  { revalidate: 300, tags: [PUBLIC_PRODUCTS_TAG] },
);
