import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type DefinitionEntry } from "../models/EnglishWord";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getUniqueStrings = (arr: string[]): string[] => {
  return Array.from(new Set(arr));
};

export const clusterByPartOfSpeech = (
  meanings: DefinitionEntry[]
): DefinitionEntry[] => {
  // Get unique POS available over all the meanings
  const uniquePos = new Set<string>();
  meanings.map((entry) => uniquePos.add(entry.partOfSpeech));

  // The mapping for result is: (unique pos) -> (unique definitions of that pos)
  const resultMap = new Map<string, string[]>();
  // Init empty array for each unique POS in result
  uniquePos.forEach((pos) => resultMap.set(pos, []));

  // Push the various definition array items into respective POS arrays
  meanings.map((entry) =>
    resultMap.get(entry.partOfSpeech)?.push(...entry.definitions)
  );

  // Convert the mappings into array of Objects as per Meaning schema
  const result: DefinitionEntry[] = [];
  for (const [pos, definitions] of resultMap) {
    result.push({
      partOfSpeech: pos,
      // Remove duplicate definitions of each POS
      definitions: getUniqueStrings(definitions),
    });
  }
  return result;
};

export const getRandomTimestamp = (stamp1: Date, stamp2: Date): Date => {
  if (stamp1 > stamp2) {
    throw Error("The first timestamp should be earlier than the second one");
  }
  const randomTimestamp = new Date(
    stamp1.getTime() + Math.random() * (stamp2.getTime() - stamp1.getTime())
  );
  return randomTimestamp;
};

// Fisher-Yates shuffle algorithm in O(n) time with type generics
export const shuffleArrayElements = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    // random() generates in range [0,1)
    // We want a random index in range [0,i]
    let j = Math.floor(Math.random() * (i + 1));

    // Swap arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};
