import type { Metadata } from "next";
import { Roboto, Barlow_Semi_Condensed } from "next/font/google";
import "@/components/arc/foundation.css";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const barlowSemiCondensed = Barlow_Semi_Condensed({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZPPSU - Online Accreditation Management System | Un Sagwan, Un Layag",
  description: "Official Accreditation Management System for Zamboanga Peninsula Polytechnic State University",
  icons: {
    icon: "/brand/zppsu-seal.png",
    apple: "/brand/zppsu-seal.png",
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
      className={`${roboto.variable} ${barlowSemiCondensed.variable} h-full antialiased`}
      data-accent="maroon"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
