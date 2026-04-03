// pages/ProductDetailPage.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchProduct } from "../store/slices/productSlice";
import { selectCartItems } from "../store/slices/cartSlice";
import SEO from "../components/SEO";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductSpecs from "../components/product/ProductSpecs";
import RelatedProducts from "../components/product/RelatedProducts";
import { getImageUrl } from "../utils/constants";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.products);
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    dispatch(fetchProduct(slug));
    window.scrollTo(0, 0);
  }, [dispatch, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            Product Not Found
          </h1>
          <p className="text-gray-400">
            The product you're looking for doesn't exist.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.description}
        keywords={product.seoKeywords || []}
        image={product.images?.[0] ? getImageUrl(product.images[0]) : null}
        url={`${window.location.origin}/products/${product.slug}`}
        type="product"
      />

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <a href="/" className="hover:text-purple-400 transition-colors">
              Home
            </a>
            <span>/</span>
            <a
              href="/products"
              className="hover:text-purple-400 transition-colors"
            >
              Products
            </a>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </nav>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGallery images={product.images} name={product.name} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductInfo product={product} />
            </motion.div>
          </div>

          {/* Specifications */}
          <div className="mt-12">
            <ProductSpecs
              specifications={product.specifications}
              brand={product.brand}
              model={product.model}
            />
          </div>

          {/* Related Products */}
          <RelatedProducts
            products={[]} // You'll need to fetch related products from your store
            currentProductId={product._id}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
