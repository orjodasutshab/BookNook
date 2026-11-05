"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  { tag: "Community Library", title: "Your Pocket-Sized Library", text: "Add a book, borrow a book, return a book. It is that simple.", img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&q=80" },
  { tag: "Share & Inspire", title: "Share the Books You Love", text: "List your favourite reads and let other readers enjoy them too.", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80" },
  { tag: "Read at Your Pace", title: "Borrow for a Few Days", text: "Pick a return date, read at your pace and bring it back when you are done.", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80" },
];

const stats = [
  { n: "30+", l: "Books" },
  { n: "5", l: "Categories" },
  { n: "24/7", l: "Open" },
];

export default function Hero() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="h-[78vh] min-h-[520px] hero-swiper"
    >
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div className="h-full w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${s.img})` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-start text-white">
              <motion.span
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm bg-white/10 backdrop-blur border border-white/20"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> {s.tag}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-5 text-4xl sm:text-5xl md:text-7xl font-extrabold max-w-3xl leading-tight"
              >
                {s.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 text-base md:text-xl max-w-xl opacity-90"
              >
                {s.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link href="/books" className="btn btn-primary text-white btn-lg">Browse Books</Link>
                <Link href="/add-book" className="btn btn-lg bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur">Add a Book</Link>
              </motion.div>
              <div className="mt-10 flex gap-8 sm:gap-12">
                {stats.map((x) => (
                  <div key={x.l}>
                    <div className="text-2xl sm:text-3xl font-bold">{x.n}</div>
                    <div className="text-sm opacity-70">{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
