import { mongo } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthConfig } from "next-auth";

export type User = {
  id: string;
  username: string;
};

export const authConfig = {
  providers: [],
  adapter: MongoDBAdapter(mongo),
  pages: {
    signIn: "/login",
  },
  // Middleware callbacks
  callbacks: {
    // Checks that request is authorized to access a page
    authorized: ({ request: { nextUrl }, auth }) => {
      // Convert to truthy/falsy value
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) return false;

      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      if (!isOnAdminPanel) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;
    },
    // jwt: async ({ token, user:AdminUser }) => {
    //   if (user) {
    //     token.id = user.id;
    //     token.username = user.username;
    //   }
    //   return token;
    // },
    // session: async ({ session, token }) => {
    //   if (token) {
    //     session.user = {
    //       ...session.user,
    //       username: token.name as string,
    //       id: token.id as string,
    //     };
    //   }
    //   return session;
    // },
  },
} satisfies NextAuthConfig;
