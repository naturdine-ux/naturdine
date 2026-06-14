import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SiteLayout from "@/components/SiteLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naturdine — Natural Wooden Cutlery",
  description: "Handcrafted bamboo and wooden cutlery sets for everyday dining. Beautiful, durable, and completely plastic-free. Ships from the USA.",
  keywords: "bamboo cutlery, wooden cutlery, eco friendly flatware, sustainable cutlery sets",
  openGraph: {
    title: "Naturdine — Natural Wooden Cutlery",
    description: "Handcrafted bamboo and wooden cutlery sets. Plastic-free, sustainably sourced, ships from the USA.",
    siteName: "Naturdine",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
     <body className="min-h-full flex flex-col bg-[#FDFCF9] text-[#1A1A1A]">
  <SiteLayout>
    {children}
  </SiteLayout>
</body>
    </html>
  );
}