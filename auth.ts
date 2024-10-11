import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AdminUserSchema } from "@/models/AdminUser";
import { getAdminUser } from "@/lib/actions-server-only";
import { verifyPassword } from "@/lib/password-hasher";
import { authConfig, User } from "./auth-config";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "User", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = AdminUserSchema.safeParse(credentials);
          if (!parsedCredentials.success) return null;

          const { username, password } = parsedCredentials.data;
          const fetchedUser = await getAdminUser(username);
          if (!fetchedUser) return null;

          const passwordMatched = await verifyPassword(
            password,
            fetchedUser.password
          );

          if (!passwordMatched) {
            console.log("Invalid Credentials");
            // return null;
            throw new Error("Invalid Credentials");
          }
          const user: User = {
            username: fetchedUser.username,
            id: fetchedUser._id.toString(),
          };
          return user;
        } catch (error) {
          console.error("Auth error", error);
          return null;
        }
      },
    }),
  ],
});
