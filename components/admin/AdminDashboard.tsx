"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, FileText, Package, Plus, RefreshCw, ShoppingCart, Sparkles, Star, TrendingUp, Users } from "lucide-react";
import { api } from "@/lib/api";
import type { PublicArticle, PublicOrder, PublicProduct } from "@/lib/types";
import { errorMessage, formatDate, formatMoney } from "@/components/admin/admin-utils";

type ProductsResponse = { products: PublicProduct[] };
type ArticlesResponse = { articles: PublicArticle[] };
type OrdersResponse = { orders: PublicOrder[] };

const colorStyles = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  yellow: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
} as const;

function StatCard({ title, value, icon: Icon, color, href }: { title: string; value: string | number; icon: typeof Package; color: keyof typeof colorStyles; href?: string }) {
  const card = (
    <motion.div whileHover={{ y: -3 }} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-sm text-gray-500">{title}</p><p className="mt-2 text-2xl font-bold text-gray-900">{value}</p></div>
        <div className={`rounded-xl p-3 ${colorStyles[color]}`}><Icon size={24} /></div>
      </div>
    </motion.div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productData, articleData, orderData] = await Promise.all([
        api.get<ProductsResponse>("/api/products?scope=admin&limit=100"),
        api.get<ArticlesResponse>("/api/articles?scope=admin&limit=100"),
        api.get<OrdersResponse>("/api/orders?limit=100"),
      ]);
      setProducts(productData.products ?? []);
      setArticles(articleData.articles ?? []);
      setOrders(orderData.orders ?? []);
    } catch (nextError) {
      setError(errorMessage(nextError, "Dashboard data could not be loaded"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const stats = useMemo(() => ({
    activeProducts: products.filter((product) => product.status === "active").length,
    publishedArticles: articles.filter((article) => article.published).length,
    draftArticles: articles.filter((article) => !article.published).length,
    pendingOrders: orders.filter((order) => order.orderStatus === "pending").length,
    revenue: orders.filter((order) => order.paymentStatus === "paid").reduce((sum, order) => sum + order.total, 0),
    customers: new Set(orders.map((order) => order.userId).filter(Boolean)).size,
    paymentRate: orders.length ? Math.round((orders.filter((order) => order.paymentStatus === "paid").length / orders.length) * 100) : 0,
  }), [articles, orders, products]);

  return (
    <main className="pb-16 pt-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div><h1 className="text-4xl font-bold"><span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Admin Dashboard</span></h1><p className="mt-2 text-gray-600">Manage your store, publishing, and customer orders.</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => void load()} disabled={loading} aria-label="Refresh dashboard" className="rounded-lg border border-gray-200 bg-white p-3 text-gray-600 hover:text-emerald-600 disabled:opacity-50"><RefreshCw size={20} className={loading ? "animate-spin" : ""} /></button>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="hidden md:block"><Sparkles size={32} className="text-emerald-400/50" /></motion.div>
          </div>
        </div>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Products" value={products.length} icon={Package} color="emerald" href="/admin/products" />
          <StatCard title="Active Products" value={stats.activeProducts} icon={Star} color="emerald" />
          <StatCard title="Published Articles" value={stats.publishedArticles} icon={FileText} color="blue" href="/admin/articles" />
          <StatCard title="Total Orders" value={orders.length} icon={ShoppingCart} color="orange" href="/admin/orders" />
          <StatCard title="Draft Articles" value={stats.draftArticles} icon={Clock} color="yellow" />
          <StatCard title="Paid Revenue" value={formatMoney(stats.revenue)} icon={TrendingUp} color="emerald" />
          <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="red" href="/admin/orders?status=pending" />
          <StatCard title="Customers" value={stats.customers} icon={Users} color="blue" />
        </div>

        <section className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/admin/products?action=new" className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"><Plus size={18} /> Add Product</Link>
            <Link href="/admin/articles?action=new" className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"><Plus size={18} /> Write Article</Link>
            <Link href="/admin/orders?status=pending" className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"><ShoppingCart size={18} /> Process Orders</Link>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-xl font-bold text-gray-900">Featured Products</h2><Link href="/admin/products" className="text-sm font-medium text-emerald-600">View all</Link></div>
            <div className="divide-y divide-gray-100">
              {products.filter((item) => item.featured).slice(0, 5).map((product) => <div key={product.id} className="flex items-center gap-4 p-4"><img src={product.images?.[0] || "/logo.png"} alt="" className="h-12 w-12 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-gray-900">{product.name}</p><p className="text-sm text-gray-500">{formatMoney(product.price)} · {product.stockQuantity} in stock</p></div></div>)}
              {!loading && products.every((item) => !item.featured) && <p className="p-6 text-center text-gray-500">No featured products yet.</p>}
            </div>
          </section>
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-700"><TrendingUp /></div><div><p className="text-sm text-gray-500">Order payment rate</p><p className="text-2xl font-bold text-gray-900">{stats.paymentRate}%</p></div></div>
            <div className="mb-2 flex justify-between text-sm text-gray-600"><span>Paid orders</span><span>{orders.filter((order) => order.paymentStatus === "paid").length} / {orders.length}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100"><motion.div initial={{ width: 0 }} animate={{ width: `${stats.paymentRate}%` }} transition={{ duration: .8 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" /></div>
            <p className="mt-5 border-t border-gray-100 pt-4 text-sm text-gray-500">Calculated from Firestore-backed order and payment states.</p>
          </section>
        </div>

        <section className="mt-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-xl font-bold text-gray-900">Recent Products</h2><Link href="/admin/products" className="text-sm font-medium text-emerald-600">Manage products</Link></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Added</th></tr></thead><tbody className="divide-y divide-gray-100">{products.slice(0, 6).map((product) => <tr key={product.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><img src={product.images?.[0] || "/logo.png"} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="font-semibold text-gray-900">{product.name}</span></div></td><td className="px-5 py-4 capitalize text-gray-600">{product.category}</td><td className="px-5 py-4">{formatMoney(product.price)}</td><td className="px-5 py-4">{product.stockQuantity}</td><td className="px-5 py-4 text-sm text-gray-500">{formatDate(product.createdAt)}</td></tr>)}</tbody></table></div>
          {!loading && products.length === 0 && <p className="p-6 text-center text-gray-500">No products yet.</p>}
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5"><h2 className="text-xl font-bold text-gray-900">Recent Orders</h2><Link href="/admin/orders" className="text-sm font-medium text-emerald-600">View all</Link></div>
          <div className="divide-y divide-gray-100">{orders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between gap-4 p-4"><div className="min-w-0"><p className="font-semibold text-gray-900">{order.orderNumber}</p><p className="truncate text-sm text-gray-500">{order.customer.name} · {formatDate(order.createdAt)}</p></div><div className="text-right"><p className="font-semibold text-gray-900">{formatMoney(order.total)}</p><p className="text-xs capitalize text-gray-500">{order.orderStatus}</p></div></div>)}{!loading && orders.length === 0 && <p className="p-6 text-center text-gray-500">No orders yet.</p>}</div>
        </section>
      </div>
    </main>
  );
}
