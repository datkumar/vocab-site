import { z } from "zod";
import type { EnglishWord, DefinitionEntry } from "./EnglishWord";

const DefinitionSchema = z.object({
  definition: z.string(),
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
  example: z.string().optional(),
});

const PhoneticSchema = z.object({
  text: z.string(),
  audio: z.string().url(),
});

const MeaningSchema = z.object({
  partOfSpeech: z.string(),
  definitions: z.array(DefinitionSchema),
  synonyms: z.array(z.string()),
  antonyms: z.array(z.string()),
});

const WordEntrySchema = z.object({
  word: z.string(),
  phonetics: z.array(PhoneticSchema),
  meanings: z.array(MeaningSchema),
});

const WordResponse = z.array(WordEntrySchema);
export type DictionaryApiResponse = z.infer<typeof WordResponse>;

export const mapApiResponseFields = (
  responseDataArray: DictionaryApiResponse
): EnglishWord => {
  let allDefinitions: DefinitionEntry[] = [],
    allExamples: string[] = [],
    allSynonyms: string[] = [],
    allAntonyms: string[] = [];
  const word: string = responseDataArray[0].word;
  let audioUrl: string = "";
  for (const wordData of responseDataArray) {
    // Set audio-url only once (ignore if already set)
    for (const phoneticData of wordData.phonetics) {
      if (!audioUrl && phoneticData.audio) {
        audioUrl = phoneticData.audio;
      }
    }
    // Collect definitions, examples, synonyms, antonyms
    for (const meaningData of wordData.meanings) {
      const partOfSpeech = meaningData.partOfSpeech;
      meaningData.synonyms.map((synonym) => allSynonyms.push(synonym));
      meaningData.antonyms.map((antonym) => allAntonyms.push(antonym));
      let definitions: string[] = [];
      for (const definitionData of meaningData.definitions) {
        definitions.push(definitionData.definition);
        definitionData.synonyms.map((synonym) => allSynonyms.push(synonym));
        definitionData.antonyms.map((antonym) => allAntonyms.push(antonym));
        if (definitionData.example) allExamples.push(definitionData.example);
      }
      allDefinitions.push({
        partOfSpeech,
        definitions,
      });
    }
  }
  const result: EnglishWord = {
    word,
    meanings: allDefinitions,
    examples: allExamples,
    synonyms: allSynonyms,
    antonyms: allAntonyms,
    variants: [], // Initially empty, have to manually add words later
  };
  if (audioUrl) {
    result.audio = audioUrl;
  }

  return result;
};
