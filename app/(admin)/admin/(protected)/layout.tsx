import { AdminGuard } from "@/components/auth/AdminGuard";
import AdminNavigation from "@/components/admin/AdminNavigation";
import type { ReactNode } from "react";

export default function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        {children}
      </div>
    </AdminGuard>
  );
}
