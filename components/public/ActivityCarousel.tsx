"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Hammer, HeartHandshake, Lightbulb } from "lucide-react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { lifeSkillPathGuidance, lifeSkillPaths } from "@/lib/life-skills";

import "swiper/css";
import "swiper/css/effect-fade";

const pathwayIcons = [Lightbulb, Hammer, BriefcaseBusiness, HeartHandshake];
const backgroundImages = [
  "/assets/farm1.jpeg",
  "/assets/farm3.jpeg",
  "/assets/preach2.jpeg",
  "/assets/study1.jpeg",
  "/assets/recipe1.jpeg",
];

export default function ActivityCarousel() {
  return (
    <section
      aria-labelledby="our-impact-heading"
      className="relative isolate overflow-hidden bg-emerald-950 py-16 text-white sm:py-20"
    >
      <Swiper
        aria-hidden="true"
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1400}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="absolute inset-0 -z-20 h-full w-full"
      >
        {backgroundImages.map((image) => (
          <SwiperSlide key={image}>
            <div
              className="h-full w-full scale-105 bg-cover bg-center motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
              style={{ backgroundImage: `url(${image})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-950/95 via-emerald-950/88 to-slate-950/92" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-amber-300 ring-1 ring-white/15 backdrop-blur-sm">
            Our Impact
          </p>
          <h2 id="our-impact-heading" className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Transforming Lives Through <span className="text-amber-300">Faith &amp; Action</span>
          </h2>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-amber-300 to-emerald-300" />
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-emerald-50/85">
            From the farm to the classroom, from the pulpit to the printing press &ndash; here&apos;s how we&apos;re making a difference.
          </p>
        </motion.div>

        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
          {lifeSkillPaths.map((path, index) => {
            const Icon = pathwayIcons[index];
            const guidance = lifeSkillPathGuidance[path.id];

            return (
              <motion.article
                key={path.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group h-full w-[86vw] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <Link
                  href={`/practical-christianity?path=${path.id}#get-involved`}
                  aria-label={`${path.action}: ${path.title}`}
                  className="flex h-full min-h-96 flex-col rounded-2xl border border-emerald-900 bg-emerald-950 p-6 text-white shadow-lg transition hover:-translate-y-1 hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.16em] text-amber-300">{path.number}</span>
                    <span className="text-emerald-200">
                      <Icon aria-hidden="true" size={22} />
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-bold">{path.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-emerald-50/85">{path.summary}</p>
                  <p className="mt-5 border-l-2 border-amber-300/80 pl-3 text-sm leading-6 text-emerald-50/90">
                    <span className="font-bold text-amber-200">What it&apos;s for:</span> {guidance.for}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-emerald-50/90">
                    <span className="font-bold text-amber-200">Potential impact:</span> {guidance.impact}
                  </p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-bold text-amber-200 transition group-hover:gap-3 group-hover:text-amber-100">
                    {path.action} <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
