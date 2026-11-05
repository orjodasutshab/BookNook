"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Book } from "@/lib/api";

const SPRING = { stiffness: 180, damping: 16, mass: 0.6 };

export default function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const soldOut = book.availableCopies === 0;
  const [broken, setBroken] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 3D tilt that follows the mouse
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const glare = useSpring(0, { stiffness: 120, damping: 20 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.30), transparent 55%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rotateY.set((px - 0.5) * 16);
    rotateX.set(-(py - 0.5) * 16);
    mx.set(px * 100);
    my.set(py * 100);
    glare.set(1);
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glare.set(0);
  };

  const colours = ["7c3aed", "0e7490", "b91c1c", "15803d", "ca8a04", "be123c", "1e40af", "c2410c"];
  const colour = colours[(book.title?.length || 0) % colours.length];
  const fallback = `https://placehold.co/400x600/${colour}/ffffff/png?text=${encodeURIComponent((book.title || "Book").replace(/(.{1,14})(\s|$)/g, "$1\n").trim())}`;

  const pct = book.totalCopies > 0 ? Math.round((book.availableCopies / book.totalCopies) * 100) : 0;
  const barColour = pct > 50 ? "bg-success" : pct > 0 ? "bg-warning" : "bg-error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
      className="h-full"
    >
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover={reduce ? undefined : { scale: 1.035, y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
        className="group relative h-full flex flex-col rounded-2xl border border-base-300 bg-base-100 shadow-md transition-shadow duration-300 hover:border-primary/50 hover:shadow-[0_28px_60px_-18px_rgba(99,102,241,0.55)]"
      >
        <figure className="relative h-56 sm:h-[400px] overflow-hidden rounded-t-2xl bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={broken || !book.image ? fallback : book.image}
            alt={book.title}
            onError={() => setBroken(true)}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          />
          {/* soft shade + description that slides up on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 pt-10 text-white transition-transform duration-500 ease-out group-hover:translate-y-0 sm:p-4 sm:pt-12">
            <p className="line-clamp-3 text-xs sm:text-sm opacity-95">{book.description}</p>
          </div>
        </figure>

        {/* badges float in front of the card */}
        <span className="badge badge-primary absolute left-3 top-3 z-10 text-xs shadow-lg transition-transform duration-300 [transform:translateZ(45px)] group-hover:[transform:translateZ(70px)_scale(1.12)]">
          {book.category}
        </span>
        {soldOut && (
          <span className="badge badge-error absolute right-3 top-3 z-10 text-xs text-white shadow-lg [transform:translateZ(45px)]">
            Not Available
          </span>
        )}

        <div className="card-body flex-1 gap-1 p-3 sm:p-5 [transform:translateZ(24px)]">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug transition-colors duration-300 group-hover:text-primary sm:min-h-[3.5rem] sm:text-lg">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-xs opacity-70 sm:text-sm">by {book.author}</p>

          <div className="mt-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-300">
              <div className={`h-full rounded-full ${barColour} transition-all duration-700 group-hover:brightness-125`} style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-xs opacity-60">{book.availableCopies}/{book.totalCopies} copies left</p>
          </div>

          <div className="card-actions mt-auto pt-2">
            <Link
              href={`/books/${book._id}`}
              className="btn btn-primary relative w-full overflow-hidden text-white btn-sm sm:btn-md group/btn"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              <span className="relative">View Details</span>
              <span className="relative inline-block transition-transform duration-300 group-hover/btn:translate-x-1.5">→</span>
            </Link>
          </div>
        </div>

        {/* moving light reflection */}
        <motion.div
          aria-hidden
          style={{ background: glareBg, opacity: glare }}
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl mix-blend-soft-light"
        />
      </motion.div>
    </motion.div>
  );
}
