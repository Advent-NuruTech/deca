"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { cartItemKey } from "@/components/providers/CartProvider";
import type { CartItem } from "@/lib/types";

export default function OrderSummary({ cartItems, subtotal, shipping: _shipping, total }: { cartItems: CartItem[]; subtotal: number; shipping: number; total: number }) {
  return <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#008EFE] px-5 py-5 text-slate-950 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.16em]">Your Deca order</p><h2 className="mt-1 text-xl font-black">Order summary</h2></div>
      <div className="p-5 sm:p-6">
        <div className="mb-5 max-h-72 space-y-4 overflow-y-auto pr-1">{cartItems.map((item) => <div key={cartItemKey(item)} className="flex gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">{item.images?.[0] && <img src={item.images[0]} alt="" className="h-full w-full object-contain" />}</div><div className="min-w-0 flex-grow"><p className="truncate text-sm font-semibold text-slate-900">{item.name}</p><p className="mt-0.5 text-xs text-slate-500">{item.variantName && `${item.variantName} · `}Quantity: {item.quantity}</p></div><span className="whitespace-nowrap text-sm font-semibold text-slate-900">KES {(item.price * item.quantity).toLocaleString()}</span></div>)}</div>
        <div className="space-y-3 border-t border-slate-200 pt-4"><Line label="Subtotal" value={`KES ${subtotal.toLocaleString()}`} /><Line label="Shipping" value="To be confirmed" /><div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-950"><span>Products total</span><span>KES {total.toLocaleString()}</span></div></div>
        <div className="mt-6 space-y-3 border-t border-slate-200 pt-4 text-sm leading-5 text-slate-600"><p className="flex gap-2"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#008EFE]" aria-hidden="true" />Secure account checkout</p><p className="flex gap-2"><Truck size={17} className="mt-0.5 shrink-0 text-[#079326]" aria-hidden="true" />Delivery across Kenya</p><p className="flex gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#079326]" aria-hidden="true" />We will confirm your parcel fee before delivery.</p></div>
      </div>
    </div>
  </motion.div>;
}

function Line({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 text-slate-600"><span>{label}</span><span className="text-right font-medium text-slate-900">{value}</span></div>; }
