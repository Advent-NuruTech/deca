"use client";

import { motion } from "framer-motion";
import { Shield, Truck } from "lucide-react";
import { cartItemKey } from "@/components/providers/CartProvider";
import type { CartItem } from "@/lib/types";

export default function OrderSummary({ cartItems, subtotal, shipping, total }: { cartItems: CartItem[]; subtotal: number; shipping: number; total: number }) {
  return <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="sticky top-24"><div className="bg-white rounded-xl shadow-md p-6 border border-gray-100"><h2 className="text-xl font-bold mb-5 text-gray-800">Order Summary</h2><div className="space-y-4 max-h-72 overflow-y-auto mb-5">{cartItems.map((item) => <div key={cartItemKey(item)} className="flex gap-3"><div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">{item.images?.[0] && <img src={item.images[0]} alt="" className="w-full h-full object-cover" />}</div><div className="min-w-0 flex-grow"><p className="text-sm font-medium text-gray-800 truncate">{item.name}</p><p className="text-xs text-gray-500">{item.variantName && `${item.variantName} - `}Qty: {item.quantity}</p></div><span className="text-sm font-medium">KES {(item.price * item.quantity).toLocaleString()}</span></div>)}</div><div className="space-y-3 border-t pt-4"><Line label="Subtotal" value={`KES ${subtotal.toLocaleString()}`} /><Line label="Shipping" value={"To be confirmed"} /><div className="flex justify-between border-t pt-3 text-lg font-bold"><span>Products total</span><span className="text-emerald-700">KES {total.toLocaleString()}</span></div></div><div className="mt-6 pt-4 border-t space-y-2 text-sm text-gray-500"><p className="flex gap-2"><Shield size={15} className="text-emerald-500" /> Secure account checkout</p><p className="flex gap-2"><Truck size={15} className="text-emerald-500" /> Delivery across Kenya</p></div></div></motion.div>;
}

function Line({ label, value }: { label: string; value: string }) { return <div className="flex justify-between text-gray-600"><span>{label}</span><span className="text-gray-800 font-medium">{value}</span></div>; }
