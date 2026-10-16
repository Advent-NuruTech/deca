"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Download, Edit3, Eye, FileText, ImagePlus, Plus, Search, Sparkles, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { Article, PublicArticle } from "@/lib/types";
import { cloudinaryPublicId, errorMessage, formatDate } from "@/components/admin/admin-utils";

type ArticlesResponse = { articles: PublicArticle[] };
type ImageUpload = { url: string; public_id: string };
type DocumentUpload = { fileKey: string; fileName: string; fileType: string; fileUrl: string };
type ArticleForm = {
  title: string; excerpt: string; content: string; category: Article["category"]; studyCategory: string;
  tags: string; featuredImage: string; published: boolean; isDownloadable: boolean;
  fileKey: string; fileName: string; fileType: string; fileUrl: string;
  seoTitle: string; seoDescription: string; seoKeywords: string;
};

const emptyForm: ArticleForm = { title: "", excerpt: "", content: "", category: "faith", studyCategory: "", tags: "", featuredImage: "", published: false, isDownloadable: false, fileKey: "", fileName: "", fileType: "", fileUrl: "", seoTitle: "", seoDescription: "", seoKeywords: "" };

function formFromArticle(article?: PublicArticle | null): ArticleForm {
  if (!article) return { ...emptyForm };
  return { title: article.title, excerpt: article.excerpt, content: article.content ?? "", category: article.category, studyCategory: article.studyCategory ?? "", tags: article.tags?.join(", ") ?? "", featuredImage: article.featuredImage ?? "", published: article.published, isDownloadable: article.isDownloadable, fileKey: article.fileKey ?? "", fileName: article.fileName ?? "", fileType: article.fileType ?? "", fileUrl: article.fileUrl ?? "", seoTitle: article.seoTitle ?? "", seoDescription: article.seoDescription ?? "", seoKeywords: article.seoKeywords?.join(", ") ?? "" };
}

