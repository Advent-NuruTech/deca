import "server-only";
import { unstable_cache } from "next/cache";
import { firestore, firestoreConfigured } from "@/lib/firestore";
import { HttpError } from "@/lib/auth";

export type YouTubeChannel = { id: string; title: string; uploadsPlaylistId: string; url: string };
export type Video = { id: string; title: string; publishedAt: string; thumbnail: string };
export const YOUTUBE_SETTINGS_TAG = "youtube-settings";

function apiKey(slot: number) {
  return process.env.YOUTUBE_API_KEY || (slot === 2 ? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY_2 : process.env.NEXT_PUBLIC_YOUTUBE_API_KEY) || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
}

async function youtube<T>(path: string, params: Record<string, string>, slot: number, cache: boolean): Promise<T> {
  const key = apiKey(slot);
  if (!key) throw new HttpError(503, "YouTube API key is not configured.");
  const query = new URLSearchParams({ ...params, key });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${query}`, cache ? { next: { revalidate: 3600 } } : { cache: "no-store" });
  if (!response.ok) throw new HttpError(502, "YouTube could not load this channel. Check the API key, quota, and channel link.");
  return response.json() as Promise<T>;
}

type ChannelResponse = { items?: Array<{ id: string; snippet?: { title?: string }; contentDetails?: { relatedPlaylists?: { uploads?: string } } }> };
export async function resolveChannel(input: string, slot: number): Promise<YouTubeChannel> {
  let url: URL;
  try { url = new URL(input.trim()); } catch { throw new HttpError(400, "Enter a valid YouTube channel link."); }
  if (url.protocol !== "https:" || !["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname.toLowerCase())) throw new HttpError(400, "Enter a valid YouTube channel link.");
  const parts = url.pathname.split("/").filter(Boolean);
  let filter: Record<string, string>;
  if (parts[0]?.startsWith("@") && /^@[A-Za-z0-9._-]{3,30}$/.test(parts[0])) filter = { forHandle: parts[0] };
  else if (parts[0] === "channel" && /^UC[A-Za-z0-9_-]{22}$/.test(parts[1] || "")) filter = { id: parts[1] };
  else if (parts[0] === "user" && /^[A-Za-z0-9._-]{1,100}$/.test(parts[1] || "")) filter = { forUsername: parts[1] };
  else throw new HttpError(400, "Use a YouTube @handle, /channel/ID, or /user/ link.");
  const data = await youtube<ChannelResponse>("channels", { part: "snippet,contentDetails", ...filter }, slot, false);
  const channel = data.items?.[0];
  const uploadsPlaylistId = channel?.contentDetails?.relatedPlaylists?.uploads;
  if (!channel || !uploadsPlaylistId) throw new HttpError(404, "YouTube channel not found or has no uploads playlist.");
  return { id: channel.id, title: channel.snippet?.title || "YouTube channel", uploadsPlaylistId, url: `https://www.youtube.com/channel/${channel.id}` };
}

function fallbackChannels(): (YouTubeChannel | null)[] {
  return [process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID, process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID_2].map((id, index) => id && /^UC[A-Za-z0-9_-]{22}$/.test(id) ? { id, title: index === 0 ? "Gilead Medicare" : "Gilead Medicare Food & Nutrition", uploadsPlaylistId: `UU${id.slice(2)}`, url: `https://www.youtube.com/channel/${id}` } : null);
}

export async function readChannels(): Promise<(YouTubeChannel | null)[]> {
  if (!firestoreConfigured()) return fallbackChannels();
  const doc = await firestore().collection("settings").doc("youtube").get();
  return doc.exists ? (doc.data()?.channels ?? [null, null]) : fallbackChannels();
}
export const getChannels = unstable_cache(readChannels, ["youtube-channels-v1"], { revalidate: 3600, tags: [YOUTUBE_SETTINGS_TAG] });

export async function listVideos(channel: YouTubeChannel, slot: number, pageToken: string, limit: number) {
  const params: Record<string, string> = { part: "snippet,contentDetails", maxResults: String(limit), playlistId: channel.uploadsPlaylistId };
  if (pageToken) params.pageToken = pageToken;
  const data = await youtube<{ nextPageToken?: string; prevPageToken?: string; items?: Array<{ snippet?: { title?: string; publishedAt?: string; thumbnails?: Record<string, { url?: string }> }; contentDetails?: { videoId?: string; videoPublishedAt?: string } }> }>("playlistItems", params, slot, true);
  const videos: Video[] = (data.items ?? []).flatMap((item) => {
    const id = item.contentDetails?.videoId;
    const title = item.snippet?.title;
    const thumbnail = item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url;
    if (!id || !title || !thumbnail || title === "Private video" || title === "Deleted video") return [];
    return [{ id, title, thumbnail, publishedAt: item.contentDetails?.videoPublishedAt || item.snippet?.publishedAt || "" }];
  });
  return { channel, videos, nextPageToken: data.nextPageToken || null, prevPageToken: data.prevPageToken || null };
}
