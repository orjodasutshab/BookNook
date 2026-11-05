"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { toWriterId } from "@/lib/profile";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const t = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
    localStorage.setItem("theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  const logout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const user = session?.user;
  const links = [
    { href: "/", label: "Home" },
    { href: "/books", label: "All Books" },
    ...(user
      ? [
          { href: "/add-book", label: "Add Book" },
          { href: "/my-books", label: "My Books" },
          { href: "/my-borrows", label: "My Borrows" },
        ]
      : []),
  ];

  const navItems = links.map((l) => (
    <li key={l.href}>
      <Link href={l.href} className={pathname === l.href ? "text-primary font-semibold" : ""}>
        {l.label}
      </Link>
    </li>
  ));

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4 md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow">
            {navItems}
          </ul>
        </div>
        <Logo />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItems}</ul>
      </div>
      <div className="navbar-end gap-2">
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle" aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        {isPending ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <Avatar src={user.image} name={user.name} size={40} />
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow">
              <li className="px-3 py-2 font-semibold pointer-events-none">{user.name}</li>
              <li><Link href="/profile">My Profile</Link></li>
              <li><Link href={`/writers/${toWriterId(user.email)}`}>Writer Profile</Link></li>
              <li><button onClick={logout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline btn-primary btn-sm md:btn-md">Login</Link>
            <Link href="/register" className="btn btn-primary text-white btn-sm md:btn-md hidden sm:inline-flex">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
