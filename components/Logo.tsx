import Link from "next/link";

export default function Logo({ size = "text-2xl" }: { size?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 font-bold ${size}`}>
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
        <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
      </svg>
      <span>Book<span className="text-primary">Nook</span></span>
    </Link>
  );
}
