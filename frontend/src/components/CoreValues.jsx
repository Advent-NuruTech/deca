// components/CoreValues.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Lightbulb,
  Heart,
  Shield,
  Users,
  Globe2,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const CoreValues = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description:
        "We are committed to delivering the highest quality products and services to our customers, ensuring their satisfaction and success.",
      color: "from-yellow-400 to-orange-400",
      delay: 0.1,
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We embrace creativity and continuously seek new ways to solve problems and improve our services.",
      color: "from-blue-400 to-cyan-400",
      delay: 0.2,
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description:
        "Our customers are at the heart of everything we do. We strive to exceed their expectations.",
      color: "from-red-400 to-pink-400",
      delay: 0.3,
    },
    {
      icon: Shield,
      title: "Integrity",
      description:
        "We conduct our business with honesty, transparency, and respect for all stakeholders.",
      color: "from-green-400 to-emerald-400",
      delay: 0.4,
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We believe in the power of teamwork and collaboration to achieve common goals.",
      color: "from-purple-400 to-indigo-400",
      delay: 0.5,
    },
    {
      icon: Globe2,
      title: "Accessibility",
      description:
        "We ensure that our technology solutions are accessible to everyone, regardless of their background or location.",
      color: "from-teal-400 to-cyan-400",
      delay: 0.6,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Background with tech pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
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
                ⚡ OUR PRINCIPLES ⚡
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
                Core Values
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4" />
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </AnimatedSection>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={value.delay} direction="up">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative h-full"
                >
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                  />

                  <div className="relative h-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                    {/* Icon with gradient circle */}
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="relative mb-6 inline-block"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity`}
                      />
                      <div
                        className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${value.color} p-3 flex items-center justify-center`}
                      >
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Title with gradient on hover */}
                    <h3
                      className={`text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${value.color} transition-all duration-300`}
                    >
                      {value.title}
                    </h3>

                    <p className="text-gray-400 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Decorative elements */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity }}
                      className="absolute bottom-4 right-4 text-purple-500/10"
                    >
                      <Sparkles size={32} />
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
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

export default CoreValues;
