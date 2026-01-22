"use client";

import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { ChevronRight, Loader2, Timer, RotateCcw, HelpCircle } from "lucide-react";
import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import { Progress } from "./ui/progress";
import MCQCounter from "./MCQCounter";
import { QuizCompleted3D } from "./QuizCompleted3D";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { checkAnswerSchema, endGameSchema } from "@/schemas/forms/questions";
import { z } from "zod";
import { toast } from "sonner";
import { cn, formatTimeDelta } from "@/lib/utils";
import { useQuizSecurity } from "@/hooks/useQuizSecurity";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";


type Props = {
  game: Game & {
    timeLimit: number;
    questions: Pick<Question, "id" | "question" | "options" | "answer">[];
  };
};

// ---------------- OPTION COMPONENT ----------------
const MCQOption = React.memo(({
  index,
  option,
  isSelected,
  isCorrectOption,
  isWrongSelected,
  submitted,
  onClick
}: {
  index: number;
  option: string;
  isSelected: boolean;
  isCorrectOption: boolean | null;
  isWrongSelected: boolean | null;
  submitted: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      disabled={submitted}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left",
        isCorrectOption
          ? "bg-green-950/50 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          : isWrongSelected
            ? "bg-red-950/50 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
            : isSelected
              ? "bg-cyan-950/50 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              : "glass border-white/10 hover:bg-white/5"
      )}
    >
      <motion.div
        layout
        className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white/5"
      >
        {index + 1}
      </motion.div>
      <span className="font-medium">{option}</span>
    </motion.button>
  );
});
MCQOption.displayName = "MCQOption";

