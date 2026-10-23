import type { Metadata } from "next";
import CustomerAuthPage from "@/components/public/account/CustomerAuthPage";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ returnTo?: string | string[] }> }) {
  const value = (await searchParams).returnTo;
  const returnTo = typeof value === "string" && (value === "/account" || value === "/checkout") ? value : "/account";
  return <CustomerAuthPage mode="sign-up" returnTo={returnTo} />;
}
