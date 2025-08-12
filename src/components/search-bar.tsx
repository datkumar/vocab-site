"use client";

import { useState, useEffect, useRef, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { searchWords } from "@/lib/actions";
import { SearchResult } from "@/models/SearchResult";
import clsx from "clsx";

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Hide dropdown if query is too short
    if (searchTerm.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      startTransition(async () => {
        try {
          const searchResults = await searchWords(searchTerm);
          setResults(searchResults);
          setShowDropdown(true); // Always show dropdown if search is > 3
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
          setShowDropdown(false);
        }
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setActiveIndex(-1); // Reset active index on new search
    };
  }, [searchTerm]);

  const handleSelectWord = (word: string) => {
    setShowDropdown(false);
    setSearchTerm("");
    router.push(`/words/${word}`);
  };

  // Prevent form submission on Enter key
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return; // Only handle keys when dropdown is visible

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : results.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex !== -1) {
        handleSelectWord(results[activeIndex].word);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const showMessage = useMemo(() => {
    if (isPending) return "Searching...";
    if (searchTerm.length < 3) return "Type at least 3 characters...";
    if (results.length === 0) return "No matches found.";
    return null;
  }, [isPending, searchTerm, results.length]);

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Remove onSubmit from form to prevent redirect on Enter */}
      <form onSubmit={handleFormSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for words ..."
            className="w-full pl-4 pr-2 py-2 text-sm border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="button" // Change to type="button" to prevent form submission
            disabled={searchTerm.length < 3}
            className={clsx(
              "absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 transition-colors",
              searchTerm.length < 3
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {isPending ? (
              // Loading spinner
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            ) : (
              // Search icon (Magnifying glass)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="size-6 h-5 w-5 stroke-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {showMessage ? (
            <div className="px-4 py-3 text-sm text-gray-500">{showMessage}</div>
          ) : (
            results.map((result, index) => (
              <button
                key={result.word}
                onClick={() => handleSelectWord(result.word)}
                className={clsx(
                  "w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors",
                  { "bg-gray-100": index === activeIndex }
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-orange-900">
                    {result.word}
                  </span>
                  <span
                    className={clsx(
                      "text-xs px-2 py-1 rounded-full",
                      result.wordMatched
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {result.wordMatched ? "Direct Match" : "Variant matched"}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
