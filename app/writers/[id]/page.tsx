"use client";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import Avatar from "@/components/Avatar";
import BookCard from "@/components/BookCard";
import VerifiedBadge from "@/components/VerifiedBadge";
import EditProfileModal from "@/components/EditProfileModal";
import { verifyChecklist, WriterData } from "@/lib/profile";

export default function WriterProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [writer, setWriter] = useState<WriterData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/writers/${id}`, { cache: "no-store" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Could not load this profile");
      setWriter(body);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error || !writer) {
    return (
      <section className="max-w-xl mx-auto px-4 py-24 text-center">
        <Title name="Writer Profile" />
        <p className="text-lg opacity-70 mb-6">{error || "This writer could not be found."}</p>
        <Link href="/books" className="btn btn-primary text-white">Browse Books</Link>
      </section>
    );
  }

  const w = writer;
  const checklist = verifyChecklist({ image: w.image, cover: w.cover, bio: w.bio, location: w.location });
  const done = checklist.filter((c) => c.done).length;
  const joined = w.joinedAt
    ? new Date(w.joinedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;
  const earned = w.achievements.filter((a) => a.earned).length;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <Title name={`${w.name} | Writer`} />

      {/* cover + header */}
      <div className="card bg-base-100 border border-base-300 shadow-md overflow-hidden">
        <div className="h-44 sm:h-64 bg-gradient-to-r from-primary via-secondary to-accent">
          {w.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={w.cover} alt={`${w.name} cover`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          )}
        </div>
        <div className="px-5 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <div className="rounded-full bg-base-100 p-1 w-fit">
              <Avatar src={w.image} name={w.name} size={120} />
            </div>
            <div className="flex-1 sm:pb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold">{w.name}</h1>
                <VerifiedBadge verified={w.verified} />
              </div>
              <p className="opacity-70">{w.email}</p>
            </div>
            {w.isOwner && (
              <button onClick={() => setEditing(true)} className="btn btn-primary text-white sm:mb-2">
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm opacity-80">
            {w.location && <span>📍 {w.location}</span>}
            {w.website && (
              <a href={w.website} target="_blank" rel="noopener noreferrer" className="link link-primary">
                🔗 {w.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {joined && <span>📅 Joined {joined}</span>}
          </div>

          <p className="mt-4 leading-relaxed max-w-3xl">
            {w.bio || (w.isOwner ? "You have not written a bio yet. Click Edit Profile to add one." : "This writer has not added a bio yet.")}
          </p>
        </div>
      </div>

      {/* verification progress (owner only) */}
      {w.isOwner && !w.verified && (
        <div className="alert mt-6 border border-warning/40 bg-warning/10 flex-col items-start gap-3">
          <div className="w-full flex items-center justify-between">
            <p className="font-semibold">Complete your profile to get the Verified badge</p>
            <span className="text-sm opacity-70">{done} / {checklist.length}</span>
          </div>
          <progress className="progress progress-warning w-full" value={done} max={checklist.length} />
          <ul className="grid sm:grid-cols-2 gap-1 text-sm w-full">
            {checklist.map((c) => (
              <li key={c.key} className={c.done ? "text-success" : "opacity-80"}>{c.done ? "✔" : "○"} {c.label}</li>
            ))}
          </ul>
        </div>
      )}

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mt-6">
        {[
          { label: "Books published", value: w.stats.books, icon: "📚" },
          { label: "Total copies", value: w.stats.copies, icon: "📦" },
          { label: "Categories", value: w.stats.categories, icon: "🧭" },
          { label: "Achievements", value: `${earned}/${w.achievements.length}`, icon: "🏆" },
        ].map((s) => (
          <div key={s.label} className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body items-center text-center p-5">
              <span className="text-3xl">{s.icon}</span>
              <p className="text-3xl font-extrabold leading-none">{s.value}</p>
              <p className="text-sm opacity-70">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* daily streak */}
      <h2 className="text-2xl font-bold mt-12 mb-4">Daily Streak</h2>
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🔥</span>
              <div>
                <p className="text-4xl font-extrabold leading-none">{w.streak.current}</p>
                <p className="opacity-70">{w.streak.current === 1 ? "day streak" : "days streak"}</p>
              </div>
            </div>
            <div className="text-sm opacity-70 sm:text-right">
              <p>Best streak: <b>{w.streak.best}</b> {w.streak.best === 1 ? "day" : "days"}</p>
              <p>{w.isOwner ? "Open BookNook every day to keep your streak alive." : "Streaks grow by visiting BookNook every day."}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm ${
                  i < Math.min(w.streak.current, 7) ? "bg-primary text-white" : "bg-base-200 opacity-60"
                }`}>
                {i < Math.min(w.streak.current, 7) ? "🔥" : i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* achievements */}
      <h2 className="text-2xl font-bold mt-12 mb-4">Achievements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {w.achievements.map((a) => (
          <div key={a.id}
            className={`card border shadow-sm ${a.earned ? "border-primary bg-primary/10" : "border-base-300 bg-base-100"}`}>
            <div className="card-body p-5 flex-row items-center gap-4">
              <span className={`text-4xl ${a.earned ? "" : "grayscale opacity-50"}`}>{a.icon}</span>
              <div className="flex-1">
                <p className="font-bold">{a.title} {a.earned && <span className="text-success text-sm">✔</span>}</p>
                <p className="text-sm opacity-70">{a.desc}</p>
                {!a.earned && (
                  <div className="mt-2">
                    <progress className="progress progress-primary w-full" value={a.progress} max={a.target} />
                    <p className="text-xs opacity-60 mt-1">{a.progress} / {a.target}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* published books */}
      <h2 className="text-2xl font-bold mt-12 mb-4">Published Books ({w.books.length})</h2>
      {w.books.length === 0 ? (
        <div className="text-center py-12 opacity-70">
          <p>{w.isOwner ? "You have not published any book yet." : "No published books yet."}</p>
          {w.isOwner && <Link href="/add-book" className="btn btn-primary text-white mt-4">+ Add Book</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {w.books.map((b, i) => <BookCard key={b._id} book={b} index={i} />)}
        </div>
      )}

      {editing && (
        <EditProfileModal
          writer={w}
          onClose={() => setEditing(false)}
          onSaved={async () => { setEditing(false); await load(); }}
        />
      )}
    </section>
  );
}
