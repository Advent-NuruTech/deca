import Link from "next/link";
import { Mail, MessageSquareText, Phone, ShieldCheck } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import { customerServiceContacts, officialPhoneContacts, siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <main className="bg-sky-50/50">
      <PageHero
        eyebrow="Contact"
        title="Talk with the GILEAD team."
        description="For programme enquiries, health education, healthy-food services, wellness coaching, partnerships or general questions, contact us by email or phone."
        primaryAction={{ href: "mailto:" + siteConfig.email, label: "Email GILEAD" }}
        secondaryAction={{ href: "/invite-gilead", label: "Invite a programme" }}
        aside={<><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">We are here to help</p><h2 className="mt-3 text-2xl font-bold text-slate-950">Get to the right team quickly.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Tell us what you need, where you are and the best way to reach you. We will guide your enquiry to the right place.</p><p className="mt-6 border-t border-slate-200 pt-5 text-sm font-semibold text-[#079326]">For emergencies, contact local emergency services.</p></>}
      />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-sky-100"><Mail className="h-8 w-8 text-[#008EFE]" /><h2 className="mt-5 text-2xl font-bold text-slate-950">Email GILEAD</h2><p className="mt-3 text-sm leading-6 text-slate-600">Tell us what you need and include a phone number if you would like a call back.</p><a href={`mailto:${siteConfig.email}`} className="mt-6 inline-flex break-all rounded-xl bg-[#008EFE] px-5 py-3 font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">{siteConfig.email}</a></article>
          <article className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-sky-100"><MessageSquareText className="h-8 w-8 text-[#008EFE]" /><h2 className="mt-5 text-2xl font-bold text-slate-950">Invite a programme</h2><p className="mt-3 text-sm leading-6 text-slate-600">Share your event details in our invitation form. Your request is sent securely to the GILEAD administration team.</p><Link href="/invite-gilead" className="mt-6 inline-flex rounded-xl border border-[#008EFE] px-5 py-3 font-bold text-[#008EFE] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">Complete an invitation</Link></article>
        </div>
        <section aria-labelledby="official-contact-heading" className="mx-auto mt-8 max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-7"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-[#008EFE]"><Phone className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Official contacts</p><h2 id="official-contact-heading" className="mt-1 text-xl font-bold text-slate-950">Call the right GILEAD team</h2></div></div><div className="mt-6 grid gap-6 sm:grid-cols-2"><div><h3 className="font-bold text-slate-950">Main office</h3><div className="mt-3 space-y-2">{officialPhoneContacts.map(({ label, number }) => <a key={number} href={`tel:${number}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><Phone className="h-4 w-4 text-[#008EFE]" aria-hidden="true" />{label}: {number}</a>)}</div></div><div><h3 className="font-bold text-slate-950">Customer service</h3><div className="mt-3 space-y-2">{customerServiceContacts.map(({ label, number }) => <a key={number} href={`tel:${number}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]"><Phone className="h-4 w-4 text-[#008EFE]" aria-hidden="true" />{label}: {number}</a>)}</div></div></div></section>
        <aside className="mx-auto mt-8 flex max-w-5xl gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-900"><ShieldCheck className="h-6 w-6 shrink-0 text-[#079326]" aria-hidden="true" /><p>GILEAD provides health education and wellness support within its lawful scope and refers clients to licensed medical professionals when medical services are required. Do not use this contact channel for emergencies.</p></aside>
      </section>
    </main>
  );
}
