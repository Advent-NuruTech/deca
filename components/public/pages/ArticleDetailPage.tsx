"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import type { PublicArticle } from "@/lib/types";
import SEO from "@/components/public/SEO";
import ArticleFeaturedImage from "@/components/public/article/ArticleFeaturedImage";
import ArticleContent from "@/components/public/article/ArticleContent";
import ArticleSidebar from "@/components/public/article/ArticleSidebar";

function formatDate(value: unknown) {
  if (typeof value !== "string" && typeof value !== "number" && !(value instanceof Date)) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleDetailPage({ slug }: { slug: string }) {
  const [article, setArticle] = useState<PublicArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setArticle(null);
    api
      .get<PublicArticle>(`/api/articles/${encodeURIComponent(slug)}`)
      .then((response) => {
        if (!cancelled) setArticle(response);
      })
      .catch(() => {
        if (!cancelled) setArticle(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/articles"
            className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Articles
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        keywords={article.seoKeywords || []}
        image={article.featuredImage}
        type="article"
      />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words [overflow-wrap:anywhere]">{article.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  <span>•</span>
                  <span>By {article.author?.name || "Admin"}</span>
                </div>
              </div>

              {article.featuredImage && <ArticleFeaturedImage image={article.featuredImage} title={article.title} />}
              {article.content && <ArticleContent content={article.content} tags={article.tags} />}

              {article.isDownloadable && article.fileUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">📥 Download Resource</h3>
                  <p className="text-gray-700 mb-4">
                    This content is available as a downloadable file for your convenience.
                  </p>
                  <a
                    href={article.fileUrl}
                    download={article.fileName}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    <Download size={20} />
                    Download Study Material
                  </a>
                </motion.div>
              )}
            </div>
            <div className="lg:col-span-1">
              <ArticleSidebar article={article} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
