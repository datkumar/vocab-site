import { WordMeaningCard } from "@/components/word-meaning-card";
import { getWordDetails } from "@/lib/actions";
import { type EnglishWordEntry } from "@/models/EnglishWord";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ word: string }>;
};

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const params = await props.params;
  return {
    title: params.word,
  };
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const response = await getWordDetails(params.word);

  if (!response) {
    return notFound();
  }
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container w-full max-w-4xl bg-orange-100 rounded-xl px-10 py-8 shadow-lg border-2 border-amber-900">
        <WordMeaningCard wordData={response as EnglishWordEntry} />
      </div>
    </div>
  );
}
