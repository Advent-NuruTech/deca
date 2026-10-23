import TermsOfService from "@/components/public/pages/TermsOfService";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service", description: "Terms for using RemSam Homestead's website and services.", alternates: { canonical: "https://remsamhomestead.com/terms-of-service" } };

export default function Page() {
  return <TermsOfService />;
}
