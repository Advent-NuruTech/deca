"use client";

// src/pages/ProductsPage.jsx
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { ProductCategory, PublicProduct } from "@/lib/types";
import SEO from "../SEO";
import { Check, ChevronDown, Home, ImageOff, Search, ShoppingCart, X } from "lucide-react";
import ProductsGrid from "../products/ProductsGrid";
import ProductsPagination from "../products/ProductsPagination";

type ProductsResponse = {
  products: PublicProduct[];
  totalPages: number;
  currentPage: number;
  total: number;
};
type CategoriesResponse = { categories: ProductCategory[] };

const ProductsPage = ({ initialCategory = "" }: { initialCategory?: string }) => {
  const router = useRouter();
  const { itemCount } = useCart();
  const searchParams = useSearchParams();
  const saleType = searchParams.get("type") === "wholesale" ? "wholesale" : searchParams.get("type") === "retail" ? "retail" : "";
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(initialCategory || searchParams.get("category") || "");
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const categoryButton = useRef<HTMLButtonElement>(null);

  useEffect(() => { const timer = window.setTimeout(() => { setSearch(query.trim()); }, 300); return () => window.clearTimeout(timer); }, [query]);
  useEffect(() => { const media = window.matchMedia("(min-width: 1024px)"); const reset = () => { setDrawerOpen(false); setDesktopOpen(false); }; media.addEventListener("change", reset); return () => media.removeEventListener("change", reset); }, []);
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; drawer.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setDrawerOpen(false); if (event.key === "Tab" && drawer.current) { const buttons = drawer.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]"); const first = buttons[0], last = buttons[buttons.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } } };
    document.addEventListener("keydown", onKey); return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); categoryButton.current?.focus(); };
  }, [drawerOpen]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    let cancelled = false;
    api.get<CategoriesResponse>("/api/product-categories")
      .then((response) => { if (!cancelled) setProductCategories(response.categories ?? []); })
      .catch(() => { if (!cancelled) setProductCategories([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (saleType) params.set("type", saleType);
    params.set("page", searchParams.get("page") || "1");
    setLoading(true);
    setError(false);
    api
      .get<ProductsResponse>(`/api/products?${params.toString()}`)
      .then((response) => {
        if (cancelled) return;
        setProducts(response.products ?? []);
        setTotal(response.total ?? 0);
        setTotalPages(response.totalPages ?? 1);
        setCurrentPage(response.currentPage ?? 1);
      })
      .catch(() => {
        if (!cancelled) { setProducts([]); setError(true); }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, search, saleType, searchParams, retry]);

  const handleCategoryChange = (cat: string, showAllTypes = false) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set("search", query.trim()); else params.delete("search");
    if (cat) params.set("category", cat);
    else params.delete("category");
    if (showAllTypes) params.delete("type");
    params.delete("page");
    router.replace(`/products${params.size ? `?${params}` : ""}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search); else params.delete("search");
    params.set("page", String(page));
    router.replace(`/products?${params}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaleTypeChange = (type: "" | "retail" | "wholesale") => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set("type", type); else params.delete("type");
    params.delete("page");
    router.replace(`/products?${params}`);
  };

  const categories = [
    { value: "", label: "All Products", image: undefined as string | undefined },
    ...productCategories.map((item) => ({ value: item.id, label: item.name, image: item.image })),
  ];

  const categoryName = categories.find((item) => item.value === category)?.label || "All Products";
  const typeLabel = saleType === "wholesale" ? "Wholesale products" : saleType === "retail" ? "Retail products" : "All products";
  const homeLink = <Link href="/" className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><Home size={18} aria-hidden="true" />Home</Link>;
  const categoryList = (close: boolean) => categories.map((item) => { const selected = item.value ? category === item.value : !category && !saleType; return <button key={item.value} onClick={() => { handleCategoryChange(item.value, !item.value); if (close) setDrawerOpen(false); }} aria-pressed={selected} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${selected ? "bg-slate-100 font-semibold text-[#079326]" : "text-gray-700 hover:bg-gray-100"}`}><span className="flex-1">{item.label}</span>{selected && <Check size={17} />}</button>; });

  return (
    <>
      <SEO
        title={`${typeLabel} | Deca Bookstore`}
        description="Shop Deca Bookstore revision materials for retail or wholesale orders. Wholesale listings show their minimum order quantity."
        keywords={["Revision books", "Retail books", "Wholesale books", "KJSEA materials"]}
      />
      <h1 className="sr-only">Products</h1>
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 sm:gap-2">
          <Link href="/" aria-label="Home" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#079326] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><Home size={20} aria-hidden="true" /></Link>
          <label className="flex min-w-0 flex-1 items-center gap-2 px-2 text-gray-500 sm:px-3"><Search size={20} aria-hidden="true" /><span className="sr-only">Search products</span><input type="search" value={query} onChange={(event) => { if (!query && event.target.value) window.scrollTo({ top: 0, behavior: "smooth" }); setQuery(event.target.value); if (searchParams.get("page")) { const params = new URLSearchParams(searchParams.toString()); params.delete("page"); router.replace(`/products${params.size ? `?${params}` : ""}`, { scroll: false }); } }} placeholder="Search products..." className="min-w-0 w-full py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500 sm:text-base" /></label>
          <button ref={categoryButton} onClick={() => { if (window.matchMedia("(min-width: 1024px)").matches) setDesktopOpen((open) => !open); else setDrawerOpen(true); }} aria-expanded={drawerOpen || desktopOpen} aria-controls="product-categories" className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#079326] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] sm:px-5"><span className="max-w-[100px] truncate sm:max-w-[220px]">{category ? categoryName : "Categories"}</span><ChevronDown size={18} /></button>
          <Link href="/cart" aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#079326] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><ShoppingCart size={21} aria-hidden="true" />{itemCount > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{itemCount > 99 ? "99+" : itemCount}</span>}</Link>
        </div>
        <nav aria-label="Product categories" className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-1 pt-2 sm:gap-7">
          {categories.map((item) => { const selected = item.value ? category === item.value : !category && !saleType; return <button key={item.value} type="button" onClick={() => handleCategoryChange(item.value, !item.value)} aria-current={selected ? "true" : undefined} className={`flex shrink-0 items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#008EFE] ${selected ? "border-[#008EFE] text-[#079326]" : "border-transparent text-gray-600 hover:text-[#079326]"}`}>{item.value && (item.image ? <img src={item.image} alt="" className="h-8 w-8 rounded-full border border-gray-200 bg-white object-cover" /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400"><ImageOff size={15} aria-hidden="true" /></span>)}{item.value ? item.label : "All"}</button>; })}
        </nav>
      </div>
      <section id="product-results" className="scroll-mt-20 bg-gray-50 py-5 sm:py-10" aria-label="Product results">
        <div className="mx-auto flex max-w-7xl items-start gap-8 px-4 sm:px-6">
          {desktopOpen && <aside id="product-categories" aria-label="Product categories" className="sticky top-36 hidden max-h-[calc(100dvh-9rem)] w-60 shrink-0 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 lg:block">{homeLink}<h2 className="px-4 py-3 font-bold">Categories</h2>{categoryList(false)}</aside>}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col gap-4"><div className="inline-flex w-full rounded-xl border border-slate-200 bg-white p-1 sm:w-auto sm:self-start" role="group" aria-label="Product order type">{(["", "retail", "wholesale"] as const).map((type) => <button key={type} type="button" onClick={() => handleSaleTypeChange(type)} aria-pressed={saleType === type} className={`min-h-11 min-w-0 flex-1 rounded-lg px-3 text-sm font-bold capitalize transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] sm:flex-none sm:px-5 ${saleType === type ? "bg-[#079326] text-white" : "text-slate-700 hover:bg-slate-100"}`}>{type || "All"}</button>)}</div><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-2xl font-bold text-gray-900">{search ? "Search results" : category ? categoryName : typeLabel}</h2><p className="mt-1 text-sm text-gray-500" aria-live="polite">{loading ? "Finding products..." : `${total} ${total === 1 ? "product" : "products"}${search ? ` for "${search}"` : ""}`}</p></div>{category && <button onClick={() => handleCategoryChange("")} className="text-sm font-semibold text-[#079326] hover:underline">Clear category</button>}</div></div>
            {error ? <div role="alert" className="rounded-xl bg-white p-8 text-center text-gray-600">Could not load products. <button onClick={() => setRetry((value) => value + 1)} className="font-semibold text-[#079326] underline focus-visible:outline-2 focus-visible:outline-[#008EFE]">Try again</button></div> : <ProductsGrid products={products} loading={loading} />}
            {!loading && !error && products.length > 0 && <ProductsPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
          </div>
        </div>
      </section>
      {drawerOpen && <div className="fixed inset-0 z-[100]" role="presentation"><div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} /><div ref={drawer} role="dialog" aria-modal="true" aria-labelledby="product-categories-heading" className="absolute inset-y-0 left-0 flex w-[min(85vw,340px)] flex-col bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-100 p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#008EFE]">Browse the shop</p><h2 id="product-categories-heading" className="mt-1 text-xl font-bold text-gray-900">Categories</h2></div><button onClick={() => setDrawerOpen(false)} aria-label="Close categories" className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><X size={22} /></button></div><div id="product-categories" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">{homeLink}{categoryList(true)}</div></div></div>}
    </>
  );
};

export default ProductsPage;
