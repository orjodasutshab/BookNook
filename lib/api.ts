import { authClient } from "./auth-client";

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: { name: string; email: string };
  createdAt: string;
};

export type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};

export async function api<T = any>(path: string, opts: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const { data } = await authClient.token();
    if (!data?.token) throw new Error("Please login again");
    headers.Authorization = `Bearer ${data.token}`;
  }
  const res = await fetch(`${API}${path}`, { ...opts, headers: { ...headers, ...(opts.headers as any) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || "Request failed");
  return body;
}

export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`, {
    method: "POST",
    body: fd,
  });
  const json = await res.json();
  if (!json.success) throw new Error("Image upload failed");
  return json.data.display_url;
}

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
