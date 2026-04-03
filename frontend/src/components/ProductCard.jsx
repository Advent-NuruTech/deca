// components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { addToCart } from "../store/slices/cartSlice";
import { getImageUrl } from "../utils/constants";
import toast from "react-hot-toast";
import { ShoppingCart, Star, Sparkles, Zap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      dispatch(addToCart({ product, quantity: 1 }));
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error("Product is out of stock");
    }
  };

  const categoryLabels = {
    starlink: "Starlink Kit",
    networking: "Networking",
    laptop: "Laptop",
    phone: "Phone",
    software: "Software",
    accesspoint: "Access Point",
    cctv: "CCTV System",
    router: "Router",
  };

  // Category-based gradients
  const categoryGradients = {
    starlink: "from-purple-500 to-blue-500",
    networking: "from-blue-500 to-cyan-500",
    laptop: "from-green-500 to-emerald-500",
    phone: "from-orange-500 to-red-500",
    software: "from-pink-500 to-rose-500",
    accesspoints: "from-yellow-500 to-amber-500",
    cctv: "from-red-500 to-orange-500",
    router: "from-indigo-500 to-purple-500",
  };

  const gradient =
    categoryGradients[product.category] || "from-purple-500 to-blue-500";

  return (
    <AnimatedSection delay={0.1} direction="up">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative h-full"
      >
        {/* Animated border glow */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500`}
        />

        <div className="relative h-full bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 group-hover:border-transparent transition-all duration-500">
          {/* Image container */}
          <Link to={`/products/${product.slug}`} className="block">
            <div className="relative h-56 overflow-hidden bg-gray-900">
              {product.images && product.images.length > 0 ? (
                <motion.img
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

              {/* Featured badge */}
              {product.featured && (
                <motion.div
                  initial={{ x: 100 }}
                  animate={{ x: 0 }}
                  className="absolute top-4 right-4"
                >
                  <span className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <Star size={12} />
                    Featured
                  </span>
                </motion.div>
              )}

              {/* Category badge */}
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                className={`absolute top-4 left-4 bg-gradient-to-r ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}
              >
                {categoryLabels[product.category] || product.category}
              </motion.div>

              {/* Stock status badge */}
              {!product.inStock && (
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="block bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full text-center">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Product details */}
          <div className="p-5">
            <Link to={`/products/${product.slug}`} className="block group/link">
              <h3
                className={`text-lg font-bold mb-2 text-white group-hover/link:text-transparent group-hover/link:bg-clip-text group-hover/link:bg-gradient-to-r ${gradient} transition-all duration-300 line-clamp-2`}
              >
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {product.description}
            </p>

            {/* Price section */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}
                >
                  ${product.price?.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Quick view indicator */}
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400/50"
              >
                <Zap size={20} />
              </motion.div>
            </div>

            {/* Add to cart button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              whileHover={product.inStock ? { scale: 1.02 } : {}}
              whileTap={product.inStock ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                product.inStock
                  ? `bg-gradient-to-r ${gradient} hover:shadow-lg hover:shadow-purple-500/30`
                  : "bg-gray-700 cursor-not-allowed opacity-50"
              }`}
            >
              <ShoppingCart size={18} />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </motion.button>
          </div>

          {/* Decorative sparkle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-2 right-2 text-purple-500/10"
          >
            <Sparkles size={32} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
};

export default ProductCard;
