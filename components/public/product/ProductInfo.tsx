"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import type { PublicProduct, ProductVariant } from "@/lib/types";
import { sanitizeRichText } from "@/lib/rich-text";

export default function ProductInfo({
  product,
  onAddToCart,
  onVariantChange,
}: {
  product: PublicProduct;
  onAddToCart: (quantity: number, variant?: ProductVariant) => void;
  onVariantChange: (variant: ProductVariant) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [variantId, setVariantId] = useState("");
  const variant = product.variants?.find((v) => v.id === variantId);
  const stock = product.variants?.length ? variant?.stockQuantity ?? 0 : product.stockQuantity;
  const available = product.variants?.length ? stock > 0 : product.inStock && stock > 0;

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= 1 && next <= stock) setQuantity(next);
  };
  const handleAdd = () => {
    onAddToCart(quantity, variant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-emerald-600">{variant ? `KES ${variant.price}` : product.variants?.length ? `From KES ${product.price}` : `KES ${product.price}`}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-gray-400 line-through">KES {product.originalPrice}</span>
        )}
      </div>
      <div className="mb-4">
        <span className={`text-sm font-medium ${available ? "text-green-600" : "text-red-600"}`}>
          {product.variants?.length && !variant ? "Choose an option" : available ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      <div className="prose prose-emerald mb-6 max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeRichText(product.description) }} />
      {Boolean(product.variants?.length) && <fieldset className="mb-6"><legend className="mb-2 font-semibold text-gray-800">Choose a size or option</legend><div className="flex flex-wrap gap-2">{product.variants!.map((option) => <label key={option.id} className={`cursor-pointer rounded-lg border px-4 py-3 text-sm ${variantId === option.id ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-gray-300"}`}><input type="radio" name="variant" value={option.id} checked={variantId === option.id} onChange={() => { setVariantId(option.id); setQuantity(1); onVariantChange(option); }} className="mr-2 accent-emerald-600" />{option.name} - KES {option.price.toLocaleString()}{option.stockQuantity === 0 && " - Out of stock"}</label>)}</div></fieldset>}
      {available && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              aria-label="Decrease quantity"
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-gray-800">{quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              aria-label="Increase quantity"
              className="px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              <Plus size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}
