"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CheckoutAuthGate({ children }: { children: ReactNode }) {
  const { firebaseUser, user, loading, refreshProfile, logout } = useAuth();
  if (loading) return <p role="status" className="py-20 text-center text-gray-500">Loading checkout?</p>;
  if (firebaseUser && user) return <>{children}</>;
  if (firebaseUser) return <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-6"><p role="alert">Your account profile could not be loaded.</p><div className="mt-4 flex gap-5"><button type="button" onClick={() => void refreshProfile().catch(() => toast.error("Could not load your profile."))} className="font-semibold text-emerald-700 underline">Try again</button><button type="button" onClick={() => void logout()} className="font-semibold text-emerald-700 underline">Sign out</button></div></div>;
  return <section className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><LockKeyhole aria-hidden="true" /></div>
    <h2 className="text-2xl font-bold text-gray-900">Sign in to complete checkout</h2>
    <p className="mt-2 text-gray-600">Your account keeps your order details together. You?ll return to checkout after signing in.</p>
    <Link href="/sign-in?returnTo=%2Fcheckout" className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Sign in</Link>
    <p className="mt-5 text-center text-sm text-gray-600">New to Gilead? <Link href="/sign-up?returnTo=%2Fcheckout" className="font-semibold text-emerald-700 underline underline-offset-4">Create an account</Link></p>
  </section>;
}
