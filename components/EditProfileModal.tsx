"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import { uploadImage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { BIO_MIN, checkUsername, verifyChecklist, WriterData } from "@/lib/profile";

type Props = { writer: WriterData; onClose: () => void; onSaved: (username: string) => void };

export default function EditProfileModal({ writer, onClose, onSaved }: Props) {
  const [name, setName] = useState(writer.name);
  const [bio, setBio] = useState(writer.bio);
  const [location, setLocation] = useState(writer.location);
  const [website, setWebsite] = useState(writer.website);
  const [username, setUsername] = useState(writer.username);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(writer.image);
  const [coverPreview, setCoverPreview] = useState<string>(writer.cover);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    if (photoPreview?.startsWith("blob:")) URL.revokeObjectURL(photoPreview);
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
  }, [photoPreview, coverPreview]);

  const pick = (file: File | null, kind: "photo" | "cover") => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    const url = URL.createObjectURL(file);
    if (kind === "photo") { setPhotoFile(file); setPhotoPreview(url); }
    else { setCoverFile(file); setCoverPreview(url); }
  };

  const checklist = verifyChecklist({ image: photoPreview, cover: coverPreview, bio, location });
  const doneCount = checklist.filter((c) => c.done).length;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    if (username.trim()) {
      const bad = checkUsername(username);
      if (bad) return toast.error(bad);
    }
    setBusy(true);
    try {
      let image = writer.image || "";
      let cover = writer.cover || "";
      if (photoFile) image = await uploadImage(photoFile);
      if (coverFile) cover = await uploadImage(coverFile);

      const { error } = await authClient.updateUser({ name: name.trim(), image: image || undefined });
      if (error) throw new Error(error.message || "Could not update profile");

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image, cover, bio, location, website, username }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Could not save profile");

      toast.success("Profile updated successfully");
      if (body.verified && !writer.verified) {
        toast.success("🎉 Congratulations! Your profile is now verified.", { duration: 5000 });
      }
      onSaved(body.username || "");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <form onSubmit={submit} className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto space-y-5">
        <h3 className="font-bold text-2xl">Edit Profile</h3>

        <div className="rounded-xl border border-base-300 p-4 bg-base-200/50">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold">Get your Verified badge</p>
            <span className="text-sm opacity-70">{doneCount} / {checklist.length}</span>
          </div>
          <progress className="progress progress-success w-full" value={doneCount} max={checklist.length} />
          <ul className="mt-3 grid sm:grid-cols-2 gap-1 text-sm">
            {checklist.map((c) => (
              <li key={c.key} className={c.done ? "text-success" : "opacity-70"}>
                {c.done ? "✔" : "○"} {c.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span className="label-text font-medium block mb-1">Cover photo</span>
          <div className="h-32 rounded-xl overflow-hidden bg-gradient-to-r from-primary via-secondary to-accent mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {coverPreview && <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />}
          </div>
          <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0] || null, "cover")}
            className="file-input file-input-bordered w-full" />
        </div>

        <div className="flex items-center gap-4">
          <Avatar src={photoPreview} name={name} size={72} />
          <div className="flex-1">
            <span className="label-text font-medium block mb-1">Profile photo</span>
            <input type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0] || null, "photo")}
              className="file-input file-input-bordered w-full" />
          </div>
        </div>

        <label className="block">
          <span className="label-text font-medium">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required
            className="input input-bordered w-full mt-1" />
        </label>

        <label className="block">
          <span className="label-text font-medium">Your profile link</span>
          <div className="mt-1 flex items-stretch rounded-lg border border-base-300 overflow-hidden focus-within:border-primary">
            <span className="bg-base-200 px-3 flex items-center text-xs sm:text-sm opacity-70 whitespace-nowrap">
              {typeof window !== "undefined" ? window.location.host : ""}/writers/
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              maxLength={30}
              placeholder="your-name"
              className="input input-ghost focus:outline-none w-full rounded-none"
            />
          </div>
          <span className="text-xs opacity-60">Letters, numbers, - or _ (3 to 30 characters). Leave empty to use the default link.</span>
        </label>

        <label className="block">
          <span className="label-text font-medium">Bio</span>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={4}
            placeholder="Tell readers who you are and what you love to write or read"
            className="textarea textarea-bordered w-full mt-1" />
          <span className={`text-xs ${bio.trim().length >= BIO_MIN ? "text-success" : "opacity-60"}`}>
            {bio.trim().length} / 300 (minimum {BIO_MIN})
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-text font-medium">Location</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={60}
              placeholder="Dhaka, Bangladesh" className="input input-bordered w-full mt-1" />
          </label>
          <label className="block">
            <span className="label-text font-medium">Website (optional)</span>
            <input value={website} onChange={(e) => setWebsite(e.target.value)} type="url" maxLength={200}
              placeholder="https://..." className="input input-bordered w-full mt-1" />
          </label>
        </div>

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" disabled={busy} className="btn btn-primary text-white">
            {busy ? <span className="loading loading-spinner" /> : "Save Profile"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
