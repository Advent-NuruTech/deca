"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Download, Edit3, Eye, FileText, FolderPlus, ImagePlus, Plus, Search, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { PublicArticle, ResourceMajorCategory, ResourceSubcategory, ResourceTaxonomy } from "@/lib/types";
import { cloudinaryPublicId, errorMessage, formatDate } from "@/components/admin/admin-utils";
import RichTextEditor from "@/components/admin/rich-text-editor";
import { automaticPreviewText, richTextToPlainText } from "@/lib/rich-text";

type CategoryItem = ResourceMajorCategory | ResourceSubcategory;
type ArticleForm = {
  title: string; excerpt: string; content: string; majorCategoryId: string; subcategoryId: string;
  tags: string; featuredImage: string; published: boolean; isDownloadable: boolean;
  fileKey: string; fileName: string; fileType: string; fileUrl: string;
  seoTitle: string; seoDescription: string; seoKeywords: string;
};
const emptyForm: ArticleForm = { title: "", excerpt: "", content: "", majorCategoryId: "articles-blogs", subcategoryId: "", tags: "", featuredImage: "", published: false, isDownloadable: false, fileKey: "", fileName: "", fileType: "", fileUrl: "", seoTitle: "", seoDescription: "", seoKeywords: "" };

function articleForm(article?: PublicArticle | null): ArticleForm {
  if (!article) return { ...emptyForm };
  return { title: article.title, excerpt: article.excerpt, content: article.content ?? "", majorCategoryId: article.majorCategoryId || "articles-blogs", subcategoryId: article.subcategoryId ?? "", tags: article.tags?.join(", ") ?? "", featuredImage: article.featuredImage ?? "", published: article.published, isDownloadable: article.isDownloadable, fileKey: article.fileKey ?? "", fileName: article.fileName ?? "", fileType: article.fileType ?? "", fileUrl: article.fileUrl ?? "", seoTitle: article.seoTitle ?? "", seoDescription: article.seoDescription ?? "", seoKeywords: article.seoKeywords?.join(", ") ?? "" };
}

