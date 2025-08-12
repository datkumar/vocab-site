import { WordMeaningCard } from "@/components/word-meaning-card";
import { fetchWordDetails } from "@/lib/actions";
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
  const response = await fetchWordDetails(params.word);

  if (!response) {
    return notFound();
  }
  return (
    <div className="container max-w-6xl w-full h-full mx-auto py-8">
      <div className="bg-orange-50 rounded-xl px-12 py-8 shadow-lg border-2 border-amber-900 w-full">
        <WordMeaningCard wordData={response as EnglishWordEntry} />
      </div>
    </div>

    // <div className="container max-w-6xl w-full h-full mx-auto flex items-center justify-center py-8">
    //   <div className="bg-orange-50 rounded-xl px-12 py-8 shadow-lg border-2 border-amber-900">
    //     <WordMeaningCard wordData={response as EnglishWordEntry} />
    //   </div>
    // </div>
  );
}
