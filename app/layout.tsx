import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@mantine/core/styles.css';
import "./globals.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';

const blackScale: readonly [
  string, string, string, string, string,
  string, string, string, string, string
] = [
    '#ffffff', '#f2f2f2', '#e6e6e6', '#cccccc', '#999999',
    '#666666', '#333333', '#1f1f1f', '#0f0f0f', '#000000'
  ];




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smonadjemi.github.io"),
  title: "A Scoping Review of Mixed-Initiative Visual Analytics",
  description: "Explore the taxonomy and example papers from a scoping review of mixed-initiative visual analytics systems.",
  alternates: {
    canonical: "/miva",
  },
  openGraph: {
    title: "A Scoping Review of Mixed-Initiative Visual Analytics",
    description: "Explore the taxonomy and example papers from a scoping review of mixed-initiative visual analytics systems.",
    url: "/miva",
    siteName: "MI-VA Taxonomy Explorer",
    type: "website",
    images: [
      {
        url: "/miva/logo.png",
        width: 512,
        height: 512,
        alt: "MI-VA Taxonomy Explorer logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "A Scoping Review of Mixed-Initiative Visual Analytics",
    description: "Explore the taxonomy and example papers from a scoping review of mixed-initiative visual analytics systems.",
    images: ["/miva/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <ColorSchemeScript forceColorScheme="light" defaultColorScheme="light" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider
          forceColorScheme="light"
          defaultColorScheme="light"
          theme={{
            colors: { black: blackScale },
            primaryColor: 'black',
            primaryShade: 7
          }}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
