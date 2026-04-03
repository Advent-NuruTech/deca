// components/home/HeroSection.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Code2,
  Cloud,
  Shield,
  ArrowRight,
  ChevronDown,
  Github,
  Twitter,
  Linkedin,
  Sparkles,
  Cpu,
  Globe2,
  Database,
  Box,
  Braces,
  Workflow,
  Fingerprint,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomeHero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [glitchText, setGlitchText] = useState(false);

  // Track mouse for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Glitch effect interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingIconsVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: (custom) => ({
      scale: 1,
      opacity: custom.opacity || 0.2,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        delay: custom.delay || 0,
      },
    }),
    float: (custom) => ({
      y: [custom.yOffset || -20, custom.yOffset || 20, custom.yOffset || -20],
      x: [custom.xOffset || -10, custom.xOffset || 10, custom.xOffset || -10],
      rotate: [custom.rotate || -5, custom.rotate || 5, custom.rotate || -5],
      transition: {
        duration: custom.duration || 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  const techStack = [
    {
      Icon: Code2,
      color: "text-blue-400",
      delay: 0,
      x: -400,
      y: -200,
      rotate: -10,
    },
    {
      Icon: Cloud,
      color: "text-cyan-400",
      delay: 0.2,
      x: 400,
      y: -150,
      rotate: 15,
    },
    {
      Icon: Database,
      color: "text-green-400",
      delay: 0.4,
      x: -350,
      y: 200,
      rotate: 5,
    },
    {
      Icon: Shield,
      color: "text-purple-400",
      delay: 0.6,
      x: 350,
      y: 180,
      rotate: -15,
    },
    {
      Icon: Cpu,
      color: "text-orange-400",
      delay: 0.8,
      x: -300,
      y: -250,
      rotate: 20,
    },
    {
      Icon: Globe2,
      color: "text-indigo-400",
      delay: 1,
      x: 300,
      y: 220,
      rotate: -20,
    },
    {
      Icon: Braces,
      color: "text-pink-400",
      delay: 1.2,
      x: -250,
      y: 250,
      rotate: 12,
    },
    {
      Icon: Workflow,
      color: "text-yellow-400",
      delay: 1.4,
      x: 250,
      y: -220,
      rotate: -12,
    },
    {
      Icon: Fingerprint,
      color: "text-red-400",
      delay: 1.6,
      x: -200,
      y: -280,
      rotate: 8,
    },
    {
      Icon: Box,
      color: "text-teal-400",
      delay: 1.8,
      x: 200,
      y: 280,
      rotate: -8,
    },
  ];

  return (
    <section className="relative pt-8 md:pt-2 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{
              opacity: Math.random() * 0.3,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: mousePosition.x * 2,
          y: mousePosition.y * 2,
        }}
      />
      <motion.div
        className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{
          x: mousePosition.x * -2,
          y: mousePosition.y * -2,
        }}
      />

      {/* Floating tech icons */}
      {techStack.map(({ Icon, color, delay, x, y, rotate }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{
            left: "50%",
            top: "50%",
            x: x,
            y: y,
            rotate: rotate,
          }}
          variants={floatingIconsVariants}
          initial="hidden"
          animate={inView ? ["visible", "float"] : "hidden"}
          custom={{
            delay,
            opacity: 0.15,
            yOffset: Math.random() * 30 - 15,
            xOffset: Math.random() * 20 - 10,
            rotate: Math.random() * 10 - 5,
            duration: Math.random() * 4 + 4,
          }}
        >
          <Icon size={40} />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative container mx-auto px-4 min-h-screen flex items-center pt-24">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto text-center relative z-10"
        >
          {/* Animated badge */}
          <motion.div variants={itemVariants} className="inline-block mb-8">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(139, 92, 246, 0.4)",
                  "0 0 0 20px rgba(139, 92, 246, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-6 py-2 rounded-full"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
                ✦ POWERING THE FUTURE OF SOUTH SUDAN TECH ✦
              </span>
            </motion.div>
          </motion.div>

          {/* Main heading with glitch effect */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-6 relative"
          >
            <span className="relative inline-block">
              <span
                className={`bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text ${glitchText ? "opacity-50" : ""}`}
              >
                Innovate
              </span>
              {glitchText && (
                <>
                  <span
                    className="absolute top-0 left-0 text-red-400 opacity-70 animate-pulse"
                    style={{
                      clipPath: "inset(5% 0 10% 0)",
                      transform: "translate(-2px, -2px)",
                    }}
                  >
                    Innovate
                  </span>
                  <span
                    className="absolute top-0 left-0 text-blue-400 opacity-70 animate-pulse"
                    style={{
                      clipPath: "inset(20% 0 30% 0)",
                      transform: "translate(2px, 2px)",
                    }}
                  >
                    Innovate
                  </span>
                </>
              )}
            </span>
            <br />
            <span className="text-white">Build</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 text-transparent bg-clip-text">
              Integrate
            </span>
          </motion.h1>

          {/* Typewriter effect description */}
          <motion.div variants={itemVariants} className="mb-12">
            <TypewriterText />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Link to="/contact">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full font-semibold text-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-white flex items-center gap-2">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </Link>

            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05, borderColor: "#8b5cf6" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full font-semibold text-lg bg-transparent border-2 border-white/30 hover:border-purple-500 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <span className="relative text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  See Our Work
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Tech stack showcase */}
          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-gray-400 mb-4">Trusted by companies using</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {["React", "Node.js", "Python", "AWS", "Express", "MongoDB"].map(
                (tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.7, y: 0 }}
                    transition={{ delay: 2 + i * 0.1 }}
                    className="text-gray-400 font-mono text-sm"
                  >
                    {tech}
                  </motion.span>
                ),
              )}
            </div>
          </motion.div>

          {/* Social proof / client logos */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4"
          >
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -3, color: "#8b5cf6" }}
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator with animated rings */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-purple-500"
          />
          <ChevronDown className="relative text-white w-6 h-6" />
        </div>
      </motion.div>
    </section>
  );
};

// Typewriter effect component
const TypewriterText = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const phrases = [
    "We turn complex problems into elegant solutions",
    "Your vision, our software, amazing results",
    "Building the future, one line of code at a time",
    "Where creativity meets technology",
  ];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1),
      );

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, isDeleting ? 50 : 100);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases]);

  return (
    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto h-16">
      {text}
      <span className="animate-pulse">|</span>
    </p>
  );
};

export default HomeHero;
