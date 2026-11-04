import Link from "next/link";
import Title from "@/components/Title";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <Title name="Page Not Found" />
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="text-2xl font-semibold mt-4">This page is missing from our shelf</p>
      <p className="opacity-70 mt-2 mb-6">The page you are looking for does not exist or was moved.</p>
      <Link href="/" className="btn btn-primary text-white">Back to Home</Link>
    </div>
  );
}
