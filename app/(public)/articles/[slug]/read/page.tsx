import DocumentReader from "@/components/public/DocumentReader";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocumentReader slug={slug} />;
}
