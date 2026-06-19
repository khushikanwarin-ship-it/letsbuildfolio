import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LetsBuildFolio - Build the Future",
  description: "A discovery and portfolio platform for students aged 14-22.",
  verification: {
    google: "MlPJNSM-FJRvWjFJwUxsxhic9t10ofFPfGFiKLTYlos",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Space+Grotesk:wght@500;600;700&family=Be+Vietnam+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
