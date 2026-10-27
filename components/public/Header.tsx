"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const links = [{ label: "Home", href: "/" }, { label: "Programmes", href: "/programmes" }, { label: "Invite GILEAD", href: "/invite-gilead" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      menuButtonRef.current?.focus();
    };
  }, [open]);
  const active = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
  const linkClass = (href: string) => `rounded-lg px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] ${active(href) ? "bg-slate-100 text-[#079326]" : "text-slate-700 hover:bg-slate-100 hover:text-[#079326]"}`;
  const mobileNavigation = open ? createPortal(
    <div id="mobile-navigation" className="fixed inset-x-0 bottom-0 top-20 z-[60] lg:hidden">
      <button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close navigation menu" />
      <aside role="dialog" aria-modal="true" aria-label="Main navigation" className="relative h-full w-[min(88vw,22rem)] overflow-y-auto bg-white shadow-2xl">
        <div className="flex min-h-full flex-col px-4 py-5">
          <div className="mb-4 flex justify-end border-b border-slate-200 pb-4">
            <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]" aria-label="Close navigation menu"><X size={22} /></button>
          </div>
          <div className="grid gap-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={linkClass(link.href)}>{link.label}</Link>)}</div>
          <Link href="/invite-gilead" onClick={() => setOpen(false)} className="mt-auto rounded-lg bg-[#079326] px-4 py-3.5 text-center text-base font-bold text-white transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">Book a programme</Link>
        </div>
      </aside>
    </div>,
    document.body,
  ) : null;

  return <><header className={`sticky top-0 z-50 border-b transition ${scrolled ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur" : "border-transparent bg-white"}`}><nav aria-label="Main navigation" className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]"><span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src="/assets/logo.jpeg" alt="Gilead Medicare" className="h-14 w-14 object-cover" /></span><span className="leading-tight"><span className="block text-lg font-extrabold tracking-tight text-[#079326]">{siteConfig.shortName}</span><span className="block text-[11px] font-bold tracking-[0.16em] text-[#008EFE]">EDENRISE WELLNESS</span></span></Link><div className="hidden items-center gap-2 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}</div><Link href="/invite-gilead" className="hidden rounded-lg bg-[#079326] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] sm:inline-flex">Book a programme</Link><button ref={menuButtonRef} type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="rounded-lg p-2.5 text-[#079326] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] lg:hidden">{open ? <X size={24} /> : <Menu size={24} />}</button></nav></header>{mobileNavigation}</>;
}
