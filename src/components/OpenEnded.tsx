"use client";

import { cn, formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { BarChart, Timer } from "lucide-react";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { buttonVariants } from "@/components/ui/button";
import OpenEndedPercentage from "@/components/OpenEndedPercentage";
import BlankAnswerInput from "@/components/BlankAnswerInput";
import { QuizCompleted3D } from "./QuizCompleted3D";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import keyword_extractor from "keyword-extractor";
import { z } from "zod";
import { checkAnswerSchema, endGameSchema } from "@/schemas/forms/questions";
import { useMutation } from "@tanstack/react-query";
import { useQuizSecurity } from "@/hooks/useQuizSecurity";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

type Props = {
  game: Game & {
    timeLimit: number;
    questions: Pick<Question, "id" | "question" | "answer">[]
  };
};

const OpenEnded = ({ game }: Props) => {
  const [hasEnded, setHasEnded] = React.useState(false);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [averagePercentage, setAveragePercentage] = React.useState(0);
  const [now, setNow] = React.useState(new Date());
  const startTime = React.useMemo(() => new Date(game.timeStarted), [game.timeStarted]);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(
    game.timeLimit > 0 ? game.timeLimit * 60 : null
  );
  const router = useRouter();

  const [cheatCount, setCheatCount] = React.useState(0);

  useQuizSecurity(() => {
    setCheatCount((prev) => prev + 1);
  });

  React.useEffect(() => {
    if (cheatCount > 0 && cheatCount < 3) {
      toast.warning(
        `Warning ${cheatCount}/3: Please do not switch tabs or copy content.`
      );
    } else if (cheatCount >= 3) {
      if (!hasEnded) {
        toast.error("Too many violations. Quiz submitted.");
        saveEndTime();
        setHasEnded(true);
      }
    }
  }, [cheatCount, hasEnded]);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const keywords = React.useMemo(() => {
    if (!currentQuestion) return [];
    const words = keyword_extractor.extract(currentQuestion.answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    return words.sort(() => 0.5 - Math.random()).slice(0, 2);
  }, [currentQuestion]);

  const answerWithBlanks = React.useMemo(() => {
    if (!currentQuestion) return "";
    let answer = currentQuestion.answer;
    keywords.forEach((keyword) => {
      answer = answer.replace(keyword, "_____");
    });
    return answer;
  }, [currentQuestion, keywords]);

  const { mutate: checkAnswer, isPending } = useMutation({
    mutationFn: async (userInput: string) => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput,
      };
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
  });

  const saveEndTime = async () => {
    try {
      const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
      await axios.post("/api/endGame", payload);
    } catch { }
  };

  React.useEffect(() => {
    if (hasEnded) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#a855f7", "#22c55e"],
      });
      return;
    };
    const interval = setInterval(() => {
      setNow(new Date());
      if (timeLeft !== null && timeLeft > 0) {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded, timeLeft]);

  // AUTO SUBMIT ON TIME UP
  React.useEffect(() => {
    if (timeLeft === 0 && !hasEnded) {
      toast.error("Time is up! Submitting quiz...");
      saveEndTime();
      setHasEnded(true);
    }
  }, [timeLeft, hasEnded]);

  const handleNext = React.useCallback(
    (accuracy: number) => {
      setAveragePercentage((prev) => {
        return (prev * questionIndex + accuracy) / (questionIndex + 1);
      });

      if (questionIndex === game.questions.length - 1) {
        saveEndTime();
        setHasEnded(true);
        return;
      }
      setQuestionIndex((prev) => prev + 1);
    },
    [questionIndex, game.questions.length]
  );

  if (hasEnded) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md overflow-hidden">
        <div className="absolute inset-0 z-0">
          <QuizCompleted3D />
        </div>

        <div className="z-10 w-full max-w-md animate-in zoom-in-95 duration-500">
          <Card className="glass border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-green-500/10 text-green-400">
              <Timer className="w-12 h-12" />
            </div>

            <h2 className="text-4xl font-extrabold text-gradient mb-2">Quiz Completed!</h2>
            <div className="space-y-1 mb-6">
              <p className="text-gray-400">
                Average Accuracy: <span className="text-green-400 font-bold">{averagePercentage.toFixed(2)}%</span>
              </p>
              <p className="text-gray-400">
                Time Taken: <span className="text-white font-bold">
                  {formatTimeDelta(Math.max(0, differenceInSeconds(now, startTime)))}
                </span>
              </p>
            </div>

            <Link
              href={`/statistics/${game.id}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover-glow")}
            >
              View Statistics
              <BarChart className="w-4 h-4 ml-2" />
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="select-none flex flex-col items-center min-h-screen px-4 pt-24">
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col gap-2 self-start">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Topic</span>
            <span className="px-3 py-1 text-sm text-cyan-400 rounded-full bg-cyan-500/5 border border-cyan-500/20">
              {game.topic}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg hover-glow self-start">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              <Timer size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                {timeLeft !== null ? "Remaining" : "Time"}
              </span>
              <span className={cn(
                "text-cyan-100 font-mono text-sm leading-none pt-0.5",
                timeLeft !== null && timeLeft < 30 && "text-red-500 animate-pulse"
              )}>
                {timeLeft !== null
                  ? formatTimeDelta(timeLeft)
                  : formatTimeDelta(Math.max(0, differenceInSeconds(now, startTime)))
                }
              </span>
            </div>
          </div>
        </div>

        <div className="hover-glow p-2 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5">
          <OpenEndedPercentage percentage={parseFloat(averagePercentage.toFixed(2))} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-4xl will-change-transform transform-gpu"
        >
          <Card className="w-full mt-4 glass border-white/10 shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center p-8">
              <CardTitle className="mr-5 text-center bg-white/5 p-4 rounded-xl min-w-[80px]">
                <div className="text-2xl font-bold text-white/90">{questionIndex + 1}</div>
                <div className="text-base text-slate-400 border-t border-white/10 mt-1 pt-1">
                  {game.questions.length}
                </div>
              </CardTitle>

              <CardDescription className="flex-grow text-xl font-medium text-white/90 leading-relaxed">
                {currentQuestion.question}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center w-full mt-10 max-w-4xl">
        <BlankAnswerInput
          answerWithBlanks={answerWithBlanks}
          checkAnswer={checkAnswer}
          isPending={isPending}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default OpenEnded;
