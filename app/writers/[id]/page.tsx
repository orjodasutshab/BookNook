"use client";
import Link from "next/link";
import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import Avatar from "@/components/Avatar";
import BookCard from "@/components/BookCard";
import VerifiedBadge from "@/components/VerifiedBadge";
import EditProfileModal from "@/components/EditProfileModal";
import { toWriterId, verifyChecklist, WriterData } from "@/lib/profile";

export default function WriterProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
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
      // always show the short custom link in the address bar
      if (body.username && body.username !== id) router.replace(`/writers/${body.username}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

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
      <div className="card bg-base-100 border border-base-300 shadow-lg overflow-hidden">
        <div className="relative h-44 sm:h-64 bg-gradient-to-r from-primary via-secondary to-accent">
          {w.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={w.cover} alt={`${w.name} cover`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="px-5 sm:px-10 pb-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            {/* photo overlaps the cover edge (z-10 keeps it in front of the cover) */}
            <div className="relative z-10 -mt-16 sm:-mt-20 shrink-0 w-fit rounded-full bg-base-100 p-1.5 shadow-xl">
              <Avatar src={w.image} name={w.name} size={120} />
            </div>

            {/* name and badge start well below the cover */}
            <div className="flex-1 min-w-0 sm:pt-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight break-words">{w.name}</h1>
                <VerifiedBadge verified={w.verified} />
              </div>
              <p className="mt-1.5 text-sm sm:text-base opacity-70 break-all">{w.email}</p>
            </div>

            {w.isOwner && (
              <button onClick={() => setEditing(true)} className="btn btn-primary text-white rounded-full px-5 w-fit sm:mt-5">
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mt-6">
            {w.location && (
              <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {w.location}
              </span>
            )}
            {w.website && (
              <a
                href={w.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-sm no-underline hover:border-primary hover:text-primary transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
                  <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
                </svg>
                <span className="truncate max-w-[220px] sm:max-w-xs">{w.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              </a>
            )}
            {joined && (
              <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3 py-1.5 text-sm">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Joined {joined}
              </span>
            )}
          </div>

          <div className="mt-6 border-l-4 border-primary/60 pl-4 max-w-3xl">
            <p className="leading-relaxed sm:text-lg opacity-90">
              {w.bio || (w.isOwner ? "You have not written a bio yet. Click Edit Profile to add one." : "This writer has not added a bio yet.")}
            </p>
          </div>
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
          onSaved={async (u) => {
            setEditing(false);
            const target = u || toWriterId(w.email);
            if (target !== id) router.replace(`/writers/${target}`);
            else await load();
          }}
        />
      )}
    </section>
  );
}