export default function ArticleManager() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [taxonomy, setTaxonomy] = useState<ResourceTaxonomy>({ majors: [], subcategories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [publication, setPublication] = useState("");
  const [resourcePage, setResourcePage] = useState(1);
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
    try {
      const response = await api.get<{ articles: PublicArticle[]; resourceCategories: ResourceTaxonomy }>("/api/articles?scope=admin&all=true");
      setArticles(response.articles ?? []); setTaxonomy(response.resourceCategories ?? { majors: [], subcategories: [] });
    } catch (nextError) { setError(errorMessage(nextError, "Resources could not be loaded")); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setCategory(searchParams.get("category") ?? ""); if (searchParams.get("action") === "new") openNew(); }, [searchParams]);

  const filtered = useMemo(() => articles.filter((article) => {
    const text = `${article.title} ${article.excerpt} ${(article.tags ?? []).join(" ")}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!category || article.majorCategoryId === category || article.subcategoryId === category) && (!publication || (publication === "published") === article.published);
  }), [articles, category, publication, query]);
  const resourcePages = Math.max(1, Math.ceil(filtered.length / 20));
  const currentResourcePage = Math.min(resourcePage, resourcePages);
  const visibleArticles = filtered.slice((currentResourcePage - 1) * 20, currentResourcePage * 20);
  useEffect(() => { setResourcePage(1); }, [query, category, publication]);
  useEffect(() => { setResourcePage((page) => Math.min(page, resourcePages)); }, [resourcePages]);
  const setField = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const categoryName = (article: PublicArticle) => {
    const major = taxonomy.majors.find((item) => item.id === article.majorCategoryId)?.name ?? "Uncategorized";
    const sub = taxonomy.subcategories.find((item) => item.id === article.subcategoryId)?.name;
    return sub ? `${major} / ${sub}` : major;
  };

  function openNew() { setEditing(null); setForm({ ...emptyForm, majorCategoryId: taxonomy.majors[0]?.id ?? "articles-blogs" }); setNewImageId(""); setNewDocumentKey(""); setModalOpen(true); }
  async function openEdit(article: PublicArticle) {
    try { const full = await api.get<PublicArticle>(`/api/articles/${article.id}?scope=admin`); setEditing(full); setForm(articleForm({ ...full, majorCategoryId: article.majorCategoryId, subcategoryId: article.subcategoryId })); setModalOpen(true); }
    catch (nextError) { toast.error(errorMessage(nextError, "Resource details could not be loaded")); }
  }
  async function closeModal() {
    if (saving) return;
    await Promise.allSettled([...(newImageId ? [api.delete("/api/upload", { publicId: newImageId })] : []), ...(newDocumentKey ? [api.delete("/api/study-materials", { key: newDocumentKey })] : [])]);
    setModalOpen(false); setEditing(null); setNewImageId(""); setNewDocumentKey("");
  }
  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return; setUploadingImage(true);
    try { if (newImageId) await api.delete("/api/upload", { publicId: newImageId }); const body = new FormData(); body.append("image", file); const result = await api.upload<{ url: string; public_id: string }>("/api/upload", body); setField("featuredImage", result.url); setNewImageId(result.public_id); toast.success("Image uploaded"); }
    catch (nextError) { toast.error(errorMessage(nextError, "Image upload failed")); }
    finally { setUploadingImage(false); event.target.value = ""; }
  }
  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return; setUploadingDocument(true);
    try { if (newDocumentKey) await api.delete("/api/study-materials", { key: newDocumentKey }); const body = new FormData(); body.append("file", file); const result = await api.upload<{ fileKey: string; fileName: string; fileType: string; fileUrl: string }>("/api/study-materials", body); setForm((current) => ({ ...current, isDownloadable: true, ...result })); setNewDocumentKey(result.fileKey); toast.success("Document uploaded"); }
    catch (nextError) { toast.error(errorMessage(nextError, "Document upload failed")); }
    finally { setUploadingDocument(false); event.target.value = ""; }
  }
  async function clearImage() { if (newImageId) await api.delete("/api/upload", { publicId: newImageId }).catch(() => undefined); setNewImageId(""); setField("featuredImage", ""); }
  async function clearDocument() { if (newDocumentKey) await api.delete("/api/study-materials", { key: newDocumentKey }).catch(() => undefined); setNewDocumentKey(""); setForm((current) => ({ ...current, isDownloadable: false, fileKey: "", fileName: "", fileType: "", fileUrl: "" })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!richTextToPlainText(form.content) && !/<img\b/i.test(form.content) && !form.featuredImage && !(form.isDownloadable && form.fileKey)) { toast.error("Add content, an image, or a document."); return; }
    setSaving(true);
    const payload = { title: form.title, ...(!editing || form.content !== editing.content ? { content: form.content, excerpt: automaticPreviewText(form.content) } : {}), majorCategoryId: form.majorCategoryId, subcategoryId: form.subcategoryId, featuredImage: form.featuredImage, published: form.published, isDownloadable: form.isDownloadable, ...(form.isDownloadable ? { fileKey: form.fileKey, fileName: form.fileName, fileType: form.fileType } : {}) };
    try {
      if (editing) await api.put(`/api/articles/${editing.id}`, payload); else await api.post("/api/articles", payload);
      const oldImage = editing?.featuredImage ? cloudinaryPublicId(editing.featuredImage) : null;
      await Promise.allSettled([...(oldImage && editing?.featuredImage !== form.featuredImage ? [api.delete("/api/upload", { publicId: oldImage })] : []), ...(editing?.fileKey && editing.fileKey !== form.fileKey ? [api.delete("/api/study-materials", { key: editing.fileKey })] : [])]);
      setNewImageId(""); setNewDocumentKey(""); setModalOpen(false); setEditing(null); toast.success(editing ? "Resource updated" : "Resource created"); await load();
    } catch (nextError) { toast.error(errorMessage(nextError, "Resource could not be saved")); }
    finally { setSaving(false); }
  }
  async function remove(article: PublicArticle) {
    if (!window.confirm(`Delete “${article.title}” and its stored files? This cannot be undone.`)) return;
    try { await api.delete(`/api/articles/${article.id}`); toast.success("Resource and stored files deleted"); await load(); }
    catch (nextError) { toast.error(errorMessage(nextError, "Resource could not be deleted")); }
  }

  async function addCategory(kind: "major" | "subcategory", parentId?: string) { const name = window.prompt(kind === "major" ? "Name the new major resource category" : "Name the new subcategory")?.trim(); if (!name) return; try { await api.post("/api/resource-categories", { kind, name, parentId }); toast.success("Category added"); await load(); } catch (nextError) { toast.error(errorMessage(nextError, "Category could not be added")); } }
  async function renameCategory(item: CategoryItem) { const name = window.prompt("Edit category name", item.name)?.trim(); if (!name || name === item.name) return; try { await api.put(`/api/resource-categories/${item.id}`, { name }); toast.success("Category renamed"); await load(); } catch (nextError) { toast.error(errorMessage(nextError, "Category could not be renamed")); } }
  async function moveSubcategory(item: ResourceSubcategory, parentId: string) { if (parentId === item.parentId) return; try { await api.put(`/api/resource-categories/${item.id}`, { parentId }); toast.success("Subcategory and its resources moved"); await load(); } catch (nextError) { toast.error(errorMessage(nextError, "Subcategory could not be moved")); } }
  async function deleteCategory(item: CategoryItem) {
    const candidates = item.kind === "major" ? taxonomy.majors.filter((candidate) => candidate.id !== item.id) : taxonomy.subcategories.filter((candidate) => candidate.id !== item.id);
    const inUse = item.count > 0 || (item.kind === "major" && taxonomy.subcategories.some((sub) => sub.parentId === item.id)); let replacementId = "";
    if (inUse) { const name = window.prompt(`“${item.name}” is in use. Type the exact destination name to move everything before deletion:\n\n${candidates.map((candidate) => candidate.name).join(", ")}`)?.trim(); if (!name) return; replacementId = candidates.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase())?.id ?? ""; if (!replacementId) return void toast.error("That destination category was not found"); }
    else if (!window.confirm(`Delete “${item.name}”?`)) return;
    try { await api.delete(`/api/resource-categories/${item.id}`, { replacementId }); toast.success("Category deleted without orphaning resources"); setCategory(""); await load(); } catch (nextError) { toast.error(errorMessage(nextError, "Category could not be deleted")); }
  }

  return <main className="pb-16 pt-10"><div className="container mx-auto px-4">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-4xl font-bold text-emerald-700">Resource Management</h1><p className="mt-2 text-gray-600">Manage resources, documents, and the editable category structure.</p></div><button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-700"><Plus size={20} /> Add Resource</button></div>
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"><MiniStat label="Total resources" value={articles.length} icon={<FileText />} /><MiniStat label="Published" value={articles.filter((item) => item.published).length} icon={<Eye />} /><MiniStat label="Drafts" value={articles.filter((item) => !item.published).length} icon={<Edit3 />} /><MiniStat label="Documents" value={articles.filter((item) => item.isDownloadable).length} icon={<Download />} /></div>
    <CategoryManager taxonomy={taxonomy} selected={category} onSelect={setCategory} onAdd={addCategory} onRename={renameCategory} onMove={moveSubcategory} onDelete={deleteCategory} />
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"><AlertCircle className="mr-2 inline" size={18} />{error} <button onClick={() => void load()} className="ml-2 font-semibold underline">Retry</button></div>}
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-gray-100 p-5 lg:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources…" className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500" /></label><CategorySelect taxonomy={taxonomy} value={category} onChange={setCategory} /><select value={publication} onChange={(event) => setPublication(event.target.value)} className="rounded-lg border border-gray-200 px-3"><option value="">All publication states</option><option value="published">Published</option><option value="draft">Draft</option></select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Resource</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">State</th><th className="px-5 py-3">Views</th><th className="px-5 py-3">Updated</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{visibleArticles.map((article) => <tr key={article.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="flex items-center gap-3">{article.featuredImage ? <img src={article.featuredImage} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400"><FileText /></div>}<div className="min-w-0"><p className="max-w-md truncate font-semibold text-gray-900">{article.title}</p><p className="max-w-md truncate text-sm text-gray-500">{article.excerpt}</p></div></div></td><td className="px-5 py-4 text-gray-600">{categoryName(article)}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${article.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{article.published ? "Published" : "Draft"}</span>{article.isDownloadable && <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">File</span>}</td><td className="px-5 py-4">{article.views ?? 0}</td><td className="px-5 py-4 text-sm text-gray-500">{formatDate(article.updatedAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => void openEdit(article)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" aria-label={`Edit ${article.title}`}><Edit3 size={18} /></button><button onClick={() => void remove(article)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${article.title}`}><Trash2 size={18} /></button></div></td></tr>)}</tbody></table></div>{loading && <p className="p-10 text-center text-gray-500">Loading resources…</p>}{!loading && !filtered.length && <p className="p-10 text-center text-gray-500">No resources match your filters.</p>}{!loading && filtered.length > 0 && <Pagination label="resources" page={currentResourcePage} pages={resourcePages} total={filtered.length} pageSize={20} onPage={setResourcePage} />}
    </section>
  </div>
  <AnimatePresence>{modalOpen && <ResourceModal form={form} taxonomy={taxonomy} editing={Boolean(editing)} saving={saving} uploadingImage={uploadingImage} uploadingDocument={uploadingDocument} setField={setField} setForm={setForm} onSubmit={submit} onClose={closeModal} onUploadImage={uploadImage} onUploadDocument={uploadDocument} onClearImage={clearImage} onClearDocument={clearDocument} />}</AnimatePresence>
  </main>;
}

