"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function EmptyCheckout() {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#008EFE] text-[#008EFE]"><ShoppingBag className="h-9 w-9" /></div><h1 className="text-2xl font-bold text-slate-950">Your cart is empty</h1><p className="mb-6 mt-2 text-slate-600">Add something from our shop before checking out.</p><Link href="/products" className="inline-flex min-h-12 items-center rounded-xl bg-[#079326] px-6 font-semibold text-slate-950 transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">Browse products</Link></motion.div>;
}
