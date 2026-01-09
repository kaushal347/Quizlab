import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Loading from "./loading";
import { SplashScreen } from "@/components/ui/SplashScreen";
import PageTransition from "@/components/ui/PageTransition";

// Lazy load heavy components
const Navbar = dynamic(() => import("@/components/ui/Navbar"));

const AuroraBackground = dynamic(
  () => import("@/components/ui/AuroraBackground").then((mod) => mod.AuroraBackground)
);

const NoiseTexture = dynamic(() => import("@/components/ui/NoiseTexture"));

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
        <SplashScreen />
        <Providers>
          <NextTopLoader color="#00ffff" showSpinner={false} />
          <Suspense fallback={<Loading />}>
            <AuroraBackground>
              <Navbar />
              <NoiseTexture />
              <main className="flex-1 w-full flex flex-col">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <Toaster />
              {/* Footer - moved inside AuroraBackground for color matching */}
              <footer id="global-footer" className="w-full text-center text-sm text-muted-foreground py-4 mt-auto">
                © 2025 QuizLab. All rights reserved.<br />
                Developed by Parth Patel, Suhani Desai, Shivani Shinde, Kaushal Dabhi.
              </footer>
            </AuroraBackground>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}


