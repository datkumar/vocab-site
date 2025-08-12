import { authConfig } from "@/auth-config";
import NextAuth from "next-auth";

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // matcher: ["/admin/:path*", "/login/:path*"],
  matcher: [
    // Match all admin routes
    "/admin/:path*",
    // Match login page to redirect authenticated users
    "/login",
    // Exclude static files, API routes, audio files, and other assets
    // "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|gif|webp|svg|mp3|wav|ogg|m4a|aac|flac)).*)",
  ],
};
