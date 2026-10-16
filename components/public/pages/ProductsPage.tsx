"use client";

// src/pages/ProductsPage.jsx
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { PublicProduct } from "@/lib/types";
import SEO from "../SEO";
import ProductsHero from "../products/ProductsHero";
import ProductsFilter from "../products/ProductsFilter";
import ProductsGrid from "../products/ProductsGrid";
import ProductsPagination from "../products/ProductsPagination";
import CategoryStats from "../products/CategoryStats";
import AnimatedSection from "../AnimatedSection";

type ProductsResponse = {
  products: PublicProduct[];
  totalPages: number;
  currentPage: number;
  total: number;
};

const ProductsPage = ({ initialCategory = "" }: { initialCategory?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(initialCategory || searchParams.get("category") || "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    params.set("page", searchParams.get("page") || "1");
    setLoading(true);
    api
      .get<ProductsResponse>(`/api/products?${params.toString()}`)
      .then((response) => {
        if (cancelled) return;
        setProducts(response.products ?? []);
        setTotalPages(response.totalPages ?? 1);
        setCurrentPage(response.currentPage ?? 1);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, search, searchParams]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams.toString());
    if (cat) params.set("category", cat);
    else params.delete("category");
    params.delete("page");
    router.replace(`/products${params.size ? `?${params}` : ""}`);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    router.replace(`/products${params.size ? `?${params}` : ""}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`/products?${params}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    { value: "", label: "All Products" },
    { value: "seeds", label: "Organic Seeds" },
    { value: "produce", label: "Fresh Produce" },
    { value: "other", label: "Other Products" },
  ];

  return (
    <>
      <SEO
        title="Shop | RemSam Homestead"
        description="Buy organic seeds, fresh produce, and other agricultural products from our farm."
        keywords={["Organic Seeds", "Fresh Produce", "Farm Products"]}
      />
      <ProductsHero />
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={0.1} direction="up">
            <ProductsFilter
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={handleCategoryChange}
              categories={categories}
              onSearch={handleSearch}
              totalProducts={products?.length || 0}
            />
          </AnimatedSection>
          {products?.length > 0 && (
            <AnimatedSection delay={0.2} direction="up">
              <CategoryStats products={products} />
            </AnimatedSection>
          )}
          <AnimatedSection delay={0.3} direction="up">
            <ProductsGrid products={products || []} loading={loading} />
          </AnimatedSection>
          {!loading && products?.length > 0 && (
            <AnimatedSection delay={0.4} direction="up">
              <ProductsPagination
                currentPage={currentPage || 1}
                totalPages={totalPages || 1}
                onPageChange={handlePageChange}
              />
            </AnimatedSection>
          )}
        </div>
      </section>
    </>
  );
};

export default ProductsPage;
