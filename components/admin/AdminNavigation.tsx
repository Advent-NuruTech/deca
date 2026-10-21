"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, LayoutDashboard, LogOut, Mail, MessageCircle, Package, ShoppingCart, Youtube } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/articles", label: "Resources", icon: FileText },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/youtube", label: "YouTube", icon: Youtube },
  { href: "/admin/mailing", label: "Mailing", icon: Mail },
  { href: "/admin/chat", label: "Chat", icon: MessageCircle },
];

export default function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function signOut() {
    await logout();
    router.replace("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/admin/dashboard" className="mr-auto flex items-center gap-3">
          <img src="/logo.png" alt="RemSam Homestead" className="h-10 w-10 rounded-full object-contain" />
          <div>
            <p className="font-bold text-gray-900">RemSam Admin Panel</p>
            <p className="text-xs text-gray-500">{user?.name || user?.email}</p>
          </div>
        </Link>
        <nav aria-label="Admin navigation" className="order-3 flex w-full gap-1 overflow-x-auto md:order-2 md:w-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-emerald-100 text-emerald-800" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                <Icon size={17} />{label}
              </Link>
            );
          })}
        </nav>
        <button onClick={signOut} className="order-2 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:order-3">
          <LogOut size={17} /> Sign out
        </button>
      </div>
    </header>
  );
}
