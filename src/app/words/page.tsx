import { fetchGroupedWordList } from "@/lib/actions";
import { Metadata } from "next";
import Link from "next/link";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Glossary",
  };
};

export default async function WordsPage() {
  const groupedWords = await fetchGroupedWordList();

  return (
    <div className="container max-w-6xl mx-auto py-5 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-center text-rose-800 my-8">
        Glossary
      </h1>

      <div className="flex flex-col gap-6">
        {Object.entries(groupedWords).map(
          ([letter, letterWords]) =>
            letterWords.length > 0 && (
              <div
                key={letter}
                className="bg-orange-100 rounded-2xl p-6 border border-amber-900 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline">
                  {/* Letter title */}
                  <h2 className="text-4xl font-serif font-bold text-orange-900 pr-3">
                    {letter}
                  </h2>
                  {/* Words of that letter */}
                  {letterWords.map((word, index) => (
                    // Use a span for each word to control spacing consistently
                    <span key={word} className="mr-3 mb-2">
                      <Link
                        href={`/${word}`}
                        className="hover:underline  hover:text-amber-600 transition-colors duration-200"
                      >
                        {word}
                      </Link>
                    </span>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
