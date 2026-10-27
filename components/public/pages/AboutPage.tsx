import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Droplets,
  HandHeart,
  HeartHandshake,
  Leaf,
  Mail,
  Phone,
  Salad,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const departments = [
  {
    number: "2.1",
    icon: Stethoscope,
    title: "Department of Medical Care and Natural Remedies",
    summary: "This department focuses on health guidance, natural wellness education, and the responsible use of natural remedies.",
    items: [
      "Health consultations and guidance",
      "Basic health assessments, within the scope of applicable qualifications and authorisations",
      "Natural remedies and medicinal plant education",
      "Hydrotherapy and other natural wellness approaches, where appropriately authorised",
      "Patient support, follow-up, and health education",
    ],
  },
  {
    number: "2.2",
    icon: Salad,
    title: "Department of Nutrition and Lifestyle",
    summary: "This department promotes healthy eating habits and lifestyle practices that support general well-being.",
    items: [
      "Nutrition education and healthy-eating guidance",
      "Healthy food preparation and meal planning",
      "Cooking demonstrations and classes",
      "Lifestyle education and healthy daily habits",
      "Physical activity and general wellness education",
      "Hygienic food preparation and healthy food services",
    ],
  },
  {
    number: "2.3",
    icon: HeartHandshake,
    title: "Department of Spiritual Care",
    summary: "This department supports the spiritual and emotional well-being of patients, staff, students, and other people served by the institution.",
    items: [
      "Bible studies and spiritual education",
      "Prayer meetings and devotional activities",
      "Personal spiritual counselling",
      "Moral guidance, encouragement, and compassionate support",
      "Biblical principles related to health and daily living",
      "Participation in spiritual activities respects individual religious freedom",
    ],
  },
  {
    number: "2.4",
    icon: BookOpenCheck,
    title: "Department of Training and Community Services",
    summary: "This department promotes health education, medical missionary learning, and community outreach.",
    items: [
      "Medical missionary education and practical training",
      "Community health education",
      "Health seminars, workshops, and public awareness programmes",
      "Community outreach and charitable service",
      "Home visits and follow-up support, where appropriate",
      "Training in nutrition, natural wellness principles, and healthy living",
    ],
  },
  {
    number: "2.5",
    icon: BriefcaseBusiness,
    title: "Department of Administration and Support Services",
    summary: "This department coordinates the institution's administration and supports the effective operation of all departments.",
    items: [
      "General administration and coordination",
      "Financial management and budgeting",
      "Records management and documentation",
      "Procurement and supplies",
      "Facilities maintenance and safety",
      "Logistics and transport coordination",
      "Administrative reporting and operational support",
    ],
  },
] as const;

const principles = [
  "Faith in God and respect for biblical teachings",
  "Compassion and service to humanity",
  "Integrity and accountability",
  "Respect for human dignity",
  "Equal treatment without discrimination",
  "Health education and preventive wellness",
  "Cooperation, discipline, and responsible service",
] as const;

const servicePillars = [
  { icon: Stethoscope, title: "Physical well-being", text: "Medical Care and Natural Remedies" },
  { icon: Salad, title: "Nutrition and healthy living", text: "Nutrition and Lifestyle" },
  { icon: HeartHandshake, title: "Spiritual well-being", text: "Spiritual Care" },
  { icon: UsersRound, title: "Education and outreach", text: "Training and Community Services" },
  { icon: BriefcaseBusiness, title: "Sustainability", text: "Administration and Support Services" },
] as const;

