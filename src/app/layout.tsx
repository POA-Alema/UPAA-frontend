import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uma Porto Alegre Alemã",
  description: "Frontend",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}