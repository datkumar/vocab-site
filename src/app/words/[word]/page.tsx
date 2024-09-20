import MeaningCard from "@/components/MeaningCard";
import {
  EnglishWordCollection,
  type EnglishWordEntry,
} from "@/models/EnglishWord";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { word: string } };

export const generateMetadata = ({ params }: Props): Metadata => {
  return {
    title: params.word,
  };
};

export default async function Page({ params }: Props) {
  const response = await EnglishWordCollection.findOne({ word: params.word });

  if (!response) {
    return notFound();
  }
  return <MeaningCard wordData={response as EnglishWordEntry} />;
}
