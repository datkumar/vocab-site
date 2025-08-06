import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <AdminNav />
      <main className="max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
