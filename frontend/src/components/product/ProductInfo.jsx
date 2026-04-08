// src/components/product/ProductInfo.jsx
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";

const ProductInfo = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stockQuantity) setQuantity(newQty);
  };

  const handleAdd = () => {
    onAddToCart(quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        {product.name}
      </h1>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-emerald-600">
          ${product.price}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-gray-400 line-through">
            ${product.originalPrice}
          </span>
        )}
      </div>
      <div className="mb-4">
        <span
          className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <p className="text-gray-600 mb-6">{product.description}</p>
      {product.features && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Key Features</h3>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {product.features}
          </p>
        </div>
      )}
      {product.inStock && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-gray-800">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
