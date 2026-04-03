// components/product/ProductInfo.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import toast from "react-hot-toast";
import {
  ShoppingCart,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  Wifi,
  Camera,
} from "lucide-react";

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch();
  const [showFeatures, setShowFeatures] = useState(false);

  const categoryLabels = {
    starlink: "Starlink Kit",
    networking: "Networking Equipment",
    laptop: "Laptop",
    phone: "Phone",
    software: "Software",
    cctv: "CCTV",
  };

  const Ourfeatures = [
    {
      icon: Shield,
      text: "3 months Warranty",
      color: "from-blue-400 to-blue-500",
    },
    {
      icon: Truck,
      text: "Free Delivery",
      color: "from-green-400 to-green-500",
    },
    {
      icon: RotateCcw,
      text: "7-Day Returns",
      color: "from-purple-400 to-purple-500",
    },
  ];

  // Helper function to get appropriate icon for specification
  const getSpecIcon = (key) => {
    const iconMap = {
      processor: Cpu,
      cpu: Cpu,
      ram: HardDrive,
      memory: HardDrive,
      storage: HardDrive,
      harddrive: HardDrive,
      display: Monitor,
      screen: Monitor,
      battery: Battery,
      wifi: Wifi,
      wireless: Wifi,
      camera: Camera,
    };
    const Icon = iconMap[key.toLowerCase()] || Cpu;
    return Icon;
  };

  return (
    <div className="space-y-6">
      {/* Category & Title */}
      <div>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-semibold text-purple-400 mb-4"
        >
          {categoryLabels[product.category] || product.category}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            {product.name}
          </span>
        </motion.h1>

        {/* Overview Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h3 className="text-sm font-semibold text-purple-400 mb-2 uppercase tracking-wider">
            Overview
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            {product.description}
          </p>
        </motion.div>

        {/* Key Features Toggle Button */}
        {product.features && Object.keys(product.features).length > 0 && (
          <motion.button
            onClick={() => setShowFeatures(!showFeatures)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mt-2 group"
            whileHover={{ x: 5 }}
          >
            <span className="text-sm font-medium">
              {showFeatures ? "Hide Key Features" : "See Key Features"}
            </span>
            {showFeatures ? (
              <ChevronUp
                size={16}
                className="group-hover:-translate-y-1 transition-transform"
              />
            ) : (
              <ChevronDown
                size={16}
                className="group-hover:translate-y-1 transition-transform"
              />
            )}
          </motion.button>
        )}
      </div>

      {/* Key Features Collapsible Section */}
      <AnimatePresence>
        {showFeatures && product.features && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
                Technical Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.features).map(([key, value], index) => {
                  const Icon = getSpecIcon(key);
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 bg-white/5 rounded-lg p-3 group hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-1.5 group-hover:scale-110 transition-transform">
                        <Icon className="w-full h-full text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </p>
                        <p className="text-sm font-semibold text-white">
                          {value}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            $ {product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xl text-gray-500 line-through">
              $ {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              product.inStock
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {product.inStock ? (
              <CheckCircle size={18} className="text-green-400" />
            ) : (
              <XCircle size={18} className="text-red-400" />
            )}
            <span className="font-medium">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {product.stockQuantity > 0 && (
            <span className="text-gray-400">
              {product.stockQuantity} units available
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={product.inStock ? { scale: 1.02 } : {}}
          whileTap={product.inStock ? { scale: 0.98 } : {}}
          onClick={() => {
            if (product.inStock) {
              dispatch(addToCart({ product, quantity: 1 }));
              toast.success(`${product.name} added to cart!`);
            }
          }}
          disabled={!product.inStock}
          className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 relative overflow-hidden group ${
            product.inStock
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/30"
              : "bg-gray-700 cursor-not-allowed text-gray-400"
          } transition-all duration-300`}
        >
          {product.inStock ? (
            <>
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add to Cart
              <motion.div
                animate={{ x: ["0%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </>
          ) : (
            "Out of Stock"
          )}
        </motion.button>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3"
      >
        {Ourfeatures.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center group"
          >
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.color} p-2 mx-auto mb-2 group-hover:scale-110 transition-transform`}
            >
              <feature.icon className="w-full h-full text-white" />
            </div>
            <p className="text-xs text-gray-400">{feature.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductInfo;
