"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
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

const seo = <SEO title="Checkout | Deca Bookstore" description="Complete your Deca Bookstore order securely. Review your details and delivery address before placing your order." keywords={["Checkout", "Book order", "Deca Bookstore", "Kenya"]} />;

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
  const [formData, setFormData] = useState<CheckoutFormData>({ name: "", email: "", phone: "", address: { street: "", city: "", county: "", postalCode: "" }, notes: "" });

  useEffect(() => {
    if (!user) return;
    setFormData((current) => ({ ...current, name: current.name || user.name, email: current.email || user.email }));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setAddressesLoading(true);
    api.get<{ addresses: SavedAddress[] }>("/api/account/addresses").then(({ addresses: savedAddresses }) => {
      if (!active) return;
      setAddresses(savedAddresses);
      if (savedAddresses[0]) {
        const address = savedAddresses[0];
        setFormData((current) => current.phone || current.address.street || current.address.city || current.address.county ? current : { ...current, phone: address.phone, address: { street: address.street, city: address.city, county: address.county, postalCode: address.postalCode } });
        setSelectedAddress(address.id);
      }
    }).catch(() => { if (active) setAddressError("Saved addresses could not be loaded. You can still enter an address."); }).finally(() => { if (active) setAddressesLoading(false); });
    return () => { active = false; };
  }, [user]);

  const selectAddress = (id: string) => {
    setSelectedAddress(id);
    const address = addresses.find((item) => item.id === id);
    setFormData((current) => ({ ...current, phone: address?.phone ?? current.phone, address: address ? { street: address.street, city: address.city, county: address.county, postalCode: address.postalCode } : { street: "", city: "", county: "", postalCode: "" } }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => name.startsWith("address.") ? { ...current, address: { ...current.address, [name.split(".")[1]]: value } } : { ...current, [name]: value });
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
      const order = await api.post<PublicOrder & { confirmationEmailSent: boolean }>("/api/orders", { customer: { name: formData.name, email: formData.email, phone: formData.phone, address: { ...formData.address, country: "Kenya" } }, items: items.map((item) => ({ product: item._id, variantId: item.variantId, quantity: item.quantity })), notes: formData.notes });
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

  if (!items.length) return <>{seo}<div className="min-h-screen bg-slate-50 px-4 pb-16 pt-12 sm:px-6 sm:pt-16"><EmptyCheckout /></div></>;

  return <>{seo}<div className="min-h-screen bg-slate-50 pb-16"><section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><Link href="/cart" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Return to cart</Link><motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="mt-4 overflow-hidden rounded-2xl bg-[#008EFE] p-6 text-slate-950 shadow-sm sm:p-8"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em]">Deca Bookstore</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Secure checkout</h1><p className="mt-3 max-w-2xl text-base leading-7">Review your contact and delivery details, then send your order to the Deca team.</p></div><div className="flex items-center gap-3 rounded-xl border border-slate-950/20 bg-white/80 p-4 text-sm font-semibold"><LockKeyhole className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Your account keeps your order details together.</span></div></div></motion.div></div></section><div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8"><ol aria-label="Checkout steps" className="mb-8 grid gap-3 sm:grid-cols-3">{["Confirm details", "Add delivery address", "Place your order"].map((label, index) => <li key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#079326] text-xs font-black text-white">{index + 1}</span>{label}</li>)}</ol><CheckoutAuthGate><div className="grid grid-cols-1 gap-8 lg:grid-cols-3"><div className="lg:col-span-2">{addressesLoading ? <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Loading your saved details…</p> : <>{addressError && <p role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">{addressError}</p>}<CheckoutForm addresses={addresses} selectedAddress={selectedAddress} onSelectAddress={selectAddress} saveAddress={saveAddress} onSaveAddressChange={setSaveAddress} formData={formData} errors={errors} onChange={handleChange} onSubmit={handleSubmit} loading={submitting} /></>}</div><aside className="lg:col-span-1" aria-label="Order summary"><OrderSummary cartItems={items} subtotal={cartTotal} shipping={0} total={cartTotal} /></aside></div></CheckoutAuthGate><p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-600"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#079326]" aria-hidden="true" />You will receive confirmation after placing your order.</p></div></div></>;
}
