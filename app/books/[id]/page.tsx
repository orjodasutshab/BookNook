"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { api, Book, fmtDate } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { toWriterId } from "@/lib/profile";

export default function BookDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api<Book>(`/books/${id}`)
      .then(setBook)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const minDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const openBorrow = () => {
    if (!session?.user) return router.push(`/login?redirect=/books/${id}`);
    setOpen(true);
  };

  const confirmBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/borrows", { method: "POST", body: JSON.stringify({ bookId: id, returnDate }) }, true);
      toast.success("Book borrowed successfully!");
      setOpen(false);
      setReturnDate("");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading || isPending) return <Spinner />;
  if (!book) return <p className="text-center py-24 opacity-70">This book could not be found.</p>;

  const unavailable = book.availableCopies <= 0;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <Title name={book.title} />
      <div className="grid gap-10 md:grid-cols-2 items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={book.image} alt={book.title} className="w-full max-h-[560px] object-cover rounded-2xl shadow-lg" />
        <div>
          <span className="badge badge-primary badge-outline">{book.category}</span>
          <h1 className="text-3xl md:text-4xl font-bold mt-3">{book.title}</h1>
          <p className="text-lg opacity-70 mt-1">by {book.author}</p>
          <p className="mt-6 leading-relaxed">{book.description}</p>
          <div className="mt-6 space-y-1 opacity-80">
            <p>
              <b>Added by:</b>{" "}
              <Link href={`/writers/${toWriterId(book.addedBy.email)}`} className="link link-primary font-medium">
                {book.addedBy.name}
              </Link>{" "}
              ({book.addedBy.email})
            </p>
            <p><b>Added on:</b> {fmtDate(book.createdAt)}</p>
            <p><b>Copies available:</b> {book.availableCopies} / {book.totalCopies}</p>
          </div>
          <button onClick={openBorrow} disabled={unavailable} className="btn btn-primary text-white mt-8">
            {unavailable ? "Not Available" : "Borrow This Book"}
          </button>
          <Link href={`/writers/${toWriterId(book.addedBy.email)}`} className="btn btn-outline btn-primary mt-8 ml-3">
            ✍️ Writer Profile
          </Link>
        </div>
      </div>

      {open && session?.user && (
        <dialog className="modal modal-open">
          <form onSubmit={confirmBorrow} className="modal-box space-y-4">
            <h3 className="font-bold text-xl">Borrow “{book.title}”</h3>
            <label className="block">
              <span className="label-text">Name</span>
              <input readOnly value={session.user.name} className="input input-bordered w-full mt-1" />
            </label>
            <label className="block">
              <span className="label-text">Email</span>
              <input readOnly value={session.user.email} className="input input-bordered w-full mt-1" />
            </label>
            <label className="block">
              <span className="label-text">Return date (up to 30 days)</span>
              <input type="date" required min={minDate} max={maxDate} value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)} className="input input-bordered w-full mt-1" />
            </label>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
              <button type="submit" disabled={busy} className="btn btn-primary text-white">
                {busy ? <span className="loading loading-spinner" /> : "Confirm Borrow"}
              </button>
            </div>
          </form>
        </dialog>
      )}
    </section>
  );
}
