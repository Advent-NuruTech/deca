"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Leaf, Mail, Share2 } from "lucide-react";

type NewsletterSignupProps = { compact?: boolean };

export default function NewsletterSignup({ compact = false }: NewsletterSignupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "existing" | "error">("idle");
  const [message, setMessage] = useState("");
  const [shareMessage, setShareMessage] = useState("");

  async function subscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/mailing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const result = await response.json() as { status?: string; error?: string; welcomeEmailError?: string };
      if (!response.ok) throw new Error(result.error || "Could not save your subscription.");
      const existing = result.status === "already-subscribed";
      setStatus(existing ? "existing" : "success");
      setMessage(existing
        ? "You’re already part of the Remsam community."
        : result.welcomeEmailError || "Welcome to Remsam Homestead—please check your inbox.");
      if (!existing) { setEmail(""); setName(""); }
    } catch (reason) {
      setStatus("error");
      setMessage(reason instanceof Error ? reason.message : "Could not save your subscription.");
    }
  }

  async function shareNewsletter() {
    const url = `${window.location.origin}/#newsletter`;
    const shareData = {
      title: "Remsam Homestead Newsletter",
      text: "Subscribe to the Remsam Homestead Newsletter for practical farm notes, encouragement, resources, and seasonal updates.",
      url,
    };

    setShareMessage("");
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Newsletter shared.");
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Newsletter link copied.");
      }
    } catch (reason) {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setShareMessage("Could not share the link. Please try again.");
    }
  }

  if (compact) {
    return (
      <form onSubmit={subscribe} className="mt-4" aria-label="Newsletter subscription">
        <label htmlFor="footer-newsletter-email" className="mb-2 block text-sm text-gray-600">Stay encouraged</label>
        <div className="flex">
          <input id="footer-newsletter-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email" className="min-w-0 flex-1 rounded-l-lg border border-brand-border bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20" />
          <button disabled={status === "loading"} className="rounded-r-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60">
            {status === "loading" ? "Joining…" : "Subscribe"}
          </button>
        </div>
        <p className={`mt-2 text-xs ${status === "error" ? "text-red-600" : status === "success" || status === "existing" ? "text-brand-dark" : "text-gray-400"}`} aria-live="polite">
          {message || "No spam—just stories, resources, and homestead news."}
        </p>
      </form>
    );
  }

  return (
    <section id="newsletter" className="scroll-mt-20 bg-brand-canvas px-4 py-16 md:py-24" aria-labelledby="newsletter-heading">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-deep px-6 py-12 text-white shadow-2xl md:px-12 md:py-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-brand-accent/20 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-emerald-100"><Leaf size={14} /> Newsletter</span>
            <h2 id="newsletter-heading" className="mt-5 max-w-xl text-3xl font-bold leading-tight md:text-5xl">The Remsam Homestead Newsletter</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/80">Join Remsam Homestead for practical farm notes, encouraging reflections, new resources, and seasonal updates from Kenya.</p>
            <button type="button" onClick={() => void shareNewsletter()} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-semibold text-white transition hover:border-white/40 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-deep"><Share2 size={18} aria-hidden="true" /> Share newsletter</button>
            <p className="mt-2 min-h-5 text-sm text-emerald-100" aria-live="polite">{shareMessage}</p>
          </div>
          <form onSubmit={subscribe} className="rounded-2xl border border-white/15 bg-white p-5 text-brand-ink shadow-xl md:p-7" aria-label="Newsletter subscription">
            <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-brand-soft p-2.5 text-brand-dark"><Mail size={22} /></span><div><p className="font-bold">Join the newsletter</p><p className="text-sm text-brand-muted">Free, useful, and easy to leave anytime.</p></div></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">First name <span className="font-normal text-gray-400">(optional)</span><input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" maxLength={120} placeholder="Your name" className="input-field mt-1.5" /></label>
              <label className="text-sm font-semibold text-gray-700">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" maxLength={254} placeholder="you@example.com" className="input-field mt-1.5" /></label>
            </div>
            <button disabled={status === "loading"} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 font-bold text-white transition hover:bg-brand-dark disabled:cursor-wait disabled:opacity-60">
              {status === "loading" ? "Joining the newsletter…" : <>Subscribe to newsletter <ArrowRight size={18} /></>}
            </button>
            <p className={`mt-3 flex min-h-5 items-center gap-2 text-sm ${status === "error" ? "text-red-600" : status === "success" || status === "existing" ? "text-brand-dark" : "text-brand-muted"}`} aria-live="polite">
              {(status === "success" || status === "existing") && <CheckCircle2 size={16} />}{message || "We respect your inbox. Unsubscribe with one click."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
