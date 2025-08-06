import { TiledWords } from "@/components/tiled-words";
import { getFewRandomWords } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = { params: Promise<{ word: string }> };

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  return {
    title: "Words",
  };
};

export default async function Page() {
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
