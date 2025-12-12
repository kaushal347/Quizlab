import { prisma } from "@/lib/db";
import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import MCQCounter from "./MCQCounter";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComponent = async ({ limit, userId }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: "desc",
    },
  });
  return (
    <div className="space-y-4">
      {games.map((game) => {
        return (
          <div className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200" key={game.id}>
            <div className="flex items-center gap-4 w-full">
              {game.gameType === "mcq" ? (
                <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400">
                  <CopyCheck className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
                  <Edit2 className="w-5 h-5" />
                </div>
              )}

              <div className="flex flex-col gap-1 flex-grow">
                <Link
                  className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                    <Clock className="w-3 h-3" />
                    {new Date(game.timeEnded ?? game.timeStarted).toLocaleDateString()}
                  </span>
                  <span className="uppercase tracking-wider opacity-70">
                    {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                  </span>
                </div>
              </div>

              <Link href={`/statistics/${game.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-2 rounded-full text-white hover:bg-white/20">
                {/* Chevron or specialized icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
              </Link>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryComponent;
