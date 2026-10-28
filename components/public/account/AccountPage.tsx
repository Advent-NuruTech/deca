"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CircleCheck,
  Clock3,
  PackageSearch,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import AdminNavigation from "@/components/admin/AdminNavigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";
import type { PublicOrder } from "@/lib/types";

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-[#008EFE] focus:ring-2 focus:ring-[#008EFE]";
const button =
  "rounded-xl bg-[#079326] px-5 py-3 font-bold text-white transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:cursor-not-allowed disabled:opacity-50";
const secondary =
  "rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-[#008EFE] hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:cursor-not-allowed disabled:opacity-50";

function friendly(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  const messages: Record<string, string> = {
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/email-already-in-use": "An account already uses this email address.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/requires-recent-login": "For security, please sign in again and retry.",
    "auth/operation-not-allowed": "Email and password sign-in is unavailable. Please contact support.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
  };
  return (
    messages[code] ||
    (error instanceof Error && !code
      ? error.message
      : "Something went wrong. Please try again.")
  );
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "";
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return "";
  return new Date(timestamp).toLocaleDateString("en-KE", { dateStyle: "medium" });
}

function OrderTracker({ order, stages }: { order: PublicOrder; stages: string[] }) {
  const currentIndex = stages.indexOf(order.orderStatus);
  const cancelled = order.orderStatus.toLowerCase().includes("cancel");

  return (
    <div className="mt-5" aria-label={`Order status: ${order.orderStatus}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Order progress
        </p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-800">
          {order.orderStatus}
        </span>
      </div>
      <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {stages.map((stage, index) => {
          const current = stage === order.orderStatus;
          const complete = !cancelled && currentIndex >= 0 && index < currentIndex;
          return (
            <li
              key={stage}
              aria-current={current ? "step" : undefined}
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${
                current
                  ? "border-[#008EFE] bg-[#008EFE] text-white"
                  : complete
                    ? "border-[#079326] bg-white text-[#079326]"
                    : "border-slate-200 bg-slate-50 text-slate-500"
              }`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                  current
                    ? "border-white bg-white text-[#008EFE]"
                    : complete
                      ? "border-[#079326] bg-[#079326] text-white"
                      : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {complete ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
              </span>
              <span className="truncate">{stage}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
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
  const [reloadKey, setReloadKey] = useState(0);
  const [tab, setTab] = useState<"orders" | "settings">("orders");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("section") === "settings") {
      setTab("settings");
    }
  }, []);

  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/sign-in?returnTo=%2Faccount");
  }, [loading, firebaseUser, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setNewEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setOrders(null);
      return;
    }
    let active = true;
    setOrders(null);
    setOrderError("");

    const refresh = () => {
      api
        .get<{ statuses: string[] }>("/api/order-statuses")
        .then((result) => {
          if (active) setStages(result.statuses);
        })
        .catch(() => {
          if (active) setStages([]);
        });
      api
        .get<{ orders: PublicOrder[] }>("/api/account/orders")
        .then((result) => {
          if (active) {
            setOrders(result.orders);
            setOrderError("");
          }
        })
        .catch((err) => {
          if (active) {
            setOrders([]);
            setOrderError(friendly(err));
          }
        });
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user?.uid, reloadKey]);

  async function run(action: () => Promise<void>) {
    setFailure("");
    setNotice("");
    setBusy(true);
    try {
      await action();
    } catch (err) {
      setFailure(friendly(err));
    } finally {
      setBusy(false);
    }
  }

  async function reauthenticate() {
    if (!firebaseUser?.email) throw new Error("Please sign in again.");
    if (!currentPassword) throw new Error("Enter your current password to continue.");
    await reauthenticateWithCredential(
      firebaseUser,
      EmailAuthProvider.credential(firebaseUser.email, currentPassword),
    );
  }

  const label = (title: string, field: React.ReactNode) => (
    <label className="block text-sm font-semibold text-slate-700">
      {title}
      {field}
    </label>
  );

  return (
    <AdminNavigation
      account={{
        section: tab,
        onSectionChange: (section) => {
          setTab(section);
          setFailure("");
          setNotice("");
        },
      }}
    >
      <main className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#079326]">
              {siteConfig.name}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {user ? `Welcome, ${user.name.split(" ")[0]}` : "Your account"}
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your details and follow every order from placement to delivery.
            </p>
          </div>

          {loading ? (
            <p role="status" className="text-slate-600">
              Loading your account…
            </p>
          ) : !firebaseUser ? (
            <p role="status" className="text-slate-600">
              Taking you to sign in…
            </p>
          ) : !user ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p role="alert" className="text-red-700">
                {error || "Your profile could not be loaded."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className={secondary}
                  onClick={() => void run(async () => void (await refreshProfile()))}
                >
                  Try again
                </button>
                <button className={secondary} onClick={() => void logout()}>
                  Sign out
                </button>
              </div>
              {failure && (
                <p role="alert" className="mt-3 text-red-700">
                  {failure}
                </p>
              )}
            </div>
          ) : tab === "orders" ? (
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Your orders</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Statuses refresh whenever you return to this page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className={`${secondary} flex items-center gap-2 py-2.5`}
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Refresh
                </button>
              </div>

              {orderError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                  <p role="alert">Could not load orders: {orderError}</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((key) => key + 1)}
                    className="mt-3 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              ) : !orders ? (
                <p role="status" className="text-slate-600">
                  Loading orders…
                </p>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <ShoppingBag className="mx-auto h-10 w-10 text-[#079326]" aria-hidden="true" />
                  <p className="mt-4 font-bold text-slate-950">No orders yet</p>
                  <p className="mt-2 text-slate-600">
                    When you place an order, its progress will appear here.
                  </p>
                  <Link
                    href="/products"
                    className={`${button} mt-5 inline-flex items-center gap-2`}
                  >
                    <PackageSearch className="h-4 w-4" aria-hidden="true" />
                    Browse books
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            Order number
                          </p>
                          <h3 className="mt-1 text-lg font-black text-slate-950">
                            {order.orderNumber}
                          </h3>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock3 className="h-4 w-4" aria-hidden="true" />
                            Placed {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#079326]">
                          <CircleCheck className="h-5 w-5" aria-hidden="true" />
                          Saved to your account
                        </div>
                      </div>

                      <OrderTracker order={order} stages={stages} />

                      <ul className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 text-sm text-slate-700">
                        {order.items.map((item, index) => (
                          <li key={`${item.product}-${index}`}>
                            {item.quantity} × {item.name}
                            {item.variantName ? ` (${item.variantName})` : ""}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                        <span className="text-slate-600">
                          {order.deliveryFeePending
                            ? "Delivery fee to be confirmed"
                            : `Payment: ${order.paymentStatus}`}
                        </span>
                        <strong className="text-slate-950">
                          {order.deliveryFeePending ? "Products: " : ""}KES{" "}
                          {order.total.toLocaleString("en-KE")}
                        </strong>
                        <Link
                          href={`/order-confirmation/${encodeURIComponent(order.orderNumber)}`}
                          className="font-bold text-[#079326] underline decoration-[#008EFE] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"
                        >
                          View full details
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Profile</h2>
                <form
                  className="mt-5 space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await api.patch("/api/auth/me", { name });
                      await refreshProfile();
                      setNotice("Your name has been updated.");
                    });
                  }}
                >
                  {label(
                    "Name",
                    <input
                      className={input}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={120}
                      required
                      autoComplete="name"
                    />,
                  )}
                  <button disabled={busy} className={button}>
                    Save name
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">Email and password</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter your current password before changing either sign-in detail.
                </p>
                <div className="mt-5 space-y-4">
                  {label(
                    "Current password",
                    <input
                      className={input}
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                    />,
                  )}
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        await reauthenticate();
                        await verifyBeforeUpdateEmail(firebaseUser, newEmail.trim());
                        setCurrentPassword("");
                        setNotice("Check your new email for a verification link. Your sign-in email changes after you verify it.");
                      });
                    }}
                  >
                    {label(
                      "New email address",
                      <input
                        className={input}
                        type="email"
                        autoComplete="email"
                        maxLength={254}
                        value={newEmail}
                        onChange={(event) => setNewEmail(event.target.value)}
                        required
                      />,
                    )}
                    <button
                      disabled={busy || newEmail.trim().toLowerCase() === user.email.toLowerCase()}
                      className={secondary}
                    >
                      Send verification email
                    </button>
                  </form>
                  <form
                    className="space-y-3 border-t border-slate-100 pt-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void run(async () => {
                        await reauthenticate();
                        await updatePassword(firebaseUser, newPassword);
                        setNewPassword("");
                        setCurrentPassword("");
                        setNotice("Your password has been updated.");
                      });
                    }}
                  >
                    {label(
                      "New password",
                      <input
                        className={input}
                        type="password"
                        autoComplete="new-password"
                        minLength={6}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                      />,
                    )}
                    <button disabled={busy} className={secondary}>
                      Change password
                    </button>
                  </form>
                </div>
              </div>

              {(notice || failure) && (
                <p
                  role={failure ? "alert" : "status"}
                  className={`rounded-xl p-4 md:col-span-2 ${
                    failure ? "bg-red-50 text-red-800" : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {failure || notice}
                </p>
              )}
            </section>
          )}
        </div>
      </main>
    </AdminNavigation>
  );
}
