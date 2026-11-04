"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Title from "@/components/Title";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/";
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await authClient.signIn.email({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    setBusy(false);
    if (error) {
      const msg = error.message || "Invalid email or password";
      setError(msg);
      return toast.error(msg);
    }
    toast.success("Logged in successfully!");
    router.push(redirect);
    router.refresh();
  };

  const google = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: redirect });
  };

