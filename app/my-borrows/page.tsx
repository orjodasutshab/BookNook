"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { api, Borrow, fmtDate } from "@/lib/api";

export default function MyBorrows() {
  const [items, setItems] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    api<Borrow[]>("/borrows", {}, true)
      .then(setItems)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const giveBack = async (id: string) => {
    setBusyId(id);
    try {
      await api(`/borrows/${id}`, { method: "DELETE" }, true);
      setItems((x) => x.filter((i) => i._id !== id));
      toast.success("Book returned successfully!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Title name="My Borrows" />
      <h1 className="section-title">My Borrows</h1>
      <p className="section-sub">Books you have borrowed. Return them when you are done.</p>
      {loading ? <Spinner /> : items.length === 0 ? (
        <div className="text-center">
          <p className="opacity-70 mb-4">You have not borrowed any book yet.</p>
          <Link href="/books" className="btn btn-primary text-white">Browse Books</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
          <table className="table">
            <thead><tr><th>Image</th><th>Title</th><th>Borrow Date</th><th>Return Date</th><th className="text-right">Action</th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.bookImage} alt={i.bookTitle} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="font-semibold">{i.bookTitle}</td>
                  <td>{fmtDate(i.borrowDate)}</td>
                  <td>{fmtDate(i.returnDate)}</td>
                  <td className="text-right">
                    <button onClick={() => giveBack(i._id)} disabled={busyId === i._id} className="btn btn-sm btn-primary text-white">
                      {busyId === i._id ? <span className="loading loading-spinner loading-xs" /> : "Return Book"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
