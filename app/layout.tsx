import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "react-hot-toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.remsamhomestead.com";
const description =
  "RemSam Homestead — Faith, Family, Farming. Inspiring content on faith, organic recipes, agriculture, homeschooling, free study materials, and farm-fresh products in Kenya.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RemSam Homestead",
    template: "%s | RemSam Homestead",
  },
  description,
  openGraph: {
    type: "website",
    siteName: "RemSam Homestead",
    title: "RemSam Homestead",
    description,
    images: [{ url: "/assets/logo.png", width: 576, height: 434, alt: "RemSam Homestead logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RemSam Homestead",
    description,
    images: ["/assets/logo.png"],
  },
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
