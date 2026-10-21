"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterShare() {
  async function shareNewsletter() {
    const url = new URL("/newsletter", window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "RemSam Homestead Newsletter", text: "Stay connected with RemSam Homestead.", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Newsletter link copied");
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) toast.error("Unable to share the newsletter. Please try again.");
    }
  }

  return <button type="button" onClick={shareNewsletter} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><Share2 size={18} aria-hidden="true" /> Share newsletter</button>;
}
