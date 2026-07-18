import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://debasisnath.com"),
  title: "Debasis Nath — Product Systems & AI-Enabled Workflows",
  description:
    "Senior software engineer building product platforms and AI-enabled workflows across Go, React, TypeScript, Agentic AI, and MCP.",
  keywords: [
    "Debasis Nath",
    "Senior Software Engineer",
    "Go",
    "React",
    "TypeScript",
    "Agentic AI",
    "MCP",
    "Frontend Platform Engineering",
  ],
  authors: [{ name: "Debasis Nath" }],
  openGraph: {
    type: "website",
    title: "Debasis Nath — Product Systems & AI-Enabled Workflows",
    description:
      "Senior software engineer with frontend-platform depth, building across Go, React, TypeScript, and agentic AI.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Debasis Nath — Product systems and AI-enabled workflows",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debasis Nath — Product Systems & AI-Enabled Workflows",
    description:
      "Senior software engineer with frontend-platform depth, building across Go, React, TypeScript, and agentic AI.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
