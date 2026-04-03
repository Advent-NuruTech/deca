// pages/ArticleDetailPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchArticle } from "../store/slices/articleSlice";
import SEO from "../components/SEO";
import ArticleHero from "../components/article/ArticleHero";
import ArticleFeaturedImage from "../components/article/ArticleFeaturedImage";
import ArticleContent from "../components/article/ArticleContent";
import ArticleSidebar from "../components/article/ArticleSidebar";
import { getImageUrl } from "../utils/constants";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { article, loading } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchArticle(slug));
    window.scrollTo(0, 0);
  }, [dispatch, slug]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const categoryLabels = {
    news: "News",
    tutorial: "Tutorial",
    "product-review": "Product Review",
    "company-update": "Company Update",
    "tech-tips": "Tech Tips",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Article Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <a
            href="/articles"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Articles
          </a>
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
        image={
          article.featuredImage ? getImageUrl(article.featuredImage) : null
        }
        url={`${window.location.origin}/articles/${article.slug}`}
        type="article"
      />

      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <ArticleHero
          article={article}
          categoryLabels={categoryLabels}
          formatDate={formatDate}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Image */}
              {article.featuredImage && (
                <ArticleFeaturedImage
                  image={article.featuredImage}
                  title={article.title}
                />
              )}

              {/* Article Content */}
              <ArticleContent content={article.content} tags={article.tags} />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <ArticleSidebar article={article} formatDate={formatDate} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
