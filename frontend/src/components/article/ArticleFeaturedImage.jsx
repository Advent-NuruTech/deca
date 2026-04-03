// components/article/ArticleFeaturedImage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const ArticleFeaturedImage = ({ image, title }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!image) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        {/* Image Container */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          <motion.img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-[500px] object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

          {/* Zoom Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full"
          >
            <ZoomIn size={20} />
          </motion.div>
        </div>
      </motion.div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </motion.button>

            <motion.img
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              src={getImageUrl(image)}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArticleFeaturedImage;
