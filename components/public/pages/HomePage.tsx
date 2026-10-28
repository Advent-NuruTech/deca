import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Mail, PackageCheck, Truck, UsersRound } from "lucide-react";
import AnimatedSection from "@/components/public/AnimatedSection";
import HomeAuthorHeroCarousel from "@/components/public/HomeAuthorHeroCarousel";
import { decaAssets } from "@/lib/deca-assets";

const highlights = [
  { icon: BookOpenCheck, title: "KJSEA revision materials", text: "Books that help junior-school learners practise, revise and build confidence." },
  { icon: Truck, title: "Free delivery offered", text: "Get your revision materials delivered at no extra delivery charge." },
  { icon: UsersRound, title: "Retail & wholesale", text: "Order a single copy or ask us about bulky copies for schools and resellers." },
];

const books = [
  { image: decaAssets.juniorSchool, title: "KJSEA Solving Problem Combined", text: "Revision support for Grades 7, 8 and 9." },
  { image: decaAssets.integratedScience, title: "Integrated Science", text: "A KJSEA solving-problem revision book." },
  { image: decaAssets.socialStudies, title: "Social Studies", text: "Practical revision for junior-school learners." },
  { image: decaAssets.mathematics, title: "Mathematics", text: "KJSEA solving-problem practice for Grades 7, 8 and 9." },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="relative mx-auto grid max-w-7xl lg:min-h-[640px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="order-2 relative z-10 px-4 py-10 sm:px-6 sm:py-14 lg:order-1 lg:flex lg:items-end lg:px-8">
            <div className="max-w-3xl border border-white/40 bg-[#008EFE] p-6 text-white shadow-2xl sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/90">Deca Bookstore</p>
              <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Revision materials for learners.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8">Find KJSEA revision books that make practice purposeful. We serve individual learners, parents, schools and bulk buyers.</p>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                <Link href="/programmes" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#079326] px-4 py-4 text-center text-base font-bold text-white shadow-lg transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">View catalogue <ArrowRight className="h-5 w-5" /></Link>
                <Link href="/contact" className="inline-flex min-h-14 items-center justify-center rounded-xl bg-white px-4 py-4 text-center text-base font-bold text-slate-950 shadow-lg transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Contact Deca</Link>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2"><HomeAuthorHeroCarousel /></div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200 md:grid-cols-3 md:p-6">
          {highlights.map(({ icon: Icon, title, text }, index) => <AnimatedSection key={title} direction="jump" delay={index * 0.08} duration={0.45}><article className="flex gap-4 rounded-xl p-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-[#079326]"><Icon className="h-5 w-5" /></span><div><h2 className="font-bold text-slate-950">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></article></AnimatedSection>)}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#008EFE]">Featured books</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Revision books learners can rely on.</h2><p className="mt-4 text-lg leading-8 text-slate-600">Explore the Deca Bookstore selection for junior school. Contact us if you need an author connection or a bulk order.</p></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {books.map((book) => <article key={book.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#008EFE] hover:shadow-lg"><div className="relative aspect-[4/3] bg-slate-100"><Image src={book.image} alt={book.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-contain" /></div><div className="p-6"><h3 className="text-xl font-bold text-slate-950">{book.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{book.text}</p></div></article>)}
          </div>
          <div className="mt-10 text-center"><Link href="/programmes" className="inline-flex items-center gap-2 font-bold text-[#008EFE] hover:text-[#079326] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#008EFE]">Open the 2027 catalogue <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="bg-[#008EFE] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-white/40 bg-[#008EFE] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div><p className="text-sm font-bold uppercase tracking-wider text-white">Authors &amp; wholesale orders</p><h2 className="mt-4 text-3xl font-black tracking-tight text-white">Need more information on revision materials?</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-white">Get in touch to ask about our authors, place a retail order, or arrange bulky copies for your school or business.</p></div>
          <a href="mailto:denniskamau025@gmail.com" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#079326] px-6 py-3.5 font-bold text-white transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><Mail className="h-5 w-5" />Email Deca Bookstore</a>
        </div>
      </section>
    </main>
  );
}
