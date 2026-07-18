import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PIZZALAB",
  description: "PIZZALAB",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "PIZZALAB",
    description: "PIZZALAB",
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
      <Navbar />
      
      <body className="flex min-h-full flex-col">{children}</body>

      <Footer />
    </html>
  );
}
