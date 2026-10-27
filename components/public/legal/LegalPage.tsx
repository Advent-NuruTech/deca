import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <div className="min-h-screen bg-stone-50 px-4 pb-20 pt-28 sm:pt-32"><div className="mx-auto max-w-4xl">
    <Link href="/" className="text-sm font-semibold text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">← Back to home</Link>
    <header className="mb-8 mt-8"><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">Gilead Medicare</p><h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">{intro}</p><p className="mt-4 text-sm text-gray-500">Last updated: 23 October 2026</p></header>
    <article className="space-y-9 rounded-2xl border border-stone-200 bg-white p-6 text-base leading-7 text-gray-700 shadow-sm sm:p-10 [&_a]:font-medium [&_a]:text-emerald-700 [&_a]:underline [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_li]:mt-2 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">{children}</article>
  </div></div>;
}
