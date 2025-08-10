import { TiledWords } from "@/components/tiled-words";
import { getFewRandomWords } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function Home() {
  const wordList = await getFewRandomWords();

  if (!wordList || wordList.words.length < 1) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container w-full max-w-4xl bg-orange-50 rounded-xl p-6 shadow-lg border-2 border-amber-900">
        <TiledWords words={wordList.words} />
      </div>
    </div>
  );
}
