"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { api, Book } from "@/lib/api";

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Book[]>("/books")
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <Title name="All Books" />
      <h1 className="section-title">All Books</h1>
      <p className="section-sub">Every book on our shelf. Open one to borrow it.</p>
      {loading ? (
        <Spinner />
      ) : books.length === 0 ? (
        <p className="text-center opacity-70">No books found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((b, i) => <BookCard key={b._id} book={b} index={i} />)}
        </div>
      )}
    </section>
  );
}
