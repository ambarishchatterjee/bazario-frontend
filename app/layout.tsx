// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import ClientWrapper from "./client-wrapper";

export const metadata: Metadata = {
  title: "Multi-Vendor Store",
  description: "A modern multi-vendor e-commerce platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
