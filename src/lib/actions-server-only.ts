"use server-only";

import { signIn } from "../../auth";
import { AuthError } from "next-auth";

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    // Refer https://authjs.dev/reference/core/errors#credentialssignin
    console.table(formData);
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
