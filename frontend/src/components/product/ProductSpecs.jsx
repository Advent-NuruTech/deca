// components/product/ProductSpecs.jsx
import React from "react";
import { motion } from "framer-motion";
import { Cpu, HardDrive, Monitor, Battery, Wifi, Camera } from "lucide-react";

const ProductSpecs = ({ specifications, brand, model }) => {
  if (!specifications && !brand && !model) return null;

  const getIcon = (key) => {
    const iconMap = {
      processor: Cpu,
      ram: HardDrive,
      storage: HardDrive,
      display: Monitor,
      battery: Battery,
      wifi: Wifi,
      camera: Camera,
    };
    return iconMap[key.toLowerCase()] || Cpu;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <h2 className="text-2xl font-bold mb-6">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
          Technical Specifications
        </span>
      </h2>

      <div className="space-y-6">
        {/* Brand & Model */}
        {(brand || model) && (
          <div className="grid grid-cols-2 gap-4">
            {brand && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Brand</p>
                <p className="text-lg font-semibold text-white">{brand}</p>
              </div>
            )}
            {model && (
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Model</p>
                <p className="text-lg font-semibold text-white">{model}</p>
              </div>
            )}
          </div>
        )}

        {/* Specifications Grid */}
        {specifications && Object.keys(specifications).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(specifications).map(([key, value], index) => {
              const Icon = getIcon(key);
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-4 group hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 group-hover:scale-110 transition-transform">
                    <Icon className="w-full h-full text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-base font-semibold text-white">
                      {value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductSpecs;
