// components/home/ServiceDetailModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Wifi,
  WifiOff,
  Clock,
  DollarSign,
  Users,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center">
              <div className="bg-gray-900 rounded-2xl w-full max-w-4xl border border-gray-800 shadow-2xl">
                {/* Header with gradient */}
                <div
                  className={`bg-gradient-to-r ${service.color} p-8 rounded-t-2xl relative`}
                >
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 rounded-full p-2 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                      <div className="text-white">
                        {React.cloneElement(service.icon, {
                          className: "w-12 h-12",
                        })}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {service.title}
                      </h2>
                      <p className="text-white/90 text-lg">
                        {service.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Online/Offline Badge */}
                  <div className="flex items-center gap-4 mb-8 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <span className="text-white">Online Mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <WifiOff className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">Offline Mode</span>
                    </div>
                    <span className="text-sm text-gray-400 ml-auto">
                      Seamless sync when connection is restored
                    </span>
                  </div>

                  {/* Full Description */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Overview
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {service.fullDesc}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Industries/Institutions (if applicable) */}
                  {(service.industries || service.institutions) && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {service.industries ? "Perfect For" : "Designed For"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(service.industries || service.institutions).map(
                          (item) => (
                            <span
                              key={item}
                              className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-sm border border-gray-700"
                            >
                              {item}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Benefits Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800/30 rounded-xl p-4 text-center border border-gray-700">
                      <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">
                        Quick Deployment
                      </span>
                    </div>
                    <div className="bg-gray-800/30 rounded-xl p-4 text-center border border-gray-700">
                      <DollarSign className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">
                        Budget Friendly
                      </span>
                    </div>
                    <div className="bg-gray-800/30 rounded-xl p-4 text-center border border-gray-700">
                      <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">
                        24/7 Support
                      </span>
                    </div>
                    <div className="bg-gray-800/30 rounded-xl p-4 text-center border border-gray-700">
                      <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-300">
                        Secure & Reliable
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/contact">
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2">
                        Request Demo
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <Link to="/contact">
                      <button className="flex-1 bg-gray-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all border border-gray-700">
                        Contact Sales
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ServiceDetailModal;
