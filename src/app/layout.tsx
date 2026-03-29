import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "FCN Signal — Structured Products Intelligence",
  description:
    "Real-time intelligence on Fixed Coupon Notes, Autocallable products, and structured investment instruments across global markets.",
  keywords: [
    "FCN", "Fixed Coupon Note", "Autocallable", "Structured Products",
    "结构化产品", "固定票息票据", "信号场",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
