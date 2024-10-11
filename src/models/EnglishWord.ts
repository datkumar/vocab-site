import { getDb } from "@/lib/db";
import { WithId, Collection } from "mongodb";
import { z } from "zod";

// Parts of speech: noun, pronoun, verb, adverb, adjective
// More: preposition, conjunction, interjection, determiners, article
const DefinitionSchema = z.object({
  partOfSpeech: z.string(), // Maybe convert to enum later
  definitions: z.array(z.string()),
});

export type DefinitionEntry = z.infer<typeof DefinitionSchema>;

const EnglishWordSchema = z.object({
  word: z.string(),
  audio: z.string().url().optional(),
  meanings: z.array(DefinitionSchema),
  examples: z.array(z.string()),
  variants: z.array(z.string()),
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
});
export type EnglishWord = z.infer<typeof EnglishWordSchema>;

const EnglishWordWithTimestampsSchema = EnglishWordSchema.extend({
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type EnglishWordWithTimestamps = z.infer<
  typeof EnglishWordWithTimestampsSchema
>;

// MongoDB Collection Entry's type
export type EnglishWordEntry = WithId<EnglishWordWithTimestamps>;

let collectionPromise: Promise<Collection<EnglishWordEntry>>;

export const getEnglishWordsCollection = async (): Promise<
  Collection<EnglishWordEntry>
> => {
  try {
    if (!collectionPromise) {
      collectionPromise = getDb().then((db) =>
        db.collection<EnglishWordEntry>("english_words")
      );
    }
    return await collectionPromise;
  } catch (error) {
    console.error("Failed to get 'english_words' collection:", error);
    throw new Error("Failed to get 'english_words' collection");
  }
};

// Note: Make sure 'count' is less than 5% of total number of documents
export const getFewRandomWords = async (
  count = 40
): Promise<{
  words: string[];
} | null> => {
  try {
    const collection = await getEnglishWordsCollection();
    const wordEntries = await collection
      .aggregate([
        { $sample: { size: count } }, // Randomly select that many documents
      ])
      .toArray();
    // Construct an array of the "word" field values
    const wordList = wordEntries.map((entry) => entry.word);
    return { words: wordList };
  } catch (error) {
    console.log("Failed to fetch words", error);
    throw new Error("Failed to fetch words");
  }
};

// Additional model functions
/*

export async function getWordByValue(
  word: string
): Promise<EnglishWordEntry | null> {
  try {
    const collection = await getEnglishWordsCollection();
    return await collection.findOne({ word: word.toLowerCase() });
  } catch (error) {
    console.error(`Failed to get word '${word}':`, error);
    throw new Error("Failed to fetch word");
  }
}

export async function addWord(
  wordData: Omit<EnglishWordEntry, "_id">
): Promise<EnglishWordEntry> {
  try {
    const collection = await getEnglishWordsCollection();
    const result = await collection.insertOne({
      ...wordData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EnglishWordEntry);

    const insertedWord = await collection.findOne({ _id: result.insertedId });
    if (!insertedWord) {
      throw new Error("Failed to retrieve inserted word");
    }

    return insertedWord;
  } catch (error) {
    console.error("Failed to add word:", error);
    throw new Error("Failed to add new word");
  }
}

export async function updateWord(
  wordId: string,
  updateData: Partial<Omit<EnglishWordEntry, "_id" | "createdAt">>
): Promise<EnglishWordEntry | null> {
  try {
    const collection = await getEnglishWordsCollection();
    const result = await collection.findOneAndUpdate(
      { _id: wordId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" }
    );

    return result;
  } catch (error) {
    console.error(`Failed to update word '${wordId}':`, error);
    throw new Error("Failed to update word");
  }
}

*/
