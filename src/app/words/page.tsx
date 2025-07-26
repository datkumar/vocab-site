import { TiledWords } from "@/components/TiledWords";
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

  return <TiledWords words={wordList.words} />;
}
