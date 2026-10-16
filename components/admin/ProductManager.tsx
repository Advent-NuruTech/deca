"use client";

import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Edit3, ImagePlus, Package, Plus, Search, Sparkles, Star, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { Product, PublicProduct } from "@/lib/types";
import { cloudinaryPublicId, errorMessage, formatDate, formatMoney } from "@/components/admin/admin-utils";

type ProductsResponse = { products: PublicProduct[] };
type UploadResponse = { url: string; public_id: string };
type ProductForm = {
  name: string; description: string; features: string; category: Product["category"];
  price: string; originalPrice: string; stockQuantity: string; inStock: boolean;
  featured: boolean; status: Product["status"]; images: string[]; brand: string;
  model: string; organicCertified: boolean; seedType: string; seoTitle: string;
  seoDescription: string; seoKeywords: string;
};

const emptyForm: ProductForm = { name: "", description: "", features: "", category: "seeds", price: "", originalPrice: "", stockQuantity: "0", inStock: true, featured: false, status: "active", images: [], brand: "", model: "", organicCertified: false, seedType: "", seoTitle: "", seoDescription: "", seoKeywords: "" };

function formFromProduct(product?: PublicProduct | null): ProductForm {
  if (!product) return { ...emptyForm, images: [] };
  return {
    name: product.name, description: product.description, features: product.features ?? "", category: product.category,
    price: String(product.price), originalPrice: product.originalPrice == null ? "" : String(product.originalPrice),
    stockQuantity: String(product.stockQuantity ?? 0), inStock: product.inStock, featured: product.featured,
    status: product.status, images: [...(product.images ?? [])], brand: product.brand ?? "", model: product.model ?? "",
    organicCertified: product.organicCertified ?? false, seedType: product.seedType ?? "", seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "", seoKeywords: product.seoKeywords?.join(", ") ?? "",
  };
}

