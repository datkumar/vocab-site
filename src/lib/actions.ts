"use server";

import {
  EnglishWordEntry,
  EnglishWordsCollection,
  GroupedWords,
} from "@/models/EnglishWord";
import { AdminUserEntry, AdminUsersCollection } from "@/models/AdminUser";
import { WithId } from "mongodb";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { SearchResult } from "@/models/SearchResult";

/**
 * Fetches a small random sample of words from the `EnglishWordsCollection`
 *
 * @param count The number of random words to retrieve. It is recommended to keep this
 * below 5% of the total documents to maintain performance and avoid overloading the database.
 * @returns An object containing an array of random words, or null if the operation fails
 * @throws Will throw an error if the database query fails.
 */
export const getFewRandomWords = async (
  count = 40
): Promise<{ words: string[] } | null> => {
  try {
    const wordEntries = await EnglishWordsCollection.aggregate([
      {
        $sample: { size: count }, // Randomly select these many documents
      },
    ]).toArray();
    // Construct an array of the "word" field values
    const wordList = wordEntries.map((entry) => entry.word);
    return { words: wordList };
  } catch (error) {
    console.log("Failed to fetch words", error);
    throw new Error("Failed to fetch words");
  }
};

/**
 * Fetches a small random sample of words from the `EnglishWordsCollection`
 *
 * @returns An object containing letter-wise grouped list of words
 * @throws Will throw an error if the database query fails
 */
export const fetchGroupedWordList = async (): Promise<GroupedWords> => {
  try {
    const wordEntries = await EnglishWordsCollection.find(
      {},
      { projection: { word: 1, _id: 0 } }
    )
      .sort({ word: 1 })
      .toArray();

    const groupedWords: GroupedWords = {};
    // A = 65 to Z = 90 character codes
    for (let i = 65; i <= 90; i++) {
      groupedWords[String.fromCharCode(i)] = [];
    }

    for (const entry of wordEntries) {
      const firstLetterCode = entry.word.toUpperCase().charCodeAt(0);
      if (firstLetterCode >= 65 && firstLetterCode <= 90) {
        groupedWords[String.fromCharCode(firstLetterCode)].push(entry.word);
      }
    }
    return groupedWords;
  } catch (error) {
    console.error("Failed to get grouped word list from DB", error);
    throw new Error("Failed to get grouped word list");
  }
};

/**
 * Retrieves a single word document from the `EnglishWordsCollection` by `word` value
 * @param word The word to fetch details for
 * @returns The matching `EnglishWordEntry` document, or null if not found
 * @throws Will throw an error if the database query fails
 */
export const fetchWordDetails = async (
  word: string
): Promise<WithId<EnglishWordEntry> | null> => {
  try {
    const result = await EnglishWordsCollection.findOne({ word });
    return result;
  } catch (error) {
    console.log(`Failed to fetch details of word  ${word}`, error);
    throw new Error("Failed to fetch word details");
  }
};

/**
 * Retrieves a single word document from the `EnglishWordsCollection` by `word` value
 * @param query The term to search matching words for
 * @returns All array of all the matched {word, variants} values
 * @throws Will throw an error if the database query fails
 */
export async function searchWords(query: string): Promise<SearchResult[]> {
  // Minimum query length
  if (!query || query.length < 3) return [];

  const searchTerm = query.trim().toLowerCase();
  try {
    // NOTE: Have created Composite Index ["word", "variants"] for faster searches
    const results = await EnglishWordsCollection.find(
      {
        // Match query to anywhere in "word" field OR "variants" field array
        // The "i" is for case-insensitive
        $or: [
          { word: { $regex: new RegExp(searchTerm, "i") } },
          { variants: { $regex: new RegExp(searchTerm, "i") } },
        ],
      },
      {
        // Pick only "word" and "variants" values
        projection: { word: 1, variants: 1, _id: 0 },
      }
    )
      .limit(20)
      .toArray();

    const searchResults = results.map((result) => {
      const isWordMatch = result.word.toLowerCase().includes(searchTerm);
      return {
        word: result.word,
        wordMatched: isWordMatch,
      };
    });
    return searchResults;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

/**
 * Retrieves an admin user document by email from the AdminUsersCollection.
 * @param email The email of the admin user to retrieve
 * @returns The matching admin user document, or null if not found
 * @throws Will throw an error if the database query fails
 */
export const getAdminUser = async (
  email: string
): Promise<WithId<AdminUserEntry> | null> => {
  try {
    const adminUser = AdminUsersCollection.findOne({ email });
    return adminUser;
  } catch (error) {
    console.log("Failed to fetch user", error);
    throw new Error("Failed to fetch user");
  }
};

/**
 * Handles user authentication using credentials provided via a FormData object.
 *
 * @param prevState The previous authentication state or error message.
 * @param formData The form data containing login credentials.
 * @returns A string error message if login fails, or undefined on success.
 * @throws Will throw an unexpected error if the sign-in process fails.
 */
export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    // Refer https://authjs.dev/reference/core/errors#credentialssignin
    console.log("at authenticate()");
    console.log("formData:", formData);

    // await signIn("credentials", formData); // old one

    // Convert FormData to a regular JS object if needed
    // const formDataEntries = Object.fromEntries(formData);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Ensure we await the cookies/headers (Next15 breaking change)
    console.log("Attempting authentication for:", email);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    console.log("SignIn result:", result);

    // If we reach here, authentication was successful
    // Redirect to admin panel
    redirect("/admin");
  } catch (error) {
    console.error("Authentication error:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credentials";
        default:
          return "Something went wrong";
      }
    }
    // Handle redirect errors (which are expected after successful auth)
    if (error && typeof error === "object" && "digest" in error) {
      throw error; // Let Next.js handle the redirect
    }
    return "Authentication failed";
  }
};

/**
 * Logs the user out and redirects to the login page.
 * @param formData - The form data associated with the logout action (not used here).
 * @returns Resolves when logout is complete.
 * @throws Will throw an error if the logout operation fails.
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut({
      redirectTo: "/login",
    });
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};
