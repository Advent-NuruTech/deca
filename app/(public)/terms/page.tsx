import TermsOfService from "@/components/public/pages/TermsOfService";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "https://gileadmedicare.co.ke/terms-of-service" } };

export default function Page() {
  return <TermsOfService />;
}
