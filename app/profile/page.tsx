"use client";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending || !session) return <Spinner />;
  const u = session.user;
  return (
    <section className="max-w-md mx-auto px-4 py-12">
      <Title name="My Profile" />
      <div className="card bg-base-100 shadow-md">
        <div className="card-body items-center text-center">
          <div className="avatar">
            <div className="w-28 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.image || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(u.name)}`} alt={u.name} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-3">{u.name}</h1>
          <p className="opacity-70">{u.email}</p>
        </div>
      </div>
    </section>
  );
}
