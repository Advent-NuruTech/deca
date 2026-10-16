"use client";

import type { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Building, FileText, Home, Mail, MapPin, Phone, User } from "lucide-react";

export type CheckoutFormData = {
  name: string;
  email: string;
  phone: string;
  address: { street: string; city: string; county: string; postalCode: string };
  paymentMethod: "mpesa" | "bank_transfer" | "cash_on_delivery";
  shippingMethod: "standard" | "express" | "pickup";
  notes: string;
};

type Props = {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
};

const baseInput = "w-full bg-white border rounded-lg px-4 py-3 pl-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all";

export default function CheckoutForm({ formData, errors, onChange, onSubmit, loading }: Props) {
  const inputClasses = (error?: string) => `${baseInput} ${error ? "border-red-500 focus:ring-red-500/50" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/50"}`;
  const field = (label: string, name: string, value: string, Icon: typeof User, placeholder: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative group">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type={type} name={name} value={value} onChange={onChange} className={inputClasses(errors[name])} placeholder={placeholder} required={!label.startsWith("Postal")} />
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("Full Name *", "name", formData.name, User, "John Doe")}
          {field("Email *", "email", formData.email, Mail, "john@example.com", "email")}
          <div className="md:col-span-2">{field("Phone Number *", "phone", formData.phone, Phone, "+254 700 000 000", "tel")}</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">Shipping Address</h2>
        <div className="space-y-4">
          {field("Street Address *", "address.street", formData.address.street, Home, "123 Main Street")}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {field("City *", "address.city", formData.address.city, Building, "Nairobi")}
            {field("County *", "address.county", formData.address.county, MapPin, "Nairobi County")}
            {field("Postal Code", "address.postalCode", formData.address.postalCode, Mail, "00100")}
          </div>
        </div>
      </motion.div>

      <ChoiceSection title="Shipping Method" delay={0.2}>
        {[
          ["standard", "Standard Delivery", "5-7 business days", 500, "🚚"],
          ["express", "Express Delivery", "2-3 business days", 1500, "⚡"],
          ["pickup", "Pickup from Store", "Available at our store", 0, "🏪"],
        ].map(([method, label, time, rate, icon]) => (
          <Choice key={String(method)} name="shippingMethod" value={String(method)} checked={formData.shippingMethod === method} onChange={onChange} icon={String(icon)} label={String(label)} description={String(time)} trailing={Number(rate) === 0 ? "Free" : `$ ${Number(rate).toLocaleString()}`} />
        ))}
      </ChoiceSection>

      <ChoiceSection title="Payment Method" delay={0.3}>
        {[
          ["mpesa", "M-Pesa", "Pay with M-Pesa", "📱"],
          ["bank_transfer", "Bank Transfer", "Direct bank transfer", "🏦"],
          ["cash_on_delivery", "Cash on Delivery", "Pay when you receive", "💵"],
        ].map(([value, label, description, icon]) => (
          <Choice key={value} name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={onChange} icon={icon} label={label} description={description} />
        ))}
      </ChoiceSection>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">Additional Notes</h2>
        <div className="relative"><FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" /><textarea name="notes" value={formData.notes} onChange={onChange} rows={4} maxLength={2000} className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Any special instructions or notes for your order..." /></div>
      </motion.div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 shadow-sm hover:bg-emerald-700 transition">
        {loading ? "Processing Order..." : "Place Order"}
      </motion.button>
    </form>
  );
}

function ChoiceSection({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><h2 className="text-xl font-bold mb-5 text-gray-800 border-l-3 border-emerald-500 pl-3">{title}</h2><div className="space-y-3">{children}</div></motion.div>;
}

function Choice({ name, value, checked, onChange, icon, label, description, trailing }: { name: string; value: string; checked: boolean; onChange: Props["onChange"]; icon: string; label: string; description: string; trailing?: string }) {
  return <label className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all ${checked ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-emerald-300"}`}><input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" /><div className="flex items-center gap-4 flex-grow"><span className="text-2xl">{icon}</span><div className="flex-grow"><div className="font-semibold text-gray-800">{label}</div><div className="text-sm text-gray-500">{description}</div></div>{trailing && <div className="font-bold text-emerald-600">{trailing}</div>}</div>{checked && <div className="absolute inset-0 border-2 border-emerald-500 rounded-xl pointer-events-none" />}</label>;
}
