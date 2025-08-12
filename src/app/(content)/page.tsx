import { TiledWords } from "@/components/tiled-words";
import { getFewRandomWords } from "@/lib/actions";
import { notFound } from "next/navigation";

export default async function Home() {
  const wordList = await getFewRandomWords();

  if (!wordList || wordList.words.length < 1) return notFound();

  return (
    <div className="container h-full max-w-6xl">
      <div className=" flex flex-col items-center justify-center py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-center text-rose-800 pb-8">
          Fresh 40 Mix
        </h1>
        <TiledWords words={wordList.words} />
      </div>
    </div>
  );
}
