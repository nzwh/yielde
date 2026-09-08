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
  metadataBase: new URL("https://yielde.vercel.app"),

  title: {
    default: "Yielde • Spin & Win Vouchers",
    template: "%s • Yielde",
  },
  description:
    "Spin the prize wheel to win exclusive vouchers, discounts, and rewards.",
  appleWebApp: {
    title: "Yielde",
    capable: true,
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Yielde • Spin & Win Vouchers",
    description:
      "Spin the prize wheel to win exclusive vouchers, discounts, and rewards.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yielde • Spin & Win Vouchers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yielde • Spin & Win Vouchers",
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
