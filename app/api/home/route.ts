import { NextResponse } from "next/server";
import { timestamp } from "@/lib/articles";
import { PUBLIC_CACHE_CONTROL } from "@/lib/cache-tags";
import { getCachedActiveProducts, getCachedPublishedArticles } from "@/lib/public-content";
import { STUDY_MAJOR_ID } from "@/lib/resource-taxonomy";

function productTimestamp(value: unknown): number {
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export async function GET() {
  const [{ articles, resourceCategories }, products] = await Promise.all([
    getCachedPublishedArticles(),
    getCachedActiveProducts(),
  ]);
  const newestArticles = [...articles].sort(
    (left, right) =>
      timestamp(right.publishedAt ?? right.createdAt) -
      timestamp(left.publishedAt ?? left.createdAt),
  );
  const featured = (slug: string) => {
    const subcategory = resourceCategories.subcategories.find((item) => item.slug === slug);
    return newestArticles.find((article) =>
      subcategory
        ? article.subcategoryId === subcategory.id
        : String(article.category ?? "").toLowerCase() === slug,
    ) ?? null;
  };
  const featuredSeeds = products
    .filter((product) => product.category === "seeds" && product.featured)
    .sort((left, right) => productTimestamp(right.createdAt) - productTimestamp(left.createdAt))
    .slice(0, 3);

  return NextResponse.json({
    featuredFaith: featured("faith"),
    featuredRecipe: featured("recipe"),
    featuredAgriculture: featured("agriculture"),
    featuredHomeschool: featured("homeschooling"),
    latestStudies: newestArticles
      .filter((article) => article.majorCategoryId === STUDY_MAJOR_ID)
      .slice(0, 3),
    resourceTaxonomy: resourceCategories,
    featuredSeeds,
  }, { headers: { "Cache-Control": PUBLIC_CACHE_CONTROL } });
}
