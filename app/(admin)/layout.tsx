import type { ReactNode } from "react";

/** Admin pages intentionally have no public Header, Footer or floating actions. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
