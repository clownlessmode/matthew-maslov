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
  title: {
    default: "MATTHEW MASLOV",
    template: "%s | MATTHEW MASLOV",
  },
  metadataBase: new URL("https://matthewmaslov.com"),
  description: "MATTHEW MASLOV — РОССИЙСКИЙ ПРЕМИАЛЬНЫЙ БРЕНД ОДЕЖДЫ 🧈",
  keywords: [
    "matthewmaslov",
    "matthew maslov",
    "matthew maslov portfolio",
    "matthew maslov website",
    "matthew maslov blog",
    "matthew maslov portfolio website",
    "matthew maslov portfolio website 2024",
    "matthew maslov portfolio website 2024",
  ],
  authors: [
    {
      name: "ML AGENCY",
      url: "https://t.me/ml_agency_com",
    },
    {
      name: "Matthew Maslov",
      url: "https://t.me/matthewmaslov",
    },
  ],
  creator: "ML AGENCY",
  openGraph: {
    title: "MATTHEW MASLOV",
    description: "Мы делаем историю, всё только начинается 🧈",
    url: "https://matthewmaslov.com",
    siteName: "MATTHEW MASLOV",
    locale: "ru",
    type: "website",
    images: [
      {
        url: "/seo/opengraph.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  manifest: "/seo/manifest.json",
  icons: {
    // Иконка для браузера
    icon: [{ rel: "icon", url: "/seo/favicon.ico" }],
    // Иконки для iOS
    apple: [
      { url: "/seo/apple-icon.png" },
      {
        url: "/seo/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    // Иконки для Android
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/seo/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/seo/android-chrome-512x512.png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MATTHEW MASLOV",
  },
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
