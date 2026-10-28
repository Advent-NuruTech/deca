"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CheckoutAuthGate({ children }: { children: ReactNode }) {
  const { firebaseUser, user, loading, refreshProfile, logout } = useAuth();
  if (loading) return <p role="status" className="py-20 text-center text-slate-600">Loading your secure checkout…</p>;
  if (firebaseUser && user) return <>{children}</>;
  if (firebaseUser) return <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p role="alert" className="font-medium text-slate-950">Your account profile could not be loaded.</p><div className="mt-4 flex gap-5"><button type="button" onClick={() => void refreshProfile().catch(() => toast.error("Could not load your profile."))} className="font-semibold text-slate-950 decoration-[#008EFE] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]">Try again</button><button type="button" onClick={() => void logout()} className="font-semibold text-slate-950 decoration-[#008EFE] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]">Sign out</button></div></div>;
  return <section className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="bg-[#008EFE] px-6 py-5 text-slate-950 sm:px-8"><LockKeyhole aria-hidden="true" className="h-6 w-6" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.16em]">Deca account</p><h2 className="mt-1 text-2xl font-black">Sign in to continue</h2></div>
    <div className="p-6 sm:p-8"><p className="text-slate-600">Your account keeps order and delivery details together. You’ll return here after signing in.</p><Link href="/sign-in?returnTo=%2Fcheckout" className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-[#079326] px-5 font-bold text-white transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">Continue with email</Link><p className="mt-5 text-center text-sm text-slate-600">New to Deca? <Link href="/sign-up?returnTo=%2Fcheckout" className="font-semibold text-slate-950 decoration-[#008EFE] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]">Create an account</Link></p></div>
  </section>;
}
