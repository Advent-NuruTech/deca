"use client";

import { ChevronUp, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/chat-defaults";
import { useChatSettings } from "@/lib/use-chat-settings";

export default function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [open, setOpen] = useState(false);
  const { settings, error } = useChatSettings();
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {open && <section id="chat-options" aria-label="WhatsApp enquiry options" className="w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl bg-[#079326] p-5 text-slate-950 shadow-xl">
        <h2 className="font-bold">Chat with Deca Bookstore</h2>
        <p className="mt-1 text-sm">Choose a topic to start a WhatsApp conversation.</p>
        {!settings && <p role="status" className="mt-4 text-sm">{error ? "Chat is temporarily unavailable. Please use the contact page to get in touch." : "Loading chat options…"}</p>}
        {settings && <div className="mt-4 grid max-h-[50vh] gap-2 overflow-y-auto">
          {settings.categories.map((category) => <a key={category.id} href={whatsappUrl(category.phone, category.label)} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{category.label}</a>)}
          <a href={whatsappUrl(settings.directPhone)} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-900 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Send a direct message</a>
        </div>}
      </section>}
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="chat-options" aria-label={open ? "Close WhatsApp chat options" : "Open WhatsApp chat options"} className="grid h-12 w-12 place-items-center rounded-full bg-[#079326] text-white shadow-lg transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">{open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}</button>
      {showBackToTop && <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-[#008EFE] shadow-lg transition hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><ChevronUp className="h-5 w-5" aria-hidden="true" /></button>}
    </div>
  );
}
