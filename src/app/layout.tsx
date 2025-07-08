import type { Metadata } from "next";
import localFont from "next/font/local";
import "@app/_styles/globals.css";
import { Header } from "@widgets/header";
import { Footer } from "@widgets/footer";

const vkSansDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/VKSansDisplay-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/VKSansDisplay-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/VKSansDisplay-DemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/VKSansDisplay-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vk-sans",
  display: "swap",
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
      <body className={`${vkSansDisplay.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
