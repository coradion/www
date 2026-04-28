import type { Metadata } from "next";
import { Spline_Sans } from "next/font/google";
import "./globals.css";

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eudemonic Task Management",
  description: "A system for human focus and well-being",
};

export function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${splineSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
