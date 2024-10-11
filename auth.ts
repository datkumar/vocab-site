import NextAuth from "next-auth";
import { authConfig } from "./auth-config";
import Credentials from "next-auth/providers/credentials";
import { AdminUserSchema, getAdminUser } from "@/models/AdminUser";
import { verifyPassword } from "./src/lib/password-hasher";

type User = {
  id: string;
  username: string;
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: "User" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
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
          return null;
        }
        const user: User = {
          id: fetchedUser._id.toString(),
          username: fetchedUser.username,
        };
        return user;
      },
    }),
  ],
});
