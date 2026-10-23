import PrivacyPolicy from "@/components/public/pages/PrivacyPolicy";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy", description: "How RemSam Homestead handles personal information.", alternates: { canonical: "https://remsamhomestead.com/privacy-policy" } };

export default function Page() {
  return <PrivacyPolicy />;
}
