import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@app/_styles/globals.css";
import { Header } from "@widgets/header";
import { Footer } from "@widgets/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matthew Maslov - Модная одежда",
  description: "Стильная одежда от дизайнера Matthew Maslov.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
