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

  return (
    <div className="card bg-base-100 shadow-lg w-full max-w-md">
      <form onSubmit={submit} className="card-body space-y-2">
        <h1 className="text-3xl font-bold text-center">Login to BookNook</h1>
        {error && <div className="alert alert-error text-white text-sm">{error}</div>}
        <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
        <input name="password" type="password" required placeholder="Password" className="input input-bordered w-full" />
        <button type="button" onClick={() => toast("Password reset is coming soon.")} className="text-sm link link-primary text-left w-fit">
          Forget Password?
        </button>
        <button disabled={busy} className="btn btn-primary text-white w-full">
          {busy ? <span className="loading loading-spinner" /> : "Login"}
        </button>
        <div className="divider">OR</div>
        <button type="button" onClick={google} className="btn btn-outline w-full">Continue with Google</button>
        <p className="text-center text-sm mt-2">
          New here? <Link href="/register" className="link link-primary">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Title name="Login" />
      <Suspense fallback={<span className="loading loading-spinner loading-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
