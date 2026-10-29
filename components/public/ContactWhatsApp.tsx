"use client";

import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/chat-defaults";
import { useChatSettings } from "@/lib/use-chat-settings";

export default function ContactWhatsApp() {
  const { settings, error } = useChatSettings();
  if (!settings) return <div role="status" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h3 className="font-bold text-slate-950">WhatsApp</h3><p className="mt-2 text-sm text-slate-600">{error ? "Temporarily unavailable. Please call or email us." : "Loading contact details…"}</p></div>;
  const { directPhone } = settings;
  return <a href={whatsappUrl(directPhone)} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">
    <MessageCircle className="h-7 w-7 text-[#079326]" aria-hidden="true" />
    <h3 className="mt-4 font-bold text-slate-950">WhatsApp</h3>
    <p className="mt-2 font-medium text-[#079326]">+{directPhone}</p>
  </a>;
}
