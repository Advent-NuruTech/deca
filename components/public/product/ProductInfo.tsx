"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import type { PublicProduct, ProductVariant } from "@/lib/types";
import { sanitizeRichText } from "@/lib/rich-text";

export default function ProductInfo({
  product,
  onAddToCart,
  onVariantChange,
  variant,
}: {
  product: PublicProduct;
  onAddToCart: (quantity: number, variant?: ProductVariant) => void;
  onVariantChange: (variant: ProductVariant) => void;
  variant?: ProductVariant;
}) {
  const { itemCount } = useCart();
  const minimumQuantity = product.saleType === "wholesale" ? Math.max(2, product.minimumOrderQuantity ?? 2) : 1;
  const [quantity, setQuantity] = useState(minimumQuantity);
  const [added, setAdded] = useState(false);
  useEffect(() => { setQuantity(minimumQuantity); }, [minimumQuantity, variant?.id]);

  const stock = product.variants?.length ? variant?.stockQuantity ?? 0 : product.stockQuantity;
  const available = (product.variants?.length ? stock > 0 : product.inStock && stock > 0) && stock >= minimumQuantity;

  const handleQuantityChange = (delta: number) => {
    const next = quantity + delta;
    if (next >= minimumQuantity && next <= stock) setQuantity(next);
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
        <span className="text-3xl font-bold text-[#079326]">{variant ? `KES ${variant.price.toLocaleString()}` : product.variants?.length ? `From KES ${product.price.toLocaleString()}` : `KES ${product.price.toLocaleString()}`}</span>
        {!variant && product.originalPrice && product.originalPrice > product.price && (
          <span className="text-gray-400 line-through">KES {product.originalPrice}</span>
        )}
      </div>
      <div className="mb-4">
        <span className={`text-sm font-medium ${available ? "text-green-600" : "text-red-600"}`}>
          {product.variants?.length && !variant ? "Choose an option" : available ? "In Stock" : "Out of Stock"}
        </span>
      </div>
      {product.saleType === "wholesale" && <div className="mb-5 rounded-xl border border-[#008EFE] bg-slate-50 p-4"><p className="font-bold text-slate-950">Wholesale product</p><p className="mt-1 text-sm text-slate-600">Minimum order: {minimumQuantity} units{variant ? ` of ${variant.name}` : ""}.</p></div>}
      <div className="prose mb-6 max-w-none text-gray-600 [--tw-prose-links:#079326]" dangerouslySetInnerHTML={{ __html: sanitizeRichText(product.description) }} />
      {Boolean(product.variants?.length) && <fieldset className="mb-6"><legend className="mb-2 font-semibold text-gray-800">Choose a size or option</legend><div className="flex flex-wrap gap-2">{product.variants!.map((option) => <label key={option.id} className={`cursor-pointer rounded-lg border px-4 py-3 text-sm ${variant?.id === option.id ? "border-[#008EFE] bg-slate-50 text-slate-950" : "border-gray-300"}`}><input type="radio" name="variant" value={option.id} checked={variant?.id === option.id} onChange={() => { setQuantity(minimumQuantity); onVariantChange(option); }} className="mr-2 accent-[#079326]" />{option.name} - KES {option.price.toLocaleString()}{option.stockQuantity < minimumQuantity && " - Minimum unavailable"}</label>)}</div></fieldset>}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex shrink-0 items-center rounded-lg border border-gray-200">
            <button type="button" onClick={() => handleQuantityChange(-1)} disabled={!available || quantity <= minimumQuantity} aria-label="Decrease quantity" className="p-3 text-gray-700 disabled:opacity-40"><Minus size={16} /></button>
            <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
            <button type="button" onClick={() => handleQuantityChange(1)} disabled={!available || quantity >= stock} aria-label="Increase quantity" className="p-3 text-gray-700 disabled:opacity-40"><Plus size={16} /></button>
          </div>
          <button type="button" onClick={handleAdd} disabled={!available || stock < minimumQuantity} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#079326] px-3 text-sm font-semibold text-white transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:cursor-not-allowed disabled:opacity-50">
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}{added ? "Added to Cart" : product.variants?.length && !variant ? "Choose an option" : available ? "Add to Cart" : "Out of Stock"}
          </button>
          {itemCount > 0 && <Link href="/checkout" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#008EFE] px-4 text-sm font-semibold text-[#079326] transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] sm:w-auto">Proceed to Checkout</Link>}
        </div>
      </div>
    </div>
  );
}
