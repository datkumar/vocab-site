import { db } from "@/lib/db";
import { WithId } from "mongodb";
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

// MongoDB collection of english word entries
export const EnglishWordsCollection =
  db.collection<EnglishWordEntry>("english_words");

// Type for the aggregated result
export interface GroupedWords {
  // Key will be the starting letter (A-Z), value will be an array of words
  [key: string]: string[];
}
