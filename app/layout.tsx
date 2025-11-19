import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@mantine/core/styles.css';
import "./globals.css";

import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { Navbar } from "@/components/Navbar/Navbar";

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
  title: "Mixed Initiative Visual Analytics",
  description: "A scoping review of mixed-initiative visual analytics systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <link
          rel="icon"
          href="/logo.svg?svg"
          type="image/svg+xml"
          sizes="160x160"
        />
        <ColorSchemeScript forceColorScheme="light" defaultColorScheme="light" />
      </head>
      <body>
        <MantineProvider
          forceColorScheme="light"
          defaultColorScheme="light"
          theme={{
            colors: { black: blackScale },
            primaryColor: 'black',
            primaryShade: 7
          }}
        >
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
