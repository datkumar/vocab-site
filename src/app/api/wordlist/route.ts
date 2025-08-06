import { EnglishWordsCollection, GroupedWords } from "@/models/EnglishWord";
import { NextResponse } from "next/server";
import z from "zod";

export const GET = async (request: Request) => {
  try {
    const wordEntries = await EnglishWordsCollection.find(
      {},
      {
        projection: { word: 1, _id: 0 },
      }
    )
      .sort({ word: 1 })
      .toArray();

    const groupedWords: GroupedWords = {};
    for (let i = 65; i <= 90; i++) {
      // A-Z letter group keys
      groupedWords[String.fromCharCode(i)] = [];
    }

    for (const entry of wordEntries) {
      // Ensure non-empty string
      const parsed = z.string().min(2).safeParse(entry.word);
      if (parsed.success) {
        const word = parsed.data;
        const firstLetterCode = word.toUpperCase().charCodeAt(0);
        if (firstLetterCode >= 65 && firstLetterCode <= 90) {
          groupedWords[String.fromCharCode(firstLetterCode)].push(word);
        }
      }
    }

    return NextResponse.json({ groupedWords }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};
