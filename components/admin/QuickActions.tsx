import Link from "next/link";
import { Plus, ShoppingCart, MessageCircle } from "lucide-react";

export default function QuickActions() {
  return (
<section className="mb-8 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
  <h2 className="mb-4 text-xl font-bold text-gray-900">
    Quick Actions
  </h2>

  <div className="grid grid-cols-3 gap-2 sm:gap-3">
    <Link
      href="/admin/products?action=new"
      className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-[#079326] px-1 py-3 text-center text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 hover:bg-[#008EFE] sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
    >
      <Plus size={18} className="shrink-0" />
      <span>Add Product</span>
    </Link>

    <Link
      href="/admin/orders?status=pending"
      className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-[#008EFE] px-1 py-3 text-center text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 hover:bg-[#079326] sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
    >
      <ShoppingCart size={18} className="shrink-0" />
      <span>Process Orders</span>
    </Link>

    <Link
      href="/admin/chat"
      className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg bg-[#079326] px-1 py-3 text-center text-xs font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 hover:bg-[#008EFE] sm:flex-row sm:gap-2 sm:px-4 sm:text-sm"
    >
      <MessageCircle size={18} className="shrink-0" />
      <span>Edit Chat</span>
    </Link>
  </div>
</section>
  );
}
