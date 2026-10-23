"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name, selectedIndex, onSelect }: { images: string[]; name: string; selectedIndex: number; onSelect: (index: number) => void }) {
  const touchStart = useRef<number | null>(null);
  const validImages = images.filter(Boolean);
  const mainImage = validImages[selectedIndex] || "https://placehold.co/600x400?text=No+Image";
  const next = () => onSelect((selectedIndex + 1) % validImages.length);
  const previous = () => onSelect((selectedIndex - 1 + validImages.length) % validImages.length);
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-white" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current === null || validImages.length < 2) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 50) { if (distance < 0) next(); else previous(); } touchStart.current = null; }}>
        <img src={mainImage} alt={name} className="h-full w-full object-contain" />
        {validImages.length > 1 && <><button type="button" onClick={previous} aria-label="Previous product image" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"><ChevronLeft size={20} /></button><button type="button" onClick={next} aria-label="Next product image" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"><ChevronRight size={20} /></button></>}
      </div>
      {validImages.length > 1 && <div className="flex gap-2 overflow-x-auto">{validImages.map((image, index) => <button type="button" key={`${image}-${index}`} onClick={() => onSelect(index)} aria-label={`View product image ${index + 1}`} aria-pressed={index === selectedIndex} className={`h-16 w-16 shrink-0 sm:h-20 sm:w-20 overflow-hidden rounded-lg border-2 ${index === selectedIndex ? "border-emerald-500" : "border-transparent"}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}
    </div>
  );
}
