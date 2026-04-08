// src/components/order/ShippingInfo.jsx
import React from "react";
import { motion } from "framer-motion";
import { MapPin, User, Phone, Mail, Home } from "lucide-react";

const ShippingInfo = ({ customer, address }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-5">
        <MapPin className="w-5 h-5 text-emerald-500" />
        <h2 className="text-xl font-bold text-gray-800">
          Shipping Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Customer Details
          </h3>

          <div className="space-y-3">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <User size={16} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-gray-800 font-medium">{customer.name}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <Mail size={16} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{customer.email}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <Phone size={16} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{customer.phone}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Delivery Address
          </h3>

          <div className="space-y-3">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <Home size={16} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Street Address</p>
                <p className="text-gray-800">{address.street}</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <MapPin size={16} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">City / County</p>
                <p className="text-gray-800">
                  {address.city}, {address.county}
                </p>
              </div>
            </motion.div>

            {address.postalCode && (
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-start gap-3"
              >
                <MapPin size={16} className="text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="text-gray-800">{address.postalCode}</p>
                </div>
              </motion.div>
            )}

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start gap-3"
            >
              <MapPin size={16} className="text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="text-gray-800">{address.country || "Kenya"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShippingInfo;
