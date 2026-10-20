"use client";

// src/pages/HomePage.jsx
import { useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import {
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
import api from "@/lib/public-api";
import type { Article, Product, ResourceTaxonomy } from "@/lib/types";
import StudyMaterialCard, { type StudyMaterial } from "@/components/public/StudyMaterialCard";
import SEO from "../SEO";
import YouTubeVideos from "../YouTubeVideos";
import ActivityCarousel from "../ActivityCarousel";
import YouTubeVideos2 from "../YouTubeVideos2";
const remsamVideo = "/assets/remsam.mp4";
const heroPhrase = "Faith, Family, Farming";

function HeroTypewriter() {
  const [text, setText] = useState(heroPhrase);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let position = 0;
    let phase: "typing" | "mistake" | "correcting" | "pause" | "deleting" = "typing";

    const tick = () => {
      let delay = 100;
      if (phase === "typing") {
        position += 1;
        setText(heroPhrase.slice(0, position));
        if (position === heroPhrase.length) phase = "mistake";
      } else if (phase === "mistake") {
        setText(`${heroPhrase}g`);
        phase = "correcting";
        delay = 350;
      } else if (phase === "correcting") {
        setText(heroPhrase);
        phase = "pause";
        delay = 1800;
      } else if (phase === "pause") {
        phase = "deleting";
        delay = 80;
      } else {
        position -= 1;
        setText(heroPhrase.slice(0, position));
        delay = 45;
        if (position === 0) {
          phase = "typing";
          delay = 500;
        }
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(() => {
      setText("");
      tick();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="grid text-amber-400" aria-label={heroPhrase}>
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">{heroPhrase}</span>
      <span className="col-start-1 row-start-1" aria-hidden="true">{text}<span className="animate-pulse motion-reduce:animate-none">|</span></span>
    </span>
  );
}

const HomePage = () => {
  const [featuredFaith, setFeaturedFaith] = useState<Article | null>(null);
  const [featuredRecipe, setFeaturedRecipe] = useState<Article | null>(null);
  const [featuredAgriculture, setFeaturedAgriculture] = useState<Article | null>(null);
  const [featuredHomeschool, setFeaturedHomeschool] = useState<Article | null>(null);
  const [latestStudies, setLatestStudies] = useState<StudyMaterial[]>([]);
  const [resourceTaxonomy, setResourceTaxonomy] = useState<ResourceTaxonomy>({ majors: [], subcategories: [] });
  const [featuredSeeds, setFeaturedSeeds] = useState<(Product & { _id?: string })[]>([]);
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
        const faithRes = await api.get<{ articles: Article[] }>("/articles", {
          params: { category: "faith", limit: 1, sort: "-createdAt" },
        });
        if (faithRes.data.articles?.length)
          setFeaturedFaith(faithRes.data.articles[0]);

        const recipeRes = await api.get<{ articles: Article[] }>("/articles", {
          params: { category: "recipe", limit: 1, sort: "-createdAt" },
        });
        if (recipeRes.data.articles?.length)
          setFeaturedRecipe(recipeRes.data.articles[0]);

        const agriRes = await api.get<{ articles: Article[] }>("/articles", {
          params: { category: "agriculture", limit: 1, sort: "-createdAt" },
        });
        if (agriRes.data.articles?.length)
          setFeaturedAgriculture(agriRes.data.articles[0]);

        const schoolRes = await api.get<{ articles: Article[] }>("/articles", {
          params: { category: "homeschooling", limit: 1, sort: "-createdAt" },
        });
        if (schoolRes.data.articles?.length)
          setFeaturedHomeschool(schoolRes.data.articles[0]);

        const studyRes = await api.get<{ articles: StudyMaterial[]; resourceCategories: ResourceTaxonomy }>("/articles", {
          params: {
            majorCategoryId: "study-library",
            limit: 3,
            sort: "-createdAt",
          },
        });
        setLatestStudies(studyRes.data.articles || []);
        setResourceTaxonomy(studyRes.data.resourceCategories || { majors: [], subcategories: [] });

        const seedsRes = await api.get<{ products: (Product & { _id?: string })[] }>("/products", {
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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const staggerContainer: Variants = {
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
  className="relative min-h-screen min-h-[100svh] flex items-center justify-center overflow-hidden pt-28 pb-32 md:pt-24 md:pb-28"
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
        className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4 md:mb-6 border border-white/30"
      >
                Welcome
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-4xl font-bold leading-tight"
              >
                <span className="block text-emerald-400">Remsam Homestade</span>
                <HeroTypewriter />

              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-base sm:text-lg md:text-2xl mt-4 mb-6 md:mt-6 md:mb-8 max-w-2xl mx-auto text-gray-200"
              >
                A place where faith meets everyday life – inspiring blogs,
                organic recipes, sustainable agriculture, homeschooling wisdom,
                and farm‑fresh products.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-3 md:gap-4 justify-center"
              >
                <Link
                  href="/faith"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-emerald-600 text-white rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition-all hover:shadow-xl"
                >
                  Explore Faith
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-black/50 backdrop-blur-md border border-white/60 text-white rounded-full font-semibold hover:bg-black/60 transition-all"
                >
                  <Gift size={20} /> Support Our Work
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="hidden md:block absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
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
                  image: "/assets/about.jpeg",
                  width: 1080,
                  height: 810,
                  title: "Faith",
                  description:
                    "Daily devotionals and spiritual growth resources",
                  color: "from-rose-500 to-pink-500",
                  link: "/faith",
                },
                {
                  image: "/assets/study2.png",
                  width: 810,
                  height: 1080,
                  title: "Family",
                  description: "Homeschooling support and parenting wisdom",
                  color: "from-blue-500 to-indigo-500",
                  link: "/homeschooling",
                },
                {
                  image: "/assets/farm1.jpeg",
                  width: 1080,
                  height: 810,
                  title: "Farming",
                  description:
                    "Organic gardening and sustainable agriculture tips",
                  color: "from-green-500 to-emerald-500",
                  link: "/agriculture",
                },
                {
                  image: "/assets/study.jpg",
                  width: 1920,
                  height: 1442,
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
                    href={card.link}
                    className="relative block h-full overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                  >
                    <Image
                      src={card.image}
                      alt=""
                      width={card.width}
                      height={card.height}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="w-full h-auto"
                    />
                    <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600">{card.description}</p>
                    <div className="mt-4 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 group-hover:from-emerald-600 group-hover:to-teal-600 transition-all">
                      Learn more →
                    </div>
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
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div><div className="flex items-center gap-2"><Download className="h-6 w-6 text-emerald-600" /><h2 className="text-2xl font-bold text-gray-900">{resourceTaxonomy.majors.find((item) => item.id === "study-library")?.name ?? "Study Library"}</h2></div><p className="mt-2 text-sm text-gray-600">Explore free resources for your faith and learning journey.</p></div>
                </div>
                {loading ? <p className="text-sm text-gray-500" role="status">Loading resources...</p> : latestStudies.length === 0 ? <p className="text-gray-500">No downloadable resources yet.</p> : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {latestStudies.slice(0, 2).map((study) => <StudyMaterialCard key={study._id || study.slug} material={study} categoryName={resourceTaxonomy.subcategories.find((item) => item.id === study.subcategoryId)?.name} />)}
                  </div>
                )}
                <Link href="/study-materials" className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-900">View all materials <ArrowRight size={16} /></Link>
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
                        href={`/products/${product.slug}`}
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
                      href="/products?category=seeds"
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
}: {
  icon: ReactNode;
  bgGradient: string;
  title: string;
  item: Article | null;
  linkTo: string;
  placeholder: string;
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
            href={linkTo}
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
