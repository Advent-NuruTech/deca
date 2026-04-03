// components/admin/RecentProductsTable.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Edit, Eye, Package } from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const RecentProductsTable = ({ products }) => {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Products Yet</h3>
        <p className="text-gray-400 mb-6">
          Create your first product to get started
        </p>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Create Product
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Recent Products
          </span>
        </h2>
        <Link
          to="/admin/products"
          className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.slice(0, 5).map((product, index) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={16} className="text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-400 capitalize">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-purple-400">
                    $ {product.price?.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <Link
                      to={`/products/${product.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentProductsTable;
