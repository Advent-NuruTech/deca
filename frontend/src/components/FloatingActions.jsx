// components/FloatingActions.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  ChevronUp,
  X,
  Laptop,
  GraduationCap,
  Building2,
  ShoppingCart,
  Globe,
  Satellite,
  HelpCircle,
  Camera,
} from "lucide-react";

const FloatingActions = () => {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // WhatsApp number - replace with your actual number
  const whatsappNumber = "+211929097920"; // Format: country code + number

  // Quick replies for WhatsApp
  const quickReplies = [
    {
      icon: <Laptop className="w-4 h-4" />,
      text: "Laptop prices",
      message:
        "Hi! I'd like to know more about your available laptops and prices.",
    },
    {
      icon: <Satellite className="w-4 h-4" />,
      text: "Starlink Kits",
      message:
        "Hi! I'd like to know more about your available Starlink kits and pricing.",
    },
    {
      icon: <Globe className="w-4 h-4" />,
      text: "Website development",
      message:
        "Hi! I'd like to know more about your available website development services and pricing.",
    },
    {
      icon: <Camera className="w-4 h-4" />,
      text: " CCTV Systems",
      message:
        "Hi! I'd like to know more about your available CCTV systems and pricing.",
    },
    {
      icon: <ShoppingCart className="w-4 h-4" />,
      text: "FancifyBusiness POS",
      message:
        "Hello! I'm interested in FancifyBusiness POS for my business. Can you tell me more about pricing and features?",
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      text: "FancifySchool",
      message:
        "Hi! I'd like to learn more about FancifySchool management system for our institution.",
    },
    {
      icon: <Building2 className="w-4 h-4" />,
      text: "FancifyProperty",
      message:
        "Hello! Tell me more about FancifyProperty software for property management.",
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      text: "Custom solution",
      message:
        "Hi! I'd like to discuss a custom software solution for my business.",
    },
  ];

  // Show back to top button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsWhatsAppOpen(false);
  };

  return (
    <>
      {/* WhatsApp Button with Quick Replies */}
      <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
        {/* Quick reply menu */}
        <AnimatePresence>
          {isWhatsAppOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-20 right-0 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 w-72 overflow-hidden mb-2"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-semibold">Chat with us</h3>
                    <p className="text-green-100 text-sm">
                      How can we help you today?
                    </p>
                  </div>
                  <button
                    onClick={() => setIsWhatsAppOpen(false)}
                    className="text-white/80 hover:text-white bg-black/20 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick replies list */}
              <div className="p-2 max-h-96 overflow-y-auto">
                {quickReplies.map((reply, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => openWhatsApp(reply.message)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl transition-colors text-left group"
                  >
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      {reply.icon}
                    </div>
                    <span className="text-gray-300 group-hover:text-white flex-1 text-sm">
                      {reply.text}
                    </span>
                    <MessageCircle className="w-4 h-4 text-gray-600 group-hover:text-green-400" />
                  </motion.button>
                ))}
              </div>

              {/* Footer with direct chat option */}
              <div className="p-3 border-t border-gray-800">
                <button
                  onClick={() => openWhatsApp("Hello! I have a question.")}
                  className="w-full text-center text-sm text-gray-400 hover:text-green-400 transition-colors"
                >
                  Or send direct message →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main WhatsApp button */}
        <motion.button
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg shadow-green-500/25 relative transition-all ${
            isWhatsAppOpen ? "rotate-45 bg-green-600" : ""
          }`}
          aria-label="Chat on WhatsApp"
        >
          {isWhatsAppOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}

          {/* Pulsing ring - only show when closed */}
          {!isWhatsAppOpen && (
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-green-500 rounded-full -z-10"
            />
          )}

          {/* Unread indicator */}
          {!isWhatsAppOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-[10px] flex items-center justify-center text-white font-bold">
              1
            </span>
          )}
        </motion.button>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-6 z-50 md:bottom-8 md:left-8"
          >
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.9 }}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg shadow-purple-600/25 group relative"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />

              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="18"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="113"
                  strokeDashoffset={
                    113 - 113 * Math.min(window.scrollY / 1000, 1)
                  }
                  className="transition-all duration-300"
                />
              </svg>

              {/* Tooltip */}
              <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-700">
                Back to top
                <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 border-l border-b border-gray-700 rotate-45" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActions;
