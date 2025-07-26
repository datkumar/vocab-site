"use server";

import { EnglishWordEntry, EnglishWordsCollection } from "@/models/EnglishWord";
import { AdminUserEntry, AdminUsersCollection } from "@/models/AdminUser";
import { AuthError } from "next-auth";
import { signIn, signOut } from "../auth";
import { WithId } from "mongodb";

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
 * Retrieves a single word document from the `EnglishWordsCollection` by `word` value
 * @param word The word to fetch details for
 * @returns The matching `EnglishWordEntry` document, or null if not found
 * @throws Will throw an error if the database query fails
 */
export const getWordDetails = async (
  word: string
): Promise<WithId<EnglishWordEntry> | null> => {
  try {
    const result = await EnglishWordsCollection.findOne({ word });
    return result;
  } catch (error) {
    console.log("Failed to fetch details of that word", error);
    throw new Error("Failed to fetch words");
  }
};

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
    const formDataEntries = Object.fromEntries(formData);
    // Ensure we await the cookies/headers (Next15 breaking change)
    const result = await signIn("credentials", {
      ...formDataEntries,
      redirect: false,
    });
    if (result.error) return "Invalid Credentials";
    // After successful login:
    console.log(result);
    // revalidatePath("/admin"); // revalidate the session
    return undefined; // Clear any error message
    // redirect("/admin");
    // permanentRedirect(result?.url || "/admin");
    // redirect("/admin");
    // Don't redirect here since we're handling it in the component
    // The useEffect will handle the redirect after session is updated
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

/**
 * Logs the user out and redirects to the login page.
 * @param formData - The form data associated with the logout action (not used here).
 * @returns Resolves when logout is complete.
 * @throws Will throw an error if the logout operation fails.
 */
export const logout = async (formData: FormData): Promise<void> => {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    // log the error and/or throw it
    if (error instanceof AuthError) {
      console.log("Error signing out");
    }
    throw error;
  }
};
