import type { Metadata } from "next";
import Image from "next/image";
import { lora, geistMono, geistSans } from "@/lib/fonts";
import "./globals.css";
import bgtexture from "../../public/bgtexture.png";

export const metadata: Metadata = {
  title: {
    template: "%s | Vocabinary",
    default: "Vocabinary",
  },
  description: "A site to track vocabulary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} font-sans antialiased`}
      >
        <div className="relative bg-repeat min-h-dvh">
          <Image
            alt="page background image"
            src={bgtexture}
            priority={true}
            quality={100}
            placeholder="blur"
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
            }}
          />

          <div className="relative">{children}</div>
        </div>
      </body>
    </html>
  );
}
