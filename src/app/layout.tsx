import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kembara Dani • Perjalanan Gadis Berhijab Asal Malaysia",
  description: "Sebuah pengalaman game 2D Pixel Art platformer bercerita tentang kembara seorang gadis berhijab asal Malaysia dari Kampung Warisan ke Puncak Kinabalu. Dibangun dengan Next.js 14, Canvas 2D, dan Web Audio API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-[#050608] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
