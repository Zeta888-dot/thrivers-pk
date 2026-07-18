import type { Metadata, Viewport } from "next";
// import { Inter, Archivo_Black } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Script from "next/script";
import { Inter, Archivo_Black, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({ subsets: ["latin"] });

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: {
    default: "Thrivers PK | Premium Streetwear from Chitral",
    template: "%s | Thrivers PK",
  },
  description:
    "Thrivers PK - Pakistan's premium streetwear brand from Chitral. Shop oversized tees, hoodies, trousers, and street fashion. Quality meets culture. Free delivery across Pakistan.",
  keywords: [
    "Thrivers PK",
    "Thrivers Pakistan",
    "streetwear Pakistan",
    "premium clothing Chitral",
    "oversized tees Pakistan",
    "hoodies Pakistan",
    "trousers Pakistan",
    "street fashion Pakistan",
    "Chitral clothing brand",
    "Pakistani streetwear brand",
    "men's fashion Pakistan",
    "urban wear Pakistan",
  ],
  authors: [{ name: "Thrivers PK", url: "https://thrivers.pk" }],
  creator: "Thrivers PK",
  publisher: "Thrivers PK",
  metadataBase: new URL("https://thrivers.pk"),
  alternates: {
    canonical: "https://thrivers.pk",
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
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://thrivers.pk",
    siteName: "Thrivers PK",
    title: "Thrivers PK | Premium Streetwear from Chitral",
    description:
      "Pakistan's premium streetwear brand from Chitral. Shop oversized tees, hoodies, trousers. Quality meets culture.",
    images: [
      {
        url: "https://thrivers.pk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Thrivers PK - Premium Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thrivers PK | Premium Streetwear from Chitral",
    description:
      "Pakistan's premium streetwear brand. Shop oversized tees, hoodies, trousers. Quality meets culture.",
    images: ["https://thrivers.pk/og-image.jpg"],
    creator: "@thriverspk",
  },
  category: "Fashion & Clothing",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  themeColor: "#950606",
  applicationName: "Thrivers PK",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#950606",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Thrivers PK",
  url: "https://thrivers.pk",
  logo: "https://thrivers.pk/icon.svg",
  description:
    "Premium streetwear brand from Chitral, Pakistan. Quality meets culture.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hayat Market, New Bazar",
    addressLocality: "Chitral",
    addressCountry: "PK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+92-343-9766306",
    contactType: "customer service",
    email: "sheikhinsaan07@gmail.com",
  },
  sameAs: [
    "https://www.instagram.com/thrivers.pk",
    "https://www.tiktok.com/@thrivers.pk",
  ],
  priceRange: "PKR 1000 - PKR 5000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
     className={`${inter.className} ${archivoBlack.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}