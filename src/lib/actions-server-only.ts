"use server-only";

import { EnglishWordCollection } from "@/models/EnglishWord";

export const getWordList = async (): Promise<{ words: string[] } | null> => {
  const wordList = await EnglishWordCollection.find(
    {},
    { projection: { _id: 0, word: 1 } }
  ).toArray();
  const result: string[] = [];
  wordList.forEach((x) => result.push(x.word));
  return {
    words: result,
  };
};
