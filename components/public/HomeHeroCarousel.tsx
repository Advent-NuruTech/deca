"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const heroImages = [
  {
    src: "/assets/health-wellbeing-garden.png",
    alt: "A restorative garden designed for healthy everyday living",
  },
  {
    src: "/assets/health-whole-foods.png",
    alt: "Fresh whole foods arranged for nutrition education",
  },
  {
    src: "/assets/health-wellness-space.png",
    alt: "A welcoming space for wellbeing learning and connection",
  },
  {
    src: "/assets/health-herbal-garden.png",
    alt: "A thriving garden of herbs and vegetables",
  },
] as const;

export default function HomeHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (isPaused || reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % heroImages.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="absolute inset-0 -z-20"
      aria-label="Highlights from GILEAD's health and wellbeing work"
      role="region"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      {heroImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={index === activeIndex ? image.alt : ""}
          fill
          preload={index === 0}
          quality={100}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 motion-reduce:transition-none ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute bottom-5 right-4 z-10 flex items-center gap-2 sm:bottom-7 sm:right-6 lg:right-8">
        <span className="sr-only" aria-live="polite">
          Showing image {activeIndex + 1} of {heroImages.length}: {heroImages[activeIndex].alt}
        </span>
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Show image ${index + 1}: ${image.alt}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              index === activeIndex
                ? "w-8 bg-[#008EFE]"
                : "w-2.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
