import { ConditionalNavbar } from "@/components/conditional-navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ConditionalNavbar />
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
