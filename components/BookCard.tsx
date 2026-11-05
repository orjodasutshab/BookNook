"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Book } from "@/lib/api";

export default function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  const soldOut = book.availableCopies === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="group card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden"
    >
      <figure className="relative aspect-[2/3] bg-base-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="badge badge-primary absolute top-2 left-2 text-xs">{book.category}</span>
        {soldOut && (
          <span className="badge badge-error absolute top-2 right-2 text-xs text-white">Not Available</span>
        )}
      </figure>
      <div className="card-body p-3 sm:p-5 gap-1">
        <h3 className="font-bold text-sm sm:text-lg leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3.5rem]">
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
    </motion.div>
  );
}
