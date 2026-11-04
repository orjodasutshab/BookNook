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

  return (
    <form onSubmit={handle} className="space-y-4">
      <input name="title" required defaultValue={initial?.title} placeholder="Book title" className="input input-bordered w-full" />
      <input name="author" required defaultValue={initial?.author} placeholder="Author name" className="input input-bordered w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <select name="category" required defaultValue={initial?.category || ""} className="select select-bordered w-full">
          <option value="" disabled>Select category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input name="totalCopies" type="number" min={1} required defaultValue={initial?.totalCopies ?? 1}
          placeholder="Total copies" className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label text-sm">Book image {initial && "(leave empty to keep the current one)"}</label>
        <input name="image" type="file" accept="image/*" required={!initial} className="file-input file-input-bordered w-full" />
      </div>
      <textarea name="description" required defaultValue={initial?.description} rows={4}
        placeholder="Short description" className="textarea textarea-bordered w-full" />
      {user && (
        <div className="grid gap-4 sm:grid-cols-2">
          <input readOnly value={user.name} className="input input-bordered w-full" />
          <input readOnly value={user.email} className="input input-bordered w-full" />
        </div>
      )}
      <button disabled={busy} className="btn btn-primary text-white w-full">
        {busy ? <span className="loading loading-spinner" /> : submitLabel}
      </button>
    </form>
  );
}
