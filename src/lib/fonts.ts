import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Lora } from "next/font/google";

export const geistSans = GeistSans;
export const geistMono = GeistMono;

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});
