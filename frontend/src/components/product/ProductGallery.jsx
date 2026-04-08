// src/components/product/ProductGallery.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductGallery = ({ images, name }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const validImages = images?.filter(Boolean) || [];
  const mainImage =
    validImages[selectedIndex] || "https://placehold.co/600x400?text=No+Image";

  const next = () =>
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  const prev = () =>
    setSelectedIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length,
    );

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square">
        <img
          src={mainImage}
          alt={name}
          className="w-full h-full object-cover"
        />
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full shadow"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === selectedIndex ? "border-emerald-500" : "border-transparent"}`}
            >
              <img
                src={img}
                alt={`${name} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
