import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navigation, Footer } from "@/components/layout";
import { siteUrl } from "@/lib/games";
import "./globals.css";
const archivo = localFont({
  src: "../public/fonts/archivo-latin.woff2",
  variable: "--font-archivo",
  display: "swap",
});
const sans = localFont({
  src: "../public/fonts/plex-sans-latin.woff2",
  variable: "--font-plex-sans",
  display: "swap",
});
const mono = localFont({
  src: "../public/fonts/plex-mono-latin.woff2",
  variable: "--font-mono",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nayaro Games — Browser games by Nayaro Technology",
    template: "%s | Nayaro Games",
  },
  description:
    "Browser games by Nayaro Technology. Play MergeFinity, a number-merging puzzle with Classic, Daily Puzzle, Time Rush, and Limited Moves modes.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Nayaro Games",
    title: "Nayaro Games — Browser games by Nayaro Technology",
    description: "Play MergeFinity and browse games from Nayaro Technology.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Nayaro Games — Browser games by Nayaro Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nayaro Games",
    images: ["/opengraph-image"],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${sans.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
