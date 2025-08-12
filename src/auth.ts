import NextAuth, { CredentialsSignin, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth-config";
import { mongo } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { AdminUserSchema } from "@/models/AdminUser";
import { getAdminUser } from "@/lib/actions";
import { verifyPassword } from "@/lib/password-hasher";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid email or password";
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

          const parsedCredentials = AdminUserSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            console.log("Validation failed:", parsedCredentials.error);
            return null;
          }
          const { email, password } = parsedCredentials.data;
          console.log("Parsed Email:", email);

          const fetchedUser = await getAdminUser(email);
          if (!fetchedUser) {
            console.log("User not found");
            return null;
          }

          const passwordMatched = await verifyPassword(
            password,
            fetchedUser.password
          );
          if (!passwordMatched) {
            console.log("Invalid Credentials");
            return null;
          }

          const user: User = {
            id: fetchedUser._id.toString(),
            email: fetchedUser.email,
          };

          console.log("Authentication successful for user:", user.email);
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
