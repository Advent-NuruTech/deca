"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ChevronDown, FileText, Search, X } from "lucide-react";
import StudyMaterialCard from "@/components/public/StudyMaterialCard";
import PageHero from "@/components/public/PageHero";
import api from "@/lib/public-api";
import type { PublicArticle, ResourceTaxonomy } from "@/lib/types";
export type { PublicArticle } from "@/lib/types";

type Material = PublicArticle & { thumbnail?: string; description?: string };
type Response = { articles: Material[]; totalPages: number; total: number; resourceCategories: ResourceTaxonomy };

export default function ArticlesPage({ initialCategory = "" }: { initialCategory?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [taxonomy, setTaxonomy] = useState<ResourceTaxonomy>({ majors: [], subcategories: [] });
  const [majorCategoryId, setMajorCategoryId] = useState(searchParams.get("major") || "articles-blogs");
  const [category, setCategory] = useState(initialCategory || searchParams.get("category") || "");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const sentinel = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const categoryButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setPage(1);
    setCategory(initialCategory || searchParams.get("category") || "");
    setMajorCategoryId(searchParams.get("major") || "articles-blogs");
  }, [initialCategory, searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => { setPage(1); setSearch(query.trim()); }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    if (page === 1) { setMaterials([]); setTotal(0); }
    api.get<Response>("/articles", { params: { page, limit: 9, majorCategoryId, category, search } })
      .then(({ data }) => {
        if (cancelled) return;
        setMaterials((previous) => page === 1 ? data.articles : [...previous, ...data.articles.filter((item) => !previous.some((existing) => existing._id === item._id))]);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setTaxonomy(data.resourceCategories || { majors: [], subcategories: [] });
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, category, majorCategoryId, search, retry]);

  useEffect(() => {
    if (loading || error || page >= totalPages || !sentinel.current) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setPage((value) => value + 1); }, { rootMargin: "400px" });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loading, error, page, totalPages]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const resetPanels = () => { setDrawerOpen(false); setDesktopCategoriesOpen(false); };
    desktop.addEventListener("change", resetPanels);
    return () => desktop.removeEventListener("change", resetPanels);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
      if (event.key === "Tab" && drawer.current) {
        const buttons = drawer.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener("keydown", onKey); categoryButton.current?.focus(); };
  }, [drawerOpen]);

  const selectCategory = (value: string, closeDrawer = true) => {
    setPage(1); setCategory(value); if (closeDrawer) setDrawerOpen(false);
    const params = new URLSearchParams();
    if (majorCategoryId !== "articles-blogs") params.set("major", majorCategoryId);
    if (value) params.set("category", value);
    router.replace(`/articles${params.size ? `?${params}` : ""}`, { scroll: false });
  };
  const majorCategory = taxonomy.majors.find((item) => item.id === majorCategoryId);
  const categories = taxonomy.subcategories.filter((item) => item.parentId === majorCategoryId);
  const categoryName = categories.find((item) => item.id === category || item.slug === category)?.name || `All ${majorCategory?.name ?? "resources"}`;
  const categoryOptions = [{ id: "", slug: "", name: `All ${majorCategory?.name ?? "resources"}` }, ...categories];
  const categoryList = (closeAfterSelection: boolean) => categoryOptions.map((item) => (
    <button key={item.id || item.slug} onClick={() => selectCategory(item.id, closeAfterSelection)} aria-pressed={category === item.id || category === item.slug} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ${category === item.id || category === item.slug ? "bg-emerald-50 font-semibold text-emerald-800" : "text-gray-700 hover:bg-gray-100"}`}>
      <span className="flex-1">{item.name}</span>{(category === item.id || category === item.slug) && <Check size={17} />}
    </button>
  ));

  return (
    <>
      {!query && <PageHero eyebrow="Resources" title={majorCategory?.name ?? "Articles & Blogs"} description="Browse the latest resources by category, then choose the guidance that best supports your next step." primaryAction={{ href: "#articles-content", label: "Browse all" }} secondaryAction={{ href: "/donate", label: "Support our work" }} aside={<><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Start exploring</p><h2 className="mt-3 text-2xl font-bold text-slate-950">Helpful learning, ready when you are.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Filter articles by topic or search for a question you are working through.</p></>} />}
      {query && <div className="h-20 bg-emerald-950" aria-hidden="true" />}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 sm:gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 px-2 text-gray-500 sm:px-3"><Search size={20} aria-hidden="true" /><span className="sr-only">Search articles</span><input type="search" value={query} onChange={(event) => { if (!query && event.target.value) window.scrollTo({ top: 0, behavior: "smooth" }); setQuery(event.target.value); }} placeholder="Search articles..." className="min-w-0 w-full py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-500 sm:text-base" /></label>
          <button ref={categoryButton} onClick={() => { if (window.matchMedia("(min-width: 1024px)").matches) setDesktopCategoriesOpen((open) => !open); else setDrawerOpen(true); }} aria-expanded={drawerOpen || desktopCategoriesOpen} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 sm:px-5"><span className="max-w-[100px] truncate sm:max-w-[220px]">{category === "" ? "Categories" : categoryName}</span><ChevronDown size={18} /></button>
        </div>
      </div>
      <section id="articles-content" className="scroll-mt-20 bg-gray-50 py-10 sm:py-14" aria-label="Article results">
        <div className="mx-auto flex max-w-7xl items-start gap-8 px-4 sm:px-6">
          {desktopCategoriesOpen && <aside id="article-categories" aria-label="Article categories" className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] w-60 shrink-0 overflow-y-auto overscroll-contain rounded-xl border border-gray-200 bg-white p-3 lg:block"><h2 className="px-4 py-3 text-base font-bold text-gray-900">Categories</h2>{categoryList(false)}</aside>}
          <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-2xl font-bold text-gray-900">{search ? "Search results" : category === "" ? "Explore articles" : categoryName}</h2><p className="mt-1 text-sm text-gray-500" aria-live="polite">{loading && page === 1 ? "Finding articles..." : `${total} ${total === 1 ? "article" : "articles"}${search ? ` for “${search}”` : ""}`}</p></div>{category && <button onClick={() => selectCategory("")} className="text-sm font-semibold text-emerald-700 hover:underline">Clear category</button>}</div>
          {(!loading || page > 1) && materials.length === 0 && !error && <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-gray-600"><FileText className="mx-auto mb-4 text-emerald-600" size={32} /><p className="font-semibold text-gray-900">No articles found</p><p className="mt-1 text-sm">Try another search or category.</p></div>}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => <StudyMaterialCard key={material._id} material={material} hideEmptyImage categoryName={taxonomy.subcategories.find((item) => item.id === material.subcategoryId)?.name ?? majorCategory?.name} />)}
          </div>
          {loading && <p className="py-10 text-center text-sm text-gray-500" role="status">Loading articles...</p>}
          {error && <div className="py-8 text-center text-sm text-gray-600" role="alert">Could not load articles. <button onClick={() => setRetry((value) => value + 1)} className="font-semibold text-emerald-700 underline">Try again</button></div>}
          <div ref={sentinel} aria-hidden="true" />
          {!loading && !error && page < totalPages && <div className="pt-8 text-center"><button onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-emerald-700 px-5 py-2 text-sm font-semibold text-emerald-700">Load more</button></div>}
          </div>
        </div>
      </section>
      {drawerOpen && <div className="fixed inset-0 z-[100]" role="presentation"><div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} /><div ref={drawer} role="dialog" aria-modal="true" aria-labelledby="categories-heading" className="absolute inset-y-0 left-0 flex w-[min(85vw,340px)] flex-col bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-100 p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Browse articles</p><h2 id="categories-heading" className="mt-1 text-xl font-bold text-gray-900">Categories</h2></div><button onClick={() => setDrawerOpen(false)} aria-label="Close categories" className="rounded-full p-2 text-gray-600 hover:bg-gray-100"><X size={22} /></button></div><div id="article-categories" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">{categoryList(true)}</div></div></div>}
    </>
  );
}
