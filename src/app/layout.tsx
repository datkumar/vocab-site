import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Providers from "@/components/providers";
import SearchBar from "@/components/search-bar";
import "@/app/globals.css";
import { lora, geistMono, geistSans } from "@/lib/fonts";
import clsx from "clsx";

export const metadata: Metadata = {
  title: {
    template: "%s | Vocabinary",
    default: "Vocabinary",
  },
  description: "A site to track vocabulary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          lora.variable,
          "font-sans antialiased min-h-screen"
        )}
      >
        <Providers>
          {/* HEADER */}
          <header className="bg-slate-800 text-slate-100 shadow-sm border-b sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 max-w-6xl">
              <div className="flex items-center justify-between">
                {/* LOGO & NAVIGATION */}
                <div className="flex items-center space-x-6">
                  {/* LOGO: Always visible on all screen sizes */}
                  <Link href="/" className="flex items-center space-x-2">
                    <Image
                      src="/icon.svg"
                      alt="Vocabinary Logo"
                      height={28}
                      width={28}
                      priority // Ensures the logo loads quickly
                    />
                    <div className="text-xl font-serif font-bold hover:text-orange-300">
                      Vocabinary
                    </div>
                  </Link>

                  {/* NAVIGATION: Hidden on mobile, shown on medium screens and up */}
                  <nav className="hidden md:flex space-x-6">
                    <Link href="/words" className="hover:text-orange-300">
                      Glossary
                    </Link>
                  </nav>
                </div>

                {/* SEARCH-BAR */}
                <SearchBar />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
