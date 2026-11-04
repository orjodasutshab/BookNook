"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BookForm from "@/components/BookForm";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function AddBook() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  if (isPending || !session) return <Spinner />;

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <Title name="Add Book" />
      <h1 className="section-title">Add a New Book</h1>
      <p className="section-sub">Share a book with other readers.</p>
      <div className="card bg-base-100 shadow-md"><div className="card-body">
        <BookForm
          user={{ name: session.user.name, email: session.user.email }}
          submitLabel="Add Book"
          onSubmit={async (data) => {
            await api("/books", { method: "POST", body: JSON.stringify(data) }, true);
            toast.success("Book added successfully!");
            router.push("/my-books");
          }}
        />
      </div></div>
    </section>
  );
}
