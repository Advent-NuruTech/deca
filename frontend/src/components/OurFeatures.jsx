// components/OurFeatures.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Shield,
  Wrench,
  Headphones,
  Zap,
  Sparkles,
} from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const OurFeatures = () => {
  const features = [
    {
      icon: Rocket,
      title: "Fast Delivery",
      description: "Quick and reliable delivery across South Sudan",
      color: "from-purple-400 to-blue-400",
      delay: 0.1,
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "All products come with warranty and support",
      color: "from-green-400 to-emerald-400",
      delay: 0.2,
    },
    {
      icon: Wrench,
      title: "Expert Installation",
      description: "Professional installation services available",
      color: "from-orange-400 to-red-400",
      delay: 0.3,
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      color: "from-blue-400 to-cyan-400",
      delay: 0.4,
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <AnimatedSection delay={0.1} direction="fade">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-semibold text-purple-400">
                ⚡ WHY CHOOSE US ⚡
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text bg-[length:200%] animate-gradient">
                Why Choose F.T.I.?
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're committed to providing the best technology solutions and
              customer experience
            </p>
          </AnimatedSection>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={feature.delay} direction="up">
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative h-full"
              >
                {/* Animated border */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
                />

                <div className="relative h-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 group-hover:border-transparent transition-all duration-500 overflow-hidden">
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

                  {/* Icon with animation */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6 inline-block"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                    />
                    <div
                      className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${feature.color} p-4 flex items-center justify-center`}
                    >
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3
                    className={`text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${feature.color} transition-all duration-300`}
                  >
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative zap */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-4 right-4 text-purple-500/20"
                  >
                    <Zap size={24} />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Stats bar */}
        <AnimatedSection delay={0.5} direction="up" className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
            {[
              { value: "500+", label: "Happy Customers" },
              { value: "1000+", label: "Products Sold" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
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

export default OurFeatures;
