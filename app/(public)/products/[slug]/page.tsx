import type { Metadata } from "next";
import { getCachedActiveProductBySlug } from "@/lib/public-content";
import { richTextToPlainText } from "@/lib/rich-text";
import ProductDetailPage from "@/components/public/pages/ProductDetailPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gileadmedicare.co.ke";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getCachedActiveProductBySlug(slug);
    if (!product) return { title: "Product not found" };
    const title = product.name;
    const text = richTextToPlainText(product.seoDescription || product.description || "").replace(/\s+/g, " ").trim();
    const description = text.length > 180 ? `${text.slice(0, 177).trimEnd()}...` : text || `Shop ${title} at Gilead Medicare.`;
    const url = new URL(`/products/${encodeURIComponent(product.slug)}`, siteUrl).toString();
    const image = new URL(product.images?.[0] || "/assets/logo.png", siteUrl).toString();
    return {
      title: product.seoTitle || title,
      description,
      keywords: product.seoKeywords,
      alternates: { canonical: url },
      openGraph: { type: "website", siteName: "Gilead Medicare", url, title, description, images: [{ url: image, alt: title }] },
      twitter: { card: "summary_large_image", title, description, images: [image] },
    };
  } catch (error) {
    console.error("Unable to load product metadata", error);
    return { title: "Product | Gilead Medicare" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
