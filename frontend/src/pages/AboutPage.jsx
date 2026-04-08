// src/pages/AboutPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  Sprout,
  BookOpen,
  Shield,
  HandHeart,
  Leaf,
  Coffee,
  Church,
  TrendingUp,
} from "lucide-react";
import SEO from "../components/SEO";
import HeroSection from "../components/HeroSection";
import AnimatedSection from "../components/AnimatedSection";
import about from "../assets/about.jpeg";
import journey from "../assets/journey.jpeg";

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About Us | RemSam Homestead"
        description="Learn about our faith‑driven mission, family values, sustainable farming, and commitment to providing free study materials and organic products from our home in Kenya."
      />

      {/* Hero Section – African homeschooling/agriculture image */}
      <HeroSection
        badge="Our Story"
        title="Rooted in <span class='text-emerald-600'>Faith</span>,<br />Growing Together"
        subtitle="RemSam Homestead was born from a desire to share God's love, live sustainably, and equip families for every good work – from the heart of Kenya."
        primaryText="Read Our Mission"
        primaryLink="#mission"
        secondaryText="Get Involved"
        secondaryLink="/donate"
        imageSrc={about}
        imageAlt="African mother homeschooling her children"
      />

      {/* Mission & Vision Cards (soft, with icons) */}
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1} direction="up">
              <div className="group bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-emerald-100 h-full">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition">
                  <Heart className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Our Mission
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To inspire and equip families to grow spiritually, live
                  healthily, learn joyfully, and steward God’s creation – all
                  while sharing the love of Christ through free resources,
                  organic farming, and community support.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} direction="up">
              <div className="group bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100 h-full">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition">
                  <Shield className="w-7 h-7 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Our Vision
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  A world where every family has access to faith‑based
                  education, wholesome food, and a supportive community that
                  honors God and cares for the land – starting from Kenya to the
                  nations.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Modern "What We Believe" Cards – Glassmorphism + Gradient Borders */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What We Believe
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-3 rounded-full" />
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our core values guide everything we do – from the content we
              create to the products we grow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Church className="w-7 h-7" />,
                title: "Faith First",
                desc: "Every resource and product is rooted in biblical principles and prayer.",
                gradient: "from-indigo-500 to-purple-500",
                bgLight: "bg-indigo-50",
                textLight: "text-indigo-600",
              },
              {
                icon: <Users className="w-7 h-7" />,
                title: "Family Centered",
                desc: "We support parents as primary educators and caregivers.",
                gradient: "from-rose-500 to-pink-500",
                bgLight: "bg-rose-50",
                textLight: "text-rose-600",
              },
              {
                icon: <Sprout className="w-7 h-7" />,
                title: "Stewardship",
                desc: "We practice sustainable farming to care for God's earth.",
                gradient: "from-emerald-500 to-teal-500",
                bgLight: "bg-emerald-50",
                textLight: "text-emerald-600",
              },
              {
                icon: <BookOpen className="w-7 h-7" />,
                title: "Free Education",
                desc: "Study materials are always free to download.",
                gradient: "from-blue-500 to-cyan-500",
                bgLight: "bg-blue-50",
                textLight: "text-blue-600",
              },
              {
                icon: <HandHeart className="w-7 h-7" />,
                title: "Generosity",
                desc: "A portion of every sale supports community outreach in Kenya.",
                gradient: "from-amber-500 to-orange-500",
                bgLight: "bg-amber-50",
                textLight: "text-amber-600",
              },
              {
                icon: <Leaf className="w-7 h-7" />,
                title: "Integrity",
                desc: "Honest, transparent, and accountable in all we do.",
                gradient: "from-green-500 to-lime-500",
                bgLight: "bg-green-50",
                textLight: "text-green-600",
              },
            ].map((value, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx} direction="up">
                <motion.div
                  className="relative group h-full"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Animated gradient border on hover */}
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${value.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-md transition duration-500`}
                  />
                  <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                    <div
                      className={`w-14 h-14 ${value.bgLight} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300`}
                    >
                      <div className={value.textLight}>{value.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.desc}
                    </p>
                    <div className="mt-4">
                      <span
                        className={`text-sm font-medium ${value.textLight} inline-flex items-center gap-1 group-hover:gap-2 transition-all`}
                      >
                        Learn more <TrendingUp size={14} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section (enriched with timeline & African imagery) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.1} direction="up">
              <div className="relative">
                <img
                  src={journey}
                  alt="Kenyan farm family"
                  className="rounded-2xl shadow-lg w-full object-cover h-96"
                />
                <div className="absolute -bottom-5 -right-5 bg-emerald-600 text-white p-4 rounded-xl shadow-lg">
                  <Coffee className="w-8 h-8" />
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} direction="up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Journey
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      Humble Beginnings
                    </h3>
                    <p className="text-gray-600">
                      RemSam Homestead began as a small family farm and
                      homeschool in rural Kenya. What started as a personal blog
                      sharing faith reflections and organic recipes quickly grew
                      into a community of families seeking a more integrated,
                      faith‑filled life.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      Growing Together
                    </h3>
                    <p className="text-gray-600">
                      Today, we provide free study materials, sell organic seeds
                      and produce, and offer encouragement through articles on
                      faith, agriculture, homeschooling, and wholesome cooking.
                      All proceeds support our mission to keep resources free
                      and expand our outreach across Kenya.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      Looking Ahead
                    </h3>
                    <p className="text-gray-600">
                      We invite you to join us – whether by downloading a study
                      guide, planting a seed from our shop, or simply praying
                      with us. Together, we grow in faith, family, and farming.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
