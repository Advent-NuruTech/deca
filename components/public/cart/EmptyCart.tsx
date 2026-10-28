"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100"
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="inline-block mb-6"
      >
        <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center">
          <ShoppingBag size={64} className="text-[#079326]" />
        </div>
      </motion.div>
      <h2 className="text-3xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        You haven&apos;t added anything yet. Start exploring our revision books and learning materials.
      </p>
      <Link href="/products">
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group inline-flex items-center gap-3 bg-[#079326] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-md hover:bg-[#008EFE] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"
        >
          Browse Products
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.span>
      </Link>
    </motion.div>
  );
}
