// src/pages/ArticlesPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../store/slices/articleSlice";
import SEO from "../components/SEO";
import HeroSection from "../components/HeroSection";
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
    if (cat) params.set("category", cat);
    else params.delete("category");
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
    setSearchParams({ ...searchParams, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    { value: "", label: "All Articles" },
    { value: "faith", label: "Faith Blogs" },
    { value: "recipe", label: "Cookery & Recipes" },
    { value: "agriculture", label: "Agriculture Tips" },
    { value: "homeschooling", label: "Homeschooling" },
    { value: "study", label: "Study Materials" },
  ];

  return (
    <>
      <SEO
        title="Articles | RemSam Homestead"
        description="Explore faith-based blogs, recipes, agriculture tips, homeschooling resources, and study materials."
        keywords={[
          "Faith",
          "Recipes",
          "Agriculture",
          "Homeschooling",
          "Study Materials",
        ]}
      />

      {/* Hero Section – using the same reusable component */}
      <HeroSection
        badge="Read & Grow"
        title="Stories, Wisdom & <span class='text-emerald-600'>Inspiration</span>"
        subtitle="Discover articles on faith, family, farming, homeschooling, and free study materials."
        primaryText="Browse All"
        primaryLink="#articles-content"
        secondaryText="Support Our Work"
        secondaryLink="/donate"
        imageSrc="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        imageAlt="Open Bible and coffee"
      />

      {/* Main Content */}
      <section id="articles-content" className="py-12 bg-gray-50">
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

          {articles?.length > 0 && (
            <AnimatedSection delay={0.2} direction="up">
              <CategoryStats articles={articles} />
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.3} direction="up">
            <ArticlesGrid articles={articles || []} loading={loading} />
          </AnimatedSection>

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
