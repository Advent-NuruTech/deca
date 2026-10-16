import { Suspense } from "react";
import ProductsPage from "@/components/public/pages/ProductsPage";

export default function ProduceShopPage() {
  return <Suspense fallback={null}><ProductsPage initialCategory="produce" /></Suspense>;
}
