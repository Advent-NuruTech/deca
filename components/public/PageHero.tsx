"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeHeroCarousel from "@/components/public/HomeHeroCarousel";

type HeroAction = {
  href: string;
  label: string;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  aside?: ReactNode;
};

/**
 * The shared public-page hero. It deliberately follows the homepage pattern so
 * visitors keep the same visual orientation as they move through the site.
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  aside,
}: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[560px] overflow-hidden bg-slate-950 text-white">
      <HomeHeroCarousel preload={false} />

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[640px] lg:grid-cols-[1.08fr_0.92fr] lg:content-end lg:gap-6 lg:px-8">
        <div className="h-full max-w-3xl border border-white/40 bg-[#008EFE] p-6 text-white shadow-2xl sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/90">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">
            {description}
          </p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {primaryAction && (
                <Link
                  href={primaryAction.href}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#079326] px-4 py-4 text-center text-base font-bold text-white shadow-lg transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="inline-flex min-h-14 items-center justify-center rounded-xl border border-white/70 bg-white px-4 py-4 text-center text-base font-bold text-slate-950 shadow-lg transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {aside && (
          <aside className="h-full border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8 lg:col-start-2 lg:row-start-1">
            {aside}
          </aside>
        )}
      </div>
    </section>
  );
}
