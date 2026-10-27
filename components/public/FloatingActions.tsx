"use client";

import { useEffect, useState } from "react";
import { ChevronUp, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => { const onScroll = () => setShowBackToTop(window.scrollY > 500); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 sm:bottom-7 sm:right-7"><a href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("GILEAD enquiry")}`} aria-label="Email GILEAD" className="grid h-12 w-12 place-items-center rounded-full bg-sky-700 text-white shadow-lg transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"><Mail className="h-5 w-5" aria-hidden="true" /></a>{showBackToTop && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="grid h-11 w-11 place-items-center rounded-full border border-sky-200 bg-white text-sky-800 shadow-lg transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"><ChevronUp className="h-5 w-5" aria-hidden="true" /></button>}</div>;
}
