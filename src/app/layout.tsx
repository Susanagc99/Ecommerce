import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Techland - Your Tech Gadgets Store",
  description: "Discover the latest tech gadgets and accessories at Techland. From gaming gear to smart devices, we have everything you need.",
  keywords: ["tech", "gadgets", "electronics", "gaming", "smart devices", "ecommerce"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, width: '100%' }}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
