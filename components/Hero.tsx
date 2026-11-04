"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  { title: "Your Pocket-Sized Library", text: "Add a book, borrow a book, return a book. It is that simple.", img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80" },
  { title: "Share the Books You Love", text: "List your favourite reads and let other readers enjoy them too.", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80" },
  { title: "Borrow for a Few Days", text: "Pick a return date, read at your pace and bring it back when you are done.", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80" },
];

export default function Hero() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="h-[70vh] min-h-[420px]"
    >
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div className="h-full w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${s.img})` }}>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-white">
              <h1 className="text-4xl md:text-6xl font-bold max-w-2xl">{s.title}</h1>
              <p className="mt-4 text-lg md:text-xl max-w-xl opacity-90">{s.text}</p>
              <Link href="/books" className="btn btn-primary text-white mt-8">Browse Books</Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
