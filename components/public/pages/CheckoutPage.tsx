"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import SEO from "@/components/public/SEO";
import CheckoutAuthGate from "@/components/public/checkout/CheckoutAuthGate";
import CheckoutForm, { type CheckoutFormData, type SavedAddress } from "@/components/public/checkout/CheckoutForm";
import EmptyCheckout from "@/components/public/checkout/EmptyCheckout";
import OrderSummary from "@/components/public/checkout/OrderSummary";
import { api } from "@/lib/api";
import type { PublicOrder } from "@/lib/types";


export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, total: cartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "", email: "", phone: "",
    address: { street: "", city: "", county: "", postalCode: "" },
    notes: "",
  });

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
    }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setAddressesLoading(true);
    api.get<{ addresses: SavedAddress[] }>("/api/account/addresses").then(({ addresses }) => {
      if (!active) return;
      setAddresses(addresses);
      if (addresses[0]) { const a = addresses[0]; setFormData((current) => { if (current.phone || current.address.street || current.address.city || current.address.county) return current; return { ...current, phone: a.phone, address: { street: a.street, city: a.city, county: a.county, postalCode: a.postalCode } }; }); setSelectedAddress(a.id); }
    }).catch(() => { if (active) setAddressError("Saved addresses could not be loaded. You can still enter an address."); }).finally(() => { if (active) setAddressesLoading(false); });
    return () => { active = false; };
  }, [user]);
  const selectAddress = (id: string) => {
    setSelectedAddress(id);
    const a = addresses.find((item) => item.id === id);
    setFormData((current) => ({ ...current, phone: a?.phone ?? current.phone, address: a ? { street: a.street, city: a.city, county: a.county, postalCode: a.postalCode } : { street: "", city: "", county: "", postalCode: "" } }));
  };

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
      if (saveAddress) {
        const saved = await api.put<SavedAddress>("/api/account/addresses", { ...(selectedAddress ? { id: selectedAddress } : {}), ...formData.address, phone: formData.phone });
        setSelectedAddress(saved.id);
        setAddresses((current) => [...current.filter((item) => item.id !== saved.id), saved]);
      }
      const order = await api.post<PublicOrder & { confirmationEmailSent: boolean }>("/api/orders", {
        customer: { name: formData.name, email: formData.email, phone: formData.phone, address: { ...formData.address, country: "Kenya" } },
        items: items.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity })),
        notes: formData.notes,
      });
      clearCart();
      if (order.confirmationEmailSent) toast.success("Order placed! Check your email for confirmation.");
      else toast("Order placed. We could not send a confirmation email; view the details in your account.", { duration: 7000 });
      router.push(`/order-confirmation/${encodeURIComponent(order.orderNumber)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) return <div className="min-h-screen bg-slate-50 pb-16 pt-24"><div className="container mx-auto px-4"><EmptyCheckout /></div></div>;

  return <><SEO title="Checkout" description="Complete your Gilead Medicare order securely. Review your details and delivery address before placing your order." keywords={["Checkout", "Order", "Gilead Medicare", "Kenya"]} /><div className="min-h-screen bg-slate-50 pb-16 pt-24"><div className="container mx-auto max-w-7xl px-4 sm:px-6"><motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b border-slate-200 pb-6"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#079326]">Gilead Medicare</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#008EFE] md:text-5xl">Checkout</h1><p className="mt-3 max-w-2xl text-slate-600">Review your contact and delivery details, then place your order securely.</p></motion.div><CheckoutAuthGate><div className="grid grid-cols-1 gap-8 lg:grid-cols-3"><div className="lg:col-span-2">{addressesLoading ? <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Loading your saved details…</p> : <>{addressError && <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">{addressError}</p>}<CheckoutForm addresses={addresses} selectedAddress={selectedAddress} onSelectAddress={selectAddress} saveAddress={saveAddress} onSaveAddressChange={setSaveAddress} formData={formData} errors={errors} onChange={handleChange} onSubmit={handleSubmit} loading={submitting} /></>}</div><aside className="lg:col-span-1" aria-label="Order summary"><OrderSummary cartItems={items} subtotal={cartTotal} shipping={0} total={cartTotal} /></aside></div></CheckoutAuthGate></div></div></>;
}
