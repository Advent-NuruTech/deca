import type { Metadata } from "next";
import { getCachedPublishedArticleBySlug } from "@/lib/public-content";
import ArticleDetailPage from "@/components/public/pages/ArticleDetailPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gileadmedicare.co.ke";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getCachedPublishedArticleBySlug(slug);
    if (!article) return { title: "Article not found | Gilead Medicare" };
    const title = String(article.title || "Gilead Medicare");
    const description = String(article.seoDescription || article.excerpt || "Explore resources from Gilead Medicare.");
    const image = String(article.featuredImage || "/assets/health-resource-library.png");
    const url = new URL(`/articles/${encodeURIComponent(slug)}`, siteUrl).toString();
    const imageUrl = new URL(image, siteUrl).toString();
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { type: "article", siteName: "Gilead Medicare", url, title, description, images: [{ url: imageUrl, alt: title }] },
      twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
    };
  } catch (error) {
    console.error("Unable to load article metadata", error);
    return { title: "Article | Gilead Medicare" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}
