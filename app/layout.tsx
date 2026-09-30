import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verify your trading activity | YouLend",
  description: "Secure verification with Open Banking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable}`}
      style={
        {
          "--font-display": "var(--font-inter)",
          "--font-body": "var(--font-inter)",
        } as React.CSSProperties
      }
    >
      <body className={`${inter.className} antialiased bg-white text-navy selection:bg-brand selection:text-white`}>
        {children}
      </body>
    </html>
  );
}