const contacts = [
  { label: "Safaricom", number: "0742445600" },
  { label: "Airtel", number: "0100967771" },
] as const;

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="relative isolate overflow-hidden bg-sky-950 px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <Image src="/assets/health-wellness-space.png" alt="A calm botanical space for wellbeing learning" fill priority sizes="100vw" className="-z-20 object-cover object-[center_30%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-sky-950 via-sky-950/90 to-sky-950/35" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-300">Gilead Medicare Food and Nutrition Services</p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-sky-200">Institutional Structure</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-200/30 bg-white/10 px-3 py-1.5 text-sm font-semibold text-sky-100 backdrop-blur"><Sparkles className="h-4 w-4 text-sky-300" aria-hidden="true" />Tagline: The Balm of Healing</p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Whole-person care, learning, and service.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-sky-100">Gilead Medicare Food and Nutrition Services is an independent, privately operated institution dedicated to health education, nutrition, natural wellness, spiritual care, medical missionary training, and community service.</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-700"><Leaf className="h-4 w-4" aria-hidden="true" />1. Overview of the institution</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Health is physical, mental, and spiritual.</h2>
            <div className="mt-5 space-y-4 leading-7 text-slate-600">
              <p>The institution follows a holistic approach to health, recognising the relationship between the physical body, the mind, and the spiritual life.</p>
              <p>Its work is guided by biblical principles, compassion, integrity, and a commitment to serving people without discrimination.</p>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-3xl shadow-xl">
            <Image src="/assets/health-herbal-garden.png" alt="A thriving garden of herbs and vegetables" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur"><p className="text-sm font-bold text-sky-950">Care that honours the whole person.</p><p className="mt-1 text-sm leading-5 text-slate-600">Education, encouragement, and responsible wellness practices in one connected mission.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-sky-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">2. Main departments</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">One institution, working together.</h2>
            <p className="mt-4 leading-7 text-slate-600">The institution operates through five main departments. Each department brings focused knowledge and practical service to our shared mission.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {departments.map(({ number, icon: Icon, title, summary, items }) => (
              <article key={title} className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg sm:p-7">
                <div className="flex items-start justify-between gap-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-sky-100 text-sky-700"><Icon className="h-6 w-6" aria-hidden="true" /></span><span className="text-sm font-extrabold tracking-[0.15em] text-sky-600">{number}</span></div>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p>
                <p className="mt-4 text-sm font-semibold text-slate-800">Its areas of work include:</p>
                <ul className="mt-5 space-y-3 border-t border-sky-100 pt-5">
                  {items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 rounded-3xl bg-sky-950 p-6 text-white shadow-xl sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-300"><Droplets className="h-4 w-4" aria-hidden="true" />4. Integrated approach to service</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">The departments are strongest together.</h2><p className="mt-5 max-w-xl leading-7 text-sky-100">The five departments work together to support the institution&apos;s overall mission: physical well-being, nutrition and healthy living, spiritual well-being, education and outreach, and coordination and sustainability.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {servicePillars.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><Icon className="h-5 w-5 text-sky-300" aria-hidden="true" /><h3 className="mt-3 font-bold">{title}</h3><p className="mt-1 text-sm leading-5 text-sky-100">{text}</p></article>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sky-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-700"><UsersRound className="h-4 w-4" aria-hidden="true" />3. Leadership &amp; management</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Clear, accountable leadership.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">The institution&apos;s leadership structure includes a Management Committee and departmental leadership.</p>
            <div className="mt-6 space-y-6 text-sm leading-6 text-slate-600">
              <div><h3 className="text-lg font-bold text-slate-950">3.1 Management Committee</h3><p className="mt-2">The Management Committee is the institution&apos;s principal governance and oversight body.</p><p className="mt-2">Its composition includes: Chairperson, Secretary, Treasurer, and Departmental Leaders.</p></div>
              <div><h3 className="text-lg font-bold text-slate-950">3.2 Departmental Leadership</h3><p className="mt-2">Each department operates under designated leadership responsible for coordinating activities, supporting staff, maintaining accountability, and working with other departments to advance the institution&apos;s objectives.</p></div>
              <div><h3 className="text-lg font-bold text-slate-950">3.3 Administration</h3><p className="mt-2">The Administration Department coordinates day-to-day operations, personnel administration, institutional records, and implementation of approved policies and procedures.</p></div>
            </div>
          </article>
          <article className="relative isolate overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-100 sm:p-8">
            <Image src="/assets/health-whole-foods.png" alt="Fresh whole foods prepared for nutrition learning" fill sizes="(min-width: 1024px) 42vw, 100vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-slate-950/85" />
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-200"><ShieldCheck className="h-4 w-4" aria-hidden="true" />5. Our guiding principles</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">The values behind our service.</h2>
            <ul className="mt-6 grid gap-3 text-sm leading-6 text-sky-50 sm:grid-cols-2">
              {principles.map((principle) => <li key={principle} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />{principle}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-sky-100 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-sky-700"><HandHeart className="h-4 w-4" aria-hidden="true" />Our commitment</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Serving with education, compassion, and care.</h2><p className="mt-5 max-w-2xl leading-7 text-slate-600">Gilead Medicare Food and Nutrition Services seeks to promote physical well-being, healthy living, spiritual encouragement, and community service through education, compassionate care, and responsible wellness practices.</p><Link href="/programmes" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-3 font-bold text-white transition hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700">Explore our programmes <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          <aside className="rounded-2xl bg-sky-50 p-6 ring-1 ring-sky-100"><p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">Official Contacts</p><div className="mt-5 space-y-5"><div><h3 className="font-bold text-slate-950">Main office</h3><div className="mt-3 space-y-2">{contacts.map(({ label, number }) => <a key={number} href={`tel:${number}`} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-sky-900 shadow-sm transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"><Phone className="h-4 w-4 text-sky-600" aria-hidden="true" />{label} {number}</a>)}</div></div><div className="border-t border-sky-200 pt-5"><h3 className="font-bold text-slate-950">Customer Service</h3><div className="mt-3 space-y-2"><a href="tel:0183153489" className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-sky-900 shadow-sm transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"><Phone className="h-4 w-4 text-sky-600" aria-hidden="true" />Gents - 0183153489</a><a href="tel:0183175447" className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-sky-900 shadow-sm transition hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"><Phone className="h-4 w-4 text-sky-600" aria-hidden="true" />Ladies - 0183175447</a></div></div><a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 border-t border-sky-200 pt-5 text-sm font-bold text-sky-800 hover:text-sky-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"><Mail className="h-4 w-4" aria-hidden="true" />Email: {siteConfig.email}</a></div></aside>
        </div>
      </section>
    </main>
  );
}
