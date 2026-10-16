"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import SEO from "@/components/public/SEO";
import CheckoutAuthGate from "@/components/public/checkout/CheckoutAuthGate";
import CheckoutForm, { type CheckoutFormData } from "@/components/public/checkout/CheckoutForm";
import EmptyCheckout from "@/components/public/checkout/EmptyCheckout";
import OrderSummary from "@/components/public/checkout/OrderSummary";
import { api } from "@/lib/api";
import type { PublicOrder } from "@/lib/types";

const shippingRates = { standard: 500, express: 1500, pickup: 0 } as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total: cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "", email: "", phone: "",
    address: { street: "", city: "", county: "", postalCode: "" },
    paymentMethod: "mpesa", shippingMethod: "standard", notes: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
    }));
  }, [user]);

  const shipping = shippingRates[formData.shippingMethod];
  const total = cartTotal + shipping;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => name.startsWith("address.")
      ? { ...current, address: { ...current.address, [name.split(".")[1]]: value } }
      : { ...current, [name]: value });
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) next.email = "Email is invalid";
    if (!formData.phone.trim()) next.phone = "Phone number is required";
    else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) next.phone = "Phone number is invalid";
    if (!formData.address.street.trim()) next["address.street"] = "Street address is required";
    if (!formData.address.city.trim()) next["address.city"] = "City is required";
    if (!formData.address.county.trim()) next["address.county"] = "County is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return toast.error("Please fill in all required fields correctly");
    if (!items.length) return router.push("/cart");
    setSubmitting(true);
    try {
      const order = await api.post<PublicOrder>("/api/orders", {
        customer: { name: formData.name, email: formData.email, phone: formData.phone, address: { ...formData.address, country: "Kenya" } },
        items: items.map((item) => ({ product: item._id, quantity: item.quantity })),
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: formData.notes,
      });
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation/${encodeURIComponent(order.orderNumber)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) return <div className="min-h-screen bg-gray-50 pt-24 pb-16"><div className="container mx-auto px-4"><EmptyCheckout /></div></div>;

  return <><SEO title="Checkout | RemSam Homestead" description="Complete your order at RemSam Homestead. Secure checkout for organic seeds, fresh produce, and other farm products." keywords={["Checkout", "Order", "Payment", "Organic Seeds", "Kenya"]} /><div className="min-h-screen bg-gray-50 pt-24 pb-16"><div className="container mx-auto px-4"><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8"><h1 className="text-4xl md:text-5xl font-bold"><span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-transparent bg-clip-text">Checkout</span></h1><p className="text-gray-500 mt-2">Complete your order by providing your details below</p></motion.div><CheckoutAuthGate><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2"><CheckoutForm formData={formData} errors={errors} onChange={handleChange} onSubmit={handleSubmit} loading={submitting} /></div><div className="lg:col-span-1"><OrderSummary cartItems={items} subtotal={cartTotal} shipping={shipping} total={total} /></div></div></CheckoutAuthGate></div></div></>;
}
