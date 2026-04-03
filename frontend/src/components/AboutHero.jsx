// components/about/HeroSection.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code2,
  Users,
  Rocket,
  Globe,
  Shield,
  Cpu,
  ArrowRight,
  Award,
  Briefcase,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const navbar = document.querySelector("nav"); // Adjust selector to match your navbar
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  // Container animation for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Text animation variants
  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Floating icons animation
  const floatingIconVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 0.15,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.5,
      },
    },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Stats card animation
  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: (custom) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 1 + custom * 0.1,
      },
    }),
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 overflow-hidden py-24 lg:py-2">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#00ffff22 1px, transparent 1px), linear-gradient(90deg, #00ffff22 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating tech icons */}
      <motion.div
        className="absolute top-20 left-[10%] text-blue-400"
        variants={floatingIconVariants}
        initial="hidden"
        animate={inView ? ["visible", "float"] : "hidden"}
      >
        <Code2 size={60} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-[10%] text-purple-400"
        variants={floatingIconVariants}
        initial="hidden"
        animate={inView ? ["visible", "float"] : "hidden"}
        custom={{ delay: 0.2 }}
      >
        <Cpu size={70} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-[15%] text-green-400"
        variants={floatingIconVariants}
        initial="hidden"
        animate={inView ? ["visible", "float"] : "hidden"}
        custom={{ delay: 0.4 }}
      >
        <Shield size={50} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-[15%] text-yellow-400"
        variants={floatingIconVariants}
        initial="hidden"
        animate={inView ? ["visible", "float"] : "hidden"}
        custom={{ delay: 0.6 }}
      >
        <Globe size={55} />
      </motion.div>

      {/* Main content container */}
      <div
        className="relative container mx-auto px-4 flex items-center"
        style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }} // Adjust for navbar height
      >
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto text-center"
        >
          {/* Badge/Tag */}
          <motion.div variants={textVariants} className="inline-block mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/30">
              ⚡ Since 2021 • Innovating Tomorrow
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={textVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              We Don't Just Write Code,
            </span>
            <br />
            <span className="text-white">We Build Digital</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
              Experiences
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={textVariants}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            A team of passionate innovators, problem solvers, and tech
            enthusiasts dedicated to transforming complex challenges into
            elegant, scalable solutions that drive business growth.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={textVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Our Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Ask for a Quote
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Briefcase,
                value: "150+",
                label: "Projects Delivered",
                color: "blue",
              },
              {
                icon: Users,
                value: "500+",
                label: "Happy Clients",
                color: "purple",
              },
              {
                icon: Award,
                value: "98%",
                label: "Client Satisfaction",
                color: "yellow",
              },
              {
                icon: ShoppingCart,
                value: "1000+",
                label: "Items Sold",
                color: "orange",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statsVariants}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <stat.icon
                  className={`w-8 h-8 text-${stat.color}-400 mb-3 mx-auto group-hover:scale-110 transition-transform`}
                />
                <div
                  className={`text-2xl font-bold text-${stat.color}-400 mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
