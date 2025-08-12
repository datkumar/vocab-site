import path from "node:path";
import axios from "axios";
import { readFile, writeFile } from "node:fs/promises";
import {
  clusterByPartOfSpeech,
  delay,
  getRandomTimestamp,
  getUniqueStrings,
  shuffleArrayElements,
} from "../lib/utils";
import {
  type EnglishWordEntry,
  type EnglishWord,
  type EnglishWordWithTimestamps,
  EnglishWordsCollection,
} from "../models/EnglishWord";
import {
  mapApiResponseFields,
  type DictionaryApiResponse,
} from "../models/DictionaryApiResponse";
import { ObjectId } from "mongodb";

// This script is called from project root via 'pnpm init-words'
const inputFilePath = path.resolve("./src/init/words.txt");
// Output-file stores words from input-file whose meanings weren't found
const outputFilePath = path.resolve("./src/init/words-failed.txt");

const getWordMeaning = async (
  queryWord: string
): Promise<DictionaryApiResponse | null> => {
  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${queryWord}`;
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    return null;
  }
};

try {
  const fileContent = await readFile(inputFilePath, { encoding: "utf8" });
  const lines = fileContent.split("\n");

  console.log("STEP 1: Creating list of words to search from input file");
  let uniqueQueryWords: Set<string> = new Set();
  for (const line of lines) {
    const firstWord = line.trim().split(" ")[0];
    // Remove all characters that aren't a-z or hyphen
    const sanitizedWord = firstWord.toLowerCase().replace(/[^a-z-]/g, "");
    if (sanitizedWord) uniqueQueryWords.add(sanitizedWord);
  }

  // Get final array of query words shuffled randomly
  const finalQueryWords = shuffleArrayElements([...uniqueQueryWords]);

  const present = new Date();
  const oneYearBefore = new Date(present);
  oneYearBefore.setFullYear(present.getFullYear() - 1);

  const dbEntriesToInsert: EnglishWordEntry[] = [];
  const failedWords: string[] = [];

  console.log("STEP 2: Fetching & Processing meaning of each word");
  for (const word of finalQueryWords) {
    const dictionaryApiResponse = await getWordMeaning(word);
    if (!dictionaryApiResponse) {
      console.log(`  Could not find meaning of: ${word}`);
      failedWords.push(word);
      continue;
    }

    const wordData: EnglishWord = mapApiResponseFields(dictionaryApiResponse);
    const randomTimeStamp = getRandomTimestamp(oneYearBefore, present);

    const wordEntry: EnglishWordWithTimestamps = {
      ...wordData,
      meanings: clusterByPartOfSpeech(wordData.meanings),
      synonyms: getUniqueStrings(wordData.synonyms),
      antonyms: getUniqueStrings(wordData.antonyms),
      examples: getUniqueStrings(wordData.examples),
      variants: getUniqueStrings(wordData.variants),
      // Assuming entry added at some random point of time within last year
      createdAt: randomTimeStamp.toISOString(),
      updatedAt: randomTimeStamp.toISOString(),
    };

    // Generate id and push current word entry to all entries to be inserted
    dbEntriesToInsert.push({
      ...wordEntry,
      _id: new ObjectId(),
    });

    // The API is rate-limited as upto 450 requests per 5 mins
    await delay(667); // Wait 667ms before making next API call
  }
  console.log("STEP 3: Inserting entries into DB");

  // Insert all the prepared entries into DB
  const isInserted = await EnglishWordsCollection.insertMany(dbEntriesToInsert);
  // Verify that entries were inserted
  isInserted.acknowledged
    ? console.log("===== Your words were successfully inserted into DB =====")
    : console.log("===== Could not your insert words into DB =====");

  // Create index over "word" and "variant" for faster search querying later
  console.log("STEP 4: Creating Index for faster queries");
  await EnglishWordsCollection.createIndex(["word", "variants"]);

  console.log(
    "STEP 5: Writing the failed word searches into output file: words-failed.txt"
  );
  const outputFileContent = failedWords.join("\n");
  await writeFile(outputFilePath, outputFileContent, { encoding: "utf8" });
} catch (err) {
  console.error(err);
}
