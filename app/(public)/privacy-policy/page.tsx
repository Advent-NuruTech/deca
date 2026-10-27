import PrivacyPolicy from "@/components/public/pages/PrivacyPolicy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Gilead Medicare handles personal information.", alternates: { canonical: "https://gileadmedicare.co.ke/privacy-policy" } };

export default function Page() {
  return <PrivacyPolicy />;
}
