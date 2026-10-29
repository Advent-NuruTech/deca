"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    desktop: "/assets/hero/deca-author-create.png",
    mobile: "/assets/hero/deca-author-create-mobile.png",
    alt: "Deca Bookstore author working on a tablet",
  },
  {
    desktop: "/assets/hero/deca-author-learn.png",
    mobile: "/assets/hero/deca-author-learn-mobile.png",
    alt: "Deca Bookstore author working on a laptop outdoors",
  },
  {
    desktop: "/assets/hero/deca-author-grow.png",
    mobile: "/assets/hero/deca-author-grow-mobile.png",
    alt: "Deca Bookstore author using a smartphone in a library",
  },
  {
    desktop: "/assets/hero/deca-author-sell.png",
    mobile: "/assets/hero/deca-author-sell-mobile.png",
    alt: "Deca Bookstore author presenting a tablet at sunset",
  },
] as const;

export default function HomeAuthorHeroCarousel({ preload = true }: { preload?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (isPaused || reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      aria-label="Meet Deca Bookstore"
      className="relative h-full min-h-[360px] overflow-hidden bg-slate-900 sm:min-h-[440px] lg:min-h-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.desktop}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.mobile}
              alt={isActive ? slide.alt : ""}
              fill
              fetchPriority={preload && index === 0 ? "high" : "auto"}
              sizes="(max-width: 1023px) 100vw, 1px"
              className="object-cover object-center lg:hidden"
            />
            <Image
              src={slide.desktop}
              alt={isActive ? slide.alt : ""}
              fill
              fetchPriority={preload && index === 0 ? "high" : "auto"}
              sizes="(min-width: 1024px) 42vw, 1px"
              className="hidden object-cover object-center lg:block"
            />
          </div>
        );
      })}

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/70 px-3 py-2 backdrop-blur sm:bottom-6">
        <span className="sr-only" aria-live="polite">
          Showing image {activeIndex + 1} of {slides.length}: {slides[activeIndex].alt}
        </span>
        {slides.map((slide, index) => (
          <button
            key={slide.desktop}
            type="button"
            aria-label={`Show image ${index + 1}: ${slide.alt}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              index === activeIndex ? "w-7 bg-[#008EFE]" : "w-2.5 bg-white/75 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
