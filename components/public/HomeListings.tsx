"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpenText, ImageOff, Package } from "lucide-react";
import type { PublicArticle, PublicProduct } from "@/lib/types";
import { richTextToPlainText } from "@/lib/rich-text";

type ProductsResponse = { products?: PublicProduct[] };
type ArticlesResponse = { articles?: PublicArticle[] };

function LoadingCards() {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading listings">{Array.from({ length: 4 }, (_, index) => <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="aspect-[4/3] animate-pulse bg-slate-100" /><div className="space-y-3 p-5"><div className="h-3 w-1/3 animate-pulse rounded bg-slate-100" /><div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" /><div className="h-3 w-full animate-pulse rounded bg-slate-100" /></div></div>)}</div>;
}

function ListingError({ onRetry }: { onRetry: () => void }) {
  return <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700"><p>Listings could not be loaded right now.</p><button type="button" onClick={onRetry} className="mt-3 min-h-11 rounded-xl border border-[#008EFE] px-4 py-2 font-semibold text-[#008EFE] transition hover:bg-[#008EFE] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">Try again</button></div>;
}

function ViewAllLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#008EFE] px-4 py-2 font-semibold text-[#008EFE] transition hover:bg-[#008EFE] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">{children}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>;
}

export default function HomeListings() {
  const [products, setProducts] = useState<PublicProduct[] | null>(null);
  const [articles, setArticles] = useState<PublicArticle[] | null>(null);
  const [productsError, setProductsError] = useState(false);
  const [articlesError, setArticlesError] = useState(false);

  const loadProducts = useCallback(async (signal?: AbortSignal) => {
    setProductsError(false);
    try {
      const response = await fetch("/api/products?limit=8", { signal, cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load products");
      const data = await response.json() as ProductsResponse;
      setProducts((data.products ?? []).slice(0, 8));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setProductsError(true);
    }
  }, []);

  const loadArticles = useCallback(async (signal?: AbortSignal) => {
    setArticlesError(false);
    try {
      const response = await fetch("/api/articles?limit=8", { signal });
      if (!response.ok) throw new Error("Unable to load resources");
      const data = await response.json() as ArticlesResponse;
      setArticles((data.articles ?? []).slice(0, 8));
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setArticlesError(true);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadProducts(controller.signal);
    void loadArticles(controller.signal);
    return () => controller.abort();
  }, [loadArticles, loadProducts]);

  return (
    <section className="border-y border-slate-200 bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-16">
        <section aria-labelledby="home-products-heading">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#079326]">Shop</p>
              <h2 id="home-products-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Latest products</h2>
              <p className="mt-2 max-w-2xl text-slate-600">Explore a selection from the Gilead shop.</p>
            </div>
            <ViewAllLink href="/products">View all products</ViewAllLink>
          </div>

          {products === null && !productsError ? <LoadingCards /> : productsError ? <ListingError onRetry={() => { setProducts(null); void loadProducts(); }} /> : products?.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => {
            const description = richTextToPlainText(product.description || "").replace(/\s+/g, " ").trim();
            return <Link key={product._id} href={`/products/${product.slug}`} className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#008EFE] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><div className="relative aspect-[4/3] overflow-hidden bg-slate-100">{product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain transition duration-300 group-hover:scale-105" loading="lazy" /> : <ImageOff className="absolute inset-0 m-auto h-8 w-8 text-slate-400" aria-hidden="true" />}{product.saleType === "wholesale" && <span className="absolute left-3 top-3 rounded-lg bg-[#008EFE] px-2.5 py-1 text-xs font-bold text-white">Wholesale · Min {product.minimumOrderQuantity}</span>}</div><div className="flex flex-1 flex-col p-5"><h3 className="line-clamp-2 text-lg font-bold text-slate-950">{product.name}</h3>{description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>}<p className="mt-auto pt-4 font-bold text-[#079326]">{product.variants?.length ? "From " : ""}KES {product.price.toLocaleString("en-KE")}</p></div></Link>;
          })}</div> : <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600"><Package className="mx-auto mb-3 h-8 w-8 text-[#008EFE]" aria-hidden="true" /><p>Products will appear here when they are available.</p></div>}
        </section>

        <section aria-labelledby="home-resources-heading">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#079326]">Learn</p>
              <h2 id="home-resources-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Latest resources</h2>
              <p className="mt-2 max-w-2xl text-slate-600">Practical reading and downloadable guidance from Gilead.</p>
            </div>
            <ViewAllLink href="/articles">View all resources</ViewAllLink>
          </div>

          {articles === null && !articlesError ? <LoadingCards /> : articlesError ? <ListingError onRetry={() => { setArticles(null); void loadArticles(); }} /> : articles?.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{articles.map((article) => <Link key={article._id} href={`/articles/${article.slug}`} className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#008EFE] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><div className="relative aspect-[4/3] overflow-hidden bg-slate-100">{article.featuredImage ? <img src={article.featuredImage} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" /> : <BookOpenText className="absolute inset-0 m-auto h-9 w-9 text-[#008EFE]" aria-hidden="true" />}</div><div className="flex flex-1 flex-col p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#079326]">Resource</p><h3 className="mt-2 line-clamp-2 text-lg font-bold text-slate-950">{article.title}</h3>{article.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>}<span className="mt-auto pt-4 text-sm font-semibold text-[#008EFE]">Read resource <span aria-hidden="true">→</span></span></div></Link>)}</div> : <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600"><BookOpenText className="mx-auto mb-3 h-8 w-8 text-[#008EFE]" aria-hidden="true" /><p>Resources will appear here when they are published.</p></div>}
        </section>
      </div>
    </section>
  );
}
