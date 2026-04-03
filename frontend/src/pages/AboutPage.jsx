// src/pages/AboutPage.jsx
import { motion } from "framer-motion";
import {
  Heart,
  Users,
  Sprout,
  BookOpen,
  Shield,
  HandHeart,
} from "lucide-react";
import SEO from "../components/SEO";
import HeroSection from "../components/HeroSection";
import AnimatedSection from "../components/AnimatedSection";
import { Link } from "react-router-dom";
const AboutPage = () => {
  return (
    <>
      <SEO
        title="About Us | Sami Ministry"
        description="Learn about our faith‑driven mission, family values, sustainable farming, and commitment to providing free study materials and organic products."
      />
      <HeroSection
        badge="Our Story"
        title="Rooted in <span class='text-emerald-600'>Faith</span>,<br />Growing Together"
        subtitle="Sami Ministry was born from a desire to share God's love, live sustainably, and equip families for every good work."
        primaryText="Read Our Mission"
        primaryLink="#mission"
        secondaryText="Get Involved"
        secondaryLink="/donate"
        imageSrc="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        imageAlt="Family praying together"
      />

      {/* Mission & Vision */}
      <section id="mission" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection delay={0.1} direction="up">
              <div className="bg-emerald-50 rounded-2xl p-8 h-full">
                <Heart className="w-12 h-12 text-emerald-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
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
              <div className="bg-amber-50 rounded-2xl p-8 h-full">
                <Shield className="w-12 h-12 text-amber-600 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  A world where every family has access to faith‑based
                  education, wholesome food, and a supportive community that
                  honors God and cares for the land.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values (extended) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              What We Believe
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-3 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Faith First",
                desc: "Every resource and product is rooted in biblical principles and prayer.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Family Centered",
                desc: "We support parents as primary educators and caregivers.",
              },
              {
                icon: <Sprout className="w-8 h-8" />,
                title: "Stewardship",
                desc: "We practice sustainable farming to care for God's earth.",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Free Education",
                desc: "Study materials are always free to download.",
              },
              {
                icon: <HandHeart className="w-8 h-8" />,
                title: "Generosity",
                desc: "A portion of every sale supports community outreach.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Integrity",
                desc: "Honest, transparent, and accountable in all we do.",
              },
            ].map((value, idx) => (
              <AnimatedSection key={idx} delay={0.1 * idx} direction="up">
                <div className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition">
                  <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-600 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Founder (placeholder) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection
            delay={0.1}
            direction="up"
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Journey</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-3 rounded-full" />
          </AnimatedSection>
          <AnimatedSection delay={0.2} direction="up">
            <div className="prose prose-lg text-gray-700 mx-auto space-y-4">
              <p>
                Sami Ministry began as a small family farm and homeschool. What
                started as a personal blog sharing faith reflections and organic
                recipes quickly grew into a community of families seeking a more
                integrated, faith‑filled life.
              </p>
              <p>
                Today, we provide free study materials, sell organic seeds and
                produce, and offer encouragement through articles on faith,
                agriculture, homeschooling, and wholesome cooking. All proceeds
                support our mission to keep resources free and expand our
                outreach.
              </p>
              <p>
                We invite you to join us – whether by downloading a study guide,
                planting a seed from our shop, or simply praying with us.
                Together, we grow.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-amber-50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <HandHeart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Become Part of Our Story
          </h2>
          <p className="text-gray-700 mb-6">
            Support our work or share your own journey with us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/donate"
              className="px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
            >
              Donate Now
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold hover:border-emerald-400 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
