import { auth } from "@/auth";
import { UnifiedNavbar } from "./unified-navbar";

export const ConditionalNavbar = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return <UnifiedNavbar isAuthenticated={isAuthenticated} />;
};
