// src/components/product/RelatedProducts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../products/ProductCard";

const RelatedProducts = ({ category, currentProductId }) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await api.get("/products", {
          params: { category, limit: 4 },
        });
        const filtered = res.data.products.filter(
          (p) => p._id !== currentProductId,
        );
        setProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error(error);
      }
    };
    if (category) fetchRelated();
  }, [category, currentProductId]);
  if (products.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <ProductCard key={product._id} product={product} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
