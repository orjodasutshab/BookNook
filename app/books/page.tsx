"use client";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { CATEGORIES } from "@/components/BookForm";
import { api, Book } from "@/lib/api";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "Title: A to Z" },
  { value: "za", label: "Title: Z to A" },
];

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    api<Book[]>("/books")
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

    // allow links like /books?category=Science
    const c = new URLSearchParams(window.location.search).get("category");
    if (c && CATEGORIES.includes(c)) setCategory(c);
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: books.length };
    books.forEach((b) => { m[b.category] = (m[b.category] || 0) + 1; });
    return m;
  }, [books]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = books.filter((b) => {
      if (category !== "All" && b.category !== category) return false;
      if (availableOnly && b.availableCopies <= 0) return false;
      if (!q) return true;
      return `${b.title} ${b.author}`.toLowerCase().includes(q);
    });
    const time = (b: Book) => new Date(b.createdAt).getTime() || 0;
    list.sort((a, b) =>
      sort === "oldest" ? time(a) - time(b)
      : sort === "az" ? a.title.localeCompare(b.title)
      : sort === "za" ? b.title.localeCompare(a.title)
      : time(b) - time(a)
    );
    return list;
  }, [books, query, category, sort, availableOnly]);

  const filtered = query.trim() !== "" || category !== "All" || availableOnly || sort !== "newest";
  const clearAll = () => { setQuery(""); setCategory("All"); setSort("newest"); setAvailableOnly(false); };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <Title name="All Books" />
      <h1 className="section-title">All Books</h1>
      <p className="section-sub">Every book on our shelf. Open one to borrow it.</p>

      {/* search + filters */}
      <div className="card bg-base-100 border border-base-300 shadow-sm mb-8">
        <div className="card-body p-4 sm:p-5 gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <label className="input input-bordered flex items-center gap-2 flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by book title or author"
                className="grow"
                aria-label="Search books"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="opacity-60 hover:opacity-100" aria-label="Clear search">✕</button>
              )}
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered md:w-52" aria-label="Sort books">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`btn btn-sm rounded-full ${category === c ? "btn-primary text-white" : "btn-outline"}`}
              >
                {c} <span className="opacity-70">({counts[c] || 0})</span>
              </button>
            ))}
            <label className="flex items-center gap-2 cursor-pointer ml-auto text-sm">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)} />
              Available only
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 text-sm opacity-80">
            <p>Showing <b>{shown.length}</b> of <b>{books.length}</b> books</p>
            {filtered && <button onClick={clearAll} className="link link-primary">Clear filters</button>}
          </div>
          {shown.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl font-semibold">No books match your search</p>
              <p className="opacity-70 mt-1 mb-5">Try a different title, author or category.</p>
              <button onClick={clearAll} className="btn btn-primary text-white">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {shown.map((b, i) => <BookCard key={b._id} book={b} index={i} />)}
            </div>
          )}
        </>
      )}
    </section>
  );
}
