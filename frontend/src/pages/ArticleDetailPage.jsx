// pages/ArticleDetailPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
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

  // A function to get a clean filename
  const getDownloadFilename = () => {
    if (!article.fileUrl) return "document.pdf";
    // Try to extract from the URL
    const decodedUrl = decodeURIComponent(article.fileUrl);
    const parts = decodedUrl.split("/");
    let lastPart = parts.pop();
    // Remove query params
    if (lastPart.includes("?")) lastPart = lastPart.split("?")[0];
    // If it has no extension, add .pdf
    if (!lastPart.includes(".")) {
      return `${article.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    }
    return lastPart;
  };

  const categoryLabels = {
    faith: "Faith Blogs",
    recipe: "Recipes",
    agriculture: "Agriculture Tips",
    homeschooling: "Homeschooling",
    study: "Study Materials",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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

      <div className="min-h-screen bg-gray-50">
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

              {/* Download Section for Study Materials */}
              {article.isDownloadable && article.fileUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    📥 Download Resource
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This content is available as a downloadable file for your
                    convenience.
                  </p>
                  {article?.isDownloadable && article?.fileUrl && (
                    <a
                      href={`http://localhost:8000/api/download?url=${encodeURIComponent(article.fileUrl)}&filename=${encodeURIComponent(getDownloadFilename())}`}
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-gray-900 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      <Download size={20} />
                      Download Study Material
                    </a>
                  )}
                </motion.div>
              )}
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
