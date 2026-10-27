
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  HeartPulse,
  Leaf,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { serviceAreas, siteConfig } from "@/lib/site-config";

const pillars = [
  {
    icon: HeartPulse,
    title: "Health education",
    text: "Practical preventive-health, lifestyle and family wellness education.",
  },
  {
    icon: Leaf,
    title: "Healthy living",
    text: "Nutrition, whole-food learning, healthy cooking and natural wellness education.",
  },
  {
    icon: UsersRound,
    title: "Community programmes",
    text: "Training, workplace wellness, outreach and tailored group programmes.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative isolate min-h-[560px] overflow-hidden bg-sky-950 text-white">
        <Image
          src="/assets/health-wellbeing-garden.png"
          alt="A restorative garden designed for healthy everyday living"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />

        {/* Lighter overlay to preserve the garden's natural colours */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/35 via-slate-950/10 to-transparent" />

        <div className="mx-auto grid min-h-[560px] max-w-7xl items-end gap-10 px-4 pb-12 pt-6 sm:px-6 sm:pb-16 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          {/* Main hero content */}
          <div className="max-w-3xl">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Healthier people.{" "}
              <span className="text-sky-200">
                Stronger communities.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-50">
              {siteConfig.tagline} From health education and wellness coaching
              to healthy-food services and community outreach, our programmes
              help people make informed wellbeing choices.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/invite-gilead"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-sky-950 shadow-lg transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Invite GILEAD for a programme
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/programmes"
                className="inline-flex items-center justify-center rounded-xl border border-white/50 bg-sky-950/15 px-5 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Explore our programmes
              </Link>
            </div>
          </div>

          <aside className="hidden border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl lg:block sm:p-8">
  <p className="text-sm font-bold uppercase tracking-widest text-sky-700">
    Our commitment
  </p>

  <h2 className="mt-3 text-2xl font-bold text-slate-950">
    Education-first, person-centred support.
  </h2>

  <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
    <li className="flex gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
      <span>Clear education within our recognised and lawful scope.</span>
    </li>

    <li className="flex gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
      <span>
        Appropriate referral to licensed medical professionals where needed.
      </span>
    </li>

    <li className="flex gap-3">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
      <span>
        Tailored programmes for families, institutions and communities.
      </span>
    </li>
  </ul>
</aside>
        </div>
      </section>

      {/* Three pillars */}
      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-sky-100 md:grid-cols-3 md:p-6">
          {pillars.map(({ icon: Icon, title, text }) => (
            <article key={title} className="flex gap-4 rounded-xl p-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                <Icon className="h-5 w-5" />
              </span>

              <div>
                <h2 className="font-bold text-slate-950">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
                What we do
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Learning that reaches everyday life.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-600">
                GILEAD / EDENRISE brings together education, coaching, healthy
                food, community work and referral navigation so organisations
                and households can build lasting wellbeing practices.
              </p>
            </div>

            <figure className="relative min-h-64 overflow-hidden rounded-3xl bg-sky-100 shadow-lg">
              <Image
                src="/assets/health-whole-foods.png"
                alt="Fresh whole foods arranged for nutrition education"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />

              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent px-6 pb-5 pt-16 text-sm font-semibold text-white">
                Practical food and wellbeing learning for real communities.
              </figcaption>
            </figure>
          </div>

          {/* Service areas */}
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {serviceAreas.map((area, index) => (
              <article
                key={area.title}
                className="rounded-2xl border border-sky-100 bg-sky-50/40 p-6 transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg"
              >
                <span className="text-sm font-extrabold text-sky-700">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="mt-3 text-xl font-bold capitalize text-slate-950">
                  {area.title}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                  {area.summary}
                </p>

                <ul className="mt-5 space-y-2 border-t border-sky-100 pt-4 text-sm text-slate-700">
                  {area.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 font-bold text-sky-800 hover:text-sky-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
            >
              View the full programme directory
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-3xl border border-slate-700 bg-slate-900 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sky-300">
              <BookOpenCheck className="h-5 w-5" />
              <p className="text-sm font-bold uppercase tracking-wider">
                For organisations &amp; communities
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight">
              Plan a programme that fits your audience.
            </h2>

            <p className="mt-4 leading-7 text-slate-300">
              Tell us your proposed dates, available time, audience, requested
              topics and facilitation preferences. We will review the
              invitation and confirm the available facilitator.
            </p>
          </div>

          <Link
            href="/invite-gilead"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-sky-500 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-sky-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
          >
            Start an invitation
          </Link>
        </div>
      </section>
    </main>
  );
}
