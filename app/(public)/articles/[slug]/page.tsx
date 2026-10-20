import type { Metadata } from "next";
import { firestore } from "@/lib/firestore";
import ArticleDetailPage from "@/components/public/pages/ArticleDetailPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://remsamhomestead.com";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const snapshot = await firestore().collection("articles").where("slug", "==", slug).limit(1).get();
    const article = snapshot.docs[0]?.data();
    if (!article || article.published !== true) return { title: "Article not found | RemSam Homestead" };
    const title = String(article.title || "RemSam Homestead");
    const description = String(article.description || article.excerpt || "Explore resources from RemSam Homestead.");
    const image = String(article.thumbnail || article.featuredImage || "/assets/study.jpg");
    const url = new URL(`/articles/${encodeURIComponent(slug)}`, siteUrl).toString();
    const imageUrl = new URL(image, siteUrl).toString();
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { type: "article", siteName: "RemSam Homestead", url, title, description, images: [{ url: imageUrl, alt: title }] },
      twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
    };
  } catch (error) {
    console.error("Unable to load article metadata", error);
    return { title: "Article | RemSam Homestead" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}
