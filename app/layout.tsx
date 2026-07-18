import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PIZZALAB",
  description: "PIZZALAB 是一款模擬飛盤玩法、以擲披薩紓壓的 VR 運動體驗",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "PIZZALAB",
    description: "PIZZALAB 是一款模擬飛盤玩法、以擲披薩紓壓的 VR 運動體驗",
    // url: "https://pizzalab.tw",
    siteName: "PIZZALAB",
    images: [
      {
        url: "/images/bg.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "zh_TW",
    type: "website",
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
