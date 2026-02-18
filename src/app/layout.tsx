import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ThumbnailAI – Générateur de miniatures YouTube avec Gemini",
  description:
    "Créez des miniatures YouTube professionnelles et percutantes en quelques secondes grâce à l'IA Gemini. Design Midjourney-style, génération par lot, téléchargement instantané.",
  keywords: ["YouTube", "miniature", "thumbnail", "IA", "Gemini", "générateur"],
  openGraph: {
    title: "ThumbnailAI – Générateur de miniatures YouTube",
    description: "Créez des miniatures YouTube avec l'IA Gemini",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-zinc-950`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#fafafa",
            },
          }}
        />
      </body>
    </html>
  );
}
