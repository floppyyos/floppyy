import type { Metadata, Viewport } from "next";
import { Pixelify_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-pixelify",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.floppyy.com"),
  title: {
    default: "Floppyy - The web you grew up on",
    template: "%s | Floppyy",
  },
  description:
    "Floppyy is a retro computer in your browser. A playful browser desktop built on old desktop systems, pixel windows, floppy disks, BIOS boot screens, Winamp vibes, classic games, and the early web.",
  applicationName: "Floppyy",
  authors: [{ name: "Floppyy", url: "https://www.floppyy.com" }],
  creator: "Floppyy",
  publisher: "Floppyy",
  keywords: [
    "Floppyy",
    "Floppyy browser desktop",
    "Windows 98",
    "Windows 98 desktop",
    "floppy disk",
    "blue floppy",
    "retro desktop",
    "retro computer",
    "web desktop",
    "online desktop",
    "browser desktop",
    "early web",
    "BIOS boot screen",
    "Winamp player",
    "Doom browser",
    "Minesweeper online",
    "Solitaire online",
    "Paint online",
    "Norton Commander",
    "dial-up internet",
    "Netscape Navigator",
    "Internet Explorer",
    "pixel UI",
    "retro games",
    "nostalgic web app",
    "90s computer",
    "virtual desktop",
  ],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Floppyy - The web you grew up on",
    description:
      "Floppyy is a retro computer in your browser: pixel windows, floppy disks, BIOS boot screens, classic games, Winamp vibes, dial-up, and the early web.",
    url: "https://www.floppyy.com",
    siteName: "Floppyy",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1500,
        height: 844,
        alt: "Floppyy retro browser desktop with blue floppy, Windows 98 clouds, and pixel UI",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Floppyy - The web you grew up on",
    description:
      "Floppyy is a retro computer in your browser. Boot up, click around, remember everything — minus the dial-up wait. Mostly.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1500,
        height: 844,
        alt: "Floppyy retro computer in your browser",
      },
    ],
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
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#c0c0c0",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Floppyy",
  alternateName: "The web you grew up on.",
  url: "https://www.floppyy.com",
  description:
    "Floppyy is a retro computer in your browser. It brings back the feeling of old desktop systems, pixel windows, floppy disks, BIOS boot screens, Winamp vibes, classic games, dial-up, and the early web as a playful browser experience.",
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern web browser.",
  image: "https://www.floppyy.com/og-image.jpg",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Floppyy",
    url: "https://www.floppyy.com",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={pixelifySans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {umamiSrc && umamiWebsiteId && (
          <Script
            defer
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
