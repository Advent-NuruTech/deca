"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { PublicProduct } from "@/lib/types";
import ProductCard from "@/components/public/products/ProductCard";

type ProductsResponse = { products: PublicProduct[] };

export default function RelatedProducts({
  category,
  currentProductId,
  saleType,
}: {
  category: string;
  currentProductId: string;
  saleType: PublicProduct["saleType"];
}) {
  const [products, setProducts] = useState<PublicProduct[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<ProductsResponse>(`/api/products?category=${encodeURIComponent(category)}&type=${saleType}&limit=5`)
      .then((response) => {
        if (!cancelled) {
          setProducts(response.products.filter((product) => product._id !== currentProductId).slice(0, 4));
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [category, currentProductId, saleType]);

  if (products.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-800 mb-6">You May Also Like</h2>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} compact />
        ))}
      </div>
    </div>
  );
}
