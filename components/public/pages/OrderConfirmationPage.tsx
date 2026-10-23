"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import AdminNavigation from "@/components/admin/AdminNavigation";
import ActionButtons from "@/components/public/order/ActionButtons";
import OrderItems from "@/components/public/order/OrderItems";
import OrderSummary from "@/components/public/order/OrderSummary";
import ShippingInfo from "@/components/public/order/ShippingInfo";
import SuccessMessage from "@/components/public/order/SuccessMessage";
import { api } from "@/lib/api";
import type { PublicOrder } from "@/lib/types";

export default function OrderConfirmationPage({ orderNumber }: { orderNumber: string }) {
  const { firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) { setLoading(false); return; }
    let cancelled = false;
    api.get<PublicOrder>(`/api/orders/${encodeURIComponent(orderNumber)}`).then((value) => { if (!cancelled) setOrder(value); }).catch(() => { if (!cancelled) setOrder(null); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [authLoading, firebaseUser, orderNumber]);

  if (loading || authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /><p className="mt-4 text-gray-500">Loading order details...</p></div></div>;
  if (!order) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md p-8"><div className="text-4xl mb-5">🔍</div><h1 className="text-3xl font-bold mb-4 text-gray-800">Order Not Found</h1><p className="text-gray-500 mb-8">Sign in with the account used at checkout, or check order number &quot;{orderNumber}&quot;.</p><Link href={`/sign-in?returnTo=${encodeURIComponent(`/order-confirmation/${orderNumber}`)}`} className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold">Sign in to view order</Link></motion.div></div>;

  return <AdminNavigation account={{ section: "orders", onSectionChange: (section) => router.push(section === "settings" ? "/account?section=settings" : "/account") }}><div className="min-h-screen bg-gray-50 py-8 sm:py-12"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto mb-8"><SuccessMessage orderNumber={order.orderNumber} createdAt={order.createdAt} /></div><div className="max-w-7xl mx-auto"><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-8"><OrderItems items={order.items} /><ShippingInfo customer={order.customer} /></div><div><OrderSummary order={order} /></div></div><ActionButtons /></div></div></div></AdminNavigation>;
}
