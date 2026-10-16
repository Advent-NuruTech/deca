import { Suspense } from "react";
import ArticlesPage from "@/components/public/pages/ArticlesPage";

export default function Page() {
  return <Suspense fallback={null}><ArticlesPage initialCategory="homeschooling" /></Suspense>;
}
