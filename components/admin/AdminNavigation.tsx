"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  HandHeart,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ShoppingCart,
  X,
  Youtube,
  Users,
  Settings,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import NotificationBell from "@/components/notifications/NotificationBell";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/articles", label: "Resources", icon: FileText },
  { href: "/admin/authors", label: "Authors", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/youtube", label: "YouTube", icon: Youtube },
  { href: "/admin/updates", label: "Updates", icon: Bell },
  { href: "/admin/mailing", label: "Mailing", icon: Mail },
  { href: "/admin/chat", label: "Chat", icon: MessageCircle },
  { href: "/admin/life-skills", label: "Life Skills", icon: HandHeart },
  { href: "/admin/invitations", label: "Invitations", icon: CalendarDays },
];

const sidebarPreferenceKey = "remsam-admin-sidebar-collapsed";

type AccountSection = "orders" | "settings";

export default function AdminNavigation({ children, account }: { children: ReactNode; account?: { section: AccountSection; onSectionChange: (section: AccountSection) => void } }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(sidebarPreferenceKey) === "true");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(sidebarPreferenceKey, String(next));
      return next;
    });
  }

  async function signOut() {
    await logout();
    router.replace(account ? "/sign-in" : "/admin/login");
  }

  const isAccount = !!account;
  const title = isAccount ? "RemSam Account" : "RemSam Admin";
  const subtitle = isAccount ? "Your personal workspace" : "Management workspace";
  const home = isAccount ? "/account" : "/admin/dashboard";
  const sidebar = (isMobile = false) => {
    const compact = collapsed && !isMobile;
    const navigationItem = (active: boolean) => active
      ? isMobile
        ? "border-l-4 border-[#008EFE] bg-slate-100 text-[#079326]"
        : "border-l-4 border-[#008EFE] bg-white text-[#079326] shadow-lg shadow-black/10"
      : isMobile
        ? "border-l-4 border-transparent text-slate-700 hover:bg-slate-100 hover:text-[#079326]"
        : "border-l-4 border-transparent text-white hover:bg-white/10";
    const navigationIcon = (active: boolean) => active
      ? "text-[#079326]"
      : isMobile
        ? "text-slate-500 group-hover:text-[#079326]"
        : "text-white";

    return (
      <div className="flex h-full flex-col">
        <div className={`flex h-20 items-center border-b ${isMobile ? "border-slate-200" : "border-white/10"} ${compact ? "justify-center px-3" : "gap-3 px-5"}`}>
          <Link href={home} className="flex min-w-0 items-center gap-3" aria-label={title}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <img src="/logo.png" alt="" className="h-9 w-9 rounded-xl object-contain" />
            </span>
            {!compact && (
              <span className="min-w-0">
                <span className={`block text-sm font-bold tracking-wide ${isMobile ? "text-slate-950" : "text-white"}`}>{title}</span>
                <span className={`mt-0.5 block text-xs ${isMobile ? "text-slate-500" : "text-white/75"}`}>{subtitle}</span>
              </span>
            )}
          </Link>
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} className="ml-auto rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]" aria-label="Close navigation">
              <X size={20} />
            </button>
          )}
        </div>

        <nav aria-label={isAccount ? "Account navigation" : "Admin navigation"} className={`flex-1 overflow-y-auto py-6 ${compact ? "px-3" : "px-4"}`}>
          {!compact && <p className={`mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${isMobile ? "text-slate-500" : "text-white/75"}`}>Workspace</p>}
          <div className="space-y-1.5">
            {isAccount ? ([{ id: "orders" as const, label: "Orders", icon: ShoppingCart }, { id: "settings" as const, label: "Settings", icon: Settings }].map(({ id, label, icon: Icon }) => {
              const active = account.section === id;
              return <button key={id} type="button" onClick={() => { account.onSectionChange(id); setMobileOpen(false); }} title={compact ? label : undefined} aria-current={active ? "page" : undefined} className={`group relative flex min-h-11 w-full items-center rounded-xl text-sm font-medium transition-all ${compact ? "justify-center px-2" : "gap-3 px-3.5"} ${navigationItem(active)}`}>
                <Icon size={20} className={`shrink-0 ${navigationIcon(active)}`} />
                {!compact && <span className="flex-1 text-left">{label}</span>}
                {!compact && active && <ChevronRight size={16} className="text-[#079326]" />}
              </button>;
            })) : links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  title={compact ? label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex min-h-11 items-center rounded-xl text-sm font-medium transition-all ${compact ? "justify-center px-2" : "gap-3 px-3.5"} ${navigationItem(active)}`}
                >
                  <Icon size={20} className={`shrink-0 ${navigationIcon(active)}`} />
                  {!compact && <span className="flex-1">{label}</span>}
                  {!compact && active && <ChevronRight size={16} className="text-[#079326]" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className={`border-t p-4 ${isMobile ? "border-slate-200" : "border-white/10"} ${compact ? "px-3" : ""}`}>
          <div className={`mb-2 flex items-center ${compact ? "justify-center" : "justify-between px-1"}`}>
            {!compact && <span className={`text-xs font-medium ${isMobile ? "text-slate-600" : "text-white/75"}`}>Notifications</span>}
            <NotificationBell dark={!isMobile} placement="above" />
          </div>
          <a href="/" target="_blank" rel="noreferrer" title={compact ? "View website" : undefined} className={`mb-2 flex min-h-10 items-center rounded-xl text-sm transition ${isMobile ? "text-slate-700 hover:bg-slate-100 hover:text-[#079326]" : "text-white hover:bg-white/10"} ${compact ? "justify-center px-2" : "gap-3 px-3"}`}>
            <ExternalLink size={18} />
            {!compact && <span>View website</span>}
          </a>
          <button onClick={signOut} title={compact ? "Sign out" : undefined} className={`flex min-h-10 w-full items-center rounded-xl text-sm transition ${isMobile ? "text-slate-700 hover:bg-slate-100 hover:text-[#079326]" : "text-white hover:bg-white/10"} ${compact ? "justify-center px-2" : "gap-3 px-3"}`}>
            <LogOut size={18} />
            {!compact && <span>Sign out</span>}
          </button>
          {!compact && (
            <div className={`mt-4 flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 ${isMobile ? "bg-slate-100" : "bg-black/10"}`}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-bold uppercase text-[#079326]">{(user?.name || user?.email || "A").slice(0, 1)}</span>
              <span className="min-w-0">
                <span className={`block truncate text-xs font-semibold ${isMobile ? "text-slate-900" : "text-white"}`}>{user?.name || (isAccount ? "Customer" : "Administrator")}</span>
                <span className={`block truncate text-[11px] ${isMobile ? "text-slate-500" : "text-white/75"}`}>{user?.email}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className={`sticky top-0 hidden h-screen shrink-0 bg-[#079326] shadow-xl transition-[width] duration-300 ease-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block ${collapsed ? "lg:w-[88px]" : "lg:w-72"}`}>
        {sidebar()}
        <button onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} className="absolute -right-4 top-[98px] grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-[#079326] shadow-md transition hover:scale-105 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#008EFE] focus:ring-offset-2">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />
          <aside role="dialog" aria-label={isAccount ? "Account navigation" : "Admin navigation"} className="relative h-full w-[min(88vw,320px)] bg-white shadow-2xl">
            {sidebar(true)}
          </aside>
        </div>
      )}

      <div className={`min-h-screen transition-[padding] duration-300 ease-out ${collapsed ? "lg:pl-[88px]" : "lg:pl-72"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
          <button onClick={() => setMobileOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[#008EFE] hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>
            <Menu size={21} />
          </button>
          <div className="ml-3 min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
          <div className="ml-auto"><NotificationBell /></div>
          <Link href={home} className="ml-2 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-[#079326]" aria-label={isAccount ? "Account" : "Dashboard"}>
            <LayoutDashboard size={18} />
          </Link>
        </header>

        <div className="hidden h-0 lg:block">
          <button onClick={toggleSidebar} className="sr-only focus:not-sr-only focus:fixed focus:left-24 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:shadow-lg">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />} Toggle sidebar
          </button>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
