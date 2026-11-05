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

  const closeMenu = () => (document.activeElement as HTMLElement | null)?.blur();

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
      <div className="navbar-end gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          className="w-11 h-11 rounded-full bg-base-200 border border-base-300 flex items-center justify-center hover:bg-base-300 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {theme === "light" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-indigo-500" fill="currentColor">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>

        {isPending ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="flex items-center gap-2 h-11 pl-1 pr-2 sm:pr-3 rounded-full bg-base-200 border border-base-300 hover:bg-base-300 transition-colors cursor-pointer"
            >
              <span className="rounded-full ring-2 ring-primary/70">
                <Avatar src={user.image} name={user.name} size={34} ring={false} />
              </span>
              <span className="hidden sm:block max-w-[110px] truncate text-sm font-semibold">
                {user.name?.split(" ")[0]}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 border border-base-300 rounded-2xl z-10 mt-3 w-64 p-2 shadow-xl"
            >
              <li className="pointer-events-none px-3 py-2">
                <div className="flex items-center gap-3 p-0">
                  <Avatar src={user.image} name={user.name} size={40} ring={false} />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-xs opacity-60 truncate">{user.email}</p>
                  </div>
                </div>
              </li>
              <div className="divider my-0"></div>
              <li><Link href="/profile" onClick={closeMenu}>👤 My Profile</Link></li>
              <li><Link href={`/writers/${toWriterId(user.email)}`} onClick={closeMenu}>✍️ Writer Profile</Link></li>
              <div className="divider my-0"></div>
              <li><button onClick={() => { closeMenu(); logout(); }} className="text-error">⎋ Logout</button></li>
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
