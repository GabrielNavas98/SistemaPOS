import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./authProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Punto de venta",
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
