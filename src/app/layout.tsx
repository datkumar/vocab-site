import Image from "next/image";
import { lora, geistMono, geistSans } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

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
        <Providers>
          <div className="relative bg-repeat min-h-dvh">
            <Image
              alt="Page Background Image"
              src="/bg-texture.png"
              fill={true}
              // sizes="100vw"
              placeholder="blur"
              blurDataURL="/bg-blur.png"
              // Generated from https://png-pixel.com/
              // unoptimized={false}
              // priority={true}
              // quality={100}
              // fetchPriority="high"
              style={{
                objectFit: "cover",
              }}
            />

            <div className="relative">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
