"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Youtube } from "lucide-react";
import type { YouTubeChannel, Video } from "@/lib/youtube";

type Feed = { channel: YouTubeChannel | null; videos: Video[]; nextPageToken: string | null; prevPageToken: string | null };
export default function VideoFeed({ slot, preview = false }: { slot: number; preview?: boolean }) {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    const params = new URLSearchParams({ channel: String(slot) });
    if (preview) params.set("preview", "1");
    if (token) params.set("pageToken", token);
    fetch(`/api/youtube?${params}`, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error("Videos could not be loaded. Please try again later.");
      return response.json() as Promise<Feed>;
    }).then(setFeed).catch((err) => { if (err.name !== "AbortError") setError(err.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [slot, preview, token]);
  if (loading) return <p className="py-8 text-center text-gray-500">Loading videos...</p>;
  if (error) return <p role="alert" className="py-8 text-center text-red-700">{error}</p>;
  if (!feed?.channel) return preview ? null : <p className="py-8 text-center text-gray-500">This channel has not been configured yet.</p>;
  return <section>
    <div className="mb-8 text-center"><h2 className="text-3xl font-bold text-gray-900">{preview ? "Latest videos from " : "Videos from "}{feed.channel.title}</h2><div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" /></div>
    {feed.videos.length === 0 ? <p className="py-8 text-center text-gray-500">No public videos on this page.</p> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{feed.videos.map((video) => <a key={video.id} href={`https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl"><img src={video.thumbnail} alt="" className="aspect-video w-full object-cover" loading="lazy" /><div className="p-4"><h3 className="line-clamp-2 font-semibold text-gray-800">{video.title}</h3>{video.publishedAt && <p className="mt-1 text-sm text-gray-500">{new Date(video.publishedAt).toLocaleDateString()}</p>}<span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700"><Youtube size={16} /> Watch on YouTube</span></div></a>)}</div>}
    <div className="mt-8 flex flex-wrap justify-center gap-3">{preview ? <Link href={`/videos?channel=${slot}`} className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">Browse videos</Link> : <><button disabled={!feed.prevPageToken} onClick={() => setToken(feed.prevPageToken || "")} className="rounded-lg border px-5 py-3 disabled:opacity-40">Previous</button><button disabled={!feed.nextPageToken} onClick={() => setToken(feed.nextPageToken || "")} className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-40">Next</button></>}<a href={feed.channel.url} target="_blank" rel="noopener noreferrer" className="rounded-lg border px-5 py-3 font-semibold">Visit channel</a></div>
  </section>;
}
