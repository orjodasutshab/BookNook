export default function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="badge badge-success text-white gap-1 font-semibold" title="This writer completed their profile">
      ✔ Verified
    </span>
  ) : (
    <span className="badge badge-ghost border-base-300 gap-1 opacity-80" title="This profile is not complete yet">
      Unverified
    </span>
  );
}
