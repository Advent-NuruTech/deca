// pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../store/slices/cartSlice";
import { createOrder } from "../store/slices/orderSlice";
import toast from "react-hot-toast";
import SEO from "../components/SEO";
import EmptyCheckout from "../components/checkout/EmptyCheckout";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const { loading } = useSelector((state) => state.order);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      county: "",
      postalCode: "",
    },
    paymentMethod: "mpesa",
    shippingMethod: "standard",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const shippingRates = {
    standard: 500,
    express: 1500,
    pickup: 0,
  };

  const shipping = shippingRates[formData.shippingMethod] || 0;
  const total = cartTotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    if (!formData.address.street.trim())
      newErrors["address.street"] = "Street address is required";
    if (!formData.address.city.trim())
      newErrors["address.city"] = "City is required";
    if (!formData.address.county.trim())
      newErrors["address.county"] = "County is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    try {
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: {
            ...formData.address,
            country: "South Sudan",
          },
        },
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || "",
        })),
        subtotal: cartTotal,
        shipping,
        total,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: formData.notes,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();

      // Clear cart
      dispatch(clearCart());

      // Navigate to order confirmation
      navigate(`/order-confirmation/${result.orderNumber}`);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error(error || "Failed to place order. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <EmptyCheckout />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Checkout"
        description="Complete your order at Fancy Tech Integration South Sudan. Secure checkout for all your technology needs."
        keywords={["Checkout", "Order", "Payment"]}
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
                Checkout
              </span>
            </h1>
            <p className="text-gray-400 mt-2">
              Complete your order by providing your details below
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutForm
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                subtotal={cartTotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
