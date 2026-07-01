import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thrivers PK",
  description: "Premium clothing store in Chitral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {/* Yahan se pt-16 hata diya hai taake homepage par white gap na aaye */}
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}