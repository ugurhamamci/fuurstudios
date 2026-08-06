import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FUUR STUDIO - Dijital Dönüşüm Ortağınız",
  description: "Dijital dönüşüm ortağınız. Yazılım, AI ve tasarım çözümleri ile markanızı bir adım öne taşıyoruz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="dark">
      <head>
        <link rel="stylesheet" href="/css/variables.css" />
        <link rel="stylesheet" href="/css/reset.css" />
        <link rel="stylesheet" href="/css/typography.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/layout.css" />
        <link rel="stylesheet" href="/css/sections.css" />
        <link rel="stylesheet" href="/css/animations.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
