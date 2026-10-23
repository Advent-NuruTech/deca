"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, sendPasswordResetEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { useAuth } from "@/components/providers/AuthProvider";
import { firebaseAuth } from "@/lib/firebase/client";
import { api } from "@/lib/api";
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
  const { firebaseUser, user, loading, error, signIn, register, signInWithGoogle, logout, refreshProfile } = useAuth();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [failure, setFailure] = useState("");
  const [orders, setOrders] = useState<PublicOrder[] | null>(null);
  const [orderError, setOrderError] = useState("");
  const [tab, setTab] = useState<"orders" | "settings">("orders");
  const passwordAccount = firebaseUser?.providerData.some((provider) => provider.providerId === "password") ?? false;

  useEffect(() => { if (user) { setName(user.name); setNewEmail(user.email); } }, [user]);
  useEffect(() => {
    if (!user) { setOrders(null); return; }
    let active = true;
    setOrders(null);
    setOrderError("");
    api.get<{ orders: PublicOrder[] }>("/api/account/orders").then((result) => { if (active) setOrders(result.orders); }).catch((err) => { if (active) setOrderError(friendly(err)); });
    return () => { active = false; };
  }, [user?.uid]);

  async function run(action: () => Promise<void>) {
    setFailure(""); setNotice(""); setBusy(true);
    try { await action(); } catch (err) { setFailure(friendly(err)); } finally { setBusy(false); }
  }
  async function authenticate(event: FormEvent) {
    event.preventDefault();
    await run(async () => { if (creating) await register(name, email.trim(), password); else await signIn(email.trim(), password); setPassword(""); });
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
  return <div className="min-h-screen bg-stone-50 px-4 pb-20 pt-28 sm:pt-32"><div className="mx-auto max-w-5xl">
    <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">RemSam Homestead</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{user ? "Your account" : "Welcome"}</h1><p className="mt-2 text-gray-600">{user ? "Manage your details and keep track of your orders." : "Sign in or create an account to see your orders."}</p></div>
    {loading ? <p role="status" className="text-gray-600">Loading your account…</p> : !firebaseUser ? <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-gray-900">{creating ? "Create your account" : "Sign in"}</h2>
      <form onSubmit={authenticate} className="mt-6 space-y-4">
        {creating && label("Name", <input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />)}
        {label("Email address", <input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />)}
        {label("Password", <input className={input} type="password" autoComplete={creating ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />)}
        {failure && <p role="alert" className="text-sm text-red-700">{failure}</p>}{notice && <p role="status" className="text-sm text-emerald-700">{notice}</p>}
        <button disabled={busy} className={`${button} w-full`}>{busy ? "Please wait…" : creating ? "Create account" : "Sign in"}</button>
      </form>
      <div className="my-5 flex items-center gap-3 text-sm text-gray-400"><span className="h-px flex-1 bg-gray-200" />or<span className="h-px flex-1 bg-gray-200" /></div>
      <button type="button" disabled={busy} onClick={() => void run(async () => { await signInWithGoogle(); })} className={`${secondary} w-full`}>Continue with Google</button>
      <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm"><button type="button" onClick={() => { setCreating(!creating); setFailure(""); setNotice(""); }} className="font-semibold text-emerald-700 hover:underline">{creating ? "Already have an account? Sign in" : "Create an account"}</button>{!creating && <button type="button" disabled={busy} onClick={() => void run(async () => { if (!email.trim()) throw new Error("Enter your email address first."); await sendPasswordResetEmail(firebaseAuth(), email.trim()); setNotice("If an account exists for that address, a password reset email has been sent."); })} className="text-emerald-700 hover:underline">Forgot password?</button>}</div>
    </div> : !user ? <div className="rounded-2xl border border-stone-200 bg-white p-6"><p role="alert" className="text-red-700">{error || "Your profile could not be loaded."}</p><div className="mt-4 flex gap-3"><button className={secondary} onClick={() => void run(async () => { await refreshProfile(); })}>Try again</button><button className={secondary} onClick={() => void logout()}>Sign out</button></div>{failure && <p role="alert" className="mt-3 text-red-700">{failure}</p>}</div> : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200"><nav aria-label="Account sections" className="flex gap-6">{(["orders", "settings"] as const).map((item) => <button key={item} type="button" onClick={() => { setTab(item); setFailure(""); setNotice(""); }} aria-current={tab === item ? "page" : undefined} className={`border-b-2 pb-4 text-sm font-semibold capitalize ${tab === item ? "border-emerald-700 text-emerald-800" : "border-transparent text-gray-500 hover:text-gray-900"}`}>{item}</button>)}</nav><button type="button" onClick={() => void logout()} className="pb-4 text-sm font-semibold text-gray-600 hover:text-emerald-700">Sign out</button></div>
      {tab === "orders" ? <section><h2 className="mb-4 text-xl font-bold text-gray-900">Your orders</h2>{orderError ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Could not load orders: {orderError}</p> : !orders ? <p role="status" className="text-gray-600">Loading orders…</p> : orders.length === 0 ? <div className="rounded-2xl border border-stone-200 bg-white p-8"><p className="font-semibold text-gray-900">No orders yet</p><p className="mt-2 text-gray-600">When you place an order, it will appear here.</p><Link href="/products" className="mt-5 inline-block font-semibold text-emerald-700 hover:underline">Explore the shop →</Link></div> : <div className="space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-gray-900">{order.orderNumber}</h3><p className="mt-1 text-sm text-gray-500">{typeof order.createdAt === "string" && !Number.isNaN(Date.parse(order.createdAt)) ? new Date(order.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" }) : ""}</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold capitalize text-emerald-800">{order.orderStatus}</span></div><ul className="mt-4 space-y-1 text-sm text-gray-600">{order.items.map((item, index) => <li key={`${item.product}-${index}`}>{item.quantity} × {item.name}{item.variantName ? ` (${item.variantName})` : ""}</li>)}</ul><div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-stone-100 pt-4 text-sm"><span className="capitalize text-gray-600">Payment: {order.paymentStatus}</span><strong className="text-gray-900">KES {order.total.toLocaleString("en-KE")}</strong></div></article>)}</div>}</section> : <section className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-xl font-bold">Profile</h2><form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); void run(async () => { await api.patch("/api/auth/me", { name }); await refreshProfile(); setNotice("Your name has been updated."); }); }}>{label("Name", <input className={input} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required autoComplete="name" />)}<button disabled={busy} className={button}>Save name</button></form></div>
      <div className="rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-xl font-bold">Sign-in details</h2><p className="mt-2 text-sm text-gray-600">{passwordAccount ? "Enter your current password to change your email or password." : "Confirm your Google sign-in to change your email. Your Google password is managed by Google."}</p><div className="mt-5 space-y-4">{passwordAccount && label("Current password", <input className={input} type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />)}<form className="space-y-3" onSubmit={(e) => { e.preventDefault(); void run(async () => { await reauthenticate(); await verifyBeforeUpdateEmail(firebaseUser, newEmail.trim()); setCurrentPassword(""); setNotice("Check your new email for a verification link. Your sign-in email changes after you verify it."); }); }}>{label("New email address", <input className={input} type="email" autoComplete="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />)}<button disabled={busy || newEmail.trim().toLowerCase() === user.email.toLowerCase()} className={secondary}>Send verification email</button></form>{passwordAccount && <form className="space-y-3 border-t border-stone-100 pt-4" onSubmit={(e) => { e.preventDefault(); void run(async () => { await reauthenticate(); await updatePassword(firebaseUser, newPassword); setNewPassword(""); setCurrentPassword(""); setNotice("Your password has been updated."); }); }}>{label("New password", <input className={input} type="password" autoComplete="new-password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />)}<button disabled={busy} className={secondary}>Change password</button></form>}</div></div>{(notice || failure) && <p role={failure ? "alert" : "status"} className={`md:col-span-2 ${failure ? "text-red-700" : "text-emerald-700"}`}>{failure || notice}</p>}</section>}
    </>}
  </div></div>;
}
