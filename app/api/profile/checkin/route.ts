import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongo";

const DAY = 86400000;
const utcDay = (s: string) => Date.parse(`${s}T00:00:00Z`);

// Daily streak: called once a day when a logged in user opens the site.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ message: "Please login first" }, { status: 401 });

  const { date } = await req.json().catch(() => ({ date: "" }));
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(utcDay(date))) {
    return NextResponse.json({ message: "Invalid date" }, { status: 400 });
  }
  const todayUtc = utcDay(new Date().toISOString().slice(0, 10));
  if (Math.abs(utcDay(date) - todayUtc) > DAY) {
    return NextResponse.json({ message: "Date is out of range" }, { status: 400 });
  }

  const col = db().collection("profiles");
  const email = session.user.email.toLowerCase();
  const prev = (await col.findOne({ email }))?.streak;
  const diff = prev?.lastDate ? Math.round((utcDay(date) - utcDay(prev.lastDate)) / DAY) : null;

  if (diff === 0 || (diff !== null && diff < 0)) {
    return NextResponse.json({ current: prev.count, best: prev.best, lastDate: prev.lastDate });
  }
  const count = diff === 1 ? (prev.count || 0) + 1 : 1;
  const best = Math.max(prev?.best || 0, count);
  await col.updateOne(
    { email },
    { $set: { streak: { count, best, lastDate: date } }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  return NextResponse.json({ current: count, best, lastDate: date });
}
