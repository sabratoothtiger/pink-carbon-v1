import { PrimeReactProvider } from "primereact/api";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-dark-pink/theme.css";

const inter = Inter({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Expose publicly for use in api routes
process.env.NEXT_PUBLIC_BASE_URL = defaultUrl;

// TODO: Add social and images to metadata
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Pink Carbon - Tax Processing Management",
    template: "%s | Pink Carbon"
  },
  description: "Professional tax processing management solutions for modern businesses.",
  keywords: ["tax processing", "business software", "custom development", "consulting", "automation", "workflow optimization"],
  authors: [{ name: "Pink Carbon Team" }],
  creator: "Pink Carbon",
  publisher: "Pink Carbon",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    title: "Pink Carbon - Tax Processing Management",
    description: "Professional tax processing management solutions for modern businesses.",
    siteName: "Pink Carbon",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "Pink Carbon - Tax Processing Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pink Carbon - Tax Processing Management",
    description: "Professional tax processing management solutions for modern businesses.",
    images: ["/og-image.png"],
    creator: "@pinkcarbon", // Replace with actual Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "your-google-verification-code", // Add when you set up Google Search Console
    // bing: "your-bing-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          {children}
        </PrimeReactProvider>
      </body>
    </html>
  );
}
