"use client";

import { motion } from "framer-motion";
import { Home, Mail, MapPin, Phone, User } from "lucide-react";
import type { OrderCustomer } from "@/lib/types";

export default function ShippingInfo({ customer }: { customer: OrderCustomer }) {
  const address = customer.address ?? {};
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"><div className="flex items-center gap-2 mb-5"><MapPin className="w-5 h-5 text-emerald-500" /><h2 className="text-xl font-bold text-gray-800">Shipping Information</h2></div><div className="grid md:grid-cols-2 gap-6"><div className="space-y-3"><h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Customer Details</h3><Info icon={User} label="Full Name" value={customer.name} /><Info icon={Mail} label="Email" value={customer.email} /><Info icon={Phone} label="Phone" value={customer.phone} /></div><div className="space-y-3"><h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Delivery Address</h3><Info icon={Home} label="Street Address" value={address.street ?? ""} /><Info icon={MapPin} label="City / County" value={[address.city, address.county].filter(Boolean).join(", ")} />{address.postalCode && <Info icon={MapPin} label="Postal Code" value={address.postalCode} />}<Info icon={MapPin} label="Country" value={address.country ?? "Kenya"} /></div></div></motion.div>;
}

function Info({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) { return <div className="flex items-start gap-3"><Icon size={16} className="text-emerald-500 mt-0.5" /><div><p className="text-sm text-gray-500">{label}</p><p className="text-gray-800">{value}</p></div></div>; }
