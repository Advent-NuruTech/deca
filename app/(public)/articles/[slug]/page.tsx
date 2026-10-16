import ArticleDetailPage from "@/components/public/pages/ArticleDetailPage";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailPage slug={slug} />;
}
