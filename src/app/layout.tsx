import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reviome.in"),
  title: {
    default: "Reviome — Google Business & Review Growth Platform for Local Businesses",
    template: "%s | Reviome",
  },
  description:
    "Reviome helps local businesses manage customer reviews, connect their Google Business Profile, track customer interactions, and grow their online presence.",
  keywords: [
    "Google Business Profile management",
    "local business reviews",
    "Google reviews",
    "NFC review cards",
    "QR code review links",
    "customer feedback platform",
    "local business marketing",
    "reputation management",
  ],
  authors: [{ name: "Reviome" }],
  creator: "Reviome",
  publisher: "Reviome",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Reviome — Google Business & Review Growth Platform for Local Businesses",
    description:
      "Reviome helps local businesses manage customer reviews, connect their Google Business Profile, track customer interactions, and grow their online presence.",
    url: "https://reviome.in",
    siteName: "Reviome",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviome — Google Business & Review Growth Platform for Local Businesses",
    description:
      "Reviome helps local businesses manage customer reviews, connect their Google Business Profile, track customer interactions, and grow their online presence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafaf8] text-neutral-950 selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
