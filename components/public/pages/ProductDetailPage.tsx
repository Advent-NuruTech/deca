"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { PublicProduct, ProductVariant } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import SEO from "@/components/public/SEO";
import ProductGallery from "@/components/public/product/ProductGallery";
import ProductInfo from "@/components/public/product/ProductInfo";
import RelatedProducts from "@/components/public/product/RelatedProducts";
import { richTextToPlainText } from "@/lib/rich-text";

export default function ProductDetailPage({ slug }: { slug: string }) {
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProduct(null);
    setVariantId("");
    setImageIndex(0);
    api
      .get<PublicProduct>(`/api/products/${encodeURIComponent(slug)}`)
      .then((response) => {
        if (!cancelled) setProduct(response);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    window.scrollTo(0, 0);
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
            Product Not Found
          </h1>
          <p className="text-gray-600">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg">
            Back to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  const images = [...new Set([...(product.images ?? []), ...(product.variants ?? []).map((item) => item.image || "")].filter(Boolean))];
  const variant = product.variants?.find((item) => item.id === variantId);
  const selectImage = (index: number) => {
    setImageIndex(index);
    const matching = product.variants?.find((item) => item.image && item.image === images[index]);
    setVariantId(matching?.id ?? "");
  };

  const handleAddToCart = (quantity: number, variant?: ProductVariant) => {
    addItem(product, quantity, variant);
    toast.success("Added to cart");
  };

  return (
    <>
      <SEO
        title={product.seoTitle || product.name}
        description={product.seoDescription || richTextToPlainText(product.description)}
        keywords={product.seoKeywords || []}
        image={product.images?.[0]}
        type="product"
      />
      <div className="min-h-screen bg-gray-50 pt-24 pb-32">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-emerald-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,450px)_minmax(0,1fr)] lg:gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <ProductGallery images={images} name={product.name} selectedIndex={imageIndex} onSelect={selectImage} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <ProductInfo product={product} variant={variant} onAddToCart={handleAddToCart} onVariantChange={(option) => { setVariantId(option.id); if (option.image) setImageIndex(images.indexOf(option.image)); }} />
            </motion.div>
          </div>

          <RelatedProducts category={product.category} currentProductId={product._id} />
        </div>
      </div>
    </>
  );
}
