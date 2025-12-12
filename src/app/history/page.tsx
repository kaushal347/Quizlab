import HistoryComponent from "@/components/HistoryComponent";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";

const History = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <main className="min-h-screen bg-[#0a0a0a] w-full relative overflow-hidden flex flex-col items-center py-12">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <div className="z-10 w-full max-w-4xl px-4">
        <Card className="glass border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-4 md:p-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                History
              </CardTitle>
              <Link className={buttonVariants({ variant: "outline", className: "border-white/10 text-gray-300 hover:text-white hover:bg-white/10" })} href="/dashboard">
                <LucideLayoutDashboard className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
            <p className="text-gray-400">View your past quiz attempts and performance statistics.</p>
          </CardHeader>
          <CardContent className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <HistoryComponent limit={100} userId={session.user.id} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default History;
