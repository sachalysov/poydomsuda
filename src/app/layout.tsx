import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Пойдём Сюда — куда сходить в Санкт-Петербурге",
    template: "%s | Пойдём Сюда",
  },
  description:
    "Сервис для поиска идей досуга в Санкт-Петербурге. Спросите AI-помощника куда сходить, что посетить и как интересно провести время в городе.",
  alternates: { canonical: "https://poydomsuda.ru" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0D0608] text-[#C8828A] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
