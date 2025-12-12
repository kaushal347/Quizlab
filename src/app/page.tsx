import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import SignInButton from "@/components/ui/signinButton";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from 'next/navigation';
// import Brain3D from "@/components/Brain3D"; // Remove static import
import Brain3DWrapper from "@/components/Brain3DWrapper";
import { SplashScreen } from "@/components/ui/SplashScreen";

export const metadata = {
  title: "Login | QuizLab",
};

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    return redirect("/dashboard");
  }

  return (
    // Use fixed z-50 to cover the navbar on the login page
    <main className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background/50 backdrop-blur-sm">
      <SplashScreen />

      {/* Background 3D Element */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Brain3DWrapper />
      </div>

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-md p-4">
        <Card className="w-full bento-card border-none bg-black/30 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(138,43,226,0.5)]">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-tighter drop-shadow-md">
              QuizLab
            </CardTitle>
            <CardDescription className="text-gray-300 text-lg tracking-wide font-light">
              AI-Powered Knowledge & Assessment
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-sm text-center text-gray-400 mb-4">
              Enter the neural network. Upgrade your learning.
            </div>

            <div className="flex justify-center w-full">
              <SignInButton text="Initialize Session with Google" />
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 opacity-70 text-xs text-cyan-400 font-mono">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>SYSTEM: ONLINE AND READY</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decorative Corner Text */}
      <div className="absolute bottom-4 left-4 text-xs font-mono text-gray-500 z-10">
        VERSION 2.0.4 [AURORA]
      </div>
    </main>
  );
}
