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
      const isLoggedIn = !!auth?.user; // Convert to truthy/falsy value
      const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      if (isOnAdminPanel) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/admin", nextUrl));
      }
      return true;

      // const isOnAdminPanel = nextUrl.pathname.startsWith("/admin");
      // If trying to access admin without auth, redirect to login
      // if (!isLoggedIn && isOnAdminPanel) {
      //   return Response.redirect(new URL("/login", nextUrl));
      // }
      // // Allow access if authenticated or not trying to access protected routes
      // return true;
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
