import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EcoSphere | ESG Management Platform",
  description: "Enterprise Environmental, Social, and Governance scoring, compliance, and engagement platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full antialiased text-neutral-900 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
