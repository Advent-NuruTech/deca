"use client";

// src/pages/StudyMaterialsPage.jsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Calendar, User, ChevronRight } from "lucide-react";
import api from "@/lib/public-api";
import type { PublicArticle, StudyCategoryOption } from "@/lib/types";
import SEO from "../SEO";
import AnimatedSection from "../AnimatedSection";
const study = "/assets/study.jpg";

const StudyMaterialsPage = () => {
  const [materials, setMaterials] = useState<(PublicArticle & { thumbnail?: string; description?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [studyCategories, setStudyCategories] = useState<StudyCategoryOption[]>([]);

  const limit = 9;

  useEffect(() => {
    const fetchStudyMaterials = async () => {
      setLoading(true);
      try {
        const response = await api.get<{
          articles: (PublicArticle & { thumbnail?: string; description?: string })[];
          totalPages: number;
          studyCategories: StudyCategoryOption[];
        }>("/articles", {
          params: {
            isDownloadable: true,
            page: currentPage,
            limit,
            category: selectedCategory,
          },
        });

        setMaterials(response.data.articles || []);
        setTotalPages(response.data.totalPages || 1);
        setStudyCategories(response.data.studyCategories || []);
      } catch (error) {
        console.error("Error fetching study materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyMaterials();
  }, [currentPage, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDownloadFilename = (material: PublicArticle) => {
    return material.fileName || material.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  };

  const getStudyCategoryName = (material: PublicArticle) => {
    return (
      studyCategories.find((category) => category.slug === material.studyCategory)?.name ||
      material.studyCategory ||
      material.category
    );
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

      {/* HERO SECTION */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={study}
            alt="Study materials background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              Study <span className="text-emerald-400">Materials</span>
            </h1>
            <p className="mt-4 text-gray-200">
              Downloadable PDFs, guides, and resources for spiritual growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY FILTER BAR (RIGHT AFTER HERO) */}
      <div className="bg-white py-5 border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            
            <button
              onClick={() => {
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedCategory === ""
                  ? "bg-emerald-600 text-white"
                  : "text-gray-700"
              }`}
            >
              All
            </button>

            {studyCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => {
                  setSelectedCategory(category.slug);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  selectedCategory === category.slug
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MATERIALS GRID */}
      <div className="bg-gray-50 py-12" id="materials">
        <div className="container mx-auto px-4">

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {materials.map((material, index) => (
                <AnimatedSection
                  key={material._id}
                  delay={index * 0.05}
                  direction="up"
                >
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition flex overflow-hidden border">

                    {/* THUMBNAIL */}
                    <div className="w-1/3 min-h-[160px]">
                      <img
                        src={material.thumbnail || material.featuredImage}
                        alt={material.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="w-2/3 p-4 flex flex-col">

                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {material.title}
                      </h2>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {material.description || material.excerpt}
                      </p>

                      <div className="text-xs text-gray-500 mt-2 flex gap-3">
                        <span>{getStudyCategoryName(material)}</span>
                        <span>
                          {typeof material.createdAt === "string" || typeof material.createdAt === "number"
                            ? new Date(material.createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      <div className="mt-auto flex gap-2 pt-3">

                        <a
                          href={material.fileUrl || "#"}
                          download={getDownloadFilename(material)}
                          className="flex-1 bg-emerald-600 text-white text-sm py-2 rounded-lg text-center hover:bg-emerald-700"
                        >
                          <Download size={14} className="inline mr-1" />
                          Download
                        </a>

                        <Link
                          href={`/articles/${material.slug}`}
                          className="px-3 py-2 bg-gray-100 rounded-lg text-sm"
                        >
                          View
                        </Link>

                      </div>

                    </div>
                  </div>
                </AnimatedSection>
              ))}

            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg border ${
                    currentPage === i + 1
                      ? "bg-emerald-600 text-white"
                      : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default StudyMaterialsPage;
