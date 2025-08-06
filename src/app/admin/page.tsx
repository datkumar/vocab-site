import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="container max-w-6xl pt-2">
      <Link href="/admin/new-word">
        <button className="flex items-center gap-2 cursor-pointer bg-slate-50 text-amber-700 text-lg px-4 py-3 rounded-lg hover:bg-slate-100 transition shadow">
          <img src="/ic-plus.svg" alt="plus icon" width={24} height={24} />
          <span>Add New Word</span>
        </button>
      </Link>
    </main>
  );
}
