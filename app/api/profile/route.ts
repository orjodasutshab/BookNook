import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongo";
import { checkUsername, isVerified } from "@/lib/profile";

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
  const username = clean(body.username, 30).toLowerCase();

  if (!name) return NextResponse.json({ message: "Name cannot be empty" }, { status: 400 });
  if (image === null || cover === null) return NextResponse.json({ message: "Image link is not valid" }, { status: 400 });
  if (website === null) return NextResponse.json({ message: "Website link must start with http:// or https://" }, { status: 400 });

  if (username) {
    const bad = checkUsername(username);
    if (bad) return NextResponse.json({ message: bad }, { status: 400 });
    // must not look like the old email-based link
    if (Buffer.from(username, "base64url").toString("utf8").includes("@")) {
      return NextResponse.json({ message: "This profile link is not allowed" }, { status: 400 });
    }
  }

  const d = db();
  const email = session.user.email.toLowerCase();
  const profiles = d.collection("profiles");
  const taken = "This profile link is already taken. Please try another one.";

  if (username && (await profiles.findOne({ username, email: { $ne: email } }))) {
    return NextResponse.json({ message: taken }, { status: 409 });
  }
  try {
    await profiles.createIndex({ username: 1 }, { unique: true, partialFilterExpression: { username: { $type: "string" } } });
  } catch {}

  const update: Record<string, any> = {
    $set: { cover, bio, location, website, updatedAt: new Date(), ...(username ? { username } : {}) },
    $setOnInsert: { createdAt: new Date() },
  };
  if (!username) update.$unset = { username: "" };
  try {
    await profiles.updateOne({ email }, update, { upsert: true });
  } catch (e: any) {
    if (e?.code === 11000) return NextResponse.json({ message: taken }, { status: 409 });
    throw e;
  }
  // keep the name shown on the user's books in sync
  await d.collection("books").updateMany(
    { "addedBy.email": session.user.email },
    { $set: { "addedBy.name": name } },
    { collation: { locale: "en", strength: 2 } }
  );

  return NextResponse.json({ ok: true, username, verified: isVerified({ image, cover, bio, location }) });
}
