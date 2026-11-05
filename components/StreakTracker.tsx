"use client";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

// Records one visit per day for the logged in user (daily streak).
export default function StreakTracker() {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const key = `streak-${email}`;
    try {
      if (localStorage.getItem(key) === date) return;
    } catch {}
    fetch("/api/profile/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    })
      .then((r) => {
        if (r.ok) {
          try { localStorage.setItem(key, date); } catch {}
        }
      })
      .catch(() => {});
  }, [email]);

  return null;
}
