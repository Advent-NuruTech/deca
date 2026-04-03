// pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import EmptyCart from "../components/cart/EmptyCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const handleRemoveItem = (productId, productName) => {
    dispatch(removeFromCart(productId));
    toast.success(`${productName} removed from cart`);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ productId, quantity: parseInt(newQuantity) }));
    toast.success("Quantity updated", { duration: 1000 });
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  return (
    <>
      <SEO
        title="Shopping Cart"
        description="View your shopping cart at Fancy Tech Integration South Sudan. Review your selected products before checkout."
        keywords={["Cart", "Shopping Cart", "Checkout"]}
      />

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
                Shopping Cart
              </span>
            </h1>
            {cartItems.length > 0 && (
              <p className="text-gray-400 mt-2">
                You have {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            )}
          </motion.div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      index={index}
                      onRemove={handleRemoveItem}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary
                  subtotal={cartTotal}
                  itemCount={cartItems.length}
                  onClearCart={handleClearCart}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
