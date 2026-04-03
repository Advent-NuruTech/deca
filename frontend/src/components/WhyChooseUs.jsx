// components/WhyChooseUs.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Globe2,
  Coins,
  Wrench,
  Target,
  PhoneCall,
  Users,
  Shield,
  Rocket,
  Star,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Zap,
      title: "Fast & Reliable",
      description:
        "Experience lightning-fast internet speeds and reliable connectivity with our Starlink kits.",
      color: "from-yellow-400 to-orange-400",
      stats: "Up to 200 Mbps",
    },
    {
      icon: Globe2,
      title: "Global Coverage",
      description:
        "Access high-speed internet from anywhere in South Sudan with our satellite-based Starlink technology.",
      color: "from-blue-400 to-cyan-400",
      stats: "100% Coverage",
    },
    {
      icon: Coins,
      title: "Affordable Pricing",
      description:
        "Get premium technology solutions at competitive prices tailored to your business needs.",
      color: "from-green-400 to-emerald-400",
      stats: "Best Value",
    },
    {
      icon: Wrench,
      title: "Expert Support",
      description:
        "Our team of experts is always ready to provide technical support whenever you need it.",
      color: "from-purple-400 to-indigo-400",
      stats: "24/7 Support",
    },
    {
      icon: Target,
      title: "Custom Solutions",
      description:
        "We offer tailored technology solutions designed to meet the unique needs of your business.",
      color: "from-red-400 to-pink-400",
      stats: "100% Customizable",
    },
    {
      icon: PhoneCall,
      title: "24/7 Customer Service",
      description:
        "Our dedicated team is available around the clock to assist you with any inquiries.",
      color: "from-teal-400 to-cyan-400",
      stats: "Always Available",
    },
    {
      icon: Users,
      title: "Experience & Expertise",
      description:
        "Years of experience in South Sudan and now expanding to South Sudan, understanding unique regional needs.",
      color: "from-orange-400 to-red-400",
      stats: "5+ Years",
    },
    {
      icon: Shield,
      title: "Warranty & Support",
      description:
        "Comprehensive warranty coverage and dedicated support to protect your technology investments.",
      color: "from-blue-400 to-purple-400",
      stats: "2 Year Warranty",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30" />
      </div>

      {/* Floating elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
          className="absolute"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            opacity: 0.05,
          }}
        >
          <Rocket size={60} />
        </motion.div>
      ))}

      <div className="relative container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <AnimatedSection
            delay={0.1}
            direction="fade"
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-semibold text-purple-400">
                ⭐ WHY PARTNER WITH US ⭐
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
                Why Choose Us
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The advantages of partnering with Fancy Tech Integration
            </p>
          </AnimatedSection>

          {/* Reasons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, index) => (
              <AnimatedSection
                key={index}
                delay={0.1 + index * 0.1}
                direction="up"
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative h-full"
                >
                  {/* Animated card border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${reason.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500`}
                  />

                  <div className="relative h-full bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-transparent transition-all duration-500 overflow-hidden">
                    {/* Background shine effect */}
                    <motion.div
                      animate={{ x: ["0%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
                    />

                    {/* Icon container */}
                    <div className="relative mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${reason.color} p-3 shadow-lg`}
                      >
                        <reason.icon className="w-full h-full text-white" />
                      </motion.div>

                      {/* Stats badge */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`absolute -top-2 -right-2 bg-gradient-to-r ${reason.color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}
                      >
                        {reason.stats}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <h3
                      className={`text-lg font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${reason.color} transition-all duration-300`}
                    >
                      {reason.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed">
                      {reason.description}
                    </p>

                    {/* Decorative star */}
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="absolute bottom-2 right-2 text-purple-500/10"
                    >
                      <Star size={24} />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection
            delay={1}
            direction="up"
            className="text-center mt-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-full p-1"
            >
              <span className="text-gray-400 pl-6">Ready to get started?</span>
              <motion.button
                whileHover={{ x: 5 }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg"
              >
                Contact Us Today
                <Rocket className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
