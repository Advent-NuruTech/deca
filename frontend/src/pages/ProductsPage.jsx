// pages/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import SEO from "../components/SEO";
import ProductsHero from "../components/products/ProductsHero";
import ProductsFilter from "../components/products/ProductsFilter";
import ProductsGrid from "../components/products/ProductsGrid";
import ProductsPagination from "../components/products/ProductsPagination";
import CategoryStats from "../components/products/CategoryStats";
import AnimatedSection from "../components/AnimatedSection";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, totalPages, currentPage } = useSelector(
    (state) => state.products,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    params.page = searchParams.get("page") || 1;

    dispatch(fetchProducts(params));
  }, [dispatch, category, search, searchParams]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    { value: "", label: "All Products" },
    { value: "starlink", label: "Starlink Kits" },
    { value: "networking", label: "Networking Equipment" },
    { value: "laptop", label: "Laptop" },
    { value: "phone", label: "Phone" },
    { value: "software", label: "Software" },
    { value: "cctv", label: "CCTV Equipment" },
    { value: "router", label: "Routers" },
    { value: "accesspoint", label: "Access point" },
  ];

  return (
    <>
      <SEO
        title="Products"
        description="Browse our wide range of technology products including Starlink Kits, Networking Equipment, Laptops, Phones, and Software Solutions in South Sudan."
        keywords={[
          "Products",
          "Starlink",
          "Networking Equipment",
          "Laptop",
          "Phone",
          "Software",
          "Access point",
          "Router",
        ]}
      />

      <ProductsHero />

      <section className="py-12 bg-gray-900">
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

          {/* Category Stats */}
          {products?.length > 0 && (
            <AnimatedSection delay={0.2} direction="up">
              <CategoryStats products={products} />
            </AnimatedSection>
          )}

          {/* Products Grid */}
          <AnimatedSection delay={0.3} direction="up">
            <ProductsGrid products={products || []} loading={loading} />
          </AnimatedSection>

          {/* Pagination */}
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
