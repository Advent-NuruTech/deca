"use client";

import { motion } from "framer-motion";
import { Shield, Truck } from "lucide-react";
import { cartItemKey } from "@/components/providers/CartProvider";
import type { CartItem } from "@/lib/types";

export default function OrderSummary({ cartItems, subtotal, shipping: _shipping, total }: { cartItems: CartItem[]; subtotal: number; shipping: number; total: number }) {
  return <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 border-l-4 border-[#008EFE] pl-3 text-xl font-bold text-slate-950">Order summary</h2><div className="mb-5 max-h-72 space-y-4 overflow-y-auto">{cartItems.map((item) => <div key={cartItemKey(item)} className="flex gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">{item.images?.[0] && <img src={item.images[0]} alt="" className="h-full w-full object-contain" />}</div><div className="min-w-0 flex-grow"><p className="truncate text-sm font-medium text-slate-900">{item.name}</p><p className="text-xs text-slate-500">{item.variantName && `${item.variantName} · `}Qty: {item.quantity}</p></div><span className="text-sm font-medium text-slate-900">KES {(item.price * item.quantity).toLocaleString()}</span></div>)}</div><div className="space-y-3 border-t border-slate-200 pt-4"><Line label="Subtotal" value={`KES ${subtotal.toLocaleString()}`} /><Line label="Shipping" value="To be confirmed" /><div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-950"><span>Products total</span><span className="text-[#079326]">KES {total.toLocaleString()}</span></div></div><div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600"><p className="flex gap-2"><Shield size={15} className="text-[#008EFE]" /> Secure account checkout</p><p className="flex gap-2"><Truck size={15} className="text-[#079326]" /> Delivery across Kenya</p></div></div></motion.div>;
}

function Line({ label, value }: { label: string; value: string }) { return <div className="flex justify-between text-slate-600"><span>{label}</span><span className="font-medium text-slate-900">{value}</span></div>; }
