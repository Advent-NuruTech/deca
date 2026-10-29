"use client";

import Link from "next/link";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, Eye, PackageCheck, Search, Settings2, ShoppingBag, X, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { Order, PublicOrder } from "@/lib/types";
import { errorMessage, formatDate, formatMoney } from "@/components/admin/admin-utils";

type OrdersResponse = { orders: PublicOrder[]; total: number };

export default function OrdersManager() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<PublicOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [paymentStatus, setPaymentStatus] = useState(searchParams.get("paymentStatus") ?? "");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PublicOrder | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [updating, setUpdating] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  useEffect(() => { api.get<{ statuses: string[] }>("/api/order-statuses").then(({ statuses }) => setStatuses(statuses)).catch(() => toast.error("Could not load order statuses")); }, []);
  useEffect(() => {
    if (!selected) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const controls = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), select:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])') ?? []);
    controls()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { setSelected(null); return; }
      if (event.key !== "Tab") return;
      const items = controls();
      if (!items.length) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0].focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previousFocus?.focus(); };
  }, [selected?.id]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const params = new URLSearchParams({ limit: "100" });
    if (status) params.set("status", status);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    try { const response = await api.get<OrdersResponse>(`/api/orders?${params}`); setOrders(response.orders ?? []); }
    catch (nextError) { setError(errorMessage(nextError, "Orders could not be loaded")); }
    finally { setLoading(false); }
  }, [paymentStatus, status]);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => orders.filter((order) => !query || `${order.orderNumber} ${order.customer.name} ${order.customer.email} ${order.customer.phone}`.toLowerCase().includes(query.toLowerCase())), [orders, query]);
  const totals = useMemo(() => ({ revenue: orders.filter((order) => order.paymentStatus === "paid").reduce((sum, order) => sum + order.total, 0), pending: orders.filter((order) => order.orderStatus === "pending").length, delivered: orders.filter((order) => order.orderStatus === "delivered").length }), [orders]);

  async function updateOrder(order: PublicOrder, changes: Partial<Pick<Order, "orderStatus" | "paymentStatus">>) {
    setUpdating(true);
    try {
      const updated = await api.put<PublicOrder>(`/api/orders/${order.id}/status`, changes);
      setOrders((current) => current.map((item) => item.id === updated.id ? updated : item).filter((item) => (!status || item.orderStatus === status) && (!paymentStatus || item.paymentStatus === paymentStatus)));
      setSelected((current) => current?.id === updated.id ? updated : current);
      toast.success("Order status updated");
    } catch (nextError) { toast.error(errorMessage(nextError, "Order status could not be updated")); }
    finally { setUpdating(false); }
  }

  return <main className="pb-16 pt-6 sm:pt-10"><div className="container mx-auto max-w-7xl px-4 sm:px-6">
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008EFE]">Store management</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Orders</h1><p className="mt-2 text-sm leading-6 text-slate-600">Review placed orders and keep payment and delivery progress up to date.</p></div>
      <Link href="/admin/orders/stages" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><Settings2 size={18} /> Manage tracking stages</Link>
    </header>
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><MiniStat label="Orders loaded" value={String(orders.length)} icon={<ShoppingBag size={20} />} /><MiniStat label="Paid revenue" value={formatMoney(totals.revenue)} icon={<CheckCircle2 size={20} />} /><MiniStat label="Pending" value={String(totals.pending)} icon={<Clock size={20} />} /><MiniStat label="Delivered" value={String(totals.delivered)} icon={<PackageCheck size={20} />} /></div>
    <p className="mb-5 text-xs text-slate-500">Summary reflects up to 100 orders loaded for the selected status filters.</p>
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error} <button onClick={() => void load()} className="ml-2 font-semibold underline">Retry</button></div>}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-labelledby="placed-orders-heading">
      <div className="border-b border-slate-200 p-4 sm:p-6"><div className="mb-4"><h2 id="placed-orders-heading" className="text-xl font-bold text-slate-950">Placed orders</h2><p className="mt-1 text-sm text-slate-500">Search by order number or customer, or filter by status.</p></div>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto]"><label className="relative block"><span className="sr-only">Search orders</span><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders or customers" className="min-h-11 w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#008EFE] focus:ring-2 focus:ring-[#008EFE]" /></label><label><span className="sr-only">Filter by fulfillment status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm capitalize focus:outline-2 focus:outline-[#008EFE]"><option value="">All order statuses</option>{statuses.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select></label><label><span className="sr-only">Filter by payment status</span><select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm focus:outline-2 focus:outline-[#008EFE]"><option value="">All payment statuses</option><option value="pending">Pending payment</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></label></div>
      </div>
      {!loading && filtered.length > 0 && <>
      <div className="divide-y divide-slate-100 lg:hidden">{filtered.map((order) => <article key={order.id} className="space-y-4 p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words font-bold text-slate-950">{order.orderNumber}</h3><p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)} ? {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p></div><p className="shrink-0 font-bold text-slate-950">{formatMoney(order.total)}</p></div><div><p className="font-medium text-slate-900">{order.customer.name}</p><p className="break-all text-sm text-slate-500">{order.customer.email}</p></div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-medium text-slate-500">Payment</span><StatusBadge value={order.paymentStatus} /></div><div className="flex flex-wrap items-end gap-3"><label className="min-w-[160px] flex-1 text-xs font-semibold text-slate-600">Fulfillment<select value={order.orderStatus} disabled={updating || !statuses.length} onChange={(event) => void updateOrder(order, { orderStatus: event.target.value as Order["orderStatus"] })} className="mt-1 block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm capitalize focus:outline-2 focus:outline-[#008EFE]">{statuses.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select></label><button type="button" onClick={() => setSelected(order)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-800 hover:border-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><Eye size={17} /> Details</button></div></article>)}</div>
      <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[900px] text-left"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Fulfillment</th><th className="px-5 py-3">Date</th><th className="px-5 py-3 text-right">Details</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((order) => <tr key={order.id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{order.orderNumber}</p><p className="text-xs text-slate-500">{order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p></td><td className="px-5 py-4"><p className="font-medium text-slate-900">{order.customer.name}</p><p className="text-sm text-slate-500">{order.customer.email}</p></td><td className="px-5 py-4 font-semibold">{formatMoney(order.total)}</td><td className="px-5 py-4"><StatusBadge value={order.paymentStatus} /></td><td className="px-5 py-4"><select aria-label={`Fulfillment status for ${order.orderNumber}`} value={order.orderStatus} disabled={updating || !statuses.length} onChange={(event) => void updateOrder(order, { orderStatus: event.target.value as Order["orderStatus"] })} className="min-h-10 rounded-lg border border-slate-300 bg-white px-2 text-sm capitalize focus:outline-2 focus:outline-[#008EFE]">{statuses.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select></td><td className="px-5 py-4 text-sm text-slate-500">{formatDate(order.createdAt)}</td><td className="px-5 py-4 text-right"><button type="button" onClick={() => setSelected(order)} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#008EFE] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]">View details</button></td></tr>)}</tbody></table></div></>}
      {loading && <p role="status" className="p-10 text-center text-slate-500">Loading orders?</p>}{!loading && !error && filtered.length === 0 && <div className="p-10 text-center"><p className="font-semibold text-slate-900">No orders found</p><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p>{(query || status || paymentStatus) && <button type="button" onClick={() => { setQuery(""); setStatus(""); setPaymentStatus(""); }} className="mt-4 font-semibold text-[#008EFE] underline focus-visible:outline-2 focus-visible:outline-[#008EFE]">Clear filters</button>}</div>}
    </section>
  </div>
  <AnimatePresence>{selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="order-details-title" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }} className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><div><h2 id="order-details-title" className="text-xl font-bold sm:text-2xl">Order {selected.orderNumber}</h2><p className="text-sm text-gray-500">Placed {formatDate(selected.createdAt)}</p></div><button type="button" aria-label="Close order details" onClick={() => setSelected(null)} className="rounded-lg p-2 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><X /></button></div><div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
    <div className="grid gap-4 sm:grid-cols-2"><DetailCard title="Customer"><p className="font-semibold">{selected.customer.name}</p><p>{selected.customer.email}</p><p>{selected.customer.phone}</p></DetailCard><DetailCard title="Delivery address"><p>{selected.customer.address?.street}</p><p>{selected.customer.address?.city}, {selected.customer.address?.county}</p><p>{selected.customer.address?.country}</p></DetailCard></div>
    <section><h3 className="mb-3 font-bold">Items</h3><div className="divide-y divide-gray-100 rounded-xl border border-gray-200">{selected.items.map((item, index) => <div key={`${item.product}-${index}`} className="flex items-center gap-3 p-3"><img src={item.image || "/logo.png"} alt="" className="h-12 w-12 rounded-lg object-cover" /><div className="flex-1"><p className="font-medium">{item.name}</p><p className="text-sm text-gray-500">{item.variantName && `${item.variantName} - `}{item.quantity} × {formatMoney(item.price)}</p></div><p className="font-semibold">{formatMoney(item.quantity * item.price)}</p></div>)}</div></section>
    <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1 block text-sm font-medium">Fulfillment status</span><select value={selected.orderStatus} disabled={updating} onChange={(event) => void updateOrder(selected, { orderStatus: event.target.value as Order["orderStatus"] })} className="input-field">{statuses.map((stage) => <option key={stage} value={stage}>{stage}</option>)}</select></label><label><span className="mb-1 block text-sm font-medium">Payment status</span><select value={selected.paymentStatus} disabled={updating} onChange={(event) => void updateOrder(selected, { paymentStatus: event.target.value as Order["paymentStatus"] })} className="input-field"><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option></select></label></div>
    <div className="rounded-xl bg-gray-50 p-4"><div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatMoney(selected.subtotal)}</span></div><div className="mt-2 flex justify-between text-sm"><span>Shipping {selected.deliveryFeePending ? "" : `(${selected.shippingMethod})`}</span><span>{selected.deliveryFeePending ? "To be confirmed" : formatMoney(selected.shipping)}</span></div><div className="mt-3 flex justify-between border-t border-gray-200 pt-3 text-lg font-bold"><span>Total</span><span>{formatMoney(selected.total)}</span></div></div>
    {selected.notes && <DetailCard title="Customer notes"><p>{selected.notes}</p></DetailCard>}
  </div></motion.div></div>}</AnimatePresence>
  </main>;
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:p-5"><div className="min-w-0"><p className="text-sm text-gray-500">{label}</p><p className="mt-1 break-words text-xl font-bold sm:text-2xl">{value}</p></div><div className="shrink-0 rounded-lg bg-slate-100 p-2 text-[#079326] sm:p-3">{icon}</div></div>; }
function StatusBadge({ value }: { value: string }) { const Icon = value === "paid" ? CheckCircle2 : value === "failed" || value === "refunded" ? XCircle : Clock; const style = value === "paid" ? "bg-slate-100 text-[#079326]" : value === "failed" ? "bg-red-100 text-red-700" : value === "refunded" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"; return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}><Icon size={13} />{value}</span>; }
function DetailCard({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600"><h3 className="mb-2 font-bold text-gray-900">{title}</h3>{children}</section>; }
