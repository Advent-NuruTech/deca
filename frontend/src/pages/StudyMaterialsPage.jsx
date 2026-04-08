// src/pages/StudyMaterialsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, FileText, Calendar, User, ChevronRight } from "lucide-react";
import api from "../services/api";
import SEO from "../components/SEO";
import AnimatedSection from "../components/AnimatedSection";
import study from "../assets/study.jpg";

const StudyMaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      setLoading(true);
      try {
        const response = await api.get("/articles", {
          params: {
            category: "study",
            isDownloadable: true,
            page: currentPage,
            limit: limit,
          },
        });
        setMaterials(response.data.articles || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching study materials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyMaterials();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDownloadFilename = (title) => {
    return title.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".pdf";
  };

  return (
    <>
      <SEO
        title="Study Materials | RemSam Homestead"
        description="Download free study materials, PDFs, and resources for spiritual growth, homeschooling, and personal development."
        keywords={[
          "Study Materials",
          "PDF Downloads",
          "Faith Resources",
          "Homeschooling",
        ]}
      />

      {/* Custom Hero – Study Theme (similar to homepage) */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {/* Background Image (free Pexels CDN – reliable) */}
        <div className="absolute inset-0 z-0">
          <img
            src={study}
            alt="Study materials background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6 border border-white/30">
              Free Resources
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Equipping You for{" "}
              <span className="text-emerald-400">Every Good Work</span>
            </h1>
            <p className="text-lg md:text-xl mt-6 mb-8 text-gray-200">
              Downloadable PDFs, guides, and study materials – all free, to help
              you grow in faith, family, and farming.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#materials"
                className="group inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition-all"
              >
                Browse Materials{" "}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </a>
              <Link
                to="/donate"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full font-semibold hover:bg-white/30 transition-all"
              >
                Support Our Work
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Materials Grid Section */}
      <div id="materials" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : materials.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700">
                No study materials yet
              </h2>
              <p className="text-gray-500 mt-2">
                Check back soon for new resources.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material, index) => (
                  <AnimatedSection
                    key={material._id}
                    delay={0.1 + index * 0.05}
                    direction="up"
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-100">
                      {material.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={material.featuredImage}
                            alt={material.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-full shadow">
                            PDF
                          </div>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {material.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {material.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(material.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User size={12} />
                            {material.author?.name || "Admin"}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-auto pt-4">
                          <a
                            href={`${import.meta.env.VITE_API_URL}/api/download?url=${encodeURIComponent(material.fileUrl)}&filename=${encodeURIComponent(getDownloadFilename(material.title))}`}
                            download
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
                          >
                            <Download size={16} />
                            Download
                          </a>
                          <Link
                            to={`/articles/${material.slug}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === i + 1
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StudyMaterialsPage;
