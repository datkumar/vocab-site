import path from "node:path";
import axios from "axios";
import { readFile, writeFile } from "node:fs/promises";
import { db, mongo } from "../lib/db";
import {
  clusterByPartOfSpeech,
  delay,
  getRandomTimestamp,
  getUniqueStrings,
  shuffleArrayElements,
} from "../lib/utils";
import type {
  EnglishWord,
  EnglishWordWithTimestamps,
} from "../models/EnglishWord";
import {
  mapApiResponseFields,
  type DictionaryApiResponse,
} from "../models/DictionaryApiResponse";

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

  const dbEntriesToInsert: EnglishWordWithTimestamps[] = [];
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

    dbEntriesToInsert.push(wordEntry);

    // The API is rate-limited as upto 450 requests per 5 mins
    await delay(667); // Wait 667ms before making next API call
  }
  console.log("STEP 3: Inserting entries into DB");

  const isInserted = await db
    .collection("english_words")
    .insertMany(dbEntriesToInsert);
  isInserted.acknowledged
    ? console.log("===== Your words were successfully inserted into DB =====")
    : console.log("===== Could not your insert words into DB =====");

  console.log("STEP 4: Creating Index for faster queries");
  await db.collection("english_words").createIndex(["word", "variants"]);

  console.log(
    "STEP 5: Writing failed word searches into output file: words-failed.txt"
  );
  const outputFileConent = failedWords.join("\n");
  await writeFile(outputFilePath, outputFileConent, { encoding: "utf8" });
} catch (err) {
  console.error(err);
} finally {
  // Close the DB connection
  await mongo.close();
}
