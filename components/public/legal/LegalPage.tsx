import type { ReactNode } from "react";
import PageHero from "@/components/public/PageHero";

export default function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return <><PageHero eyebrow="Gilead Medicare" title={title} description={intro} primaryAction={{ href: "/contact", label: "Contact us" }} secondaryAction={{ href: "/", label: "Back to home" }} aside={<><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Important information</p><h2 className="mt-3 text-2xl font-bold text-slate-950">Clear terms for using GILEAD services.</h2><p className="mt-4 border-t border-slate-200 pt-5 text-sm text-slate-600">Last updated: 23 October 2026</p></>} /><div className="bg-stone-50 px-4 py-16 sm:py-20"><article className="mx-auto max-w-4xl space-y-9 rounded-2xl border border-stone-200 bg-white p-6 text-base leading-7 text-gray-700 shadow-sm sm:p-10 [&_a]:font-medium [&_a]:text-[#008EFE] [&_a]:underline [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_li]:mt-2 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">{children}</article></div></>;
}
