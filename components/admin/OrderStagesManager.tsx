"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, GripVertical, Plus, Save } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { errorMessage } from "@/components/admin/admin-utils";

const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:border-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:cursor-not-allowed disabled:opacity-40";

export default function OrderStagesManager() {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [saving, setSaving] = useState(false);
  const [dragged, setDragged] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    api.get<{ statuses: string[] }>("/api/order-statuses")
      .then((result) => { if (active) setStatuses(result.statuses); })
      .catch((err) => { if (active) setError(errorMessage(err, "Could not load order stages")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  function move(from: number, to: number) {
    setStatuses((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return next;
    });
  }
  async function save() {
    setSaving(true);
    try { const result = await api.put<{ statuses: string[] }>("/api/order-statuses", { statuses }); setStatuses(result.statuses); toast.success("Order stages saved"); }
    catch (err) { toast.error(errorMessage(err, "Could not save order stages")); }
    finally { setSaving(false); }
  }

  return <main className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10">
    <Link href="/admin/orders" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><ArrowLeft size={18} /> Back to orders</Link>
    <header className="mb-6 mt-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#008EFE]">Order settings</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Tracking stages</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Arrange the stages customers see when tracking an order. Pending is required. Move orders to another stage before removing one that is in use.</p></header>
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="stages-heading"><h2 id="stages-heading" className="text-lg font-bold text-slate-950">Order of stages</h2><p className="mt-1 text-sm text-slate-500">Drag to reorder on desktop, or use the arrow buttons.</p>
      {loading ? <p role="status" className="py-8 text-slate-500">Loading stages…</p> : error ? <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button type="button" onClick={() => setRetry((n) => n + 1)} className="font-semibold underline">Retry</button></div> : <><ol className="mt-4 space-y-2">{statuses.map((stage, index) => <li key={stage} draggable onDragStart={(event) => { setDragged(index); event.dataTransfer.effectAllowed = "move"; }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (dragged !== null) move(dragged, index); setDragged(null); }} onDragEnd={() => setDragged(null)} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-2 sm:gap-2"><GripVertical size={18} className="hidden shrink-0 cursor-grab text-slate-400 sm:block" aria-hidden="true" /><span className="min-w-0 flex-1 break-words px-2 text-sm font-semibold capitalize text-slate-900">{stage}</span><button type="button" disabled={index === 0} onClick={() => move(index, index - 1)} className={`${button} px-2.5`} aria-label={`Move ${stage} up`}><ArrowUp size={17} /></button><button type="button" disabled={index === statuses.length - 1} onClick={() => move(index, index + 1)} className={`${button} px-2.5`} aria-label={`Move ${stage} down`}><ArrowDown size={17} /></button><button type="button" disabled={stage === "pending"} onClick={() => setStatuses((current) => current.filter((item) => item !== stage))} className={`${button} px-2.5 text-red-700`} aria-label={`Remove ${stage}`}>Remove</button></li>)}</ol>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row"><label className="flex-1 text-sm font-semibold text-slate-700">New stage<input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} maxLength={100} placeholder="e.g. Ready for delivery" className="mt-1 block min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-[#008EFE] focus:ring-2 focus:ring-[#008EFE]" /></label><button type="button" onClick={() => { const name = newStatus.trim().toLowerCase(); if (!name || statuses.includes(name)) { toast.error("Enter a unique stage name"); return; } setStatuses((current) => [...current, name]); setNewStatus(""); }} className={`${button} sm:self-end`}><Plus size={18} /> Add stage</button></div><div className="mt-6 border-t border-slate-200 pt-5"><button type="button" disabled={saving || !statuses.length} onClick={() => void save()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#079326] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:opacity-50 sm:w-auto"><Save size={18} />{saving ? "Saving…" : "Save stages"}</button></div></>}
    </section>
  </main>;
}
