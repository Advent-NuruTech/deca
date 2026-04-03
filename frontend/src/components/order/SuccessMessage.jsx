// components/order/SuccessMessage.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Clock, Mail } from "lucide-react";

const SuccessMessage = ({ orderNumber, createdAt }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 text-center relative overflow-hidden"
    >
      {/* Animated background circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"
      />

      <div className="relative z-10">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="inline-block mb-6"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
            <CheckCircle size={48} className="text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold mb-3"
        >
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
            Order Placed Successfully!
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg mb-4 max-w-2xl mx-auto"
        >
          Thank you for your order. We've received your order and will begin
          processing it right away.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3"
        >
          <Package size={18} className="text-purple-400" />
          <span className="text-white font-medium">Order #{orderNumber}</span>
          <span className="w-1 h-1 bg-gray-500 rounded-full" />
          <Clock size={18} className="text-blue-400" />
          <span className="text-gray-300">{formatDate(createdAt)}</span>
        </motion.div>

        {/* Email notification */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400"
        >
          <Mail size={14} />
          <span>A confirmation email has been sent to your inbox</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SuccessMessage;
