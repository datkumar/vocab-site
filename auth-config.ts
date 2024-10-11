import { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Checks that request is authorized to access a page
    authorized: ({ request: { nextUrl }, auth }) => {
      // Convert to truthy/falsy value
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) return false;

      const isOnWordsGallery = nextUrl.pathname.startsWith("/words");
      if (!isOnWordsGallery) {
        return Response.redirect(new URL("/words", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
