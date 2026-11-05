import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongo";
import { buildAchievements, isVerified } from "@/lib/profile";

const DAY = 86400000;
const ci = { collation: { locale: "en", strength: 2 } }; // case-insensitive email match
const utcDay = (s: string) => Date.parse(`${s}T00:00:00Z`);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ message: "Please login first" }, { status: 401 });

  const { id } = await params;
  let email = "";
  try {
    email = Buffer.from(id, "base64url").toString("utf8").trim();
  } catch {}
  if (!email.includes("@")) return NextResponse.json({ message: "Invalid writer link" }, { status: 400 });

  const d = db();
  const [user, profile, books] = await Promise.all([
    d.collection("user").findOne({ email }, ci),
    d.collection("profiles").findOne({ email: email.toLowerCase() }),
    d.collection("books").find({ "addedBy.email": email }, ci).sort({ createdAt: -1 }).toArray(),
  ]);
  if (!user && books.length === 0) return NextResponse.json({ message: "Writer not found" }, { status: 404 });

  const name = user?.name || books[0]?.addedBy?.name || email.split("@")[0];
  const image: string | null = user?.image || null;
  const cover: string = profile?.cover || "";
  const bio: string = profile?.bio || "";
  const location: string = profile?.location || "";
  const website: string = profile?.website || "";
  const verified = isVerified({ image, cover, bio, location });

  // a streak is still alive if the last check-in was today or yesterday
  const st = profile?.streak;
  const todayUtc = utcDay(new Date().toISOString().slice(0, 10));
  const alive = st?.lastDate && Math.abs(todayUtc - utcDay(st.lastDate)) <= DAY;
  const current = alive ? st.count || 0 : 0;
  const best = Math.max(st?.best || 0, current);

  const stats = {
    books: books.length,
    copies: books.reduce((n, b) => n + (Number(b.totalCopies) || 0), 0),
    categories: new Set(books.map((b) => b.category)).size,
  };
  const oldestBook = books.length ? books[books.length - 1].createdAt : null;

  return NextResponse.json({
    email: user?.email || email,
    name,
    image,
    cover,
    bio,
    location,
    website,
    joinedAt: user?.createdAt || profile?.createdAt || oldestBook,
    verified,
    isOwner: session.user.email.toLowerCase() === email.toLowerCase(),
    streak: { current, best, lastDate: st?.lastDate || null },
    stats,
    achievements: buildAchievements({ ...stats, bestStreak: best, verified }),
    books: books.map((b) => ({ ...b, _id: String(b._id) })),
  });
}
