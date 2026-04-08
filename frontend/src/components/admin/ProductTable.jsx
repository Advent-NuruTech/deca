// src/components/admin/ProductTable.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getImageUrl } from "../../utils/constants";

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const getCategoryColor = (category) => {
    const colors = {
      seeds: "bg-emerald-100 text-emerald-700 border-emerald-200",
      produce: "bg-green-100 text-green-700 border-green-200",
      other: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentProducts.map((product, index) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
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
                  <div className="text-sm font-semibold text-emerald-700">
                    KSH {product.price?.toLocaleString()}
                  </div>
                  {product.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      KSH {product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    <span className="text-sm text-gray-600">
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
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : product.status === "draft"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.featured ? (
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(product._id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                    <a
                      href={`/products/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
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
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft size={18} />
            </motion.button>
            <span className="text-sm text-gray-600">
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
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
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
