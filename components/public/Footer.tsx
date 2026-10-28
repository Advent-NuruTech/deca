import { BookOpenCheck, Mail, Truck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { href: "/programmes", label: "2027 catalogue" },
  { href: "/contact", label: "Retail & wholesale orders" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-[#079326] text-white"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4"><div className="lg:col-span-2"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#008EFE] text-white"><BookOpenCheck aria-hidden="true" /></span><div><p className="font-extrabold">{siteConfig.name}</p><p className="text-sm text-white/80">Revision materials for learners</p></div></div><p className="mt-5 max-w-xl text-sm leading-6 text-white/85">We supply revision materials for learners, including KJSEA solving-problem books for Grades 7, 8 and 9. Retail and wholesale orders are welcome.</p></div><div><h2 className="text-sm font-bold uppercase tracking-wider text-white">Explore</h2><ul className="mt-4 space-y-2 text-sm">{footerLinks.map((link) => <li key={link.href}><a href={link.href} className="transition hover:text-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{link.label}</a></li>)}</ul></div><div><h2 className="text-sm font-bold uppercase tracking-wider text-white">Connect</h2><a href={`mailto:${siteConfig.email}`} className="mt-4 flex items-start gap-2 text-sm transition hover:text-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{siteConfig.email}</a><p className="mt-4 flex gap-2 text-xs leading-5 text-white/80"><Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Free delivery is available.</p></div></div><div className="mt-10 flex flex-col gap-2 border-t border-white/25 pt-6 text-xs text-white/80 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p><p>Powered by Advent Nurutech</p></div></div></footer>;
}
