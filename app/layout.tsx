import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "RemSam Homestead",
  description:
    "RemSam Homestead – Faith, Family, Farming. Inspiring content on faith, organic recipes, agriculture, homeschooling, free study materials, and farm-fresh products in Kenya.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
