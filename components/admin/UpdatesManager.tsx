"use client";

import PageQuickActions from "@/components/admin/PageQuickActions";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Bell, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { errorMessage } from "@/components/admin/admin-utils";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { sanitizeRichText } from "@/lib/rich-text";

type Update = { id: string; title: string; content: string; createdAt: string; updatedAt: string };
function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
export default function UpdatesManager() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<Update | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { setUpdates((await api.get<{ updates: Update[] }>("/api/admin/updates")).updates); }
    catch (reason) { setError(errorMessage(reason, "Updates could not be loaded.")); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  function start(update?: Update) { setEditing(update ?? null); setTitle(update?.title ?? ""); setContent(update?.content ?? ""); setError(""); setNotice(""); setOpen(true); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      if (editing) await api.put(`/api/admin/updates/${encodeURIComponent(editing.id)}`, { title, content });
      else await api.post("/api/admin/updates", { title, content });
      setOpen(false); await load(); setNotice(editing ? "Update saved." : "Update added.");
    } catch (reason) { setError(errorMessage(reason, "The update could not be saved.")); }
    finally { setSaving(false); }
  }
  async function remove(update: Update) {
    if (!window.confirm(`Delete “${update.title}”?`)) return;
    setSaving(true); setError(""); setNotice("");
    try { await api.delete(`/api/admin/updates/${encodeURIComponent(update.id)}`); await load(); setNotice("Update deleted."); }
    catch (reason) { setError(errorMessage(reason, "The update could not be deleted.")); }
    finally { setSaving(false); }
  }
  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">What’s new</p><h1 className="mt-1 text-3xl font-bold text-gray-900">Updates</h1><p className="mt-2 max-w-2xl text-gray-600">Discover new features and learn how to use them.</p></div><button type="button" onClick={() => start()} className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Plus size={18} /> Add update</button></div>
    <PageQuickActions actions={[
      { label: "Add update", icon: <Plus size={18} />, onClick: () => start() },
      { label: "View updates", icon: <Bell size={18} />, href: "#recent-updates" },
      { label: "Refresh updates", icon: <RefreshCw size={18} />, onClick: () => void load(), disabled: loading },
    ]} />
    {error && <div role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-red-700"><p>{error}</p>{!open && <button type="button" onClick={() => void load()} className="mt-2 font-semibold underline">Try again</button>}</div>}
    {notice && <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
    {open && <form onSubmit={save} className="mt-6 space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-xl font-bold">{editing ? "Edit update" : "New update"}</h2><p className="text-sm text-gray-600">Describe a finished feature and explain how to use it.</p><label className="block text-sm font-medium text-gray-800">Title <span aria-hidden="true">*</span><input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="input-field mt-2" /></label><div><span className="mb-2 block text-sm font-medium text-gray-800">Update</span><RichTextEditor label="Update" placeholder="What’s new and how can people use it?" value={content} maxTextLength={5000} onChange={setContent} /></div><div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">{saving ? "Saving…" : "Save update"}</button><button type="button" disabled={saving} onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button></div></form>}
    <section id="recent-updates" aria-label="Recent updates" className="mt-6">
      {loading ? <p role="status" className="rounded-xl border border-gray-200 bg-white p-6 text-gray-500">Loading updates…</p> : updates.length === 0 ? !error && <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500"><Bell className="mx-auto mb-3 text-gray-400" /><p>No updates yet. New features will appear here when they are ready.</p></div> : <ol className="space-y-4">{updates.map((update) => <li key={update.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><time dateTime={update.createdAt} className="text-sm font-medium text-gray-500">{dateLabel(update.createdAt)}</time><h2 className="mt-1 break-words text-xl font-bold text-gray-900">{update.title}</h2></div><div className="flex gap-2"><button type="button" onClick={() => start(update)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" aria-label={`Edit ${update.title}`}><Pencil size={15} /> Edit</button><button type="button" onClick={() => void remove(update)} disabled={saving} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700" aria-label={`Delete ${update.title}`}><Trash2 size={15} /> Delete</button></div></div><div className="prose prose-sm mt-4 max-w-none break-words text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizeRichText(update.content) }} /></li>)}</ol>}
    </section>
  </main>;
}
