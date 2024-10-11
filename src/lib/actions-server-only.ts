"use server-only";

import { EnglishWordsCollection, EnglishWordEntry } from "@/models/EnglishWord";
import { signIn } from "../../auth";
import { AuthError } from "next-auth";
import { AdminUsersCollection } from "@/models/AdminUser";

// Note: Make sure 'count' is less than 5% of total number of documents
export const getFewRandomWords = async (
  count = 40
): Promise<{
  words: string[];
} | null> => {
  try {
    const wordEntries = await EnglishWordsCollection.aggregate([
      { $sample: { size: count } }, // Randomly select that many documents
    ]).toArray();
    // Construct an array of the "word" field values
    const wordList = wordEntries.map((entry) => entry.word);
    return { words: wordList };
  } catch (error) {
    console.log("Failed to fetch words", error);
    throw new Error("Failed to fetch words");
  }
};

export const getWordDetails = async (word: string) => {
  try {
    const result = await EnglishWordsCollection.findOne({ word });
    console.log(result);
    return result;
  } catch (error) {
    console.log("Failed to fetch details of that word", error);
    throw new Error("Failed to fetch words");
  }
};

export const getAdminUser = async (username: string) => {
  try {
    const adminUser = AdminUsersCollection.findOne({ username });
    return adminUser;
  } catch (error) {
    console.log("Failed to fetch user", error);
    throw new Error("Failed to fetch user");
  }
};

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    // Refer https://authjs.dev/reference/core/errors#credentialssignin
    console.log("formData", formData);
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
};
