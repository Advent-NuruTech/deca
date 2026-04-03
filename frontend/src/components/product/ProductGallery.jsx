// components/product/ProductGallery.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const ProductGallery = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl h-96 flex items-center justify-center text-gray-400 border border-white/10">
        No Image Available
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
        {/* Main Image */}
        <div className="relative group">
          <motion.img
            key={selectedImage}
            src={getImageUrl(images[selectedImage])}
            alt={name}
            className="w-full h-96 object-contain rounded-lg cursor-zoom-in"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsZoomed(true)}
          />

          {/* Zoom indicator */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn size={20} />
          </motion.button>

          {/* Image navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </motion.button>
            </>
          )}
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-2 mt-4">
            {images.slice(0, 5).map((image, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? "border-purple-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${name} ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
                {selectedImage === index && (
                  <motion.div
                    layoutId="selectedIndicator"
                    className="absolute inset-0 bg-purple-500/20"
                  />
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

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
              src={getImageUrl(images[selectedImage])}
              alt={name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductGallery;
