"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions";
import clsx from "clsx";

export const AdminNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "#", label: "Nav-item" },
  ];

  return (
    <nav className="bg-stone-900 shadow-lg border-b-2 border-slate-700">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-3 py-2 rounded-md text-xl font-medium hover:underline transition-colors ease-in",
                  pathname === item.href ? "text-amber-300" : "text-slate-400"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 rounded-md font-medium bg-red-50 text-red-700 hover:bg-red-500 hover:text-white transition-colors ease-in"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};
