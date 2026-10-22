"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Edit3, FolderPlus, ImagePlus, Package, Plus, Search, Sparkles, Star, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { richTextToPlainText } from "@/lib/rich-text";
import type { Product, ProductCategory, PublicProduct } from "@/lib/types";
import { cloudinaryPublicId, errorMessage, formatDate, formatMoney } from "@/components/admin/admin-utils";
import RichTextEditor from "@/components/admin/rich-text-editor";

type ProductsResponse = { products: PublicProduct[] };
type CategoriesResponse = { categories: ProductCategory[] };
type UploadResponse = { url: string; public_id: string };
type ProductForm = {
  name: string; description: string; features: string; category: string;
  price: string; originalPrice: string; stockQuantity: string; inStock: boolean;
  featured: boolean; status: Product["status"]; images: string[]; brand: string;
  model: string; organicCertified: boolean; seedType: string;
  variants: { id: string; name: string; price: string; stockQuantity: string; image: string }[];
};

const emptyForm: ProductForm = {
  name: "", description: "", features: "", category: "", price: "", originalPrice: "",
  stockQuantity: "0", inStock: true, featured: false, status: "active", images: [], brand: "",
  model: "", organicCertified: false, seedType: "", variants: [],
};

function formFromProduct(product?: PublicProduct | null, fallbackCategory = ""): ProductForm {
  if (!product) return { ...emptyForm, category: fallbackCategory, images: [] };
  return {
    name: product.name, description: product.description, features: product.features ?? "", category: product.category,
    price: String(product.price), originalPrice: product.originalPrice == null ? "" : String(product.originalPrice),
    stockQuantity: String(product.stockQuantity ?? 0), inStock: product.inStock, featured: product.featured,
    status: product.status, images: [...(product.images ?? [])], brand: product.brand ?? "", model: product.model ?? "",
    organicCertified: product.organicCertified ?? false, seedType: product.seedType ?? "",
    variants: (product.variants ?? []).map((v) => ({ ...v, price: String(v.price), stockQuantity: String(v.stockQuantity), image: v.image ?? "" })),
  };
}

