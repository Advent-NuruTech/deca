"use client";

import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { cartItemKey, useCart } from "@/components/providers/CartProvider";
import SEO from "@/components/public/SEO";
import CartItem from "@/components/public/cart/CartItem";
import CartSummary from "@/components/public/cart/CartSummary";
import EmptyCart from "@/components/public/cart/EmptyCart";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} removed from cart`);
  };
  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateQuantity(productId, quantity);
    toast.success("Quantity updated", { duration: 1000 });
  };
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast.success("Cart cleared");
    }
  };

  return (
    <>
      <SEO
        title="Shopping Cart | Gilead Medicare"
        description="View your shopping cart at Gilead Medicare. Review products before checkout."
        keywords={["Cart", "Shopping Cart", "Checkout", "Organic Seeds"]}
      />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">Shopping Cart</span>
            </h1>
            {items.length > 0 && (
              <p className="text-gray-500 mt-2">You have {items.length} {items.length === 1 ? "item" : "items"} in your cart</p>
            )}
          </motion.div>
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <CartItem
                      key={cartItemKey(item)}
                      item={item}
                      index={index}
                      onRemove={handleRemoveItem}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <div className="lg:col-span-1">
                <CartSummary subtotal={total} itemCount={items.length} onClearCart={handleClearCart} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
