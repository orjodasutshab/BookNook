"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Book } from "@/lib/api";

export default function BookCard({ book, index = 0 }: { book: Book; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow h-full"
    >
      <figure className="h-64 bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
      </figure>
      <div className="card-body">
        <h3 className="card-title line-clamp-1">{book.title}</h3>
        <p className="opacity-70 line-clamp-1">by {book.author}</p>
        <div><span className="badge badge-primary badge-outline">{book.category}</span></div>
        <div className="card-actions mt-auto pt-3">
          <Link href={`/books/${book._id}`} className="btn btn-primary text-white w-full">View Details</Link>
        </div>
      </div>
    </motion.div>
  );
}
