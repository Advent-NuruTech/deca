// pages/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../store/slices/productSlice";
import toast from "react-hot-toast";
import SEO from "../../components/SEO";
import ProductStats from "../../components/admin/ProductStats";
import ProductTable from "../../components/admin/ProductTable";
import ProductModal from "../../components/admin/ProductModal";
import { Package, Plus, Sparkles } from "lucide-react";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete product");
      }
    }
  };

  const handleSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({ id: editingProduct._id, productData }),
        ).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created successfully");
      }
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error(error || "Failed to save product");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <>
      <SEO
        title="Product Management"
        description="Manage products for Fancy Tech Integration South Sudan"
      />

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Product Management
                </span>
              </h1>
              <p className="text-gray-400">
                Manage your product inventory, pricing, and availability
              </p>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity }}
                className="hidden md:block"
              >
                <Sparkles size={32} className="text-purple-400/30" />
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingProduct(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                Add New Product
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <ProductStats products={products} />

          {/* Products Table */}
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          {/* Product Modal */}
          <ProductModal
            isOpen={showModal}
            onClose={handleCloseModal}
            product={editingProduct}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
