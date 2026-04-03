// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  Apple,
  Sprout,
  School,
  Download,
  ShoppingBag,
  Gift,
  ArrowRight,
  Quote,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";
import SEO from "../components/SEO";
import { Users } from "lucide-react";
import HeroSection from "../components/HeroSection";

const HomePage = () => {
  const [featuredFaith, setFeaturedFaith] = useState(null);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [featuredAgriculture, setFeaturedAgriculture] = useState(null);
  const [featuredHomeschool, setFeaturedHomeschool] = useState(null);
  const [latestStudies, setLatestStudies] = useState([]);
  const [featuredSeeds, setFeaturedSeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const faithRes = await api.get("/articles", {
          params: { category: "faith", limit: 1, sort: "-createdAt" },
        });
        if (faithRes.data.articles?.length)
          setFeaturedFaith(faithRes.data.articles[0]);

        const recipeRes = await api.get("/articles", {
          params: { category: "recipe", limit: 1, sort: "-createdAt" },
        });
        if (recipeRes.data.articles?.length)
          setFeaturedRecipe(recipeRes.data.articles[0]);

        const agriRes = await api.get("/articles", {
          params: { category: "agriculture", limit: 1, sort: "-createdAt" },
        });
        if (agriRes.data.articles?.length)
          setFeaturedAgriculture(agriRes.data.articles[0]);

        const schoolRes = await api.get("/articles", {
          params: { category: "homeschooling", limit: 1, sort: "-createdAt" },
        });
        if (schoolRes.data.articles?.length)
          setFeaturedHomeschool(schoolRes.data.articles[0]);

        const studyRes = await api.get("/articles", {
          params: {
            category: "study",
            isDownloadable: true,
            limit: 3,
            sort: "-createdAt",
          },
        });
        if (studyRes.data.articles?.length)
          setLatestStudies(studyRes.data.articles);

        const seedsRes = await api.get("/products", {
          params: { category: "seeds", featured: true, limit: 3 },
        });
        if (seedsRes.data.products?.length)
          setFeaturedSeeds(seedsRes.data.products);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <>
      <SEO
        title="Sami Ministry – Faith, Family, Farming"
        description="Inspiring faith, wholesome recipes, sustainable agriculture, homeschooling resources, and farm-fresh products."
        keywords={[
          "Faith",
          "Family",
          "Farming",
          "Organic Seeds",
          "Homeschooling",
          "Study Materials",
        ]}
      />
      <div className="bg-white overflow-hidden">
        {/* ========== HERO SECTION ========== */}
        <HeroSection
          badge="Welcome to Sami Ministry"
          title="Growing in <span class='text-emerald-600'>Faith</span>,<br />Nurturing <span class='text-amber-600'>Family</span>,<br />Cultivating the <span class='text-blue-600'>Land</span>"
          subtitle="A place where faith meets everyday life – through inspiring blogs, organic recipes, sustainable agriculture, homeschooling wisdom, and farm‑fresh products."
          primaryText="Explore Faith"
          primaryLink="/faith"
          secondaryText="Support Our Work"
          secondaryLink="/donate"
          imageSrc="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          imageAlt="Sunrise over farm"
        />

        {/* ========== MISSION (short & sweet) ========== */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Quote className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                Our Simple Mission
              </h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                To inspire families to grow spiritually, live healthily, learn
                joyfully, and steward God’s creation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Values / What We Offer */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Heart className="w-8 h-8 text-rose-500" />,
                  title: "Faith",
                  desc: "Daily devotionals and spiritual growth resources",
                },
                {
                  icon: <Users className="w-8 h-8 text-blue-500" />,
                  title: "Family",
                  desc: "Homeschooling support and parenting wisdom",
                },
                {
                  icon: <Sprout className="w-8 h-8 text-green-500" />,
                  title: "Farming",
                  desc: "Organic gardening and sustainable agriculture tips",
                },
                {
                  icon: <BookOpen className="w-8 h-8 text-amber-500" />,
                  title: "Learning",
                  desc: "Free study materials and educational content",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition"
                >
                  <div className="inline-flex p-3 bg-white rounded-full shadow-sm mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== FEATURED CONTENT (cards) ========== */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                What’s New
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-3 rounded-full" />
              <p className="text-gray-600 mt-4">
                Fresh encouragement for your journey
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard
                  icon={<BookOpen className="w-5 h-5 text-white" />}
                  bgGradient="from-emerald-500 to-teal-500"
                  title="Faith Blog"
                  item={featuredFaith}
                  linkTo={`/articles/${featuredFaith?.slug}`}
                  placeholder="Latest devotional"
                />
                <FeatureCard
                  icon={<Apple className="w-5 h-5 text-white" />}
                  bgGradient="from-amber-500 to-orange-500"
                  title="Organic Recipe"
                  item={featuredRecipe}
                  linkTo={`/articles/${featuredRecipe?.slug}`}
                  placeholder="Wholesome cooking"
                />
                <FeatureCard
                  icon={<Sprout className="w-5 h-5 text-white" />}
                  bgGradient="from-green-500 to-emerald-500"
                  title="Agriculture Tip"
                  item={featuredAgriculture}
                  linkTo={`/articles/${featuredAgriculture?.slug}`}
                  placeholder="Grow your own food"
                />
                <FeatureCard
                  icon={<School className="w-5 h-5 text-white" />}
                  bgGradient="from-blue-500 to-indigo-500"
                  title="Homeschooling"
                  item={featuredHomeschool}
                  linkTo={`/articles/${featuredHomeschool?.slug}`}
                  placeholder="Joyful learning"
                />
              </div>
            )}
          </div>
        </section>

        {/* ========== STUDY MATERIALS & SHOP (combined section, shorter) ========== */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Study Materials */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Download className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Free Study Materials
                  </h2>
                </div>
                {latestStudies.length === 0 ? (
                  <p className="text-gray-500">
                    No downloadable resources yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {latestStudies.slice(0, 2).map((study) => (
                      <div
                        key={study._id}
                        className="flex gap-4 p-3 bg-gray-50 rounded-xl hover:shadow-md transition"
                      >
                        {study.featuredImage && (
                          <img
                            src={study.featuredImage}
                            alt={study.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-1">
                            {study.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {study.excerpt}
                          </p>
                          <a
                            href={`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/download?url=${encodeURIComponent(study.fileUrl)}&filename=${study.title.replace(/[^a-z0-9]/gi, "_")}.pdf`}
                            download
                            className="text-emerald-600 text-sm font-medium inline-flex items-center gap-1 mt-1"
                          >
                            Download PDF <Download size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/study-materials"
                      className="inline-flex items-center gap-1 text-emerald-600 font-medium mt-2"
                    >
                      View all materials <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Right: Featured Products */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    From Our Farm
                  </h2>
                </div>
                {featuredSeeds.length === 0 ? (
                  <p className="text-gray-500">No products yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {featuredSeeds.slice(0, 2).map((product) => (
                      <Link
                        key={product._id}
                        to={`/products/${product.slug}`}
                        className="group"
                      >
                        <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                            />
                          )}
                          <div className="p-3">
                            <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-emerald-700 font-bold text-sm mt-1">
                              ${product.price}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link
                      to="/products?category=seeds"
                      className="col-span-2 text-center text-emerald-600 font-medium mt-2 inline-block"
                    >
                      Shop all seeds →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========== DONATION CALLOUT (minimal) ========== */}
        <section className="py-16 bg-gradient-to-r from-emerald-50 to-amber-50">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <Heart className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Support Our Ministry
            </h2>
            <p className="text-gray-700 mb-6">
              Your gift helps us create free resources and serve families.
            </p>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold shadow-md hover:bg-rose-700 transition"
            >
              <Gift size={18} /> Donate Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

// ========== REUSABLE FEATURE CARD (modern, gradient header) ==========
const FeatureCard = ({
  icon,
  bgGradient,
  title,
  item,
  linkTo,
  placeholder,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
  >
    <div
      className={`bg-gradient-to-r ${bgGradient} p-4 flex items-center gap-2`}
    >
      <div className="bg-white/20 rounded-full p-2">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      {item ? (
        <>
          {item.featuredImage && (
            <img
              src={item.featuredImage}
              alt={item.title}
              className="w-full h-36 object-cover rounded-lg mb-3"
            />
          )}
          <h4 className="font-bold text-gray-800 line-clamp-2 mb-2">
            {item.title}
          </h4>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {item.excerpt}
          </p>
          <Link
            to={linkTo}
            className="mt-auto text-emerald-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            Read More <ArrowRight size={14} />
          </Link>
        </>
      ) : (
        <p className="text-gray-400 italic text-sm">{placeholder}</p>
      )}
    </div>
  </motion.div>
);

export default HomePage;
