import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ThumbnailAI – Générateur de miniatures YouTube avec Gemini",
  description:
    "Créez des miniatures YouTube professionnelles en quelques secondes grâce à l'IA Gemini.",
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
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
