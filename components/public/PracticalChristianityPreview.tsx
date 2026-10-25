"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PracticalChristianityPreview() {
  return (
    <section aria-labelledby="practical-christianity-heading" className="relative overflow-hidden bg-emerald-950 py-20 text-white sm:py-24">
      <motion.div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(52,211,153,0.22),transparent_27%),radial-gradient(circle_at_88%_70%,rgba(245,158,11,0.16),transparent_25%)]" animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300">Practical Christianity</p>
          <h2 id="practical-christianity-heading" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Transforming lives through faith &amp; action</h2>
          <p className="mt-5 text-base leading-7 text-emerald-50/85 sm:text-lg">Every God-given skill can serve His purpose. Discover where you can grow, build a sustainable livelihood, and bring Christ&apos;s hope to people around you.</p>
          <Link href="/practical-christianity#pathways" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-emerald-950 shadow-lg shadow-emerald-950/30 transition hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Choose your next step <ArrowRight aria-hidden="true" size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
