"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import AdminNavigation from "@/components/admin/AdminNavigation";
import type { PublicOrder } from "@/lib/types";

const input = "mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200";
const button = "rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50";
const secondary = "rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:opacity-50";
function friendly(error: unknown) {
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
  const messages: Record<string, string> = { "auth/invalid-credential": "The email or password is incorrect.", "auth/email-already-in-use": "An account already uses this email address.", "auth/weak-password": "Choose a stronger password.", "auth/invalid-email": "Enter a valid email address.", "auth/popup-closed-by-user": "The Google sign-in window was closed. Please try again.", "auth/account-exists-with-different-credential": "An account already exists with this email. Sign in using its original method.", "auth/requires-recent-login": "For security, please sign in again and retry.", "auth/operation-not-allowed": "This sign-in method is not enabled. Please contact support.", "auth/too-many-requests": "Too many attempts. Please try again later." };
  return messages[code] || (error instanceof Error && !code ? error.message : "Something went wrong. Please try again.");
}

export default function AccountPage() {
  const { firebaseUser, user, loading, error, logout, refreshProfile } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failure, setFailure] = useState("");
  const [orders, setOrders] = useState<PublicOrder[] | null>(null);
  const [orderError, setOrderError] = useState("");
  const [stages, setStages] = useState<string[]>([]);
  const [tab, setTab] = useState<"orders" | "settings">("orders");
  useEffect(() => { if (new URLSearchParams(window.location.search).get("section") === "settings") setTab("settings"); }, []);
  const passwordAccount = firebaseUser?.providerData.some((provider) => provider.providerId === "password") ?? false;

  useEffect(() => { if (!loading && !firebaseUser) router.replace("/sign-in?returnTo=%2Faccount"); }, [loading, firebaseUser, router]);
  useEffect(() => { if (user) { setName(user.name); setNewEmail(user.email); } }, [user]);
  useEffect(() => {
    if (!user) { setOrders(null); return; }
    let active = true;
    setOrders(null);
    setOrderError("");
    const refresh = () => {
      api.get<{ statuses: string[] }>("/api/order-statuses").then((result) => { if (active) setStages(result.statuses); }).catch(() => { if (active) setStages([]); });
      api.get<{ orders: PublicOrder[] }>("/api/account/orders").then((result) => { if (active) { setOrders(result.orders); setOrderError(""); } }).catch((err) => { if (active) setOrderError(friendly(err)); });
    };
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { active = false; window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", onVisibility); };
  }, [user?.uid]);

  async function run(action: () => Promise<void>) {
    setFailure(""); setNotice(""); setBusy(true);
    try { await action(); } catch (err) { setFailure(friendly(err)); } finally { setBusy(false); }
  }
  async function reauthenticate() {
    if (!firebaseUser) throw new Error("Please sign in again.");
    if (passwordAccount) {
      if (!firebaseUser.email || !currentPassword) throw new Error("Enter your current password to continue.");
      await reauthenticateWithCredential(firebaseUser, EmailAuthProvider.credential(firebaseUser.email, currentPassword));
    } else {
      await reauthenticateWithPopup(firebaseUser, new GoogleAuthProvider());
    }
  }
  const label = (title: string, field: React.ReactNode) => <label className="block text-sm font-semibold text-gray-700">{title}{field}</label>;
  return <AdminNavigation account={{ section: tab, onSectionChange: (section) => { setTab(section); setFailure(""); setNotice(""); } }}><main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10"><div className="mx-auto max-w-6xl">
    <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">RemSam Homestead</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{user ? "Your account" : "Welcome"}</h1><p className="mt-2 text-gray-600">{user ? "Manage your details and keep track of your orders." : "Sign in or create an account to see your orders."}</p></div>
    {loading ? <p role="status" className="text-gray-600">Loading your account…</p> : !firebaseUser ? <p role="status" className="text-gray-600">Taking you to sign in?</p> : !user ? <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p role="alert" className="text-red-700">{error || "Your profile could not be loaded."}</p><div className="mt-4 flex gap-3"><button className={secondary} onClick={() => void run(async () => { await refreshProfile(); })}>Try again</button><button className={secondary} onClick={() => void logout()}>Sign out</button></div>{failure && <p role="alert" className="mt-3 text-red-700">{failure}</p>}</div> : <>
      {tab === "orders" ? <section><h2 className="mb-4 text-xl font-bold text-gray-900">Your orders</h2>{orderError ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Could not load orders: {orderError}</p> : !orders ? <p role="status" className="text-gray-600">Loading orders…</p> : orders.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white p-8"><p className="font-semibold text-gray-900">No orders yet</p><p className="mt-2 text-gray-600">When you place an order, it will appear here.</p><Link href="/products" className="mt-5 inline-block font-semibold text-emerald-700 hover:underline">Explore the shop →</Link></div> : <div className="space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-gray-900">{order.orderNumber}</h3><p className="mt-1 text-sm text-gray-500">{typeof order.createdAt === "string" && !Number.isNaN(Date.parse(order.createdAt)) ? new Date(order.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" }) : ""}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold capitalize text-emerald-800">{order.orderStatus}</span></div><div className="mt-4" aria-label="Order tracking stages"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Tracking stages</p><ol className="flex flex-wrap gap-2">{stages.map((stage) => <li key={stage} aria-current={stage === order.orderStatus ? "step" : undefined} className={`rounded-full border px-3 py-1 text-xs capitalize ${stage === order.orderStatus ? "border-emerald-600 bg-emerald-50 font-bold text-emerald-800" : "border-slate-200 text-slate-500"}`}>{stage}</li>)}</ol></div><ul className="mt-4 space-y-1 text-sm text-gray-600">{order.items.map((item, index) => <li key={`${item.product}-${index}`}>{item.quantity} × {item.name}{item.variantName ? ` (${item.variantName})` : ""}</li>)}</ul><div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4 text-sm"><span className="text-gray-600">{order.deliveryFeePending ? "Delivery fee to be confirmed" : `Payment: ${order.paymentStatus}`}</span><strong className="text-gray-900">{order.deliveryFeePending ? "Products: " : ""}KES {order.total.toLocaleString("en-KE")}</strong><Link href={`/order-confirmation/${encodeURIComponent(order.orderNumber)}`} className="font-semibold text-emerald-700 hover:underline">View order details</Link></div></article>)}</div>}</section> : <section className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Profile</h2><form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); void run(async () => { await api.patch("/api/auth/me", { name }); await refreshProfile(); setNotice("Your name has been updated."); }); }}>{label("Name", <input className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required autoComplete="name" />)}<button disabled={busy} className={button}>Save name</button></form></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Sign-in details</h2><p className="mt-2 text-sm text-gray-600">{passwordAccount ? "Enter your current password to change your email or password." : "Confirm your Google sign-in to change your email. Your Google password is managed by Google."}</p><div className="mt-5 space-y-4">{passwordAccount && label("Current password", <input className={input} type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />)}<form className="space-y-3" onSubmit={(e) => { e.preventDefault(); void run(async () => { await reauthenticate(); await verifyBeforeUpdateEmail(firebaseUser, newEmail.trim()); setCurrentPassword(""); setNotice("Check your new email for a verification link. Your sign-in email changes after you verify it."); }); }}>{label("New email address", <input className={input} type="email" autoComplete="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />)}<button disabled={busy || newEmail.trim().toLowerCase() === user.email.toLowerCase()} className={secondary}>Send verification email</button></form>{passwordAccount && <form className="space-y-3 border-t border-slate-100 pt-4" onSubmit={(e) => { e.preventDefault(); void run(async () => { await reauthenticate(); await updatePassword(firebaseUser, newPassword); setNewPassword(""); setCurrentPassword(""); setNotice("Your password has been updated."); }); }}>{label("New password", <input className={input} type="password" autoComplete="new-password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />)}<button disabled={busy} className={secondary}>Change password</button></form>}</div></div>{(notice || failure) && <p role={failure ? "alert" : "status"} className={`md:col-span-2 ${failure ? "text-red-700" : "text-emerald-700"}`}>{failure || notice}</p>}</section>}
    </>}
  </div></main></AdminNavigation>;
}
