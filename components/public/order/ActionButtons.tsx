"use client";

import Link from "next/link";
import { Headphones, ShoppingBag } from "lucide-react";

export default function ActionButtons() {
  return <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8"><Link href="/products" className="flex-1 bg-[#079326] text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><ShoppingBag size={18} /> Continue Shopping</Link><Link href="/contact" className="flex-1 bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:border-[#008EFE] hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><Headphones size={18} /> Contact Support</Link></div>;
}
