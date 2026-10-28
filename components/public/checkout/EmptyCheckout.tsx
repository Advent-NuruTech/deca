"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function EmptyCheckout() {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white text-center shadow-sm"><div className="bg-[#008EFE] px-6 py-7 text-slate-950"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white"><ShoppingBag className="h-7 w-7" aria-hidden="true" /></div><p className="mt-4 text-xs font-bold uppercase tracking-[0.16em]">Deca Bookstore</p></div><div className="p-8 sm:p-10"><h1 className="text-2xl font-black text-slate-950">Your cart is empty</h1><p className="mt-2 text-slate-600">Add something from our shop before checking out.</p><Link href="/products" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#079326] px-6 py-3 font-bold text-white transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">Browse products <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div></motion.div>;
}
