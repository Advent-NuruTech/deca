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
  ShoppingBag,
  Gift,
  ArrowRight,
  Quote,
  ChevronRight,
  Play,
} from "lucide-react";
import api from "@/lib/public-api";
import type { Article, PublicProduct, ResourceTaxonomy } from "@/lib/types";
import ProductsGrid from "@/components/public/products/ProductsGrid";
import { api as productsApi } from "@/lib/api";
import StudyMaterialCard, { type StudyMaterial } from "@/components/public/StudyMaterialCard";
import SEO from "../SEO";
import YouTubeVideos from "../YouTubeVideos";
import ActivityCarousel from "../ActivityCarousel";
import YouTubeVideos2 from "../YouTubeVideos2";
import NewsletterSignup from "../newsletter-signup";
import HomeLoadingScreen from "../HomeLoadingScreen";
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
  const [latestProducts, setLatestProducts] = useState<PublicProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
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
        const response = await api.get<{
          featuredFaith: Article | null;
          featuredRecipe: Article | null;
          featuredAgriculture: Article | null;
          featuredHomeschool: Article | null;
          latestStudies: StudyMaterial[];
          resourceTaxonomy: ResourceTaxonomy;
        }>("/home");
        setFeaturedFaith(response.data.featuredFaith);
        setFeaturedRecipe(response.data.featuredRecipe);
        setFeaturedAgriculture(response.data.featuredAgriculture);
        setFeaturedHomeschool(response.data.featuredHomeschool);
        setLatestStudies(response.data.latestStudies || []);
        setResourceTaxonomy(response.data.resourceTaxonomy || { majors: [], subcategories: [] });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    let cancelled = false;
    productsApi.get<{ products: PublicProduct[] }>("/api/products?limit=8")
      .then((response) => { if (!cancelled) setLatestProducts(response.products ?? []); })
      .catch(() => { if (!cancelled) setProductsError(true); })
      .finally(() => { if (!cancelled) setProductsLoading(false); });
    return () => { cancelled = true; };
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
  const featuredArticles = [
    featuredFaith && { icon: <BookOpen className="h-5 w-5 text-white" />, bgGradient: "from-emerald-500 to-teal-500", title: "Faith Blog", item: featuredFaith },
    featuredRecipe && { icon: <Apple className="h-5 w-5 text-white" />, bgGradient: "from-amber-500 to-orange-500", title: "Organic Recipe", item: featuredRecipe },
    featuredAgriculture && { icon: <Sprout className="h-5 w-5 text-white" />, bgGradient: "from-green-500 to-emerald-500", title: "Agriculture Tip", item: featuredAgriculture },
    featuredHomeschool && { icon: <School className="h-5 w-5 text-white" />, bgGradient: "from-blue-500 to-indigo-500", title: "Homeschooling", item: featuredHomeschool },
  ].filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  if (loading) return <HomeLoadingScreen />;

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
                <span className="block text-emerald-400">Remsam Homestead</span>
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
        {(loading || featuredArticles.length > 0) && <section className="py-16 bg-white">
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredArticles.map((entry) => <FeatureCard key={entry.item.slug} {...entry} linkTo={`/articles/${entry.item.slug}`} />)}
              </div>
            )}
          </div>
        </section>}

        {/* ========== 6. STUDY LIBRARY ========== */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{resourceTaxonomy.majors.find((item) => item.id === "study-library")?.name ?? "Study Library"}</h2>
              <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" />
              <p className="mt-4 text-gray-600">Explore free resources for your faith and learning journey.</p>
            </div>
            {loading ? <p className="text-center text-sm text-gray-500" role="status">Loading resources...</p> : latestStudies.length === 0 ? <p className="text-center text-gray-500">No downloadable resources yet.</p> : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {latestStudies.slice(0, 8).map((study) => <StudyMaterialCard key={study._id || study.slug} material={study} categoryName={resourceTaxonomy.subcategories.find((item) => item.id === study.subcategoryId)?.name} />)}
              </div>
            )}
            <div className="mt-8 text-center"><Link href="/study-materials" className="inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-900">View all materials <ArrowRight size={16} /></Link></div>
          </div>
        </section>

        {/* ========== FROM OUR FARM ========== */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-center gap-2">
              <ShoppingBag className="h-7 w-7 text-amber-600" aria-hidden="true" />
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">From Our Farm</h2>
            </div>
            {productsError ? <p role="alert" className="py-8 text-center text-gray-600">Products could not be loaded. Please visit the shop to try again.</p> : <ProductsGrid products={latestProducts} loading={productsLoading} fourColumns />}
            <div className="mt-8 text-center"><Link href="/products" className="inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">Shop all products <ArrowRight size={16} aria-hidden="true" /></Link></div>
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
        <div className="bg-white px-4 py-8 sm:px-6 sm:py-12">
          <div className="container mx-auto"><NewsletterSignup /></div>
        </div>
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
}: {
  icon: ReactNode;
  bgGradient: string;
  title: string;
  item: Article;
  linkTo: string;
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
    </div>
  </motion.div>
);

export default HomePage;
