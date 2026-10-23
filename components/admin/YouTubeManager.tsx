"use client";

import PageQuickActions from "@/components/admin/PageQuickActions";
import { useEffect, useState } from "react";
import { Youtube } from "lucide-react";
import { api } from "@/lib/api";
import { errorMessage } from "@/components/admin/admin-utils";
import type { YouTubeChannel } from "@/lib/youtube";
type Response = { channels: (YouTubeChannel | null)[] };
export default function YouTubeManager() {
  const [links, setLinks] = useState(["", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { api.get<Response>("/api/admin/youtube").then((data) => setLinks([data.channels[0]?.url || "", data.channels[1]?.url || ""])).catch((err) => setError(errorMessage(err, "Could not load channels"))).finally(() => setLoading(false)); }, []);
  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try { const data = await api.put<Response>("/api/admin/youtube", { links }); setLinks([data.channels[0]?.url || "", data.channels[1]?.url || ""]); setMessage("Channels saved. Videos update automatically as visitors browse."); }
    catch (err) { setError(errorMessage(err, "Could not save channels")); }
    finally { setSaving(false); }
  }
  return <main className="container mx-auto max-w-3xl px-4 py-10"><h1 className="text-3xl font-bold text-gray-900">YouTube channels</h1><p className="mt-2 text-gray-600">Paste a YouTube channel link to show its public uploads on the homepage and videos page. Leave a field empty to hide that channel.</p><p className="mt-2 text-sm text-gray-500">Supported links: youtube.com/@handle, youtube.com/channel/ID, or youtube.com/user/name.</p><PageQuickActions actions={[
    { label: "Edit channel 1", icon: <Youtube size={18} />, onClick: () => document.getElementById("youtube-channel-0")?.focus(), disabled: loading },
    { label: "Edit channel 2", icon: <Youtube size={18} />, onClick: () => document.getElementById("youtube-channel-1")?.focus(), disabled: loading },
  ]} />{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}{message && <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-4 text-emerald-700">{message}</p>}<form onSubmit={save} className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">{links.map((link, index) => <label key={index} className="block font-medium text-gray-800">Channel {index + 1}<input id={`youtube-channel-${index}`} type="url" value={link} onChange={(event) => setLinks((previous) => previous.map((value, i) => i === index ? event.target.value : value))} placeholder="https://www.youtube.com/@channel" className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2" /></label>)}<button disabled={loading || saving} className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save channels"}</button></form></main>;
}
