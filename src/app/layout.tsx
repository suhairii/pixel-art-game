import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kembara Dani • Perjalanan Gadis Berhijab Asal Malaysia",
  description: "Sebuah pengalaman game 2D Pixel Art platformer bercerita tentang kembara seorang gadis berhijab asal Malaysia dari Kampung Warisan ke Puncak Kinabalu. Dibangun dengan Next.js 14, Canvas 2D, dan Web Audio API.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className="dark select-none touch-manipulation">
      <body className="bg-[#050608] text-white antialiased overflow-x-hidden min-h-[100dvh] overscroll-none">
        {children}
      </body>
    </html>
  );
}
