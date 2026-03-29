import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FCN 信号场 · 全球FCN资讯实时捕获",
  description:
    "聚合微信公众号、小红书、知乎、微博、Twitter/X、YouTube、雪球、Bloomberg等多平台FCN固定票息票据热门内容，实时追踪结构化产品市场动态。",
  keywords: [
    "FCN",
    "固定票息票据",
    "结构化产品",
    "敲入",
    "敲出",
    "私人银行",
    "投资",
    "信号场",
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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
