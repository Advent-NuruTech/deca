import type { Metadata } from "next";
import NewsletterSignup from "@/components/public/newsletter-signup";
import NewsletterShare from "@/components/public/newsletter-share";
import PageHero from "@/components/public/PageHero";

export const metadata: Metadata = {
  title: "Newsletter | Gilead Medicare",
  description: "Get health, wellness, and community-care updates from Gilead Medicare delivered to your inbox.",
  openGraph: { title: "Newsletter | Gilead Medicare", description: "Get health, wellness, and community-care updates from Gilead Medicare delivered to your inbox.", url: "/newsletter", type: "website" },
};

export default function NewsletterPage() {
  return <><PageHero eyebrow="Gilead Medicare newsletter" title="Stay connected to what matters." description="Receive thoughtful updates, new studies and news from our online fellowship in your inbox." primaryAction={{ href: "#newsletter-signup", label: "Subscribe now" }} secondaryAction={{ href: "/articles", label: "Browse resources" }} aside={<><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Thoughtful updates</p><h2 className="mt-3 text-2xl font-bold text-slate-950">Learning, encouragement and community news.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Choose how you stay connected, and share the newsletter with someone who may find it useful.</p></>} /><div id="newsletter-signup" className="container mx-auto max-w-6xl scroll-mt-6 px-4 py-16 sm:py-20"><div className="mx-auto mb-8 max-w-3xl text-center"><NewsletterShare /></div><NewsletterSignup /></div></>;
}