function CategorySelect({ taxonomy, value, onChange }: { taxonomy: ResourceTaxonomy; value: string; onChange: (value: string) => void }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-gray-200 px-3"><option value="">All categories</option>{taxonomy.majors.map((major) => <optgroup key={major.id} label={major.name}><option value={major.id}>All in {major.name} ({major.count})</option>{taxonomy.subcategories.filter((item) => item.parentId === major.id).map((item) => <option key={item.id} value={item.id}>{item.name} ({item.count})</option>)}</optgroup>)}</select>; }

function CategoryManager({ taxonomy, selected, onSelect, onAdd, onRename, onMove, onDelete }: { taxonomy: ResourceTaxonomy; selected: string; onSelect: (id: string) => void; onAdd: (kind: "major" | "subcategory", parentId?: string) => Promise<void>; onRename: (item: CategoryItem) => Promise<void>; onMove: (item: ResourceSubcategory, parentId: string) => Promise<void>; onDelete: (item: CategoryItem) => Promise<void> }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const groups = taxonomy.majors.map((major) => {
    const majorMatches = major.name.toLowerCase().includes(term);
    const subcategories = taxonomy.subcategories.filter((sub) => sub.parentId === major.id && (majorMatches || sub.name.toLowerCase().includes(term)));
    return { major, subcategories, visible: majorMatches || subcategories.length > 0 };
  }).filter((group) => group.visible);
  return <section className="mb-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Resource categories</h2><p className="mt-1 text-sm text-gray-500">Choose a category to filter resources, or manage it below.</p></div><button onClick={() => void onAdd("major")} className="flex items-center gap-2 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700"><FolderPlus size={17} /> Add major category</button></div>
    <label className="relative mb-4 block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input aria-label="Search categories" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500" /></label>
    <div className="grid gap-4 lg:grid-cols-2">{groups.map(({ major, subcategories }) => <CategoryGroup key={major.id} major={major} subcategories={subcategories} taxonomy={taxonomy} term={term} selected={selected} onSelect={onSelect} onAdd={onAdd} onRename={onRename} onMove={onMove} onDelete={onDelete} />)}</div>
    {!groups.length && <p className="py-6 text-center text-sm text-gray-500">No categories match your search.</p>}
  </section>;
}

function CategoryGroup({ major, subcategories, taxonomy, term, selected, onSelect, onAdd, onRename, onMove, onDelete }: { major: ResourceMajorCategory; subcategories: ResourceSubcategory[]; taxonomy: ResourceTaxonomy; term: string; selected: string; onSelect: (id: string) => void; onAdd: (kind: "major" | "subcategory", parentId?: string) => Promise<void>; onRename: (item: CategoryItem) => Promise<void>; onMove: (item: ResourceSubcategory, parentId: string) => Promise<void>; onDelete: (item: CategoryItem) => Promise<void> }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(subcategories.length / 10));
  const currentPage = Math.min(page, pages);
  useEffect(() => { setPage(1); }, [term]);
  useEffect(() => { setPage((current) => Math.min(current, pages)); }, [pages]);
  return <div className={`min-w-0 rounded-xl border p-4 ${selected === major.id ? "border-emerald-400 bg-emerald-50" : "border-gray-200"}`}>
    <div className="flex items-center gap-2"><button onClick={() => onSelect(selected === major.id ? "" : major.id)} className="min-w-0 flex-1 text-left font-bold">{major.name} <span className="text-sm font-normal text-gray-500">({major.count})</span></button><IconButton label={`Rename ${major.name}`} onClick={() => void onRename(major)} icon={<Edit3 size={16} />} /><IconButton danger label={`Delete ${major.name}`} onClick={() => void onDelete(major)} icon={<Trash2 size={16} />} /></div>
    <div className="mt-3 space-y-2">{subcategories.slice((currentPage - 1) * 10, currentPage * 10).map((sub) => <div key={sub.id} className={`flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 ${selected === sub.id ? "bg-emerald-50 ring-1 ring-emerald-300" : "bg-gray-50"}`}><button onClick={() => onSelect(selected === sub.id ? "" : sub.id)} className="min-w-[110px] flex-1 text-left text-sm font-medium">{sub.name} <span className="font-normal text-gray-500">({sub.count})</span></button><select aria-label={`Move ${sub.name}`} value={sub.parentId} onChange={(event) => void onMove(sub, event.target.value)} className="max-w-40 rounded border bg-white px-2 py-1 text-xs">{taxonomy.majors.map((destination) => <option key={destination.id} value={destination.id}>{destination.name}</option>)}</select><IconButton label={`Rename ${sub.name}`} onClick={() => void onRename(sub)} icon={<Edit3 size={15} />} /><IconButton danger label={`Delete ${sub.name}`} onClick={() => void onDelete(sub)} icon={<Trash2 size={15} />} /></div>)}</div>
    {!subcategories.length && <p className="mt-3 text-sm text-gray-500">{term ? "No matching subcategories." : "No subcategories yet."}</p>}
    {subcategories.length > 0 && <Pagination label={`subcategories in ${major.name}`} page={currentPage} pages={pages} total={subcategories.length} pageSize={10} onPage={setPage} />}
    <button onClick={() => void onAdd("subcategory", major.id)} className="mt-3 flex items-center gap-1 rounded text-sm font-semibold text-emerald-700"><Plus size={15} /> Add subcategory</button>
  </div>;
}

