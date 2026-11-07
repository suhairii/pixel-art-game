import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel Runner • 2D Pixel Art Platformer",
  description: "An Awwwards-inspired 2D pixel art side-scrolling platformer built with Next.js, HTML5 Canvas, and Web Audio API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-[#050608] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
