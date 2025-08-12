import { ConditionalNavbar } from "@/components/conditional-navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ConditionalNavbar />
      <main>{children}</main>
    </div>
  );
}
