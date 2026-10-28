"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  PackageCheck,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { api, ApiError } from "@/lib/api";
import { decaAssets } from "@/lib/deca-assets";
import { firebaseAuth } from "@/lib/firebase/client";
import { siteConfig } from "@/lib/site-config";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#008EFE] focus:ring-2 focus:ring-[#008EFE]";
const focusClass =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]";

function friendlyError(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  const messages: Record<string, string> = {
    "auth/invalid-credential": "The email or password is incorrect. Please try again.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/email-already-in-use": "An account already uses this email. Try signing in instead.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/operation-not-allowed": "Email and password sign-in is unavailable. Please contact us for help.",
    "auth/network-request-failed": "Check your internet connection and try again.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
  };
  return (
    messages[code] ||
    (error instanceof Error && !code
      ? error.message
      : "Something went wrong. Please try again.")
  );
}

export default function CustomerAuthPage({
  mode,
  returnTo,
}: {
  mode: "sign-in" | "sign-up";
  returnTo: string;
}) {
  const creating = mode === "sign-up";
  const router = useRouter();
  const {
    firebaseUser,
    user,
    loading,
    error,
    signIn,
    register,
    refreshProfile,
    logout,
  } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [notice, setNotice] = useState("");
  const otherHref = `${creating ? "/sign-in" : "/sign-up"}?returnTo=${encodeURIComponent(returnTo)}`;

  useEffect(() => {
    if (!loading && user && !busy) router.replace(returnTo);
  }, [loading, user, busy, returnTo, router]);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setFailure("");
    setNotice("");
    try {
      await action();
    } catch (err) {
      setFailure(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void run(async () => {
      if (creating) {
        if (!name.trim()) throw new Error("Enter your name to create an account.");
        await register(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    });
  }

  async function recoverProfile() {
    try {
      await refreshProfile();
    } catch (err) {
      if (!(err instanceof ApiError) || err.status !== 401 || !firebaseUser) throw err;
      await api.post("/api/auth/register", {
        name:
          name.trim() ||
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Customer",
      });
      await refreshProfile();
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-[#079326] text-white lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <Link
          href="/"
          className={`relative z-10 flex w-fit items-center gap-3 ${focusClass}`}
        >
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={decaAssets.logo}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
          </span>
          <span className="text-lg font-extrabold tracking-tight">{siteConfig.name}</span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Your bookstore account
          </p>
          <h2 className="text-4xl font-black leading-tight tracking-tight xl:text-5xl">
            Order with confidence. Track every step.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/85">
            Keep your delivery details, order history, and latest order status together in one secure place.
          </p>
          <div className="mt-10 grid gap-4 text-sm font-semibold text-white sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
              Track order progress
            </span>
            <span className="flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
              Faster checkout
            </span>
          </div>
        </div>

        <p className="relative z-10 flex items-center gap-2 text-sm text-white/80">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Email and password only
        </p>
      </aside>

      <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className={`flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#079326] ${focusClass}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link
            href="/"
            aria-label={`${siteConfig.name} home`}
            className={`lg:hidden ${focusClass}`}
          >
            <Image
              src={decaAssets.logo}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-contain"
            />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#079326]">
            {siteConfig.name}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {creating ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-3 leading-relaxed text-slate-600">
            {creating
              ? "Create an account with your email and password to place and track orders."
              : "Continue with your email and password to view your orders."}
          </p>

          {loading || (user && !busy) ? (
            <p role="status" className="mt-8 text-slate-600">
              Loading your account…
            </p>
          ) : firebaseUser && !busy ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p role="alert" className="text-sm text-amber-950">
                {failure || error || "Your account profile could not be loaded. Please try again."}
              </p>
              <div className="mt-4 flex gap-5 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => void run(recoverProfile)}
                  className={`text-[#079326] underline ${focusClass}`}
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => void run(logout)}
                  className={`text-[#079326] underline ${focusClass}`}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={submit} className="mt-8 space-y-4">
                {creating && (
                  <label className="block text-sm font-semibold text-slate-700">
                    Full name
                    <input
                      className={inputClass}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      maxLength={120}
                      required
                      placeholder="Your name"
                    />
                  </label>
                )}
                <label className="block text-sm font-semibold text-slate-700">
                  Email address
                  <input
                    className={inputClass}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    maxLength={254}
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Password
                  <span className="relative block">
                    <input
                      className={`${inputClass} pr-12`}
                      type={visible ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete={creating ? "new-password" : "current-password"}
                      minLength={creating ? 6 : undefined}
                      required
                      placeholder={creating ? "At least 6 characters" : "Your password"}
                    />
                    <button
                      type="button"
                      onClick={() => setVisible((current) => !current)}
                      aria-label={visible ? "Hide password" : "Show password"}
                      aria-pressed={visible}
                      className={`absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center text-slate-500 transition hover:text-[#079326] ${focusClass}`}
                    >
                      {visible ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </span>
                </label>
                {!creating && (
                  <div className="text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void run(async () => {
                          if (!email.trim()) {
                            throw new Error("Enter your email address first, then select Forgot password.");
                          }
                          await sendPasswordResetEmail(firebaseAuth(), email.trim());
                          setNotice("If an account exists for that address, a password reset email has been sent.");
                        })
                      }
                      className={`text-sm font-semibold text-[#079326] hover:underline ${focusClass}`}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                {failure && (
                  <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">
                    {failure}
                  </p>
                )}
                {notice && (
                  <p role="status" className="rounded-xl bg-slate-100 p-3 text-sm text-slate-800">
                    {notice}
                  </p>
                )}
                <button
                  disabled={busy}
                  className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#079326] px-5 font-bold text-white transition hover:bg-[#008EFE] disabled:cursor-wait disabled:opacity-60 ${focusClass}`}
                >
                  {busy ? "Please wait…" : creating ? "Create account" : "Continue with email"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-600">
                {creating ? "Already have an account? " : "New to Deca? "}
                <Link
                  href={otherHref}
                  className={`font-semibold text-[#079326] underline underline-offset-4 ${focusClass}`}
                >
                  {creating ? "Sign in" : "Create an account"}
                </Link>
              </p>
            </>
          )}

          <p className="mt-8 flex gap-2 text-xs leading-relaxed text-slate-500">
            <LockKeyhole aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              By continuing, you agree to our{" "}
              <Link href="/terms-of-service" className="underline hover:text-[#079326]">
                Terms of Service
              </Link>{" "}
              and acknowledge our{" "}
              <Link href="/privacy-policy" className="underline hover:text-[#079326]">
                Privacy Policy
              </Link>
              .
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
