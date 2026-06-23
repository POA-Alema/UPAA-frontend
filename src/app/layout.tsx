/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Manrope, Work_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { I18nProvider } from "@/components/I18nProvider";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const headlineFont = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["500", "600", "700", "800"],
});

const bodyFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Uma Porto Alegre Alemã",
  description:
    "Projeto inicial do frontend dedicado a narrativas, arquiteturas e memórias urbanas de Porto Alegre.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      className={`${headlineFont.variable} ${bodyFont.variable}`}
      lang="pt-BR"
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ScrollRestoration />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
