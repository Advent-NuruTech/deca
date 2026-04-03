// pages/ArticlesPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../store/slices/articleSlice";
import SEO from "../components/SEO";
import ArticlesHero from "../components/articles/ArticlesHero";
import ArticlesFilter from "../components/articles/ArticlesFilter";
import ArticlesGrid from "../components/articles/ArticlesGrid";
import ArticlesPagination from "../components/articles/ArticlesPagination";
import CategoryStats from "../components/articles/CategoryStats";
import AnimatedSection from "../components/AnimatedSection";

const ArticlesPage = () => {
  const dispatch = useDispatch();
  const { articles, loading, totalPages, currentPage } = useSelector(
    (state) => state.articles,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    params.page = searchParams.get("page") || 1;

    dispatch(fetchArticles(params));
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
    { value: "", label: "All Articles" },
    { value: "news", label: "News" },
    { value: "tutorial", label: "Tutorials" },
    { value: "product-review", label: "Product Reviews" },
    { value: "company-update", label: "Company Updates" },
    { value: "tech-tips", label: "Tech Tips" },
  ];

  return (
    <>
      <SEO
        title="Articles"
        description="Read the latest articles, tutorials, product reviews, and tech tips from Fancy Tech Integration South Sudan. Stay updated with technology trends and solutions."
        keywords={[
          "Articles",
          "Tech News",
          "Tutorials",
          "Product Reviews",
          "Tech Tips",
        ]}
      />

      <ArticlesHero />

      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection delay={0.1} direction="up">
            <ArticlesFilter
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={handleCategoryChange}
              categories={categories}
              onSearch={handleSearch}
              totalArticles={articles?.length || 0}
            />
          </AnimatedSection>

          {/* Category Stats */}
          {articles?.length > 0 && (
            <AnimatedSection delay={0.2} direction="up">
              <CategoryStats articles={articles} />
            </AnimatedSection>
          )}

          {/* Articles Grid */}
          <AnimatedSection delay={0.3} direction="up">
            <ArticlesGrid articles={articles || []} loading={loading} />
          </AnimatedSection>

          {/* Pagination */}
          {!loading && articles?.length > 0 && (
            <AnimatedSection delay={0.4} direction="up">
              <ArticlesPagination
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

export default ArticlesPage;
