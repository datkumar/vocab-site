import Link from "next/link";

export default function NotFound() {
  return (
    // Replaced invalid class with correct flexbox utilities
    <div className="container h-dvh mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl py-5 text-center font-serif">
        Sorry, no such page exists {" ¯\\_(ツ)_/¯"}
      </h1>
      <Link
        href="/"
        className="font-bold text-2xl text-blue-600 hover:underline hover:scale-105"
      >
        Back to Homepage
      </Link>
    </div>
  );
}
