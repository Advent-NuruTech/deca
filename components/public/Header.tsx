"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HeartPulse } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const links = [{ label: "Home", href: "/" }, { label: "Programmes", href: "/programmes" }, { label: "Invite GILEAD", href: "/invite-gilead" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 12); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => href === "/" ? pathname === href : pathname.startsWith(href);
  const linkClass = (href: string) => `rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${active(href) ? "bg-sky-100 text-sky-800" : "text-slate-700 hover:bg-sky-50 hover:text-sky-800"}`;
  return <header className={`sticky top-0 z-50 border-b transition ${scrolled ? "border-sky-100 bg-white/95 shadow-sm backdrop-blur" : "border-transparent bg-white"}`}><nav aria-label="Main navigation" className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-700 text-white shadow-sm"><HeartPulse className="h-6 w-6" aria-hidden="true" /></span><span className="leading-tight"><span className="block text-base font-extrabold tracking-tight text-sky-950">{siteConfig.shortName}</span><span className="block text-[10px] font-bold tracking-[0.16em] text-sky-700">EDENRISE WELLNESS</span></span></Link><div className="hidden items-center gap-1 lg:flex">{links.map((link) => <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}</div><Link href="/invite-gilead" className="hidden rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:inline-flex">Book a programme</Link><button type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="rounded-lg p-2 text-sky-950 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 lg:hidden">{open ? <X /> : <Menu />}</button></nav>{open && <div id="mobile-navigation" className="border-t border-sky-100 bg-white px-4 py-4 shadow-lg lg:hidden"><div className="mx-auto grid max-w-7xl gap-1">{links.map((link) => <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}<Link href="/invite-gilead" className="mt-2 rounded-lg bg-sky-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-sky-800">Book a programme</Link></div></div>}</header>;
}
