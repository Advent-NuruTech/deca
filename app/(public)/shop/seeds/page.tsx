import { Suspense } from "react";
import ProductsPage from "@/components/public/pages/ProductsPage";

export default function SeedsShopPage() {
  return <Suspense fallback={null}><ProductsPage initialCategory="seeds" /></Suspense>;
}
