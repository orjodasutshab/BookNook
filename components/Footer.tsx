import Link from "next/link";
import Logo from "./Logo";

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
);
const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.247h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" /></svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);

export default function Footer() {
  return (
    <footer className="bg-base-200 mt-20 border-t border-base-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="text-3xl" />
          <p className="mt-4 opacity-70 max-w-xs leading-relaxed">
            A small online library where you add a book, borrow a book and return a book. Made for readers across Bangladesh.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="btn btn-circle btn-sm btn-outline hover:btn-primary"><XIcon /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="btn btn-circle btn-sm btn-outline hover:btn-primary"><FbIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="btn btn-circle btn-sm btn-outline hover:btn-primary"><IgIcon /></a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Explore</h4>
          <ul className="space-y-3 opacity-80">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/books" className="hover:text-primary">All Books</Link></li>
            <li><Link href="/add-book" className="hover:text-primary">Add Book</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">My Account</h4>
          <ul className="space-y-3 opacity-80">
            <li><Link href="/profile" className="hover:text-primary">My Profile</Link></li>
            <li><Link href="/my-books" className="hover:text-primary">My Books</Link></li>
            <li><Link href="/my-borrows" className="hover:text-primary">My Borrows</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-4">Contact</h4>
          <ul className="space-y-3 opacity-80">
            <li>📍 Dhaka, Bangladesh</li>
            <li>✉️ support@booknook.app</li>
            <li>📞 +880 1700-000000</li>
            <li>🕒 Open every day, 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-base-300 py-5 px-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm opacity-70 max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} BookNook. All rights reserved.</span>
        <span>Add a book · Borrow a book · Return a book</span>
      </div>
    </footer>
  );
}