function Pagination({ label, page, pages, total, pageSize, onPage }: { label: string; page: number; pages: number; total: number; pageSize: number; onPage: (page: number) => void }) {
  return <nav aria-label={`${label} pages`} className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-1 py-4 text-sm text-gray-600"><span aria-live="polite">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total} {label}</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40">Previous</button><span>Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40">Next</button></div></nav>;
}

function ResourceModal({ form, taxonomy, editing, saving, uploadingImage, uploadingDocument, setField, setForm, onSubmit, onClose, onUploadImage, onUploadDocument, onClearImage, onClearDocument }: { form: ArticleForm; taxonomy: ResourceTaxonomy; editing: boolean; saving: boolean; uploadingImage: boolean; uploadingDocument: boolean; setField: <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => void; setForm: React.Dispatch<React.SetStateAction<ArticleForm>>; onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>; onClose: () => Promise<void>; onUploadImage: (event: ChangeEvent<HTMLInputElement>) => Promise<void>; onUploadDocument: (event: ChangeEvent<HTMLInputElement>) => Promise<void>; onClearImage: () => Promise<void>; onClearDocument: () => Promise<void> }) {
  return <div className="fixed inset-0 z-50 bg-white"><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} role="dialog" aria-modal="true" aria-labelledby="resource-modal-title" className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white"><div className="flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6"><div><h2 id="resource-modal-title" className="text-2xl font-bold">{editing ? "Edit Resource" : "Add Resource"}</h2><p className="text-sm text-gray-500">Add the details and write your resource below.</p></div><button type="button" aria-label="Close" onClick={() => void onClose()} className="rounded-lg p-2 hover:bg-gray-100"><X /></button></div><form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col"><div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-4 sm:p-6"><Section title="Resource content"><div className="grid gap-4 md:grid-cols-2"><Field label="Title *" wide><input required value={form.title} onChange={(event) => setField("title", event.target.value)} className="input-field" /></Field><Field label="Major category *"><select required value={form.majorCategoryId} onChange={(event) => setForm((current) => ({ ...current, majorCategoryId: event.target.value, subcategoryId: "" }))} className="input-field"><option value="">Select a major category</option>{taxonomy.majors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Subcategory"><select value={form.subcategoryId} onChange={(event) => setField("subcategoryId", event.target.value)} className="input-field"><option value="">No subcategory</option>{taxonomy.subcategories.filter((item) => item.parentId === form.majorCategoryId).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><div className="min-w-0 md:col-span-2"><span className="mb-1.5 block text-sm font-medium">Content</span><p className="mb-2 text-sm text-gray-500">Add content, a featured image, or a document. You can combine them.</p><RichTextEditor label="Resource content" placeholder="Write your resource here..." value={form.content} allowImages onChange={(value) => setField("content", value)} /></div><div className="flex gap-6 md:col-span-2"><Check label="Published" checked={form.published} onChange={(value) => setField("published", value)} /><Check label="Downloadable document" checked={form.isDownloadable} onChange={(value) => setField("isDownloadable", value)} /></div></div></Section><UploadSection title="Featured image" busy={uploadingImage} accept="image/jpeg,image/png,image/gif,image/webp" label="Upload image (max 5 MB)" onChange={onUploadImage}>{form.featuredImage && <div className="relative mt-4 w-fit"><img src={form.featuredImage} alt="Preview" className="h-40 max-w-sm rounded-xl object-cover" /><button type="button" onClick={() => void onClearImage()} className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white"><X size={16} /></button></div>}</UploadSection><UploadSection title="Downloadable document" busy={uploadingDocument} accept=".pdf,.doc,.docx,.ppt,.pptx" label="Upload PDF, DOC/DOCX, or PPT/PPTX (max 20 MB)" onChange={onUploadDocument}>{form.fileKey && <div className="mt-3 flex items-center justify-between rounded-lg bg-blue-50 p-3 text-blue-800"><span>{form.fileName || form.fileKey}</span><button type="button" onClick={() => void onClearDocument()}><X size={17} /></button></div>}</UploadSection></div><div className="flex shrink-0 justify-end gap-3 border-t bg-white px-4 py-3 sm:px-6"><button type="button" onClick={() => void onClose()} className="rounded-lg border px-5 py-2.5">Cancel</button><button disabled={saving || uploadingImage || uploadingDocument || !form.majorCategoryId || (form.isDownloadable && !form.fileKey)} className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : editing ? "Update Resource" : "Create Resource"}</button></div></form></motion.div></div>;
}

function UploadSection({ title, busy, accept, label, onChange, children }: { title: string; busy: boolean; accept: string; label: string; onChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>; children: ReactNode }) { return <Section title={title}><label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6"><Upload className="text-gray-400" /><span>{busy ? "Uploading…" : label}</span><input type="file" accept={accept} onChange={onChange} disabled={busy} className="hidden" /></label>{children}</Section>; }
function IconButton({ label, onClick, icon, danger }: { label: string; onClick: () => void; icon: ReactNode; danger?: boolean }) { return <button onClick={onClick} aria-label={label} className={`rounded p-1.5 ${danger ? "text-red-600 hover:bg-red-50" : "text-blue-600 hover:bg-blue-50"}`}>{icon}</button>; }
function MiniStat({ label, value, icon }: { label: string; value: number; icon: ReactNode }) { return <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-5"><div className="min-w-0"><p className="text-sm text-gray-500">{label}</p><p className="mt-1 break-words text-xl font-bold sm:text-2xl">{value}</p></div><div className="shrink-0 rounded-lg bg-blue-100 p-2 text-blue-700 sm:p-3">{icon}</div></div>; }
function Section({ title, children }: { title: string; children: ReactNode }) { return <section><h3 className="mb-4 border-b pb-2 text-lg font-bold">{title}</h3>{children}</section>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) { return <label className={wide ? "md:col-span-2" : ""}><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>; }
