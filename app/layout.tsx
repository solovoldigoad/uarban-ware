import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/componets/layout/Navbar";
import Footer from "@/app/componets/layout/Footer";
import CartDrawer from "@/app/componets/sliders/CartDrawer"; 
import AuthProvider from "@/app/componets/providers/AuthProvider";
import { BRAND_NAME } from "@/lib/brand";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: BRAND_NAME,
  description: "Premium Fashion Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body
        className='min-h-screen flex flex-col font-sans'>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
            <CartDrawer />
          </AuthProvider>
      </body>
    </html>
  );
}
