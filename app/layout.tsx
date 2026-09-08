import type { Metadata, Viewport } from "next";
import { dmSans, dmMono } from "./fonts";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#485CE0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: {
    default: "Giftaway | Spin & Win Vouchers",
    template: "%s | Giftaway",
  },
  description:
    "Spin the prize wheel to win exclusive vouchers, discounts, and rewards.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Giftaway | Spin & Win Vouchers",
    description:
      "Spin the prize wheel to win exclusive vouchers, discounts, and rewards.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Giftaway | Spin & Win Vouchers",
    description:
      "Spin the prize wheel to win exclusive vouchers, discounts, and rewards.",
    images: ["/og-image.png"],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full w-full flex-col bg-[#FDFDFD] font-sans text-slate-800">
        {children}
      </body>
    </html>
  );
}
