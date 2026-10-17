import Link from "next/link";
import VideoFeed from "@/components/public/VideoFeed";
export default async function VideosPage({ searchParams }: { searchParams: Promise<{ channel?: string }> }) {
  const { channel } = await searchParams;
  const slot = channel === "2" ? 2 : 1;
  return <div className="container mx-auto px-4 pb-20 pt-32"><div className="mb-8 flex justify-center gap-3"><Link href="/videos?channel=1" className={`rounded-lg px-4 py-2 ${slot === 1 ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>Channel 1</Link><Link href="/videos?channel=2" className={`rounded-lg px-4 py-2 ${slot === 2 ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>Channel 2</Link></div><VideoFeed key={slot} slot={slot} /></div>;
}