export default function ProductManager() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<PublicProduct | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newUploads, setNewUploads] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await api.get<ProductsResponse>("/api/products?scope=admin&limit=100");
      setProducts(response.products ?? []);
    } catch (nextError) { setError(errorMessage(nextError, "Products could not be loaded")); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (searchParams.get("action") === "new") openModal(); }, [searchParams]);

  const filtered = useMemo(() => products.filter((product) => {
    const matchQuery = !query || `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase());
    return matchQuery && (!status || product.status === status);
  }), [products, query, status]);

  function openModal(product?: PublicProduct) {
    setEditing(product ?? null); setForm(formFromProduct(product)); setNewUploads([]); setModalOpen(true);
  }

  async function closeModal() {
    if (saving) return;
    await Promise.allSettled(newUploads.map((publicId) => api.delete("/api/upload", { publicId })));
    setModalOpen(false); setEditing(null); setNewUploads([]);
  }

  function setField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (form.images.length + files.length > 10) { toast.error("A product can have at most 10 images"); return; }
    setUploading(true);
    try {
      const uploaded: UploadResponse[] = [];
      for (const file of files) {
        const data = new FormData(); data.append("image", file);
        uploaded.push(await api.upload<UploadResponse>("/api/upload", data));
      }
      setForm((current) => ({ ...current, images: [...current.images, ...uploaded.map((item) => item.url)] }));
      setNewUploads((current) => [...current, ...uploaded.map((item) => item.public_id)]);
      toast.success(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`);
    } catch (nextError) { toast.error(errorMessage(nextError, "Image upload failed")); }
    finally { setUploading(false); event.target.value = ""; }
  }

  async function removeImage(index: number) {
    const image = form.images[index];
    setField("images", form.images.filter((_, itemIndex) => itemIndex !== index));
    const publicId = cloudinaryPublicId(image);
    if (publicId && newUploads.includes(publicId)) {
      try { await api.delete("/api/upload", { publicId }); } catch { /* best-effort cleanup */ }
      setNewUploads((current) => current.filter((item) => item !== publicId));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true);
    const payload = {
      name: form.name, description: form.description, features: form.features, category: form.category,
      price: Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stockQuantity: Number(form.stockQuantity), inStock: form.inStock, featured: form.featured, status: form.status,
      images: form.images, brand: form.brand, model: form.model, organicCertified: form.organicCertified,
      seedType: form.seedType, seoTitle: form.seoTitle, seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords.split(",").map((item) => item.trim()).filter(Boolean),
    };
    try {
      if (editing) await api.put(`/api/products/${editing.id}`, payload);
      else await api.post("/api/products", payload);
      const removed = editing?.images.filter((image) => !form.images.includes(image)).map(cloudinaryPublicId).filter((item): item is string => Boolean(item)) ?? [];
      await Promise.allSettled(removed.map((publicId) => api.delete("/api/upload", { publicId })));
      setNewUploads([]); setModalOpen(false); setEditing(null); toast.success(editing ? "Product updated" : "Product created"); await load();
    } catch (nextError) { toast.error(errorMessage(nextError, "Product could not be saved")); }
    finally { setSaving(false); }
  }

  async function remove(product: PublicProduct) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try { await api.delete(`/api/products/${product.id}`); setProducts((current) => current.filter((item) => item.id !== product.id)); toast.success("Product deleted"); }
    catch (nextError) { toast.error(errorMessage(nextError, "Product could not be deleted")); }
  }

  const active = products.filter((product) => product.status === "active").length;
  const featured = products.filter((product) => product.featured).length;
  const lowStock = products.filter((product) => product.stockQuantity <= 5).length;

  return (
    <main className="pb-16 pt-10"><div className="container mx-auto px-4">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-4xl font-bold"><span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Product Management</span></h1><p className="mt-2 text-gray-600">Manage organic seeds, fresh produce, inventory, and product media.</p></div><div className="flex items-center gap-4"><motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="hidden md:block"><Sparkles size={30} className="text-emerald-400/50" /></motion.div><button onClick={() => openModal()} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-700"><Plus size={20} /> Add New Product</button></div></div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MiniStat label="Total products" value={products.length} icon={<Package />} /><MiniStat label="Active" value={active} icon={<Package />} /><MiniStat label="Featured" value={featured} icon={<Star />} /><MiniStat label="Low stock" value={lowStock} icon={<AlertCircle />} /></div>
      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={() => void load()} className="ml-2 font-semibold underline">Retry</button></div>}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500" /></label><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2.5"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option></select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((product) => <tr key={product.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.images?.[0] || "/logo.png"} alt="" className="h-12 w-12 rounded-lg object-cover" /><div><p className="font-semibold text-gray-900">{product.name}</p>{product.featured && <span className="text-xs text-amber-600">Featured</span>}</div></div></td><td className="px-5 py-4 capitalize text-gray-600">{product.category}</td><td className="px-5 py-4 font-medium">{formatMoney(product.price)}</td><td className="px-5 py-4"><span className={product.stockQuantity <= 5 ? "font-semibold text-red-600" : "text-gray-600"}>{product.stockQuantity}</span></td><td className="px-5 py-4"><StatusBadge value={product.status} /></td><td className="px-5 py-4 text-sm text-gray-500">{formatDate(product.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openModal(product)} aria-label={`Edit ${product.name}`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><Edit3 size={18} /></button><button onClick={() => void remove(product)} aria-label={`Delete ${product.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={18} /></button></div></td></tr>)}</tbody></table></div>
        {!loading && filtered.length === 0 && <p className="p-10 text-center text-gray-500">No products match your filters.</p>}{loading && <p className="p-10 text-center text-gray-500">Loading products…</p>}
      </section>
    </div>

    <AnimatePresence>{modalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) void closeModal(); }}><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><div><h2 className="text-2xl font-bold text-gray-900">{editing ? "Edit Product" : "Add New Product"}</h2><p className="text-sm text-gray-500">Product details, inventory, media, and search metadata</p></div><button onClick={() => void closeModal()} className="rounded-lg p-2 hover:bg-gray-100"><X /></button></div>
      <form onSubmit={submit}><div className="max-h-[70vh] space-y-7 overflow-y-auto p-6">
        <FormSection title="Basic information"><div className="grid gap-4 md:grid-cols-2"><Field label="Product name *"><input required value={form.name} onChange={(e) => setField("name", e.target.value)} className="input-field" /></Field><Field label="Category *"><select value={form.category} onChange={(e) => setField("category", e.target.value as Product["category"])} className="input-field"><option value="seeds">Organic Seeds</option><option value="produce">Fresh Produce</option><option value="other">Other Products</option></select></Field><Field label="Description *" wide><textarea required rows={4} value={form.description} onChange={(e) => setField("description", e.target.value)} className="input-field" /></Field><Field label="Key features" wide><textarea rows={3} value={form.features} onChange={(e) => setField("features", e.target.value)} className="input-field" /></Field><Field label="Brand"><input value={form.brand} onChange={(e) => setField("brand", e.target.value)} className="input-field" /></Field><Field label="Variety / model"><input value={form.model} onChange={(e) => setField("model", e.target.value)} className="input-field" /></Field></div></FormSection>
        <FormSection title="Pricing and inventory"><div className="grid gap-4 md:grid-cols-3"><Field label="Price (KES) *"><input required min="0.01" step="0.01" type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} className="input-field" /></Field><Field label="Original price"><input min="0" step="0.01" type="number" value={form.originalPrice} onChange={(e) => setField("originalPrice", e.target.value)} className="input-field" /></Field><Field label="Stock quantity"><input min="0" step="1" type="number" value={form.stockQuantity} onChange={(e) => setField("stockQuantity", e.target.value)} className="input-field" /></Field><Field label="Status"><select value={form.status} onChange={(e) => setField("status", e.target.value as Product["status"])} className="input-field"><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option></select></Field><div className="flex flex-wrap items-end gap-5 pb-3 md:col-span-2"><Check label="In stock" checked={form.inStock} onChange={(value) => setField("inStock", value)} /><Check label="Featured" checked={form.featured} onChange={(value) => setField("featured", value)} /><Check label="Organic certified" checked={form.organicCertified} onChange={(value) => setField("organicCertified", value)} /></div></div></FormSection>
        <FormSection title="Product images"><label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-7 text-center hover:border-emerald-500"><ImagePlus className="mb-2 text-gray-400" /><span className="font-medium text-gray-700">{uploading ? "Uploading…" : "Choose JPEG, PNG, GIF, or WebP images"}</span><span className="text-sm text-gray-500">Up to 5 MB each; maximum 10 images</span><input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" onChange={uploadImages} disabled={uploading} className="hidden" /></label>{form.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.images.map((image, index) => <div key={`${image}-${index}`} className="group relative"><img src={image} alt={`Product preview ${index + 1}`} className="h-28 w-full rounded-lg object-cover" /><button type="button" onClick={() => void removeImage(index)} aria-label="Remove image" className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white opacity-90"><X size={15} /></button></div>)}</div>}</FormSection>
        <FormSection title="Search metadata"><div className="grid gap-4"><Field label="SEO title"><input value={form.seoTitle} onChange={(e) => setField("seoTitle", e.target.value)} className="input-field" /></Field><Field label="SEO description"><textarea rows={3} value={form.seoDescription} onChange={(e) => setField("seoDescription", e.target.value)} className="input-field" /></Field><Field label="SEO keywords (comma-separated)"><input value={form.seoKeywords} onChange={(e) => setField("seoKeywords", e.target.value)} className="input-field" /></Field></div></FormSection>
      </div><div className="flex justify-end gap-3 border-t border-gray-200 p-5"><button type="button" onClick={() => void closeModal()} className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700">Cancel</button><button disabled={saving || uploading} className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : editing ? "Update Product" : "Create Product"}</button></div></form></motion.div></div>}</AnimatePresence>
    </main>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) { return <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><div><p className="text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><div className="rounded-lg bg-emerald-100 p-3 text-emerald-700">{icon}</div></div>; }
function StatusBadge({ value }: { value: string }) { const style = value === "active" ? "bg-green-100 text-green-700" : value === "draft" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{value}</span>; }
function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">{title}</h3>{children}</section>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "md:col-span-2" : ""}><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>{children}</label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded text-emerald-600" />{label}</label>; }
