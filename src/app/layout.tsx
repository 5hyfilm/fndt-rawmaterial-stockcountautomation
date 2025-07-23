// Path: src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "F&N Barcode Scanner",
  description: "ระบบตรวจจับและอ่าน barcode แบบ real-time",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "F&N Barcode Scanner",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#1f2937", // ✅ เปลี่ยนให้ตรงกับ manifest
  },
  // ✅ เพิ่ม manifest link
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        {/* ✅ เพิ่ม PWA links */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="apple-touch-icon" href="/fn-barcode-scanner-180.png" /> */}
        {/* <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/fn-barcode-scanner-180.png"
        /> */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/fn-barcode-scanner-192.png"
        />
        {/* <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/fn-barcode-scanner-512.png"
        /> */}

        {/* Additional meta tags for better mobile experience */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="F&N Scanner" />
      </head>
      <body>{children}</body>
    </html>
  );
}
