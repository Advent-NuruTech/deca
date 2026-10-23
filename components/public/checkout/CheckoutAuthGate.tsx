"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CheckoutAuthGate({ children }: { children: ReactNode }) {
  const { firebaseUser, user, loading, signIn, signInWithGoogle, register, refreshProfile, logout } = useAuth();
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return <div className="py-20 text-center text-gray-500">Loading checkout...</div>;
  if (firebaseUser && user) return <>{children}</>;
  if (firebaseUser && !user) return <div className="rounded-xl border border-gray-200 bg-white p-6"><p role="alert">Your account profile could not be loaded.</p><button type="button" onClick={() => void refreshProfile().catch(() => toast.error("Could not load your profile."))} className="mt-4 mr-4 font-semibold text-emerald-700">Try again</button><button type="button" onClick={() => void logout()} className="mt-4 font-semibold text-emerald-700">Sign out</button></div>;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (creating) await register(name, email, password);
      else await signIn(email, password);
      toast.success(creating ? "Account created" : "Signed in");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <LockKeyhole className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Sign in to complete checkout</h2>
        <p className="text-gray-500 mt-2 mb-6">Your account keeps order details private and lets you reopen this confirmation.</p>
        <form onSubmit={submit} className="space-y-4">
          {creating && (
            <label className="block text-sm font-medium text-gray-700">
              Full Name
              <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </label>
          )}
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </label>
          <button disabled={submitting} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-50">
            {submitting ? "Please wait..." : creating ? "Create Account & Continue" : "Sign In & Continue"}
          </button>
        </form>
        <button type="button" disabled={submitting} onClick={async () => { setSubmitting(true); try { await signInWithGoogle(); } catch { toast.error("Google sign-in could not be completed. Please try again."); } finally { setSubmitting(false); } }} className="mt-4 w-full rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50">Continue with Google</button>
        <button type="button" onClick={() => setCreating((value) => !value)} className="w-full mt-4 text-sm text-emerald-700 hover:text-emerald-800">
          {creating ? "Already have an account? Sign in" : "New customer? Create an account"}
        </button>
      </div>
    </motion.div>
  );
}
