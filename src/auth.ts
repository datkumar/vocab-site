import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AdminUserSchema } from "@/models/AdminUser";
import { getAdminUser } from "@/lib/actions";
import { verifyPassword } from "@/lib/password-hasher";
import { authConfig } from "./auth-config";
import { CredentialsSignin, User } from "next-auth";
import { mongo } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(mongo),
  session: {
    strategy: "jwt", // explicitly set the strategy
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          console.log("at authorize()");
          const parsedCredentials = await AdminUserSchema.safeParse(
            credentials
          );
          if (!parsedCredentials.success) return null;
          // if (!parsedCredentials.success) {
          //   throw new Error("Invalid credentials format");
          // }

          const { email, password } = parsedCredentials.data;
          console.log("Parsed Credentials:", { email, password });

          const fetchedUser = await getAdminUser(email);
          if (!fetchedUser) return null;
          // if (!fetchedUser) {
          //   throw new Error("User not found");
          // }

          const passwordMatched = await verifyPassword(
            password,
            fetchedUser.password
          );
          if (!passwordMatched) {
            console.log("Invalid Credentials");
            // return null;
            // throw new Error("Invalid Credentials");
            throw new InvalidLoginError();
          }

          const user: User = {
            id: fetchedUser._id.toString(),
            email: fetchedUser.email,
          };
          console.log("user:", user);
          return user;
        } catch (error) {
          console.error("AUTH ERROR", error);
          return null;
        }
      },
    }),
  ],
  // callbacks: {
  //   session({ session, token, user }) {
  //     // `session.user.address` is now a valid property, and will be type-checked
  //     // in places like `useSession().data.user` or `auth().user`
  //     return {
  //       ...session,
  //       user: {
  //         ...session.user,
  //         email: user.email,
  //       },
  //     };
  //   },
  // },
  // callbacks: {
  //   async session({ session, token }) {
  //     return {
  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: token.sub,
  //         username: token.username,
  //       },
  //     };
  //   },
  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.username = user.username;
  //     }
  //     return token;
  //   },
  // },
});
