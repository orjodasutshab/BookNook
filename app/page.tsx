import Link from "next/link";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import Title from "@/components/Title";
import { API, Book } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getLatest(): Promise<Book[]> {
  try {
    const res = await fetch(`${API}/books?sort=latest&limit=6`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const steps = [
  { n: "1", t: "Create an account", d: "Register with your email or sign in with Google in a few seconds." },
  { n: "2", t: "Pick a book", d: "Browse the shelf and open any book to see its details and copies left." },
  { n: "3", t: "Borrow and return", d: "Choose a return date, read the book, then return it with one click." },
];

const cats = [
  { name: "Fiction", icon: "📖" },
  { name: "Science", icon: "🔬" },
  { name: "History", icon: "🏛️" },
  { name: "Kids", icon: "🧸" },
  { name: "Others", icon: "✨" },
];

export default async function Home() {
  const books = await getLatest();
  return (
    <>
      <Title name="Home" />
      <Hero />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="section-title">New Arrivals</h2>
        <p className="section-sub">The latest books added to our shelf by readers like you.</p>
        {books.length === 0 ? (
          <p className="text-center opacity-70">No books yet. Be the first to add one!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b, i) => <BookCard key={b._id} book={b} index={i} />)}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/books" className="btn btn-primary text-white">See All Books</Link>
        </div>
      </section>

