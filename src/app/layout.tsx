import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIBGEN | バイク用ゼッケンジェネレーター",
  description:
    "モトクロス、エンデューロなどバイクレース用のゼッケンナンバーを簡単に生成・印刷できるツール",
  keywords: [
    "ゼッケン",
    "ビブス",
    "モトクロス",
    "エンデューロ",
    "バイクレース",
    "ナンバープレート",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BIBGEN | バイク用ゼッケンジェネレーター",
    description: "バイクレース用ゼッケンを簡単に生成",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="gradient-bg grid-pattern">{children}</body>
    </html>
  );
}
