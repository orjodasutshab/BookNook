"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { uploadImage, Book } from "@/lib/api";

export const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

type Props = {
  initial?: Book;
  user?: { name: string; email: string };
  submitLabel: string;
  onSubmit: (data: any) => Promise<void>;
};

export default function BookForm({ initial, user, submitLabel, onSubmit }: Props) {
  const [busy, setBusy] = useState(false);

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      let image = initial?.image || "";
      const file = f.get("image") as File;
      if (file && file.size > 0) image = await uploadImage(file);
      if (!image) throw new Error("Please choose a book image");
      await onSubmit({
        title: f.get("title"),
        author: f.get("author"),
        category: f.get("category"),
        description: f.get("description"),
        totalCopies: Number(f.get("totalCopies")),
        image,
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

