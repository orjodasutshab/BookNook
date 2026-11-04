"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { api, Book, fmtDate } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

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

