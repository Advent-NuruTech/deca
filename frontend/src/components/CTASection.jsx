// components/CTASection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Zap, Sparkles, Rocket } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-gray-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute bottom-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 text-purple-500/10 hidden lg:block"
      >
        <Rocket size={100} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-20 right-20 text-blue-500/10 hidden lg:block"
      >
        <Zap size={80} />
      </motion.div>

      <div className="relative container mx-auto px-4 text-center z-10">
        <AnimatedSection delay={0.1} direction="fade">
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block mb-8"
          >
            <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-full text-sm font-semibold text-purple-400">
              ✦ READY TO GET STARTED? ✦
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
              Ready to Transform
            </span>
            <br />
            <span className="text-white">Your Technology?</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Get in touch with us today and discover how Fancy Tech Integration
            can help you achieve your technology goals with our expert solutions
            and support.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-5 rounded-full text-lg font-semibold shadow-2xl shadow-purple-500/30 hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Phone size={20} />
                  Get in Touch
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  animate={{ x: ["0%", "200%"] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 bg-transparent border-2 border-purple-500/50 hover:border-purple-500 text-white px-10 py-5 rounded-full text-lg font-semibold backdrop-blur-sm hover:bg-white/5 transition-all duration-300"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-8 mt-16 text-sm text-gray-500"
          >
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              No hidden fees
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              Free consultation
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" />
              24/7 support
            </span>
          </motion.div>
        </AnimatedSection>
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

export default CTASection;
