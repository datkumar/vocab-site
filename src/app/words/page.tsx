import { WordCloud } from "@/components/WordCloud";
import { getFewRandomWords } from "@/models/EnglishWord";
import { notFound } from "next/navigation";

export default async function Page() {
  const wordList = await getFewRandomWords();

  return wordList ? <WordCloud words={wordList.words} /> : notFound();
}
