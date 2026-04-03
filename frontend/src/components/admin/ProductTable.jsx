// components/admin/ProductTable.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  MoreVertical,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const getCategoryColor = (category) => {
    const colors = {
      starlink: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      networking: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      laptops: "bg-green-500/20 text-green-400 border-green-500/30",
      phones: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      software: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      cctv: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return (
      colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
    );
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {currentProducts.map((product, index) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-r from-purple-500/20 to-blue-500/20">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {product._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(product.category)}`}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-purple-400">
                    $ {product.price?.toLocaleString()}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-gray-500 line-through">
                      $ {product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-400" : "bg-red-400"}`}
                    />
                    <span className="text-sm text-gray-300">
                      {product.inStock
                        ? product.stockQuantity || "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "active"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : product.status === "draft"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.featured ? (
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(product._id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                    <a
                      href={`/products/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="View Product"
                    >
                      <Eye size={16} />
                    </a>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, products.length)} of {products.length}{" "}
            products
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductTable;
