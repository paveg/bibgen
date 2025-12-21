import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bibgen.vercel.app"),
  title: {
    default: "BIBGEN | バイク用ゼッケンジェネレーター",
    template: "%s | BIBGEN",
  },
  description:
    "モトクロス、エンデューロなどバイクレース用のゼッケンナンバーを簡単に生成・印刷できるツール。サイズ・フォント・カラーをカスタマイズして印刷可能。",
  keywords: [
    "ゼッケン",
    "ビブス",
    "モトクロス",
    "エンデューロ",
    "バイクレース",
    "ナンバープレート",
    "オフロード",
    "レース",
    "印刷",
  ],
  authors: [{ name: "FUNAI RACING", url: "https://funairacing.com" }],
  creator: "FUNAI RACING",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://bibgen.vercel.app",
    siteName: "BIBGEN",
    title: "BIBGEN | バイク用ゼッケンジェネレーター",
    description: "モトクロス・エンデューロ用ゼッケンを簡単に生成・印刷",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BIBGEN - バイク用ゼッケンジェネレーター",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BIBGEN | バイク用ゼッケンジェネレーター",
    description: "モトクロス・エンデューロ用ゼッケンを簡単に生成・印刷",
    images: ["/og-image.png"],
    creator: "@paveg_",
  },
  robots: {
    index: true,
    follow: true,
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
