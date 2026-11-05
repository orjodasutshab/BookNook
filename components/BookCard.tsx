"use client";
import Link from "next/link";
import { useState } from "react";
import type { Book } from "@/lib/api";

export default function BookCard({ book }: { book: Book; index?: number }) {
  const soldOut = book.availableCopies === 0;
  const [broken, setBroken] = useState(false);
  const colours = ["7c3aed", "0e7490", "b91c1c", "15803d", "ca8a04", "be123c", "1e40af", "c2410c"];
  const colour = colours[(book.title?.length || 0) % colours.length];
  const fallback = `https://placehold.co/400x600/${colour}/ffffff/png?text=${encodeURIComponent((book.title || "Book").replace(/(.{1,14})(\s|$)/g, "$1\n").trim())}`;

  return (
    <div className="group card bg-base-100 border border-base-300 shadow-md h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/40">
      <figure className="relative h-56 sm:h-[400px] bg-base-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={broken || !book.image ? fallback : book.image}
          alt={book.title}
          onError={() => setBroken(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="badge badge-primary absolute top-2 left-2 text-xs">{book.category}</span>
        {soldOut && (
          <span className="badge badge-error absolute top-2 right-2 text-xs text-white">Not Available</span>
        )}
      </figure>
      <div className="card-body p-3 sm:p-5 gap-1">
        <h3 className="font-bold text-sm sm:text-lg leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem] transition-colors duration-300 group-hover:text-primary">
          {book.title}
        </h3>
        <p className="opacity-70 text-xs sm:text-sm line-clamp-1">by {book.author}</p>
        <p className="text-xs opacity-60">
          {book.availableCopies}/{book.totalCopies} copies left
        </p>
        <div className="card-actions mt-auto pt-2">
          <Link href={`/books/${book._id}`} className="btn btn-primary text-white w-full btn-sm sm:btn-md">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
