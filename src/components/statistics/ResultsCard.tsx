"use client";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
type Props = { accuracy: number };

const ResultsCard = ({ accuracy }: Props) => {
  React.useEffect(() => {
    if (accuracy > 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ffff', '#8a2be2', '#ff00ff']
      });
    }
  }, [accuracy]);

  return (
    <Card className="md:col-span-7 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md shadow-xl text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold text-white">Results</CardTitle>
        <Award className="text-cyan-500" size={30} />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-3/5 space-y-4">
        {accuracy > 75 ? (
          <>
            <Trophy className="mr-4 text-yellow-400" stroke="currentColor" size={50} />
            <div className="flex flex-col items-center text-2xl font-semibold text-yellow-400">
              <span className="">Impressive!</span>
              <span className="text-sm text-center text-gray-400 mt-2">
                {"> 75% accuracy"}
              </span>
            </div>
          </>
        ) : accuracy > 25 ? (
          <>
            <Trophy className="mr-4 text-gray-400" stroke="currentColor" size={50} />
            <div className="flex flex-col items-center text-2xl font-semibold text-gray-400">
              <span className="">Good job!</span>
              <span className="text-sm text-center text-gray-500 mt-2">
                {"> 25% accuracy"}
              </span>
            </div>
          </>
        ) : (
          <>
            <Trophy className="mr-4 text-orange-800" stroke="currentColor" size={50} />
            <div className="flex flex-col items-center text-2xl font-semibold text-orange-600">
              <span className="">Nice try!</span>
              <span className="text-sm text-center text-gray-500 mt-2">
                {"< 25% accuracy"}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
