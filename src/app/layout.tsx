import type { Metadata } from "next";
import { Inter, Anton, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: "Interior Aura | Interior Transformation in Ghaziabad",
  description:
    "Interior Aura is an artist-led design practice in Muradnagar, Ghaziabad. We bring construction, interiors, furnishing, elevation and Vastu into one considered process. Member access unlocks the full mood board library, material studies and project briefs.",
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
  openGraph: {
    title: "Interior Aura | Interior Transformation",
    description:
      "We turn blueprints into expressive spaces — designed for the way a new generation lives, gathers and grows.",
    url: "/",
    siteName: "Interior Aura",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interior Aura | Interior Transformation",
    description:
      "A complete interior solution in Ghaziabad — construction, modular furnishing, Vastu, elevation.",
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
        <Toaster />
      </body>
    </html>
  );
}
