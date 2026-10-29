"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicProduct } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function NewProducts() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch("/api/products?limit=12", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load products");
        return response.json() as Promise<{ products: PublicProduct[] }>;
      })
      .then((data) => { setProducts(data.products ?? []); setStatus("ready"); })
      .catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, [retry]);

  return (
    <section aria-labelledby="new-products-heading" className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Discover our latest</p><h2 id="new-products-heading" className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">What’s new</h2><p className="mt-3 text-slate-600">Explore the latest additions to our shop.</p></div>
          <Link href="/products" className="inline-flex min-h-11 items-center gap-2 font-bold text-[#079326] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]">View all products <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        {status === "loading" ? <p role="status" className="mt-8 rounded-xl bg-white p-8 text-center text-slate-600">Loading latest products…</p> : status === "error" ? <p role="alert" className="mt-8 rounded-xl bg-white p-8 text-center text-slate-600">Could not load the latest products. <button type="button" onClick={() => setRetry((value) => value + 1)} className="font-bold text-[#079326] underline focus-visible:outline-2 focus-visible:outline-[#008EFE]">Try again</button></p> : products.length === 0 ? <p className="mt-8 rounded-xl bg-white p-8 text-center text-slate-600">New products will appear here when they’re available.</p> : <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">{products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div>}
      </div>
    </section>
  );
}
