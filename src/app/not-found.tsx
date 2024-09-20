import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container h-dvh content-center">
      <h1 className="text-2xl py-3">
        Sorry we couldn&apos;t find what you were looking for
      </h1>
      <Link href="/" className="font-semibold text-lg text-blue-700">
        Take me back to Homepage
      </Link>
    </div>
  );
}
