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

