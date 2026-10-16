"use client";

// src/pages/ArticlesPage.jsx
import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { PublicArticle } from "@/lib/types";
import SEO from "../SEO";
import HeroSection from "../HeroSection";
import ArticlesFilter from "../articles/ArticlesFilter";
import ArticlesGrid from "../articles/ArticlesGrid";
import ArticlesPagination from "../articles/ArticlesPagination";
import CategoryStats from "../articles/CategoryStats";
import AnimatedSection from "../AnimatedSection";

export type { PublicArticle } from "@/lib/types";

type ArticlesResponse = {
  articles: PublicArticle[];
  totalPages: number;
  currentPage: number;
  total: number;
};

const ArticlesPage = ({ initialCategory = "" }: { initialCategory?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<PublicArticle[]>([]);
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
      .get<ArticlesResponse>(`/api/articles?${params.toString()}`)
      .then((response) => {
        if (cancelled) return;
        setArticles(response.articles ?? []);
        setTotalPages(response.totalPages ?? 1);
        setCurrentPage(response.currentPage ?? 1);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
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
    router.replace(`/articles${params.size ? `?${params}` : ""}`);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    router.replace(`/articles${params.size ? `?${params}` : ""}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`/articles?${params}`);
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
