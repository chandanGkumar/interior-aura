import type { Metadata } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const interSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const antonDisplay = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://interioraura.com";

export const metadata: Metadata = {
  // Required so openGraph.url and relative image paths resolve to absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Interior Aura | Interior Transformation in Ghaziabad",
    template: "%s | Interior Aura",
  },
  description:
    "Interior Aura is an artist-led design practice in Muradnagar, Ghaziabad. We bring construction, interiors, modular furnishing, elevation and Vastu into one considered process.",
  keywords: [
    "Interior Aura",
    "interior design Ghaziabad",
    "Vastu",
    "modular kitchens",
    "elevation design",
    "interior architecture India",
  ],
  authors: [{ name: "Interior Aura" }],
  icons: {
    icon: "/aura/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Interior Aura | Interior Transformation",
    description:
      "We turn blueprints into expressive spaces — designed for the way a new generation lives, gathers and grows.",
    url: "/",
    siteName: "Interior Aura",
    type: "website",
    locale: "en_IN",
    // Without an image, shares render as a blank card.
    images: [
      {
        url: "/aura/hero.jpg",
        width: 1920,
        height: 1080,
        alt: "Interior Aura - contemporary interior in warm wood and saffron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Aura | Interior Transformation",
    description:
      "A complete interior solution in Ghaziabad — construction, modular furnishing, Vastu, elevation.",
    images: ["/aura/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interSans.variable} ${antonDisplay.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        {/* sonner Toaster — toast() is imported from "sonner" across the app. */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                "bg-popover text-popover-foreground border border-border rounded-none",
              description: "text-muted-foreground",
            },
          }}
        />
      </body>
    </html>
  );
}