export default function ProductManager() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PublicProduct | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newUploads, setNewUploads] = useState<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        api.get<ProductsResponse>("/api/products?scope=admin&limit=100"),
        api.get<CategoriesResponse>("/api/product-categories?scope=admin"),
      ]);
      setProducts(productResponse.products ?? []);
      setCategories(categoryResponse.categories ?? []);
    } catch (nextError) { setError(errorMessage(nextError, "Products and categories could not be loaded")); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (searchParams.get("action") === "new" && categories.length) openEditor();
  // Open the URL action after its category choices have loaded.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, categories.length]);

  const categoryNames = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const filtered = useMemo(() => products.filter((product) => {
    const searchable = `${product.name} ${richTextToPlainText(product.description)}`.toLowerCase();
    return (!query || searchable.includes(query.toLowerCase()))
      && (!status || product.status === status)
      && (!categoryFilter || product.category === categoryFilter);
  }), [categoryFilter, products, query, status]);

  function openEditor(product?: PublicProduct) {
    setEditing(product ?? null); setForm(formFromProduct(product, categories[0]?.id ?? ""));
    setNewUploads([]); setEditorOpen(true);
  }
  async function closeEditor() {
    if (saving) return;
    await Promise.allSettled(newUploads.map((publicId) => api.delete("/api/upload", { publicId })));
    setEditorOpen(false); setEditing(null); setNewUploads([]);
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
    setForm((current) => ({ ...current, images: current.images.filter((_, itemIndex) => itemIndex !== index), variants: current.variants.map((v) => v.image === image ? { ...v, image: "" } : v) }));
    const publicId = cloudinaryPublicId(image);
    if (publicId && newUploads.includes(publicId)) {
      try { await api.delete("/api/upload", { publicId }); } catch { /* best-effort cleanup */ }
      setNewUploads((current) => current.filter((item) => item !== publicId));
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.category) return void toast.error("Select a product category");
    setSaving(true);
    const payload = {
      name: form.name, description: form.description, features: form.features, category: form.category,
      price: form.variants.length ? Math.min(...form.variants.map((v) => Number(v.price))) : Number(form.price), originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stockQuantity: Number(form.stockQuantity), inStock: form.inStock, featured: form.featured, status: form.status,
      images: form.images, brand: form.brand, model: form.model, organicCertified: form.organicCertified,
      seedType: form.seedType,
      variants: form.variants.map((v) => ({ ...v, price: Number(v.price), stockQuantity: Number(v.stockQuantity) })),
      ...(editing ? { expectedInventory: { stockQuantity: editing.stockQuantity, variants: (editing.variants ?? []).map((v) => ({ id: v.id, stockQuantity: v.stockQuantity })) } } : {}),
    };
    try {
      if (editing) await api.put(`/api/products/${editing.id}`, payload);
      else await api.post("/api/products", payload);
      const removed = editing?.images.filter((image) => !form.images.includes(image)).map(cloudinaryPublicId).filter((item): item is string => Boolean(item)) ?? [];
      await Promise.allSettled(removed.map((publicId) => api.delete("/api/upload", { publicId })));
      setNewUploads([]); setEditorOpen(false); setEditing(null);
      toast.success(editing ? "Product updated" : "Product created"); await load();
    } catch (nextError) { toast.error(errorMessage(nextError, "Product could not be saved")); }
    finally { setSaving(false); }
  }

  async function remove(product: PublicProduct) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/products/${product.id}`);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setCategories((current) => current.map((item) => item.id === product.category ? { ...item, count: Math.max(0, item.count - 1) } : item));
      toast.success("Product deleted");
    } catch (nextError) { toast.error(errorMessage(nextError, "Product could not be deleted")); }
  }

  async function renameCategory(category: ProductCategory) {
    const name = window.prompt("Enter the new product category name:", category.name)?.trim();
    if (!name || name === category.name) return;
    try { await api.put(`/api/product-categories/${category.id}`, { name }); toast.success("Category renamed"); await load(); }
    catch (nextError) { toast.error(errorMessage(nextError, "Category could not be renamed")); }
  }

  async function deleteCategory(category: ProductCategory) {
    const candidates = categories.filter((item) => item.id !== category.id);
    let replacementId = "";
    if (category.count > 0) {
      if (!candidates.length) return void toast.error("Add another category before deleting this one");
      const name = window.prompt(`“${category.name}” contains ${category.count} product${category.count === 1 ? "" : "s"}. Type the exact destination category name to move them before deletion:\n\n${candidates.map((item) => item.name).join(", ")}`)?.trim();
      if (!name) return;
      replacementId = candidates.find((item) => item.name.toLowerCase() === name.toLowerCase())?.id ?? "";
      if (!replacementId) return void toast.error("That destination category was not found");
    } else if (!window.confirm(`Delete “${category.name}”?`)) return;
    try {
      await api.delete(`/api/product-categories/${category.id}`, { replacementId });
      if (categoryFilter === category.id) setCategoryFilter("");
      toast.success(category.count ? "Category deleted and products moved" : "Category deleted"); await load();
    } catch (nextError) { toast.error(errorMessage(nextError, "Category could not be deleted")); }
  }

  const active = products.filter((product) => product.status === "active").length;
  const featured = products.filter((product) => product.featured).length;
  const lowStock = products.filter((product) => product.variants?.length ? product.variants.some((v) => v.stockQuantity <= 5) : product.stockQuantity <= 5).length;

  return <main className="pb-16 pt-10"><div className="container mx-auto px-4">
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-4xl font-bold"><span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Product Management</span></h1><p className="mt-2 text-gray-600">Manage products, inventory, rich content, media, and categories.</p></div><div className="flex items-center gap-4"><motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="hidden md:block"><Sparkles size={30} className="text-emerald-400/50" /></motion.div><button onClick={() => openEditor()} disabled={!categories.length} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={20} /> Add New Product</button></div></div>
    <CategoryManager categories={categories} selected={categoryFilter} onSelect={setCategoryFilter} onAdd={() => setCategoryDialogOpen(true)} onRename={renameCategory} onDelete={deleteCategory} />
    <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"><MiniStat label="Total products" value={products.length} icon={<Package />} /><MiniStat label="Active" value={active} icon={<Package />} /><MiniStat label="Featured" value={featured} icon={<Star />} /><MiniStat label="Low stock" value={lowStock} icon={<AlertCircle />} /></div>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={() => void load()} className="ml-2 font-semibold underline">Retry</button></div>}
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-5 lg:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input aria-label="Search products" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products…" className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500" /></label><select aria-label="Product category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2.5"><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select aria-label="Product status" value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2.5"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option></select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Created</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((product) => <tr key={product.id} className="hover:bg-gray-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.images?.[0] || "/logo.png"} alt="" className="h-12 w-12 rounded-lg object-cover" /><div><p className="font-semibold text-gray-900">{product.name}</p>{product.featured && <span className="text-xs text-amber-600">Featured</span>}</div></div></td><td className="px-5 py-4 text-gray-600">{categoryNames.get(product.category) ?? "Unassigned"}</td><td className="px-5 py-4 font-medium">{formatMoney(product.price)}</td><td className="px-5 py-4"><span className={product.stockQuantity <= 5 ? "font-semibold text-red-600" : "text-gray-600"}>{product.stockQuantity}</span>{Boolean(product.variants?.length) && <div className="mt-1 text-xs text-gray-500">{product.variants!.map((v) => `${v.name}: ${v.stockQuantity}`).join(", ")}</div>}</td><td className="px-5 py-4"><StatusBadge value={product.status} /></td><td className="px-5 py-4 text-sm text-gray-500">{formatDate(product.createdAt)}</td><td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEditor(product)} aria-label={`Edit ${product.name}`} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"><Edit3 size={18} /></button><button onClick={() => void remove(product)} aria-label={`Delete ${product.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"><Trash2 size={18} /></button></div></td></tr>)}</tbody></table></div>
      {!loading && filtered.length === 0 && <p className="p-10 text-center text-gray-500">No products match your filters.</p>}{loading && <p className="p-10 text-center text-gray-500">Loading products…</p>}
    </section>
  </div>
  <AnimatePresence>{editorOpen && <ProductEditor editing={editing} form={form} categories={categories} saving={saving} uploading={uploading} setField={setField} onUploadImages={uploadImages} onRemoveImage={removeImage} onClose={closeEditor} onSubmit={submit} />}</AnimatePresence>
  {categoryDialogOpen && <CategoryDialog onClose={() => setCategoryDialogOpen(false)} onCreated={load} />}
  </main>;
}

function ProductEditor({ editing, form, categories, saving, uploading, setField, onUploadImages, onRemoveImage, onClose, onSubmit }: {
  editing: PublicProduct | null; form: ProductForm; categories: ProductCategory[]; saving: boolean; uploading: boolean;
  setField: <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => void;
  onUploadImages: (event: ChangeEvent<HTMLInputElement>) => Promise<void>; onRemoveImage: (index: number) => Promise<void>;
  onClose: () => Promise<void>; onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  return <div className="fixed inset-0 z-50 bg-white"><motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} role="dialog" aria-modal="true" aria-labelledby="product-editor-title" className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white"><div className="flex shrink-0 items-center justify-between border-b px-4 py-3 sm:px-6"><div><h2 id="product-editor-title" className="text-2xl font-bold text-gray-900">{editing ? "Edit Product" : "Add New Product"}</h2><p className="text-sm text-gray-500">Add the details, write the product content, and manage its images.</p></div><button type="button" aria-label="Close" disabled={saving || uploading} onClick={() => void onClose()} className="rounded-lg p-2 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-emerald-700 disabled:opacity-50"><X /></button></div>
    <form onSubmit={(event) => void onSubmit(event)} className="flex min-h-0 flex-1 flex-col"><div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-4 sm:p-6">
      <FormSection title="Product content"><div className="grid gap-4 md:grid-cols-2"><Field label="Product name *" wide><input required maxLength={160} value={form.name} onChange={(event) => setField("name", event.target.value)} className="input-field" /></Field><Field label="Category *"><select required value={form.category} onChange={(event) => setField("category", event.target.value)} className="input-field"><option value="">Select a category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field><Field label="Variety / model"><input maxLength={160} value={form.model} onChange={(event) => setField("model", event.target.value)} className="input-field" /></Field><div className="min-w-0 md:col-span-2"><span className="mb-1.5 block text-sm font-medium text-gray-700">Description *</span><RichTextEditor label="Product description" placeholder="Write the product description…" value={form.description} maxTextLength={10000} allowImages onChange={(value) => setField("description", value)} /></div></div></FormSection>
      <FormSection title="Pricing and inventory"><div className="grid gap-4 md:grid-cols-3">{!form.variants.length && <><Field label="Price (KES) *"><input required min="0.01" step="0.01" type="number" value={form.price} onChange={(event) => setField("price", event.target.value)} className="input-field" /></Field><Field label="Original price"><input min="0" step="0.01" type="number" value={form.originalPrice} onChange={(event) => setField("originalPrice", event.target.value)} className="input-field" /></Field><Field label="Stock quantity"><input min="0" step="1" type="number" value={form.stockQuantity} onChange={(event) => setField("stockQuantity", event.target.value)} className="input-field" /></Field></>}<Field label="Status"><select value={form.status} onChange={(event) => setField("status", event.target.value as Product["status"])} className="input-field"><option value="active">Active</option><option value="inactive">Inactive</option><option value="draft">Draft</option></select></Field><div className="flex flex-wrap items-end gap-5 pb-3 md:col-span-2">{!form.variants.length && <Check label="In stock" checked={form.inStock} onChange={(value) => setField("inStock", value)} />}<Check label="Featured" checked={form.featured} onChange={(value) => setField("featured", value)} /><Check label="Organic certified" checked={form.organicCertified} onChange={(value) => setField("organicCertified", value)} /></div></div></FormSection>
      <FormSection title="Sizes or options"><p className="mb-4 text-sm text-gray-600">Add each size with its own price and stock, for example 150g, 300g and 500g. Leave empty for a single-price product.</p><div className="space-y-4">{form.variants.map((variant, index) => { const update = (patch: Partial<typeof variant>) => setField("variants", form.variants.map((v) => v.id === variant.id ? { ...v, ...patch } : v)); return <div key={variant.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4"><div className="mb-3 flex justify-between"><h4 className="font-semibold">Option {index + 1}</h4><button type="button" onClick={() => setField("variants", form.variants.filter((v) => v.id !== variant.id))} className="text-sm font-semibold text-red-700 underline">Remove option</button></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Field label="Size or name *"><input required maxLength={100} placeholder="e.g. 150g" value={variant.name} onChange={(e) => update({ name: e.target.value })} className="input-field" /></Field><Field label="Price (KES) *"><input required type="number" min="0.01" step="0.01" value={variant.price} onChange={(e) => update({ price: e.target.value })} className="input-field" /></Field><Field label="Units in stock *"><input required type="number" min="0" step="1" value={variant.stockQuantity} onChange={(e) => update({ stockQuantity: e.target.value })} className="input-field" /></Field><Field label="Image"><select value={variant.image} onChange={(e) => update({ image: e.target.value })} className="input-field"><option value="">Use main product image</option>{form.images.map((image, i) => <option key={image} value={image}>Product image {i + 1}</option>)}</select></Field></div></div>; })}</div><button type="button" onClick={() => setField("variants", [...form.variants, { id: crypto.randomUUID(), name: "", price: "", stockQuantity: "0", image: "" }])} className="mt-4 rounded-lg border border-emerald-600 px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50">+ Add an option</button></FormSection>
      <FormSection title="Product images"><label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-7 text-center hover:border-emerald-500 focus-within:border-emerald-500"><ImagePlus className="mb-2 text-gray-400" /><span className="font-medium text-gray-700">{uploading ? "Uploading…" : "Choose JPEG, PNG, GIF, or WebP images"}</span><span className="text-sm text-gray-500">Up to 5 MB each; maximum 10 images</span><input type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp" onChange={(event) => void onUploadImages(event)} disabled={uploading} className="sr-only" /></label>{form.images.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{form.images.map((image, index) => <div key={`${image}-${index}`} className="group relative"><img src={image} alt={`Product preview ${index + 1}`} className="h-28 w-full rounded-lg object-cover" /><button type="button" onClick={() => void onRemoveImage(index)} aria-label={`Remove product image ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-red-600 p-1 text-white opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"><X size={15} /></button></div>)}</div>}</FormSection>
    </div><div className="flex shrink-0 justify-end gap-3 border-t bg-white px-4 py-3 sm:px-6"><button type="button" disabled={saving || uploading} onClick={() => void onClose()} className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button><button disabled={saving || uploading || !form.category} className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? "Saving…" : editing ? "Update Product" : "Create Product"}</button></div></form>
  </motion.div></div>;
}

function CategoryManager({ categories, selected, onSelect, onAdd, onRename, onDelete }: {
  categories: ProductCategory[]; selected: string; onSelect: (id: string) => void; onAdd: () => void;
  onRename: (category: ProductCategory) => Promise<void>; onDelete: (category: ProductCategory) => Promise<void>;
}) {
  return <section className="mb-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Product categories</h2><p className="mt-1 text-sm text-gray-500">Choose a category to filter products, or manage it below.</p></div><button type="button" onClick={onAdd} className="flex items-center gap-2 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><FolderPlus size={17} /> Add category</button></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{categories.map((category) => <div key={category.id} className={`rounded-xl border p-4 ${selected === category.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}`}><button type="button" onClick={() => onSelect(selected === category.id ? "" : category.id)} className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><span className="font-semibold text-gray-900">{category.name}</span><span className="mt-1 block text-sm text-gray-500">{category.count} product{category.count === 1 ? "" : "s"}</span></button><div className="mt-3 flex gap-3 border-t border-gray-100 pt-3 text-sm"><button type="button" onClick={() => void onRename(category)} className="font-semibold text-blue-700 hover:underline">Rename</button><button type="button" onClick={() => void onDelete(category)} className="font-semibold text-red-700 hover:underline">Delete</button></div></div>)}{!categories.length && <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800 sm:col-span-2 xl:col-span-3">No product categories are available. Add one before creating a product.</p>}</div></section>;
}

function CategoryDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => Promise<void> }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(""); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => { dialog.current?.showModal(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const trimmed = name.trim();
    if (!trimmed) return void setError("Enter a category name.");
    setSaving(true); setError("");
    try { await api.post("/api/product-categories", { name: trimmed }); toast.success("Product category added"); await onCreated(); dialog.current?.close(); }
    catch (nextError) { setError(errorMessage(nextError, "Category could not be added")); }
    finally { setSaving(false); }
  }
  return <dialog ref={dialog} aria-labelledby="product-category-dialog-title" aria-describedby="product-category-dialog-description" onCancel={(event) => { if (saving) event.preventDefault(); }} onClose={onClose} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-gray-950/60"><form onSubmit={(event) => void submit(event)}><div className="border-b border-gray-100 p-5 sm:p-6"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><FolderPlus size={20} aria-hidden="true" /></div><h2 id="product-category-dialog-title" className="text-xl font-bold">Add product category</h2><p id="product-category-dialog-description" className="mt-1 text-sm text-gray-600">Create a category administrators can assign to products.</p></div><div className="p-5 sm:p-6"><label htmlFor="new-product-category-name" className="mb-2 block text-sm font-semibold">Category name</label><input id="new-product-category-name" autoFocus required maxLength={100} value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="e.g. Farm tools" aria-invalid={Boolean(error)} aria-describedby={error ? "product-category-dialog-error" : undefined} disabled={saving} className="input-field" />{error && <p id="product-category-dialog-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}</div><div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:px-6"><button type="button" disabled={saving} onClick={() => dialog.current?.close()} className="rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? "Adding…" : "Add category"}</button></div></form></dialog>;
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) { return <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-5"><div className="min-w-0"><p className="text-sm text-gray-500">{label}</p><p className="mt-1 break-words text-xl font-bold sm:text-2xl">{value}</p></div><div className="shrink-0 rounded-lg bg-emerald-100 p-2 text-emerald-700 sm:p-3">{icon}</div></div>; }
function StatusBadge({ value }: { value: string }) { const style = value === "active" ? "bg-green-100 text-green-700" : value === "draft" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{value}</span>; }
function FormSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h3 className="mb-4 border-b border-gray-100 pb-2 text-lg font-bold text-gray-900">{title}</h3>{children}</section>; }
function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "md:col-span-2" : ""}><span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>{children}</label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-medium text-gray-700"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded text-emerald-600" />{label}</label>; }
