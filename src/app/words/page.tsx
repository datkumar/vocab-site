import { WordCloud } from "@/components/WordCloud";
import { getFewRandomWords } from "@/lib/actions-server-only";
import { notFound } from "next/navigation";

export default async function Page() {
  const wordList = await getFewRandomWords();

  if (!wordList || wordList.words.length < 1) return notFound();

  return <WordCloud words={wordList.words} />;
}
