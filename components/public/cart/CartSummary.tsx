"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Truck } from "lucide-react";

export default function CartSummary({
  subtotal,
  itemCount,
  onClearCart,
}: {
  subtotal: number;
  itemCount: number;
  onClearCart: () => void;
}) {
  const features = [
    { icon: Truck, text: "Delivery fee confirmed after your details are reviewed" },
    { icon: Shield, text: "Secure checkout guaranteed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24"
    >
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h2>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
            <span className="text-gray-800 font-medium">KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-slate-700">To be confirmed</span>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-800 font-semibold">Products total</span>
              <span className="text-2xl font-bold text-emerald-700">KES {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-6">
          {features.map((feature) => (
            <div key={feature.text} className="flex items-center gap-2 text-sm text-gray-500">
              <feature.icon size={14} className="text-emerald-500" />
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Link href="/checkout" className="block">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 group relative overflow-hidden shadow-sm hover:bg-emerald-700 transition"
            >
              <span className="relative z-10 flex items-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.span>
          </Link>
          <Link href="/products" className="block">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all block text-center"
            >
              Continue Shopping
            </motion.span>
          </Link>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearCart}
          className="w-full text-sm text-red-500 hover:text-red-600 mt-4 transition-colors"
        >
          Clear Cart
        </motion.button>
      </div>
    </motion.div>
  );
}