// ---------------- MAIN COMPONENT ----------------
const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correct_Answers, setCorrectAnswer] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasEnded, setHasEnded] = useState(false);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(game.usedFiftyFifty);
  const [usedFlip, setUsedFlip] = useState(game.usedFlip);
  const [isFiftyFiftyLoading, setIsFiftyFiftyLoading] = useState(false);
  const [isFlipLoading, setIsFlipLoading] = useState(false);
  const router = useRouter();

  // 🔐 SECURITY STATE
  const [cheatCount, setCheatCount] = useState(0);

  // 🔐 SECURITY LOGIC (PROGRESSIVE)
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

  const [displayedOptions, setDisplayedOptions] = useState<string[]>([]);
  const startTime = new Date(game.timeStarted);
  const [now, setNow] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<number | null>(
    game.timeLimit > 0 ? game.timeLimit * 60 : null
  );

  // TIMER
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

  const currentQuestion = game.questions[questionIndex];

  const options = React.useMemo(() => {
    if (!currentQuestion?.options) return [];
    return JSON.parse(currentQuestion.options as string);
  }, [currentQuestion]);

  React.useEffect(() => {
    setDisplayedOptions(options);
  }, [options]);

  const { mutate: checkAnswer, isPending } = useMutation({
    mutationFn: async () => {
      if (selectedChoice === null) throw new Error("No option selected");
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: displayedOptions[selectedChoice],
      };
      const res = await axios.post("/api/checkAnswer", payload);
      return res.data as { isCorrect: boolean };
    },
  });

  const saveEndTime = async () => {
    try {
      const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
      await axios.post("/api/endGame", payload);
    } catch { }
  };

  const handleSubmit = () => {
    if (selectedChoice === null) return;
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        setSubmitted(true);
        setIsCorrect(isCorrect);
        isCorrect
          ? setCorrectAnswer((p) => p + 1)
          : setWrongAnswer((p) => p + 1);
      },
    });
  };

  const handleNext = async () => {
    if (!submitted) return;
    if (questionIndex === game.questions.length - 1) {
      await saveEndTime();
      setHasEnded(true);
      return;
    }
    setQuestionIndex((p) => p + 1);
    setSelectedChoice(null);
    setSubmitted(false);
    setIsCorrect(null);
  };

  const handleFiftyFifty = async () => {
    if (usedFiftyFifty || submitted) return;
    setIsFiftyFiftyLoading(true);
    try {
      await axios.post("/api/lifeline", {
        gameId: game.id,
        type: "fifty_fifty"
      });

      const correctOption = options.find((opt: string) => opt === currentQuestion.answer);
      const wrongOptions = options.filter((opt: string) => opt !== currentQuestion.answer);

      // Randomly pick 1 wrong option to keep (to have 2 options total: 1 correct, 1 wrong)
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      const newUserOptions = [correctOption, randomWrong].sort(() => Math.random() - 0.5);

      setDisplayedOptions(newUserOptions);
      setUsedFiftyFifty(true);
      toast.success("50/50 Used!");
    } catch (error) {
      toast.error("Could not use 50/50");
    } finally {
      setIsFiftyFiftyLoading(false);
    }
  };

  const handleFlip = async () => {
    if (usedFlip || submitted) return;
    setIsFlipLoading(true);
    try {
      const { data } = await axios.post("/api/lifeline", {
        gameId: game.id,
        type: "flip",
        topic: game.topic
      });

      if (data.question) {
        // Replace current question in the local questions array or just update UI state
        // For simplicity, we just update the current question's display
        currentQuestion.question = data.question.question;
        currentQuestion.options = data.question.options;
        currentQuestion.answer = data.question.answer;

        const newOptions = JSON.parse(data.question.options);
        setDisplayedOptions(newOptions);
        setUsedFlip(true);
        setSelectedChoice(null);
        toast.success("Question Flipped!");
      }
    } catch (error) {
      toast.error("Could not flip question");
    } finally {
      setIsFlipLoading(false);
    }
  };

  // ---------------- END SCREEN ----------------
  if (hasEnded) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
        <div className="absolute inset-0 z-0">
          <QuizCompleted3D />
        </div>
        <div className="z-10 text-center animate-in zoom-in-95 duration-500">
          <Card className="glass border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-8 flex flex-col items-center">
            <h2 className="text-4xl font-extrabold text-gradient mb-2">Quiz Completed!</h2>
            <div className="space-y-1 mb-6">
              <p className="text-gray-400">
                Your Score: <span className="text-green-400 font-bold">{correct_Answers}</span> / {game.questions.length}
              </p>
              <p className="text-gray-400">
                Time Taken: <span className="text-white font-bold">
                  {formatTimeDelta(
                    differenceInSeconds(now, startTime)
                  )}
                </span>
              </p>
            </div>
            <Link
              href={`/statistics/${game.id}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 hover-glow")}
            >
              View Statistics
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // ---------------- QUIZ UI ----------------
  return (
    <div className="select-none flex flex-col items-center min-h-screen px-4 pt-24">
      {/* HEADER SECTION */}
      <div className="w-full max-w-3xl flex flex-row justify-between items-center mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg hover-glow">
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

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            disabled={usedFiftyFifty || submitted || isFiftyFiftyLoading}
            onClick={handleFiftyFifty}
            className={cn(
              "bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 hover:border-cyan-400 transition-all shadow-[0_0_15px_-5px_rgba(6,182,212,0.4)]",
              usedFiftyFifty && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            {isFiftyFiftyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4 mr-2" />}
            50/50
          </Button>
          <Button
            size="sm"
            disabled={usedFlip || submitted || isFlipLoading}
            onClick={handleFlip}
            className={cn(
              "bg-purple-600/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30 hover:border-purple-400 transition-all shadow-[0_0_15px_-5px_rgba(168,85,247,0.4)]",
              usedFlip && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            {isFlipLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
            Flip
          </Button>
          <div className="hover-glow">
            <MCQCounter
              correct_answers={correct_Answers}
              wrong_answers={wrongAnswer}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-3xl will-change-transform transform-gpu"
        >
          <Card className="w-full mt-6 shadow-xl border-white/10 glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-md bg-white/10 text-sm">
                  Q{questionIndex + 1} / {game.questions.length}
                </span>
              </CardTitle>
              <CardDescription className="text-xl text-white/90">
                {currentQuestion.question}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="mt-4 space-y-3">
            {displayedOptions.map((opt, i) => (
              <MCQOption
                key={i}
                index={i}
                option={opt}
                isSelected={selectedChoice === i}
                isCorrectOption={submitted && isCorrect && selectedChoice === i}
                isWrongSelected={submitted && !isCorrect && selectedChoice === i}
                submitted={submitted}
                onClick={() => !submitted && setSelectedChoice(i)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {!submitted ? (
        <Button
          disabled={selectedChoice === null || isPending}
          onClick={handleSubmit}
          className="mt-6"
        >
          {isPending && <Loader2 className="animate-spin mr-2" />}
          Submit
        </Button>
      ) : (
        <Button onClick={handleNext} className="mt-6">
          Next <ChevronRight className="ml-2" />
        </Button>
      )}
    </div>
  );
};

export default MCQ;
