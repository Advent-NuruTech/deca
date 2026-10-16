import ProductDetailPage from "@/components/public/pages/ProductDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
