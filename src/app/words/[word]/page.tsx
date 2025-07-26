import MeaningCard from "@/components/MeaningCard";
import { getWordDetails } from "@/lib/actions";
import { type EnglishWordEntry } from "@/models/EnglishWord";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ word: string }> };

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  return {
    title: params.word,
  };
};

export default async function Page(props: Props) {
  const params = await props.params;
  const response = await getWordDetails(params.word);

  if (!response) {
    return notFound();
  }
  return <MeaningCard wordData={response as EnglishWordEntry} />;
}
