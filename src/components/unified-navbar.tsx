import Link from "next/link";
import { SearchBar } from "./search-bar";
import { LogoutBtn } from "./logout-btn";
import Image from "next/image";

interface UnifiedNavbarProps {
  isAuthenticated: boolean;
}

export const UnifiedNavbar = ({ isAuthenticated }: UnifiedNavbarProps) => {
  return (
    <nav className="bg-neutral-800 w-full text-gray-100 shadow-lg border-b border-gray-200 py-5">
      <div className="container  max-w-6xl mx-auto flex gap-8 justify-between items-center">
        {/* Nav-Links on the LEFT */}
        <div className="flex items-center justify-evenly gap-6 font-semibold">
          {/* Site title with icon */}
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-amber-300 transition-colors"
          >
            <Image
              src="/icon.svg"
              alt="Vocabinary Logo"
              height={28}
              width={28}
              priority
            />
            <div className="">Vocabinary</div>
          </Link>
          {/* Dashboard (admin only) */}
          {isAuthenticated && (
            <Link
              href="/admin"
              className="hover:text-amber-300 transition-colors"
            >
              Dashboard
            </Link>
          )}
          {/* Glossary */}
          <Link
            href="/words"
            className="hover:text-amber-300 transition-colors"
          >
            Glossary
          </Link>
        </div>
        {/* Search Bar */}
        <div className="w-xl">
          <SearchBar />
        </div>
        {/* Logout button (admin only) */}
        {isAuthenticated && <LogoutBtn />}
      </div>
    </nav>
  );
};
