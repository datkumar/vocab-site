import { db } from "@/lib/db";
import { WithId } from "mongodb";
import { z } from "zod";

// Parts of speech: noun, pronoun, verb, adverb, adjective
// More: preposition, conjunction, interjection, determiners, article
// [
//   "adjective",
//   "adverb",
//   "conjunction",
//   "interjection",
//   "noun",
//   "preposition",
//   "proper noun",
//   "verb",
// ];

const DefinitionSchema = z.object({
  partOfSpeech: z.string(), // Maybe convert to enum later
  definitions: z.array(z.string()),
});

export type DefinitionEntry = z.infer<typeof DefinitionSchema>;

const EnglishWordSchema = z.object({
  word: z.string().min(3),
  variants: z.array(z.string()),
  meanings: z.array(DefinitionSchema),
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
  examples: z.array(z.string()),
  audio: z.url().optional(),
});
export type EnglishWord = z.infer<typeof EnglishWordSchema>;

const EnglishWordWithTimestampsSchema = EnglishWordSchema.extend({
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
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
