import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongo";
import { isVerified } from "@/lib/profile";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
// returns "" for empty, null for a bad link, otherwise the link
const link = (v: unknown, max = 500) => {
  const s = clean(v, max);
  if (!s) return "";
  try {
    return /^https?:$/.test(new URL(s).protocol) ? s : null;
  } catch {
    return null;
  }
};

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) return NextResponse.json({ message: "Please login first" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = clean(body.name, 60);
  const image = link(body.image);
  const cover = link(body.cover);
  const website = link(body.website, 200);
  const bio = clean(body.bio, 300);
  const location = clean(body.location, 60);

  if (!name) return NextResponse.json({ message: "Name cannot be empty" }, { status: 400 });
  if (image === null || cover === null) return NextResponse.json({ message: "Image link is not valid" }, { status: 400 });
  if (website === null) return NextResponse.json({ message: "Website link must start with http:// or https://" }, { status: 400 });

  const d = db();
  const email = session.user.email.toLowerCase();
  await d.collection("profiles").updateOne(
    { email },
    { $set: { cover, bio, location, website, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  // keep the name shown on the user's books in sync
  await d.collection("books").updateMany(
    { "addedBy.email": session.user.email },
    { $set: { "addedBy.name": name } },
    { collation: { locale: "en", strength: 2 } }
  );

  return NextResponse.json({ ok: true, verified: isVerified({ image, cover, bio, location }) });
}
