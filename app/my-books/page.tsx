"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import BookForm from "@/components/BookForm";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { api, Book } from "@/lib/api";

export default function MyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [delBusy, setDelBusy] = useState(false);

  const load = () =>
    api<Book[]>("/books?mine=true", {}, true)
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const confirmDelete = async () => {
    if (!deleting) return;
    setDelBusy(true);
    try {
      await api(`/books/${deleting._id}`, { method: "DELETE" }, true);
      setBooks((b) => b.filter((x) => x._id !== deleting._id));
      toast.success("Book deleted successfully");
      setDeleting(null);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDelBusy(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Title name="My Books" />
      <h1 className="section-title">My Books</h1>
      <p className="section-sub">Books you added. Edit or remove them anytime.</p>
      {loading ? <Spinner /> : books.length === 0 ? (
        <div className="text-center">
          <p className="opacity-70 mb-4">You have not added any book yet.</p>
          <Link href="/add-book" className="btn btn-primary text-white">Add Book</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
          <table className="table">
            <thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Copies</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {books.map((b) => (
                <tr key={b._id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.image} alt={b.title} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="font-semibold">{b.title}<div className="text-sm font-normal opacity-60">{b.author}</div></td>
                  <td>{b.category}</td>
                  <td>{b.availableCopies}/{b.totalCopies}</td>
                  <td className="text-right space-x-2">
                    <button onClick={() => setEditing(b)} className="btn btn-sm btn-outline btn-primary">Edit</button>
                    <button onClick={() => setDeleting(b)} className="btn btn-sm btn-error text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

