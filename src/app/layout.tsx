import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kembara: Kisah Dani & Jihan • Petualangan Naratif Dua Sahabat Lintas Selat",
  description: "Sebuah pengalaman game 2D Pixel Art petualangan naratif bergaya A Space for the Unbound, menceritakan persahabatan Dani (Malaysia) dan Jihan (Sulawesi) di pesisir hangat Pantai Losari.",
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
