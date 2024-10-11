import { authConfig } from "./auth-config";
import NextAuth from "next-auth";

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/admin/:path*"],
};
