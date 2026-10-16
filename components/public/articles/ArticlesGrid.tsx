"use client";

// src/components/articles/ArticlesGrid.jsx
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import type { PublicArticle } from "../pages/ArticlesPage";

function formatDate(value: unknown) {
  return typeof value === "string" || typeof value === "number" || value instanceof Date
    ? new Date(value).toLocaleDateString()
    : "";
}

const ArticlesGrid = ({ articles, loading }: { articles: PublicArticle[]; loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500">No articles found.</p>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    faith: "Faith",
    recipe: "Recipe",
    agriculture: "Agriculture",
    homeschooling: "Homeschooling",
    study: "Study",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article._id}
          href={`/articles/${article.slug}`}
          className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block"
        >
          {article.featuredImage && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                {categoryLabels[article.category] || article.category}
              </span>
            </div>
          )}
          <div className="p-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(article.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <User size={12} />
                {article.author?.name || "Admin"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ArticlesGrid;
