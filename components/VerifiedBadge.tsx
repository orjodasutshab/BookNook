export default function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span
      title="This writer completed their profile"
      className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-500 px-3 text-sm font-semibold text-white shadow-sm"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
      Verified
    </span>
  ) : (
    <span
      title="This profile is not complete yet"
      className="inline-flex h-7 items-center gap-1.5 rounded-full border border-base-300 bg-base-200 px-3 text-sm font-medium opacity-80"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16.5v.01" />
      </svg>
      Unverified
    </span>
  );
}
