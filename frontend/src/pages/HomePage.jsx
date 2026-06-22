// src/pages/HomePage.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Play,
} from "lucide-react";
import api from "../services/api";
import SEO from "../components/SEO";
import YouTubeVideos from "../components/YouTubeVideos";
import ActivityCarousel from "../components/ActivityCarousel";
import YouTubeVideos2 from "../components/YouTubeVideos2";
import remsamVideo from "../assets/remsam.mp4";

const HomePage = () => {
  const [featuredFaith, setFeaturedFaith] = useState(null);
  const [featuredRecipe, setFeaturedRecipe] = useState(null);
  const [featuredAgriculture, setFeaturedAgriculture] = useState(null);
  const [featuredHomeschool, setFeaturedHomeschool] = useState(null);
  const [latestStudies, setLatestStudies] = useState([]);
  const [featuredSeeds, setFeaturedSeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

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
        title="RemSam Homestead – Faith, Family, Farming"
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
  {/* ========== 1. VIDEO HERO ========== */}
<section
  ref={heroRef}
  className="relative h-screen flex items-center justify-center overflow-hidden"
>
  {/* Video Background */}
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
      poster="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    >
      <source src={remsamVideo} type="video/mp4" />
    </video>

    <div className="absolute inset-0 bg-black/40" />
  </div>

  {/* Hero Content */}
  <motion.div
    style={{ opacity, scale }}
    className="relative z-10 container mx-auto px-4 text-center text-white"
  >
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-4xl mx-auto"
    >
      <motion.span
        variants={fadeUp}
        className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-white/30"
      >
                Welcome to RemSam Homestead
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-7xl lg:text-4xl font-bold leading-tight"
              >
                <span className="text-emerald-400">Remsam Homestade</span>
                <br />
                <span className="text-amber-400">Faith,Family, Farming</span>,<br />

              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-xl md:text-2xl mt-6 mb-8 max-w-2xl mx-auto text-gray-200"
              >
                A place where faith meets everyday life – inspiring blogs,
                organic recipes, sustainable agriculture, homeschooling wisdom,
                and farm‑fresh products.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Link
                  to="/faith"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition-all hover:shadow-xl"
                >
                  Explore Faith
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/donate"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold hover:bg-white/30 transition-all"
                >
                  <Gift size={20} /> Support Our Work
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* ========== 2. MODERN FEATURE CARDS ========== */}
        <section className="py-20 bg-white relative -mt-20 z-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Heart className="w-8 h-8" />,
                  title: "Faith",
                  description:
                    "Daily devotionals and spiritual growth resources",
                  color: "from-rose-500 to-pink-500",
                  link: "/faith",
                },
                {
                  icon: <School className="w-8 h-8" />,
                  title: "Family",
                  description: "Homeschooling support and parenting wisdom",
                  color: "from-blue-500 to-indigo-500",
                  link: "/homeschooling",
                },
                {
                  icon: <Sprout className="w-8 h-8" />,
                  title: "Farming",
                  description:
                    "Organic gardening and sustainable agriculture tips",
                  color: "from-green-500 to-emerald-500",
                  link: "/agriculture",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  title: "Learning",
                  description: "Free study materials and educational content",
                  color: "from-purple-500 to-violet-500",
                  link: "/study-materials",
                },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${card.color} rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500`}
                  />
                  <Link
                    to={card.link}
                    className="relative block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100"
                  >
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${card.color} text-white shadow-md mb-4`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">{card.description}</p>
                    <div className="mt-4 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 group-hover:from-emerald-600 group-hover:to-teal-600 transition-all">
                      Learn more →
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 3. ACTIVITY CAROUSEL (Visual Story) ========== */}
        <ActivityCarousel />

        {/* ========== 4. MISSION STATEMENT (Now meaningful) ========== */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 md:p-12 shadow-lg border border-emerald-100"
              >
                <div className="absolute -top-5 left-8 bg-white rounded-full p-2 shadow-md">
                  <Quote className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="mt-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                    Our Mission
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                    <p>
                      In new fields, where the work of God has yet to be
                      established, medical missionary work is to be done. This
                      work removes prejudice, and prepares the way for the
                      proclamation of the third angel's message. It is the means
                      by which doors are opened for the entrance of the special
                      truths for this time. Medical missionary work and the
                      gospel are one. If united, they make a complete whole.
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      — Letter 92, 1902, p. 2. ("To Brethren in Responsible
                      Positions in the Medical Work," April 8, 1902.) ~ 1MR
                      228.1
                    </p>
                    <p>
                      God's purpose in giving the third angel's message to the
                      world is to prepare a people to stand true to Him during
                      the investigative judgment. This is the purpose for which
                      we establish and maintain our publishing houses, our
                      schools, our sanitariums, hygienic restaurants, treatment
                      rooms, and food factories. This is our purpose in carrying
                      forward every line of work in the cause.
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      — Ms 154, 1902, p. 4. ("Instruction to Men in Positions of
                      Responsibility," October 24, 1902.) ~ 1MR 228.2
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-b-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ========== 5. WHAT'S NEW (Featured Articles) ========== */}
        <section className="py-16 bg-white">
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

        {/* ========== 6. STUDY MATERIALS & SHOP ========== */}
        <section className="py-16 bg-gray-50">
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
                        className="flex gap-4 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition"
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
                            href={`${import.meta.env.VITE_API_URL}/api/download?url=${encodeURIComponent(study.fileUrl)}&filename=${study.title.replace(/[^a-z0-9]/gi, "_")}.pdf`}
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
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
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

        {/* ========== 7. YOUTUBE VIDEOS ========== */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <YouTubeVideos />
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <YouTubeVideos2 />
          </div>
        </section>
      </div>
    </>
  );
};

// ========== REUSABLE FEATURE CARD ==========
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
