import type { Metadata } from "next";
import NewsletterSignup from "@/components/public/newsletter-signup";

export const metadata: Metadata = {
  title: "Newsletter | RemSam Homestead",
  description:
    "Get faith, family, and farming updates from RemSam Homestead delivered to your inbox.",
  openGraph: {
    title: "Newsletter | RemSam Homestead",
    description:
      "Get faith, family, and farming updates from RemSam Homestead delivered to your inbox.",
    url: "/newsletter",
    type: "website",
  },
};

export default function NewsletterPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          RemSam Homestead
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Newsletter
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-gray-600">
          Stay connected with thoughtful updates, new studies, and news from our
          online fellowship.
        </p>
      </div>
      <NewsletterSignup />
    </div>
  );
}
