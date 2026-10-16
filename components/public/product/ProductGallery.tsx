"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const validImages = images?.filter(Boolean) ?? [];
  const mainImage = validImages[selectedIndex] || "https://placehold.co/600x400?text=No+Image";
  const next = () => setSelectedIndex((previous) => (previous + 1) % validImages.length);
  const previous = () =>
    setSelectedIndex((current) => (current - 1 + validImages.length) % validImages.length);

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
        <img src={mainImage} alt={name} className="w-full h-full object-cover" />
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              aria-label="Previous product image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next product image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {validImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View product image ${index + 1}`}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                index === selectedIndex ? "border-emerald-500" : "border-transparent"
              }`}
            >
              <img
                src={image}
                alt={`${name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
