import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./authProvider";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "POS system",
  description: "Sistema básico de facturación para negociantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
