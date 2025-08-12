import type { NextAuthConfig } from "next-auth";

// export type User = {
//   id: string;
//   username: string;
// };

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
  },
  // Middleware callbacks
  callbacks: {
    // Checks that request is authorized to access a page
    authorized: ({ request: { nextUrl }, auth }) => {
      console.log("at authorized()");
      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      // Convert to truthy/falsy value
      const isLoggedIn = !!auth?.user;

      if (isOnAdminPanel) {
        if (isLoggedIn) return true;
        // Redirect unauthenticated users to login page
        return false;
      }

      // User is logged-in and tries to access login page, redirect to admin
      if (isOnLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) {
        // Allows relative callback URLs
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        // Allows callback URLs on the same origin
        return url;
      }
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

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
