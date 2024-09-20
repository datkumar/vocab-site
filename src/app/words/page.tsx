import { WordCloud } from "@/components/WordCloud";
import { getWordList } from "@/lib/actions-server-only";
import { shuffleArrayElements } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function Page() {
  const result = await getWordList();

  if (result) return <WordCloud words={shuffleArrayElements(result.words)} />;
  else return notFound();
}
