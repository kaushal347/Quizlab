import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Providers from "@/components/providers";
import { Toaster } from "sonner";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import NoiseTexture from "@/components/ui/NoiseTexture";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "QuizLab | AI Powered Assessments",
  description: "Advanced neural-network based quiz generation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen pt-16 bg-background text-foreground`}
      >
        <Providers>
          <NextTopLoader color="#00ffff" showSpinner={false} />
          <AuroraBackground>
            <Navbar />
            <NoiseTexture />
            {children}
            <Toaster />
          </AuroraBackground>
        </Providers>
      </body>
    </html>
  );
}
