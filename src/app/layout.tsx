import { Providers } from "@/components/providers";
import { lora, geistMono, geistSans } from "@/lib/fonts";
import clsx from "clsx";
import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s | Vocabinary", default: "Vocabinary" },
  description: "A site to track vocabulary",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={clsx(
          "repeating-page-bg",
          geistSans.variable,
          geistMono.variable,
          lora.variable,
          "font-sans antialiased"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
