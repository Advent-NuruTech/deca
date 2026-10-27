"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import PageHero from "@/components/public/PageHero";
import { api } from "@/lib/api";

const DonatePage = () => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    setLoading(true);
    try {
      await api.post("/api/donations", { amount });
      toast.success("Thank you! Your donation request has been recorded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to process your donation");
    } finally {
      setLoading(false);
    }
  };

  return <main className="bg-slate-50"><PageHero eyebrow="Support GILEAD" title="Help us serve, teach and encourage." description="Your gift helps us share faith, provide study materials and support our community through practical education and care." primaryAction={{ href: "#donation-form", label: "Make a gift" }} secondaryAction={{ href: "/programmes", label: "See our work" }} aside={<><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Your support matters</p><h2 className="mt-3 text-2xl font-bold text-slate-950">A gift can extend practical care.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Choose an amount below to send a donation request securely to the GILEAD team.</p></>} /><div id="donation-form" className="mx-auto max-w-md scroll-mt-6 px-4 py-16"><section className="bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8" aria-labelledby="donation-heading"><h2 id="donation-heading" className="text-2xl font-bold text-slate-950">Make a donation</h2><p className="mt-2 text-sm leading-6 text-slate-600">Enter the amount you would like to give. We will record your request and guide the next step.</p><label className="mt-6 block"><span className="text-sm font-semibold text-slate-700">Donation amount (USD)</span><input type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-2 block w-full rounded-xl border border-slate-300 p-3 text-slate-950 focus:border-[#008EFE] focus:outline-none focus:ring-2 focus:ring-[#008EFE]" min="1" /></label><button onClick={handleDonate} disabled={loading || !Number.isFinite(amount) || amount < 1} className="mt-5 w-full rounded-xl bg-[#079326] py-3 font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Processing…" : "Donate now"}</button></section></div></main>;
};

export default DonatePage;
