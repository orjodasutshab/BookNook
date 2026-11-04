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

