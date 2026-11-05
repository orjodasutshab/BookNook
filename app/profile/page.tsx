"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import Avatar from "@/components/Avatar";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  if (isPending || !session) return <Spinner />;
  const u = session.user;

  const openEdit = () => {
    setName(u.name || "");
    setImage(u.image || "");
    setEditing(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    setSaving(true);
    const { error } = await authClient.updateUser({ name: name.trim(), image: image.trim() || undefined });
    setSaving(false);
    if (error) return toast.error(error.message || "Could not update profile");
    toast.success("Profile updated successfully");
    setEditing(false);
  };

  const logout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <Title name="My Profile" />
      <div className="card bg-base-100 border border-base-300 shadow-md overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary to-secondary" />
        <div className="card-body pt-0 items-center text-center -mt-14">
          <div className="rounded-full bg-base-100 p-1">
            <Avatar src={u.image} name={u.name} size={112} />
          </div>
          <h1 className="text-2xl font-bold mt-2">{u.name}</h1>
          <p className="opacity-70">{u.email}</p>

          {!editing ? (
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <button onClick={openEdit} className="btn btn-primary text-white">✏️ Edit Profile</button>
              <Link href="/add-book" className="btn btn-outline btn-primary">+ Add Book</Link>
              <Link href="/my-books" className="btn btn-outline btn-primary">My Books</Link>
              <Link href="/my-borrows" className="btn btn-outline btn-primary">My Borrows</Link>
              <Link href="/books" className="btn btn-outline btn-primary">Browse Books</Link>
              <button onClick={logout} className="btn btn-outline btn-error">Logout</button>
            </div>
          ) : (
            <form onSubmit={save} className="w-full max-w-md text-left space-y-4 mt-5">
              <label className="form-control w-full">
                <span className="label-text font-medium mb-1 block">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input input-bordered w-full" required />
              </label>
              <label className="form-control w-full">
                <span className="label-text font-medium mb-1 block">Photo URL</span>
                <input value={image} onChange={(e) => setImage(e.target.value)} type="url" placeholder="https://..." className="input input-bordered w-full" />
              </label>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn btn-primary text-white flex-1">
                  {saving ? <span className="loading loading-spinner loading-sm" /> : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-outline flex-1">Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
