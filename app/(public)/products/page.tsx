import { Suspense } from "react";
import ProductsPage from "@/components/public/pages/ProductsPage";

export default function Page() {
  return <Suspense fallback={null}><ProductsPage /></Suspense>;
}
