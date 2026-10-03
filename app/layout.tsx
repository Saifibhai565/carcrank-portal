import type { Metadata } from "next";
import "./globals.css";

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
      style={
        {
          "--font-display": "sans-serif",
          "--font-body": "sans-serif",
        } as React.CSSProperties
      }
    >
      <body className="font-sans antialiased bg-white text-navy selection:bg-brand selection:text-white">
        {children}
      </body>
    </html>
  );
}