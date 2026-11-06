import type { Book } from "./api";

export const BIO_MIN = 20;

export type ProfileFields = {
  image?: string | null;
  cover?: string | null;
  bio?: string | null;
  location?: string | null;
};

// A profile is "Verified" once all of these are filled in.
export function verifyChecklist(p: ProfileFields) {
  return [
    { key: "image", label: "Profile photo", done: !!p.image },
    { key: "cover", label: "Cover photo", done: !!p.cover },
    { key: "bio", label: `Short bio (at least ${BIO_MIN} characters)`, done: (p.bio || "").trim().length >= BIO_MIN },
    { key: "location", label: "Location", done: !!(p.location || "").trim() },
  ];
}

export const isVerified = (p: ProfileFields) => verifyChecklist(p).every((i) => i.done);

// Writers are opened by a URL-safe id made from their email (no dots or @ in the URL).
export function toWriterId(email: string) {
  const bytes = new TextEncoder().encode(email);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Custom profile link, like linkedin.com/in/your-name
const USERNAME_RE = /^[a-z0-9][a-z0-9_-]{1,28}[a-z0-9]$/;
export function checkUsername(raw: string): string | null {
  const u = raw.trim().toLowerCase();
  if (!USERNAME_RE.test(u)) {
    return "Profile link must be 3 to 30 characters: letters, numbers, - or _ (start and end with a letter or number)";
  }
  return null;
}

export type Achievement = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  progress: number;
  target: number;
  earned: boolean;
};

export function buildAchievements(s: {
  books: number;
  copies: number;
  categories: number;
  bestStreak: number;
  verified: boolean;
}): Achievement[] {
  const mk = (id: string, icon: string, title: string, desc: string, progress: number, target: number): Achievement => ({
    id, icon, title, desc, target, progress: Math.min(progress, target), earned: progress >= target,
  });
  return [
    mk("first-book", "📖", "First Chapter", "Publish your first book", s.books, 1),
    mk("shelf-builder", "📚", "Shelf Builder", "Publish 5 books", s.books, 5),
    mk("library-legend", "🏛️", "Library Legend", "Publish 10 books", s.books, 10),
    mk("genre-explorer", "🧭", "Genre Explorer", "Publish books in 3 categories", s.categories, 3),
    mk("generous-shelf", "🎁", "Generous Shelf", "Offer 20 copies in total", s.copies, 20),
    mk("verified", "✅", "Verified Writer", "Complete your profile to get verified", s.verified ? 1 : 0, 1),
    mk("streak-3", "🔥", "On Fire", "Reach a 3-day streak", s.bestStreak, 3),
    mk("streak-7", "⚡", "Week Warrior", "Reach a 7-day streak", s.bestStreak, 7),
    mk("streak-30", "👑", "Monthly Master", "Reach a 30-day streak", s.bestStreak, 30),
  ];
}

export type WriterData = {
  email: string;
  username: string;
  name: string;
  image: string | null;
  cover: string;
  bio: string;
  location: string;
  website: string;
  joinedAt: string | null;
  verified: boolean;
  isOwner: boolean;
  streak: { current: number; best: number; lastDate: string | null };
  stats: { books: number; copies: number; categories: number };
  achievements: Achievement[];
  books: Book[];
};
