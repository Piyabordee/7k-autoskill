import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "7K Skill Planner - Auto Detection",
  description: "เครื่องมือวางแผนสกิลสำหรับเกม Seven Knights พร้อมระบบตรวจจับอัตโนมัติ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "7K Skill Planner",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
      </head>
      <body className="min-h-screen text-white gradient-bg">
        {children}
      </body>
    </html>
  );
}