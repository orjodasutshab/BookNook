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

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Title name="Register" />
      <div className="card bg-base-100 shadow-lg w-full max-w-md">
        <form onSubmit={submit} className="card-body space-y-2">
          <h1 className="text-3xl font-bold text-center">Create your account</h1>
          {error && <div className="alert alert-error text-white text-sm">{error}</div>}
          <input name="name" required placeholder="Name" className="input input-bordered w-full" />
          <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
          <input name="photo" type="url" required placeholder="Photo URL" className="input input-bordered w-full" />
          <input name="password" type="password" required placeholder="Password" className="input input-bordered w-full" />
          <button disabled={busy} className="btn btn-primary text-white w-full">
            {busy ? <span className="loading loading-spinner" /> : "Register"}
          </button>
          <div className="divider">OR</div>
          <button type="button" onClick={google} className="btn btn-outline w-full">Continue with Google</button>
          <p className="text-center text-sm mt-2">
            Already have an account? <Link href="/login" className="link link-primary">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
