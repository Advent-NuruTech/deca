"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingCart, UserRound, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { siteConfig } from "@/lib/site-config";
import { decaAssets } from "@/lib/deca-assets";

const links = [
  { label: "Home", href: "/" },
  { label: "Catalogue", href: "/programmes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const productLinks = [
  { label: "Retail products", href: "/products?type=retail", description: "Order from one unit" },
  { label: "Wholesale products", href: "/products?type=wholesale", description: "Shop minimum-quantity offers" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { items } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const productMenuRef = useRef<HTMLDetailsElement>(null);
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
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const accountHref = user ? "/account" : "/sign-in";
  const accountLabel = authLoading ? "Account" : user ? "My account" : "Sign in";
  const linkClass = (href: string) => `rounded-lg px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] ${active(href) ? "bg-slate-100 text-[#079326]" : "text-slate-700 hover:bg-slate-100 hover:text-[#079326]"}`;
  const mobileNavigation = open ? createPortal(
    <div id="mobile-navigation" className="fixed inset-x-0 bottom-0 top-20 z-[60] xl:hidden">
      <button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close navigation menu" />
      <aside role="dialog" aria-modal="true" aria-label="Main navigation" className="relative h-full w-[min(88vw,22rem)] overflow-y-auto bg-white shadow-2xl">
        <div className="flex min-h-full flex-col px-4 py-5">
          <div className="mb-4 flex justify-end border-b border-slate-200 pb-4">
            <button ref={closeButtonRef} type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]" aria-label="Close navigation menu"><X size={22} /></button>
          </div>
          <div className="grid gap-1">{links.slice(0, 2).map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className={linkClass(link.href)}>{link.label}</Link>)}<div className="rounded-xl border border-slate-200 p-2"><p className="px-2 pb-1 pt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#008EFE]">Products</p>{productLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><span className="block font-semibold">{link.label}</span><span className="block text-xs text-slate-500">{link.description}</span></Link>)}</div>{links.slice(2).map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className={linkClass(link.href)}>{link.label}</Link>)}</div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
            <Link href={accountHref} onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 transition hover:border-[#008EFE] hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><UserRound size={19} aria-hidden="true" />{accountLabel}</Link>
            <Link href="/cart" onClick={() => setOpen(false)} className="relative flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 transition hover:border-[#008EFE] hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><ShoppingCart size={19} aria-hidden="true" />Cart{itemCount > 0 && <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#008EFE] px-1 text-xs font-bold text-white">{itemCount > 99 ? "99+" : itemCount}</span>}</Link>
          </div>
          <Link href="/programmes" onClick={() => setOpen(false)} className="mt-auto rounded-lg bg-[#079326] px-4 py-3.5 text-center text-base font-bold text-white transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">View catalogue</Link>
        </div>
      </aside>
    </div>,
    document.body,
  ) : null;

  if (pathname === "/products") return null;

  return <><header className={`sticky top-0 z-50 border-b transition ${scrolled ? "border-slate-200 bg-white/95 shadow-sm backdrop-blur" : "border-transparent bg-white"}`}><nav aria-label="Main navigation" className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]"><span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><img src={decaAssets.logo} alt="Deca Bookstore" className="h-14 w-14 object-contain" /></span><span className="leading-tight"><span className="block text-lg font-extrabold tracking-tight text-[#079326]">{siteConfig.shortName}</span><span className="block text-[11px] font-bold tracking-[0.1em] text-[#008EFE]">REVISION MATERIALS</span></span></Link><div className="hidden items-center gap-1 xl:flex">{links.slice(0, 2).map((link) => <Link key={link.label} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}<details ref={productMenuRef} className="group relative"><summary className={`flex cursor-pointer list-none items-center gap-1 rounded-lg px-4 py-2.5 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] [&::-webkit-details-marker]:hidden ${active("/products") ? "bg-slate-100 text-[#079326]" : "text-slate-700 hover:bg-slate-100 hover:text-[#079326]"}`}>Products <ChevronDown size={16} className="transition group-open:rotate-180" aria-hidden="true" /></summary><div className="absolute left-0 top-[calc(100%+0.5rem)] w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{productLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => productMenuRef.current?.removeAttribute("open")} className="block rounded-lg px-4 py-3 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#008EFE]"><span className="block font-semibold">{link.label}</span><span className="mt-0.5 block text-xs text-slate-500">{link.description}</span></Link>)}</div></details>{links.slice(2).map((link) => <Link key={link.label} href={link.href} className={linkClass(link.href)}>{link.label}</Link>)}</div><div className="hidden items-center gap-2 sm:flex"><Link href={accountHref} aria-label={accountLabel} title={accountLabel} className={`grid h-11 w-11 place-items-center rounded-lg border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] ${active("/account") || active("/sign-in") || active("/sign-up") ? "border-[#008EFE] bg-slate-100 text-[#079326]" : "border-slate-200 text-slate-700 hover:border-[#008EFE] hover:text-[#079326]"}`}><UserRound size={20} aria-hidden="true" /></Link><Link href="/cart" aria-label={`Cart with ${itemCount} items`} title="Cart" className={`relative grid h-11 w-11 place-items-center rounded-lg border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] ${active("/cart") ? "border-[#008EFE] bg-slate-100 text-[#079326]" : "border-slate-200 text-slate-700 hover:border-[#008EFE] hover:text-[#079326]"}`}><ShoppingCart size={20} aria-hidden="true" />{itemCount > 0 && <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#008EFE] px-1 text-[10px] font-bold text-white">{itemCount > 99 ? "99+" : itemCount}</span>}</Link><Link href="/programmes" className="hidden rounded-lg bg-[#079326] px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] lg:inline-flex">View catalogue</Link></div><button ref={menuButtonRef} type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="rounded-lg p-2.5 text-[#079326] hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] xl:hidden">{open ? <X size={24} /> : <Menu size={24} />}</button></nav></header>{mobileNavigation}</>;
}
