"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { api } from "@/lib/api";

type InvitationForm = {
  contactName: string;
  organisation: string;
  email: string;
  phone: string;
  eventName: string;
  eventDate: string;
  preferredTime: string;
  duration: string;
  venue: string;
  townCounty: string;
  expectedAttendance: string;
  audience: string;
  requestedTopics: string;
  facilitatorPreference: string;
  logistics: string;
  message: string;
  consent: boolean;
  website: string;
};

const initialForm: InvitationForm = {
  contactName: "", organisation: "", email: "", phone: "", eventName: "", eventDate: "", preferredTime: "", duration: "", venue: "", townCounty: "", expectedAttendance: "", audience: "", requestedTopics: "", facilitatorPreference: "", logistics: "", message: "", consent: false, website: "",
};

export default function InviteGileadForm() {
  const [form, setForm] = useState<InvitationForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value }));
    setSuccess(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/api/programme-invitations", form);
      setSuccess(true);
      setForm(initialForm);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not send your invitation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-sky-200 bg-white p-5 shadow-sm sm:p-8" aria-describedby="invitation-privacy-note">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-100 pb-6"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Programme invitation</p><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">Tell us about your event.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Fields marked with an asterisk are required. Your details go directly to the GILEAD administration team for follow-up.</p></div><span className="rounded-full bg-sky-100 px-3 py-1.5 text-xs font-bold text-sky-800">Usually replied to in 24–48 hours</span></div>

      <fieldset className="mt-7"><legend className="text-lg font-bold text-slate-950">Your contact details</legend><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field label="Full name" required><input name="contactName" value={form.contactName} onChange={update} required maxLength={120} autoComplete="name" className="input-field" /></Field><Field label="Organisation or church" required><input name="organisation" value={form.organisation} onChange={update} required maxLength={160} autoComplete="organization" className="input-field" /></Field><Field label="Email address" required><input name="email" type="email" value={form.email} onChange={update} required maxLength={254} autoComplete="email" className="input-field" /></Field><Field label="Phone number" required><input name="phone" type="tel" value={form.phone} onChange={update} required minLength={7} maxLength={40} autoComplete="tel" className="input-field" /></Field></div></fieldset>

      <fieldset className="mt-8 border-t border-sky-100 pt-7"><legend className="text-lg font-bold text-slate-950">Event details</legend><div className="mt-4 grid gap-5 sm:grid-cols-2"><Field label="Event or programme name" required><input name="eventName" value={form.eventName} onChange={update} required maxLength={180} className="input-field" /></Field><Field label="Expected attendance" required><input name="expectedAttendance" type="number" value={form.expectedAttendance} onChange={update} required min="1" max="1000000" inputMode="numeric" className="input-field" /></Field><Field label="Preferred date" required><input name="eventDate" type="date" value={form.eventDate} onChange={update} required className="input-field" /></Field><Field label="Preferred session time" required><input name="preferredTime" value={form.preferredTime} onChange={update} required maxLength={100} placeholder="e.g. 10:00 AM–12:00 PM" className="input-field" /></Field><Field label="Time available" required><input name="duration" value={form.duration} onChange={update} required maxLength={100} placeholder="e.g. 2 hours" className="input-field" /></Field><Field label="Venue" required><input name="venue" value={form.venue} onChange={update} required maxLength={250} className="input-field" /></Field><Field label="Town or county" required><input name="townCounty" value={form.townCounty} onChange={update} required maxLength={160} className="input-field" /></Field><Field label="Preferred minister or medical missionary"><input name="facilitatorPreference" value={form.facilitatorPreference} onChange={update} maxLength={160} className="input-field" /></Field><div className="sm:col-span-2"><Field label="Audience and their needs" required><textarea name="audience" value={form.audience} onChange={update} required maxLength={1000} rows={3} className="input-field resize-y" placeholder="Who will attend, and what would be most helpful to them?" /></Field></div><div className="sm:col-span-2"><Field label="Topics you would like covered" required><textarea name="requestedTopics" value={form.requestedTopics} onChange={update} required maxLength={1000} rows={3} className="input-field resize-y" placeholder="For example: nutrition, lifestyle health, natural remedies, family wellbeing…" /></Field></div></div></fieldset>

      <fieldset className="mt-8 border-t border-sky-100 pt-7"><legend className="text-lg font-bold text-slate-950">Practical arrangements</legend><div className="mt-4 grid gap-5"><Field label="Facilities, transport, accommodation or meal arrangements"><textarea name="logistics" value={form.logistics} onChange={update} maxLength={2000} rows={3} className="input-field resize-y" placeholder="Share anything the facilitator should know about arrangements." /></Field><Field label="Anything else we should know?"><textarea name="message" value={form.message} onChange={update} maxLength={2000} rows={3} className="input-field resize-y" /></Field></div></fieldset>

      <div className="sr-only" aria-hidden="true"><label>Leave this field empty<input name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" /></label></div>
      <label className="mt-7 flex items-start gap-3 rounded-xl bg-sky-50 p-4 text-sm leading-6 text-slate-700"><input name="consent" type="checkbox" checked={form.consent} onChange={update} required className="mt-1 h-4 w-4 shrink-0 rounded border-sky-300 text-sky-700 focus:ring-sky-600" /><span>I confirm that GILEAD may use these details to assess this invitation and contact me about this event. <span aria-hidden="true">*</span></span></label>
      <p id="invitation-privacy-note" className="mt-3 text-xs leading-5 text-slate-500">Please do not include medical records or emergency requests. GILEAD will use the information only to coordinate this invitation.</p>
      {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {success && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><CheckCircle2 aria-hidden="true" className="mr-2 inline h-5 w-5 text-emerald-700" /><strong>Invitation received.</strong> The GILEAD administration team will review it and contact you using the details provided.</p>}
      <button disabled={submitting} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 font-bold text-white transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending invitation…" : "Send invitation to GILEAD"}<Send aria-hidden="true" size={17} /></button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-800"><span className="mb-2 block">{label}{required && <span aria-hidden="true" className="text-sky-700"> *</span>}</span>{children}</label>;
}
