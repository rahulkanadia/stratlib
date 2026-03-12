import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StratLib | Trading Script Library",
  description: "A high-performance, searchable library for trading indicators and strategies.",
  openGraph: {
    title: "StratLib",
    description: "search, fetch, and contribute to a massive library of trading scripts",
    url: "https://stratlib.vercel.app",
    siteName: "StratLib",
    images: [
      {
        url: "https://stratlib.vercel.app/og-image.jpg", // We can add an actual image later
        width: 1200,
        height: 630,
        alt: "StratLib IDE Interface",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StratLib | Trading Script Library",
    description: "search, fetch, and contribute to a massive library of trading scripts",
  },
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