export default function ArticleManager() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [publication, setPublication] = useState("");
  const [editing, setEditing] = useState<PublicArticle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [newImageId, setNewImageId] = useState("");
  const [newDocumentKey, setNewDocumentKey] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const response = await api.get<ArticlesResponse>("/api/articles?scope=admin&limit=100"); setArticles(response.articles ?? []); }
    catch (nextError) { setError(errorMessage(nextError, "Articles could not be loaded")); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (searchParams.get("action") === "new") openNew(); }, [searchParams]);

  const filtered = useMemo(() => articles.filter((article) => {
    const matchQuery = !query || `${article.title} ${article.excerpt} ${(article.tags ?? []).join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchQuery && (!category || article.category === category) && (!publication || (publication === "published") === article.published);
  }), [articles, category, publication, query]);

  function openNew() { setEditing(null); setForm({ ...emptyForm }); setNewImageId(""); setNewDocumentKey(""); setModalOpen(true); }
  async function openEdit(article: PublicArticle) {
    try {
      const fullArticle = await api.get<PublicArticle>(`/api/articles/${article.id}?scope=admin`);
      setEditing(fullArticle); setForm(formFromArticle(fullArticle)); setNewImageId(""); setNewDocumentKey(""); setModalOpen(true);
    } catch (nextError) { toast.error(errorMessage(nextError, "Article details could not be loaded")); }
  }
  function setField<K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function closeModal() {
    if (saving) return;
    const cleanups: Promise<unknown>[] = [];
    if (newImageId) cleanups.push(api.delete("/api/upload", { publicId: newImageId }));
    if (newDocumentKey) cleanups.push(api.delete("/api/study-materials", { key: newDocumentKey }));
    await Promise.allSettled(cleanups);
    setModalOpen(false); setEditing(null); setNewImageId(""); setNewDocumentKey("");
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return; setUploadingImage(true);
    try {
      if (newImageId) await api.delete("/api/upload", { publicId: newImageId });
      const body = new FormData(); body.append("image", file);
      const response = await api.upload<ImageUpload>("/api/upload", body);
      setField("featuredImage", response.url); setNewImageId(response.public_id); toast.success("Featured image uploaded");
    } catch (nextError) { toast.error(errorMessage(nextError, "Image upload failed")); }
    finally { setUploadingImage(false); event.target.value = ""; }
  }

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return; setUploadingDocument(true);
    try {
      if (newDocumentKey) await api.delete("/api/study-materials", { key: newDocumentKey });
      const body = new FormData(); body.append("file", file);
      const response = await api.upload<DocumentUpload>("/api/study-materials", body);
      setForm((current) => ({ ...current, isDownloadable: true, category: "study", fileKey: response.fileKey, fileName: response.fileName, fileType: response.fileType, fileUrl: response.fileUrl }));
      setNewDocumentKey(response.fileKey); toast.success("Study document uploaded");
    } catch (nextError) { toast.error(errorMessage(nextError, "Document upload failed")); }
    finally { setUploadingDocument(false); event.target.value = ""; }
  }

  async function clearNewImage() {
    if (newImageId) { try { await api.delete("/api/upload", { publicId: newImageId }); } catch { /* best effort */ } setNewImageId(""); }
    setField("featuredImage", "");
  }
  async function clearNewDocument() {
    if (newDocumentKey) { try { await api.delete("/api/study-materials", { key: newDocumentKey }); } catch { /* best effort */ } setNewDocumentKey(""); }
    setForm((current) => ({ ...current, isDownloadable: false, fileKey: "", fileName: "", fileType: "", fileUrl: "" }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const payload = { title: form.title, excerpt: form.excerpt, content: form.content, category: form.category, studyCategory: form.studyCategory, tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean), featuredImage: form.featuredImage, published: form.published, isDownloadable: form.isDownloadable, ...(form.isDownloadable ? { fileKey: form.fileKey, fileName: form.fileName, fileType: form.fileType } : {}), seoTitle: form.seoTitle, seoDescription: form.seoDescription, seoKeywords: form.seoKeywords.split(",").map((item) => item.trim()).filter(Boolean) };
    try {
      if (editing) await api.put(`/api/articles/${editing.id}`, payload); else await api.post("/api/articles", payload);
      const cleanups: Promise<unknown>[] = [];
      if (editing?.featuredImage && editing.featuredImage !== form.featuredImage) { const publicId = cloudinaryPublicId(editing.featuredImage); if (publicId) cleanups.push(api.delete("/api/upload", { publicId })); }
      if (editing?.fileKey && editing.fileKey !== form.fileKey) cleanups.push(api.delete("/api/study-materials", { key: editing.fileKey }));
      await Promise.allSettled(cleanups); setNewImageId(""); setNewDocumentKey(""); setModalOpen(false); setEditing(null); toast.success(editing ? "Article updated" : "Article created"); await load();
    } catch (nextError) { toast.error(errorMessage(nextError, "Article could not be saved")); }
    finally { setSaving(false); }
  }

  async function remove(article: PublicArticle) {
    if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/articles/${article.id}`);
      const cleanups: Promise<unknown>[] = [];
      const publicId = article.featuredImage ? cloudinaryPublicId(article.featuredImage) : null;
      if (publicId) cleanups.push(api.delete("/api/upload", { publicId }));
      if (article.fileKey) cleanups.push(api.delete("/api/study-materials", { key: article.fileKey }));
      await Promise.allSettled(cleanups); setArticles((current) => current.filter((item) => item.id !== article.id)); toast.success("Article deleted");
    } catch (nextError) { toast.error(errorMessage(nextError, "Article could not be deleted")); }
  }

  return <main className="pb-16 pt-10"><div className="container mx-auto px-4">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-4xl font-bold"><span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Article Management</span></h1><p className="mt-2 text-gray-600">Create and manage articles, featured images, and study documents.</p></div><div className="flex items-center gap-4"><motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="hidden md:block"><Sparkles size={30} className="text-emerald-400/50" /></motion.div><button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-700"><Plus size={20} /> Add New Article</button></div></div>
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MiniStat label="Total articles" value={articles.length} icon={<FileText />} /><MiniStat label="Published" value={articles.filter((item) => item.published).length} icon={<Eye />} /><MiniStat label="Drafts" value={articles.filter((item) => !item.published).length} icon={<Edit3 />} /><MiniStat label="Downloads" value={articles.filter((item) => item.isDownloadable).length} icon={<Download />} /></div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"><AlertCircle className="mr-2 inline" size={18} />{error} <button onClick={() => void load()} className="ml-2 font-semibold underline">Retry</button></div>}
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-gray-100 p-5 lg:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles…" className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-lg border border-gray-200 px-3"><option value="">All categories</option><option value="faith">Faith</option><option value="recipe">Recipes</option><option value="agriculture">Agriculture</option><option value="homeschooling">Homeschooling</option><option value="study">Study</option></select><select value={publication} onChange={(event) => setPublication(event.target.value)} className="rounded-lg border border-gray-200 px-3"><option value="">All publication states</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Article</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">State</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Updated</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((article) => <tr key={article.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="flex items-center gap-3">{article.featuredImage ? <img src={article.featuredImage} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400"><FileText /></div>}<div className="min-w-0"><p className="max-w-md truncate font-semibold text-gray-900">{article.title}</p><p className="max-w-md truncate text-sm text-gray-500">{article.excerpt}</p></div></div></td><td className="px-5 py-4 capitalize text-gray-600">{article.category}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${article.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{article.published ? "Published" : "Draft"}</span>{article.isDownloadable && <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">File</span>}</td><td className="px-5 py-4 text-gray-600">{article.views ?? 0}</td><td className="px-5 py-4 text-sm text-gray-500">{formatDate(article.updatedAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => void openEdit(article)} aria-label={`Edit ${article.title}`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Edit3 size={18} /></button><button onClick={() => void remove(article)} aria-label={`Delete ${article.title}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button></div></td></tr>)}</tbody></table></div>{loading && <p className="p-10 text-center text-gray-500">Loading articles…</p>}{!loading && filtered.length === 0 && <p className="p-10 text-center text-gray-500">No articles match your filters.</p>}
    </section>
  </div>
  <AnimatePresence>{modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) void closeModal(); }}><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="max-h-[94vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><div><h2 className="text-2xl font-bold">{editing ? "Edit Article" : "Add New Article"}</h2><p className="text-sm text-gray-500">Content, publication, media, and downloads</p></div><button onClick={() => void closeModal()} className="rounded-lg p-2 hover:bg-gray-100"><X /></button></div><form onSubmit={submit}><div className="max-h-[72vh] space-y-7 overflow-y-auto p-6">
    <Section title="Article content"><div className="grid gap-4 md:grid-cols-2"><Field label="Title *" wide><input required value={form.title} onChange={(e) => setField("title", e.target.value)} className="input-field" /></Field><Field label="Category *"><select value={form.category} onChange={(e) => setField("category", e.target.value as Article["category"])} className="input-field"><option value="faith">Faith</option><option value="recipe">Recipe</option><option value="agriculture">Agriculture</option><option value="homeschooling">Homeschooling</option><option value="study">Study material</option></select></Field><Field label="Study category"><input value={form.studyCategory} onChange={(e) => setField("studyCategory", e.target.value)} placeholder="e.g. bible-study" className="input-field" /></Field><Field label="Excerpt *" wide><textarea required rows={3} value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)} className="input-field" /></Field><Field label="HTML content *" wide><textarea required rows={12} value={form.content} onChange={(e) => setField("content", e.target.value)} className="input-field font-mono text-sm" /></Field><Field label="Tags (comma-separated)" wide><input value={form.tags} onChange={(e) => setField("tags", e.target.value)} className="input-field" /></Field><div className="flex gap-6 md:col-span-2"><Check label="Published" checked={form.published} onChange={(value) => setField("published", value)} /><Check label="Downloadable study material" checked={form.isDownloadable} onChange={(value) => setField("isDownloadable", value)} /></div></div></Section>
    <Section title="Featured image"><label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-emerald-500"><ImagePlus className="text-gray-400" /><span>{uploadingImage ? "Uploading…" : "Upload JPEG, PNG, GIF, or WebP (max 5 MB)"}</span><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={uploadImage} disabled={uploadingImage} className="hidden" /></label>{form.featuredImage && <div className="relative mt-4 w-fit"><img src={form.featuredImage} alt="Featured preview" className="h-40 max-w-sm rounded-xl object-cover" /><button type="button" onClick={() => void clearNewImage()} className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white"><X size={16} /></button></div>}</Section>
    <Section title="Study document"><label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 p-6 hover:border-blue-500"><Upload className="text-gray-400" /><span>{uploadingDocument ? "Uploading…" : "Upload PDF, DOC/DOCX, or PPT/PPTX (max 20 MB)"}</span><input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={uploadDocument} disabled={uploadingDocument} className="hidden" /></label>{form.fileKey && <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50 p-3 text-blue-800"><span className="flex items-center gap-2"><FileText size={18} />{form.fileName || form.fileKey}</span><button type="button" onClick={() => void clearNewDocument()} className="rounded p-1 hover:bg-blue-100"><X size={17} /></button></div>}</Section>
    <Section title="Search metadata"><div className="grid gap-4"><Field label="SEO title"><input value={form.seoTitle} onChange={(e) => setField("seoTitle", e.target.value)} className="input-field" /></Field><Field label="SEO description"><textarea rows={3} value={form.seoDescription} onChange={(e) => setField("seoDescription", e.target.value)} className="input-field" /></Field><Field label="SEO keywords (comma-separated)"><input value={form.seoKeywords} onChange={(e) => setField("seoKeywords", e.target.value)} className="input-field" /></Field></div></Section>
  </div><div className="flex justify-end gap-3 border-t border-gray-200 p-5"><button type="button" onClick={() => void closeModal()} className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium">Cancel</button><button disabled={saving || uploadingImage || uploadingDocument || (form.isDownloadable && !form.fileKey)} className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : editing ? "Update Article" : "Create Article"}</button></div></form></motion.div></div>}</AnimatePresence>
  </main>;
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) { return <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><div><p className="text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><div className="rounded-lg bg-blue-100 p-3 text-blue-700">{icon}</div></div>; }
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section><h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold">{title}</h3>{children}</section>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "md:col-span-2" : ""}><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>{children}</label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded text-emerald-600" />{label}</label>; }
