// src/components/HeroSection.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Gift } from "lucide-react";

const HeroSection = ({
  title,
  subtitle,
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink,
  imageSrc,
  imageAlt,
  badge,
}) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        {imageSrc && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
        )}
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            {badge && (
              <motion.div variants={fadeUp}>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
                  {badge}
                </span>
              </motion.div>
            )}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <motion.p
              variants={fadeUp}
              className="text-xl text-gray-600 mt-6 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {subtitle}
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link
                to={primaryLink}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:bg-gray-800"
              >
                {primaryText}{" "}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={secondaryLink}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-xl font-semibold hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <Gift size={20} /> {secondaryText}
              </Link>
            </motion.div>
          </motion.div>

          {imageSrc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent mix-blend-multiply" />
              </div>
              {/* Optional floating card - can be customized via children */}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-gray-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
