// components/WhatWeDo.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Satellite,
  Network,
  Smartphone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const WhatWeDo = () => {
  const services = [
    {
      icon: Code2,
      title: "Software Development",
      description: "Custom software solutions tailored to your business needs.",
      color: "from-blue-400 to-blue-600",
      gradient: "group-hover:from-blue-500 group-hover:to-purple-500",
    },
    {
      icon: Satellite,
      title: "Starlink Kits",
      description:
        "High-speed satellite internet solutions for remote and underserved areas.",
      color: "from-purple-400 to-purple-600",
      gradient: "group-hover:from-purple-500 group-hover:to-pink-500",
    },
    {
      icon: Network,
      title: "Networking Equipment",
      description:
        "Professional networking equipment and installation services for technicians.",
      color: "from-green-400 to-green-600",
      gradient: "group-hover:from-green-500 group-hover:to-blue-500",
    },
    {
      icon: Smartphone,
      title: "Laptops & Phones",
      description:
        "Quality laptops and smartphones from leading manufacturers.",
      color: "from-orange-400 to-orange-600",
      gradient: "group-hover:from-orange-500 group-hover:to-red-500",
    },
    {
      icon: Smartphone,
      title: "CCTV Systems",
      description: "Professional CCTV systems and installation services.",
      color: "from-orange-400 to-orange-600",
      gradient: "group-hover:from-orange-500 group-hover:to-red-500",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
      />

      <div className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
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
                ✦ OUR SERVICES ✦
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
                What We Do
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to your needs
            </p>
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <AnimatedSection
                key={index}
                delay={0.2 + index * 0.1}
                direction="up"
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative h-full"
                >
                  {/* Animated border gradient */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

                  <div className="relative h-full bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-white/10 group-hover:border-transparent transition-all duration-500">
                    {/* Icon with gradient background */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${service.color} p-3 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon className="w-full h-full text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
                      {service.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Learn more link */}
                    <motion.a
                      href="#"
                      className="inline-flex items-center gap-2 text-sm text-gray-500 group-hover:text-purple-400 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Learn more <ArrowRight size={14} />
                    </motion.a>

                    {/* Decorative sparkle */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity }}
                      className="absolute top-4 right-4 text-purple-500/20"
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimatedSection
            delay={0.6}
            direction="up"
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300"
            >
              Explore All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </AnimatedSection>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default WhatWeDo;
