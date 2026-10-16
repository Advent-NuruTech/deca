import type { ReactNode } from "react";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import FloatingActions from "@/components/public/FloatingActions";
import ScrollToTop from "@/components/public/ScrollToTop";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
