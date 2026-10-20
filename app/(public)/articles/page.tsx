import type { Metadata } from "next";
import { Suspense } from "react";
import ArticlesPage from "@/components/public/pages/ArticlesPage";

export const metadata: Metadata = { title: "Articles | RemSam Homestead", description: "Explore articles on faith, family, farming, homeschooling, and study materials." };

export default function Page() {
  return <Suspense fallback={null}><ArticlesPage /></Suspense>;
}
