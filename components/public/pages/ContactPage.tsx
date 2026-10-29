import { BookOpenCheck, Mail, PackageCheck, Phone, UsersRound } from "lucide-react";
import PageHero from "@/components/public/PageHero";
import ContactWhatsApp from "@/components/public/ContactWhatsApp";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
  return (
    <main className="bg-slate-50">
      <PageHero eyebrow="Contact Deca Bookstore" title="Let&apos;s find the right revision materials." description="Contact Dennis for book availability, retail orders, wholesale quantities, free delivery information, or author enquiries." primaryAction={{ href: `mailto:${siteConfig.email}`, label: "Email Deca Bookstore" }} secondaryAction={{ href: "/programmes", label: "View catalogue" }} aside={<><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">We can help with</p><h2 className="mt-3 text-2xl font-bold text-slate-950">Books, bulk copies and authors.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Tell us what you need, the learner&apos;s grade, and the quantity you are looking for.</p></>} />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-slate-950">Contact Dennis</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Choose the easiest way to get in touch.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <ContactWhatsApp />
            <a href="tel:0113048435" className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">
              <Phone className="h-7 w-7 text-[#079326]" aria-hidden="true" />
              <h3 className="mt-4 font-bold text-slate-950">Call us</h3>
              <p className="mt-2 font-medium text-[#079326]">0113048435</p>
            </a>
            <a href={`mailto:${siteConfig.email}`} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:ring-[#079326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EFE]">
              <Mail className="h-7 w-7 text-[#008EFE]" aria-hidden="true" />
              <h3 className="mt-4 font-bold text-slate-950">Email</h3>
              <p className="mt-2 break-all font-medium text-[#079326]">{siteConfig.email}</p>
            </a>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><BookOpenCheck className="h-7 w-7 text-[#079326]" /><h2 className="mt-4 font-bold text-slate-950">Revision books</h2><p className="mt-2 text-sm leading-6 text-slate-600">Ask about KJSEA books for Grades 7, 8 and 9.</p></article>
            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><PackageCheck className="h-7 w-7 text-[#079326]" /><h2 className="mt-4 font-bold text-slate-950">Bulk orders</h2><p className="mt-2 text-sm leading-6 text-slate-600">Retail and wholesale copies are available.</p></article>
            <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><UsersRound className="h-7 w-7 text-[#079326]" /><h2 className="mt-4 font-bold text-slate-950">Authors</h2><p className="mt-2 text-sm leading-6 text-slate-600">Get in touch for revision-material author information.</p></article>
          </div>
        </div>
      </section>
    </main>
  );
}
