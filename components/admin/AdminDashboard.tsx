"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QuickActions from "@/components/admin/QuickActions";
import { motion } from "framer-motion";
import { Clock, Package, RefreshCw, ShoppingCart, Sparkles, Star, TrendingUp, Users } from "lucide-react";
import { api } from "@/lib/api";
import type { PublicOrder } from "@/lib/types";
import { errorMessage, formatDate, formatMoney } from "@/components/admin/admin-utils";

type ProductsResponse = { total: number; active: number };
type OrdersResponse = { orders: PublicOrder[] };

const colorStyles = {
  emerald: "bg-slate-100 text-[#079326]",
  blue: "bg-slate-100 text-[#008EFE]",
  orange: "bg-orange-100 text-orange-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
} as const;

function StatCard({ title, value, icon: Icon, color, href }: { title: string; value: string | number; icon: typeof Package; color: keyof typeof colorStyles; href?: string }) {
  const card = (
    <motion.div whileHover={{ y: -3 }} className="h-full rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="min-w-0"><p className="text-sm text-gray-500">{title}</p><p className="mt-2 break-words text-xl font-bold text-gray-900 sm:text-2xl">{value}</p></div>
        <div className={`shrink-0 rounded-xl p-2 sm:p-3 ${colorStyles[color]}`}><Icon size={24} /></div>
      </div>
    </motion.div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductsResponse>({ total: 0, active: 0 });
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, orderData] = await Promise.all([
        api.get<ProductsResponse>("/api/products?scope=admin&stats=true"),
        api.get<OrdersResponse>("/api/orders?limit=100"),
      ]);
      setProducts(productData);
      setOrders(orderData.orders ?? []);
    } catch (nextError) {
      setError(errorMessage(nextError, "Dashboard data could not be loaded"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const stats = useMemo(() => ({
    activeProducts: products.active,
    pendingOrders: orders.filter((order) => order.orderStatus === "pending").length,
    revenue: orders.filter((order) => order.paymentStatus === "paid").reduce((sum, order) => sum + order.total, 0),
    customers: new Set(orders.map((order) => order.userId).filter(Boolean)).size,
    paymentRate: orders.length ? Math.round((orders.filter((order) => order.paymentStatus === "paid").length / orders.length) * 100) : 0,
  }), [orders, products]);

  return (
    <main className="pb-16 pt-10">
      <div className="container mx-auto px-4">
        
    <div className="mb-8 flex items-center justify-between gap-4">
          <div><p className="mt-2 text-gray-600">Manage your store and customer orders.</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => void load()} disabled={loading} aria-label="Refresh dashboard" className="rounded-lg border border-gray-200 bg-white p-3 text-gray-600 hover:text-[#079326] disabled:opacity-50"><RefreshCw size={20} className={loading ? "animate-spin" : ""} /></button>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="hidden md:block"><Sparkles size={32} className="text-[#079326]" /></motion.div>
          </div>
          


        </div>

<QuickActions />

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          <StatCard title="Total Products" value={products.total} icon={Package} color="emerald" href="/admin/products" />
          <StatCard title="Active Products" value={stats.activeProducts} icon={Star} color="emerald" />
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="orange" href="/admin/orders" />
          <StatCard title="Paid Revenue" value={formatMoney(stats.revenue)} icon={TrendingUp} color="emerald" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="red" href="/admin/orders?status=pending" />
          <StatCard title="Customers" value={stats.customers} icon={Users} color="blue" />
        </div>

        <div className="grid gap-8">
          
          <section className="self-start rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3"><div className="rounded-lg bg-slate-100 p-2 text-[#079326]"><TrendingUp /></div><div><p className="text-sm text-gray-500">Order payment rate</p><p className="text-2xl font-bold text-gray-900">{stats.paymentRate}%</p></div></div>
            <div className="mb-2 flex justify-between text-sm text-gray-600"><span>Paid orders</span><span>{orders.filter((order) => order.paymentStatus === "paid").length} / {orders.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100"><motion.div initial={{ width: 0 }} animate={{ width: `${stats.paymentRate}%` }} transition={{ duration: .8 }} className="h-full rounded-full bg-[#079326]" /></div>
            <p className="mt-5 border-t border-gray-100 pt-4 text-sm text-gray-500">Calculated from Firestore-backed order and payment states.</p>
          </section>

        </div>

        

        <section className="mt-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-xl font-bold text-gray-900">Recent Orders</h2><Link href="/admin/orders" className="text-sm font-medium text-[#079326]">View all</Link></div>
          <div className="divide-y divide-gray-100">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><p className="font-semibold text-gray-900">{order.orderNumber}</p><p className="truncate text-sm text-gray-500">{order.customer.name} · {formatDate(order.createdAt)}</p></div><div className="text-right"><p className="font-semibold text-gray-900">{formatMoney(order.total)}</p><p className="text-xs capitalize text-gray-500">{order.orderStatus}</p></div></div>)}{!loading && orders.length === 0 && <p className="p-6 text-center text-gray-500">No orders yet.</p>}</div>
        </section>
      </div>
    </main>
  );
}
