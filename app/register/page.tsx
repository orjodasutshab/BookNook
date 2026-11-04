"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Title from "@/components/Title";
import { authClient } from "@/lib/auth-client";

function validatePassword(p: string) {
  if (p.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(p)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must have a lowercase letter";
  return "";
}

export default function Register() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const password = String(f.get("password"));
    const pwError = validatePassword(password);
    if (pwError) {
      setError(pwError);
      return toast.error(pwError);
    }
    setError("");
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: String(f.get("name")),
      email: String(f.get("email")),
      password,
      image: String(f.get("photo")),
    });
    setBusy(false);
    if (error) {
      const msg = error.message || "Registration failed";
      setError(msg);
      return toast.error(msg);
    }
    toast.success("Registration successful! Please login.");
    router.push("/login");
  };

  const google = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

