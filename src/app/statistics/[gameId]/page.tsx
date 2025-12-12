import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import ResultsCard from "@/components/statistics/ResultsCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeTakenCard from "@/components/statistics/TimeTakenCard";
import QuestionsList from "@/components/statistics/QuestionsList";

type Props = {
  params: Promise<{
    gameId: string;
  }>;
};

const Statistics = async ({ params }: Props) => {
  const { gameId } = await params;
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });

  if (!game) {
    return redirect("/");
  }

  let accuracy: number = 0;

  if (game.gameType === "mcq") {
    const totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);

    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === "open_ended") {
    const totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);

    accuracy = totalPercentage / game.questions.length;
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <main className="min-h-screen bg-[#0a0a0a] w-full relative overflow-hidden flex flex-col items-center py-12">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      <div className="z-10 w-full max-w-7xl px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Analysis & Insights
            </h2>
            <p className="text-gray-400 mt-2">Detailed breakdown of your performance.</p>
          </div>

          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all" })}>
              <LucideLayoutDashboard className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 mt-4 md:grid-cols-7">
          <ResultsCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimeTakenCard
            timeStarted={game.timeStarted}
            timeEnded={game.timeEnded ?? null}
          />
        </div>

        <div className="mt-8">
          <QuestionsList questions={game.questions} />
        </div>
      </div>
    </main>
  );
};

export default Statistics;
