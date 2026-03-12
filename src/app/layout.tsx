import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StratLib | Trading Script Library",
  description: "searchable (soon, streamable) library for indicators, strategies, and snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}