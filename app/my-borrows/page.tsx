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

