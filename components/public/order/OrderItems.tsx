"use client";

import { motion } from "framer-motion";
import { Package, ShoppingBag } from "lucide-react";
import type { OrderItem } from "@/lib/types";

export default function OrderItems({ items }: { items: OrderItem[] }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div className="flex items-center gap-2 mb-5"><Package className="w-5 h-5 text-[#079326]" /><h2 className="text-xl font-bold text-gray-800">Order Items</h2></div><div className="space-y-4">{items.map((item) => <div key={`${item.product}-${item.variantId ?? ""}`} className="flex gap-4 p-4 border border-gray-100 rounded-xl"><div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">{item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="text-gray-400" /></div>}<span className="absolute top-0 right-0 bg-[#008EFE] text-white text-xs w-6 h-6 flex items-center justify-center rounded-bl-lg">{item.quantity}</span></div><div className="flex-grow"><h3 className="font-semibold text-gray-800">{item.name}</h3>{item.variantName && <p className="text-sm text-gray-600">{item.variantName}</p>}<p className="text-sm text-gray-500 mt-1">KES {item.price.toLocaleString()} each</p><p className="text-sm text-gray-500 mt-2">Subtotal: <span className="text-gray-800 font-medium">KES {(item.price * item.quantity).toLocaleString()}</span></p></div></div>)}</div></motion.div>;
}
