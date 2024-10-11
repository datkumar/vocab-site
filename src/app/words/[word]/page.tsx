import MeaningCard from "@/components/MeaningCard";
import { getWordDetails } from "@/lib/actions-server-only";
import { type EnglishWordEntry } from "@/models/EnglishWord";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { word: string } };

export const generateMetadata = ({ params }: Props): Metadata => {
  return {
    title: params.word,
  };
};

export default async function Page({ params }: Props) {
  const response = await getWordDetails(params.word);

  if (!response) {
    return notFound();
  }
  return <MeaningCard wordData={response as EnglishWordEntry} />;
}
