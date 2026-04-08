// src/components/ActivityCarousel.jsx
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
  Parallax,
} from "swiper/modules";
import { ChevronLeft, ChevronRight, Play, Heart } from "lucide-react";
import recipe1 from "../assets/recipe1.jpeg";
import farm1 from "../assets/farm1.jpeg";
import farm3 from "../assets/farm3.jpeg";
import preach2 from "../assets/preach2.jpeg";
import study1 from "../assets/study1.jpeg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/parallax";

const ActivityCarousel = () => {
  const swiperRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  // Corrected slides data – use the imported image directly
  const slides = [
    {
      id: 1,
      title: "Organic Farming Training",
      description:
        "Hands‑on workshops teaching sustainable agriculture and permaculture.",
      image: farm1, // direct imported path
      color: "from-emerald-600 to-teal-600",
    },
    {
      id: 2,
      title: "Homeschooling Support",
      description:
        "Equipping parents with resources and community for joyful learning.",
      image: farm3,
      color: "from-blue-600 to-indigo-600",
    },
    {
      id: 3,
      title: "Preaching & Outreach",
      description:
        "Sharing God's love through evangelism and community events.",
      image: preach2,
      color: "from-amber-600 to-orange-600",
    },
    {
      id: 4,
      title: "Publishing Study Materials",
      description: "Creating free downloadable PDFs, guides, and devotionals.",
      image: study1,
      color: "from-purple-600 to-pink-600",
    },
    {
      id: 5,
      title: "Hygienic Cookery Classes",
      description:
        "Cooking classes to teach hygienic food preparation and nutrition.",
      image: recipe1,
      color: "from-rose-600 to-pink-600",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Transforming Lives Through
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              {" "}
              Faith & Action
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto mt-4 rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From the farm to the classroom, from the pulpit to the printing
            press – here’s how we’re making a difference.
          </p>
        </motion.div>
      </div>

      <div className="relative w-full">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade, Parallax]}
          effect="fade"
          speed={1000}
          parallax={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          loop={true}
          className="w-full h-[70vh] min-h-[500px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                {/* Background Image – now using the imported string URL */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                  data-swiper-parallax="-30%"
                />
                {/* Overlay Gradient – reduced opacity slightly for better image visibility */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.color} mix-blend-multiply opacity-60`}
                />
                <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                  <div
                    className="max-w-3xl mx-auto"
                    data-swiper-parallax="-100"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h3 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                        {slide.title}
                      </h3>
                      <p className="text-lg md:text-xl mb-8 drop-shadow-md">
                        {slide.description}
                      </p>
                      <button className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition">
                        Learn More <Play className="w-4 h-4 fill-white" />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default ActivityCarousel;
