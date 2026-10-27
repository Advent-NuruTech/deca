"use client";

import type { ChangeEvent, FormEvent } from "react";
import { MapPin, MessageSquareText, UserRound } from "lucide-react";

export type CheckoutFormData = { name: string; email: string; phone: string; address: { street: string; city: string; county: string; postalCode: string }; notes: string };
export type SavedAddress = { id: string; street: string; city: string; county: string; postalCode: string; phone: string };

type Props = {
  formData: CheckoutFormData;
  errors: Record<string, string>;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  addresses: SavedAddress[];
  selectedAddress: string;
  onSelectAddress: (id: string) => void;
  saveAddress: boolean;
  onSaveAddressChange: (value: boolean) => void;
};

const controlClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#008EFE] focus:ring-2 focus:ring-[#008EFE]";

function SectionHeading({ icon: Icon, step, title, description }: { icon: typeof UserRound; step: string; title: string; description: string }) {
  return <div className="mb-6 flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#008EFE] text-slate-950"><Icon className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Step {step}</p><h2 className="mt-1 text-xl font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{description}</p></div></div>;
}

export default function CheckoutForm({ formData, errors, onChange, onSubmit, loading, addresses, selectedAddress, onSelectAddress, saveAddress, onSaveAddressChange }: Props) {
  const field = (label: string, name: string, value: string, required = true, type = "text") => <div><label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-700">{label}{required && <span aria-hidden="true"> *</span>}</label><input id={name} name={name} type={type} required={required} value={value} onChange={onChange} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-error` : undefined} className={controlClass} />{errors[name] && <p id={`${name}-error`} className="mt-1 text-sm font-medium text-red-700">{errors[name]}</p>}</div>;

  return <form onSubmit={onSubmit} className="space-y-5">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <SectionHeading icon={UserRound} step="1" title="Contact details" description="We’ll use these details to confirm your order and delivery." />
      <div className="grid gap-4 sm:grid-cols-2">{field("Full name", "name", formData.name)}{field("Email", "email", formData.email, true, "email")}<div className="sm:col-span-2">{field("Phone number", "phone", formData.phone, true, "tel")}</div></div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <SectionHeading icon={MapPin} step="2" title="Delivery address" description="Choose a saved address or add the delivery details below." />
      <div className="space-y-4">
        {addresses.length > 0 && <label className="block text-sm font-semibold text-slate-700">Saved addresses<select value={selectedAddress} onChange={(event) => onSelectAddress(event.target.value)} className={`mt-2 ${controlClass}`}><option value="">Add a new address</option>{addresses.map((address) => <option key={address.id} value={address.id}>{address.street}, {address.city}, {address.county}</option>)}</select></label>}
        {field("Street address", "address.street", formData.address.street)}
        <div className="grid gap-4 sm:grid-cols-3">{field("City", "address.city", formData.address.city)}{field("County", "address.county", formData.address.county)}{field("Postal code", "address.postalCode", formData.address.postalCode, false)}</div>
        <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><input type="checkbox" checked={saveAddress} onChange={(event) => onSaveAddressChange(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#079326]" />{selectedAddress ? "Save changes to this address for next time" : "Save this address for next time"}</label>
      </div>
    </section>

    <aside className="rounded-2xl border-l-4 border-[#079326] bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm"><strong className="block text-base text-slate-950">Delivery arrangements</strong><p className="mt-1">The GILEAD team will confirm your details and communicate the parcel fee. The amount shown covers products only.</p></aside>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <SectionHeading icon={MessageSquareText} step="3" title="Order notes" description="Optional information that will help us prepare your order." />
      <textarea id="notes" name="notes" value={formData.notes} onChange={onChange} rows={3} maxLength={2000} className={controlClass} placeholder="Anything else we should know?" />
    </section>

    <button type="submit" disabled={loading} aria-busy={loading} className="flex min-h-14 w-full items-center justify-center rounded-xl bg-[#079326] px-6 py-4 font-bold text-slate-950 shadow-sm transition hover:bg-[#008EFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Placing order…" : "Place order"}</button>
  </form>;
}
