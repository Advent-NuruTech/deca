"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export default function EmptyCheckout() {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto text-center bg-white rounded-xl shadow-sm p-10 border border-gray-100"><div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5"><ShoppingBag className="w-9 h-9 text-emerald-600" /></div><h1 className="text-2xl font-bold text-gray-800">Your cart is empty</h1><p className="text-gray-500 mt-2 mb-6">Add something from our shop before checking out.</p><Link href="/products" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700">Browse Products</Link></motion.div>;
}
