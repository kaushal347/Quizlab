// "use client";

// import { Game, Question } from "@prisma/client";
// import { differenceInSeconds } from "date-fns";
// import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
// import React from "react";
// import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
// import { Button, buttonVariants } from "./ui/button";
// import MCQCounter from "./MCQCounter";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { checkAnswerSchema, endGameSchema } from "@/schemas/forms/questions";
// import { z } from "zod";
// import { toast } from "sonner";
// import { cn, formatTimeDelta } from "@/lib/utils";

// type Props = {
//   game: Game & { questions: Pick<Question, "id" | "question" | "options">[] };
// };

// const MCQ = ({ game }: Props) => {
//   const [questionIndex, setQuestionIndex] = React.useState(0);
//   const [selectedChoice, setSelectedChoice] = React.useState<number | null>(null);
//   const [correct_Answers, setCorrectAnswer] = React.useState<number>(0);
//   const [wrongAnswer, setWrongAnswer] = React.useState<number>(0);
//   const [hasEnded, setHasEnded] = React.useState<boolean>(false);

//   // Store startTime as a Date object to avoid errors
//   const startTime = new Date(game.timeStarted);

//   const [now, setNow] = React.useState<Date>(new Date());

//   // LIVE TIMER
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       if (!hasEnded) {
//         setNow(new Date());
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [hasEnded]);

//   const currentQuestion = React.useMemo(() => {
//     return game.questions[questionIndex];
//   }, [questionIndex, game.questions]);

//   const options = React.useMemo(() => {
//     if (!currentQuestion || !currentQuestion.options) return [];
//     return JSON.parse(currentQuestion.options as string) as string[];
//   }, [currentQuestion]);

//   // CHECK ANSWER
//   const { mutate: checkAnswer, isPending: isChecking } = useMutation({
//     mutationFn: async () => {
//       if (selectedChoice === null) throw new Error("No option selected");

//       const payload: z.infer<typeof checkAnswerSchema> = {
//         questionId: currentQuestion.id,
//         userInput: options[selectedChoice],
//       };

//       const response = await axios.post("/api/checkAnswer", payload);
//       return response.data as { isCorrect: boolean };
//     },
//   });

//   // SAVE END TIME
//   const saveEndTime = async () => {
//     try {
//       const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
//       await axios.post("/api/endGame", payload);
//     } catch (err) {
//       console.error("Failed saving end time:", err);
//     }
//   };

//   const handleNext = React.useCallback(() => {
//     if (isChecking) return;

//     checkAnswer(undefined, {
//       onSuccess: async ({ isCorrect }) => {
//         if (isCorrect) {
//           toast.success("Correct!");
//           setCorrectAnswer((p) => p + 1);
//         } else {
//           toast.error("Wrong!");
//           setWrongAnswer((p) => p + 1);
//         }

//         // LAST QUESTION
//         if (questionIndex === game.questions.length - 1) {
//           await saveEndTime();
//           setHasEnded(true);
//           return;
//         }

//         setQuestionIndex((prev) => prev + 1);
//         setSelectedChoice(null);
//       },
//     });
//   }, [checkAnswer, isChecking, questionIndex, game.questions.length]);

//   // KEYBOARD SHORTCUTS
//   React.useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "1") setSelectedChoice(0);
//       else if (e.key === "2") setSelectedChoice(1);
//       else if (e.key === "3") setSelectedChoice(2);
//       else if (e.key === "4") setSelectedChoice(3);
//       else if (e.key === "Enter") handleNext();
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [handleNext]);

//   // END SCREEN
//   if (hasEnded) {
//     return (
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
//         <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
//           You completed in{" "}
//           {formatTimeDelta(differenceInSeconds(now, startTime))}
//         </div>

//         <a href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
//           View Statistics
//           <BarChart className="w-4 h-4 ml-2" />
//         </a>
//       </div>
//     );
//   }

//   // MAIN SCREEN
//   return (
//     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl">
//       {/* HEADER */}
//       <div className="flex flex-row justify-between items-center">
//         <p className="flex items-center gap-2">
//           <span className="text-slate-400">Topic:</span>
//           <span className="px-2 py-1 rounded-lg bg-slate-800 text-white">
//             {game.topic}
//           </span>
//         </p>

//         <div className="flex items-center text-slate-400">
//           <Timer className="mr-2" size={18} />
//           {formatTimeDelta(differenceInSeconds(now, startTime))}
//         </div>

//         <MCQCounter correct_answers={correct_Answers} wrong_answers={wrongAnswer} />
//       </div>

//       {/* QUESTION CARD */}
//       <Card className="w-full mt-4">
//         <CardHeader className="flex flex-row items-start gap-4">
//           <CardTitle className="mr-5 flex flex-col items-center">
//             <span className="font-semibold text-lg">{questionIndex + 1}</span>
//             <span className="text-sm text-slate-400">{game.questions.length}</span>
//           </CardTitle>

//           <CardDescription className="flex-grow text-lg">
//             {currentQuestion?.question}
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       {/* OPTIONS */}
//       <div className="flex flex-col w-full mt-4 gap-3">
//         {options.map((option, index) => {
//           const isSelected = selectedChoice === index;

//           return (
//             <button
//               key={index}
//               onClick={() => setSelectedChoice(index)}
//               className={`
//                 w-full flex items-center gap-4 p-4 rounded-xl border
//                 transition-all duration-200 text-left
//                 ${
//                   isSelected
//                     ? "bg-slate-800 text-white border-slate-700"
//                     : "bg-slate-100 text-black border-slate-300"
//                 }
//               `}
//             >
//               <div
//                 className={`
//                   flex items-center justify-center w-6 h-6 rounded-full border text-sm
//                   ${
//                     isSelected
//                       ? "bg-white text-slate-900 border-white"
//                       : "bg-transparent text-slate-700 border-slate-500"
//                   }
//                 `}
//               >
//                 {index + 1}
//               </div>

//               <span className="text-base font-medium">{option}</span>
//             </button>
//           );
//         })}

//         {/* NEXT BUTTON */}
//         <div className="w-full flex justify-center mt-6">
//           <Button className="mt-2" disabled={isChecking} onClick={handleNext}>
//             {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//             Next <ChevronRight className="w-4 h-4 ml-2" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MCQ;
// "use client";

// import { Game, Question } from "@prisma/client";
// import { differenceInSeconds } from "date-fns";
// import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
// import React from "react";
// import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
// import { Button, buttonVariants } from "./ui/button";
// import MCQCounter from "./MCQCounter";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import { checkAnswerSchema, endGameSchema } from "@/schemas/forms/questions";
// import { z } from "zod";
// import { toast } from "sonner";
// import { cn, formatTimeDelta } from "@/lib/utils";

// type Props = {
//   game: Game & { questions: Pick<Question, "id" | "question" | "options">[] };
// };

// const MCQ = ({ game }: Props) => {
//   const [questionIndex, setQuestionIndex] = React.useState(0);
//   const [selectedChoice, setSelectedChoice] = React.useState<number | null>(null);
//   const [correct_Answers, setCorrectAnswer] = React.useState<number>(0);
//   const [wrongAnswer, setWrongAnswer] = React.useState<number>(0);
//   const [hasEnded, setHasEnded] = React.useState<boolean>(false);

//   // Store startTime as a Date object to avoid errors
//   const startTime = new Date(game.timeStarted);

//   const [now, setNow] = React.useState<Date>(new Date());

//   // LIVE TIMER
//   React.useEffect(() => {
//     const interval = setInterval(() => {
//       if (!hasEnded) {
//         setNow(new Date());
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [hasEnded]);

//   const currentQuestion = React.useMemo(() => {
//     return game.questions[questionIndex];
//   }, [questionIndex, game.questions]);

//   const options = React.useMemo(() => {
//     if (!currentQuestion || !currentQuestion.options) return [];
//     return JSON.parse(currentQuestion.options as string) as string[];
//   }, [currentQuestion]);

//   // CHECK ANSWER
//   const { mutate: checkAnswer, isPending: isChecking } = useMutation({
//     mutationFn: async () => {
//       if (selectedChoice === null) throw new Error("No option selected");

//       const payload: z.infer<typeof checkAnswerSchema> = {
//         questionId: currentQuestion.id,
//         userInput: options[selectedChoice],
//       };

//       const response = await axios.post("/api/checkAnswer", payload);
//       return response.data as { isCorrect: boolean };
//     },
//   });

//   // SAVE END TIME
//   const saveEndTime = async () => {
//     try {
//       const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
//       await axios.post("/api/endGame", payload);
//     } catch (err) {
//       console.error("Failed saving end time:", err);
//     }
//   };

//   const handleNext = React.useCallback(() => {
//     if (isChecking) return;

//     checkAnswer(undefined, {
//       onSuccess: async ({ isCorrect }) => {
//         if (isCorrect) {
//           toast.success("Correct!");
//           setCorrectAnswer((p) => p + 1);
//         } else {
//           toast.error("Wrong!");
//           setWrongAnswer((p) => p + 1);
//         }

//         // LAST QUESTION
//         if (questionIndex === game.questions.length - 1) {
//           await saveEndTime();
//           setHasEnded(true);
//           return;
//         }

//         setQuestionIndex((prev) => prev + 1);
//         setSelectedChoice(null);
//       },
//     });
//   }, [checkAnswer, isChecking, questionIndex, game.questions.length]);

//   // KEYBOARD SHORTCUTS
//   React.useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "1") setSelectedChoice(0);
//       else if (e.key === "2") setSelectedChoice(1);
//       else if (e.key === "3") setSelectedChoice(2);
//       else if (e.key === "4") setSelectedChoice(3);
//       else if (e.key === "Enter") handleNext();
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [handleNext]);

//   // END SCREEN
//   if (hasEnded) {
//     return (
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
//         <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
//           You completed in{" "}
//           {formatTimeDelta(differenceInSeconds(now, startTime))}
//         </div>

//         <a href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
//           View Statistics
//           <BarChart className="w-4 h-4 ml-2" />
//         </a>
//       </div>
//     );
//   }

//   // MAIN SCREEN
//   return (
//     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl">
//       {/* HEADER */}
//       <div className="flex flex-row justify-between items-center">
//         <p className="flex items-center gap-2">
//           <span className="text-slate-400">Topic:</span>
//           <span className="px-2 py-1 rounded-lg bg-slate-800 text-white">
//             {game.topic}
//           </span>
//         </p>

//         <div className="flex items-center text-slate-400">
//           <Timer className="mr-2" size={18} />
//           {formatTimeDelta(differenceInSeconds(now, startTime))}
//         </div>

//         <MCQCounter correct_answers={correct_Answers} wrong_answers={wrongAnswer} />
//       </div>

//       {/* QUESTION CARD */}
//       <Card className="w-full mt-4">
//         <CardHeader className="flex flex-row items-start gap-4">
//           <CardTitle className="mr-5 flex flex-col items-center">
//             <span className="font-semibold text-lg">{questionIndex + 1}</span>
//             <span className="text-sm text-slate-400">{game.questions.length}</span>
//           </CardTitle>

//           <CardDescription className="flex-grow text-lg">
//             {currentQuestion?.question}
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       {/* OPTIONS */}
//       <div className="flex flex-col w-full mt-4 gap-3">
//         {options.map((option, index) => {
//           const isSelected = selectedChoice === index;

//           return (
//             <button
//               key={index}
//               onClick={() => setSelectedChoice(index)}
//               className={`
//                 w-full flex items-center gap-4 p-4 rounded-xl border
//                 transition-all duration-200 text-left
//                 ${
//                   isSelected
//                     ? "bg-slate-800 text-white border-slate-700"
//                     : "bg-slate-100 text-black border-slate-300"
//                 }
//               `}
//             >
//               <div
//                 className={`
//                   flex items-center justify-center w-6 h-6 rounded-full border text-sm
//                   ${
//                     isSelected
//                       ? "bg-white text-slate-900 border-white"
//                       : "bg-transparent text-slate-700 border-slate-500"
//                   }
//                 `}
//               >
//                 {index + 1}
//               </div>

//               <span className="text-base font-medium">{option}</span>
//             </button>
//           );
//         })}

//         {/* NEXT BUTTON */}
//         <div className="w-full flex justify-center mt-6">
//           <Button className="mt-2" disabled={isChecking} onClick={handleNext}>
//             {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//             Next <ChevronRight className="w-4 h-4 ml-2" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MCQ;
"use client";

import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { ChevronRight, Loader2, Timer } from "lucide-react";
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

type Props = {
  game: Game & {
    questions: Pick<Question, "id" | "question" | "options" | "answer">[];
  };
};

// Memoized Option Component
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
    <button
      disabled={submitted}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 text-left group hover:scale-[1.01] will-change-transform",
        isCorrectOption
          ? "bg-green-950/50 border-green-500 text-green-100 shadow-[0_0_30px_-5px_oklch(0.6_0.2_140/0.4)]"
          : isWrongSelected
            ? "bg-red-950/50 border-red-500 text-red-100 shadow-[0_0_30px_-5px_oklch(0.6_0.2_20/0.4)]"
            : isSelected
              ? "bg-cyan-950/50 border-cyan-500 text-cyan-100 shadow-[0_0_30px_-5px_oklch(0.8_0.15_200/0.4)]"
              : "glass border-white/10 hover:bg-white/5 hover:border-cyan-500/30 text-gray-300"
      )}
    >
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold transition-colors",
        isSelected || isCorrectOption || isWrongSelected
          ? "border-transparent bg-white/20 text-white"
          : "border-white/20 text-gray-400 group-hover:border-cyan-500/50 group-hover:text-cyan-400"
      )}>
        {index + 1}
      </div>

      <span className="text-base font-medium">{option}</span>
    </button>
  );
});
MCQOption.displayName = "MCQOption";

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correct_Answers, setCorrectAnswer] = useState<number>(0);
  const [wrongAnswer, setWrongAnswer] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasEnded, setHasEnded] = useState(false);

  const [displayedOptions, setDisplayedOptions] = useState<string[]>([]);

  const startTime = new Date(game.timeStarted);
  const [now, setNow] = useState<Date>(new Date());

  // TIMER
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  if (!currentQuestion) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <p>Error: No questions found for this game.</p>
        <Button onClick={() => window.location.href = "/quiz"} className="mt-4">Go Back</Button>
      </div>
    );
  }

  // Load fresh options for each question
  React.useEffect(() => {
    setDisplayedOptions(options);
  }, [currentQuestion, options]);

  // CHECK ANSWER API
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
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

  // END GAME API
  const saveEndTime = async () => {
    try {
      const payload: z.infer<typeof endGameSchema> = { gameId: game.id };
      await axios.post("/api/endGame", payload);
    } catch (err) {
      console.error("error saving end time", err);
    }
  };

  // SUBMIT
  const handleSubmit = () => {
    if (selectedChoice === null) return;

    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        setSubmitted(true);
        setIsCorrect(isCorrect);

        if (isCorrect) {
          setCorrectAnswer((p) => p + 1);
          toast.success("Correct!");
        } else {
          setWrongAnswer((p) => p + 1);
          toast.error("Wrong!");
        }
      },
    });
  };

  // NEXT
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

  // 50–50 LIFELINE
  const useFiftyFifty = async () => {
    if (game.usedFiftyFifty || submitted) return;

    const correct = currentQuestion.answer;
    const incorrect = displayedOptions.filter((o) => o !== correct);
    const oneIncorrect =
      incorrect[Math.floor(Math.random() * incorrect.length)];

    const newOptions = [correct, oneIncorrect].sort(
      () => Math.random() - 0.5
    );

    setDisplayedOptions(newOptions);

    await fetch("/api/lifeline", {
      method: "POST",
      body: JSON.stringify({
        type: "fifty_fifty",
        gameId: game.id,
      }),
    });

    game.usedFiftyFifty = true;
  };

  // FLIP QUESTION
  const useFlip = async () => {
    if (game.usedFlip || submitted) return;

    const res = await fetch("/api/lifeline", {
      method: "POST",
      body: JSON.stringify({
        type: "flip",
        gameId: game.id,
        topic: game.topic,
      }),
    });

    const data = await res.json();

    if (!data.question) {
      toast.error("No more questions available!");
      return;
    }

    game.questions[questionIndex] = data.question;

    const opts = JSON.parse(data.question.options);
    setDisplayedOptions(opts);

    setSelectedChoice(null);
    setSubmitted(false);
    setIsCorrect(null);

    game.usedFlip = true;
  };

  const handleOptionClick = React.useCallback((index: number) => {
    if (!submitted) {
      setSelectedChoice(index);
    }
  }, [submitted]);

  // END SCREEN
  if (hasEnded) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex flex-col items-center justify-center">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <QuizCompleted3D />
        </div>

        <div className="z-10 w-full max-w-md animate-in zoom-in-95 duration-500">
          <Card className="glass border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center text-center">
            <div className="mb-6 p-4 rounded-full bg-green-500/10 text-green-400 shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)]">
              <Timer className="w-12 h-12" />
            </div>

            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-gray-400 mb-6">
              You finished the quiz in <span className="text-white font-bold">{formatTimeDelta(differenceInSeconds(now, startTime))}</span>.
            </p>

            <a
              href={`/statistics/${game.id}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg")}
            >
              View Statistics
              <ChevronRight className="w-4 h-4 ml-2" />
            </a>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 w-full max-w-3xl mx-auto">
      {/* HEADER */}
      <div className="w-full flex flex-row justify-between items-center mb-6">
        <div className="bg-white/5 rounded-full px-4 py-1.5 border border-white/10 flex items-center gap-2">
          <Timer className="text-cyan-500" size={16} />
          <span className="text-cyan-100 font-mono text-sm">
            {formatTimeDelta(differenceInSeconds(now, startTime))}
          </span>
        </div>

        <MCQCounter
          correct_answers={correct_Answers}
          wrong_answers={wrongAnswer}
        />
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full mb-8 space-y-2">
        <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
          <span>Progress</span>
          <span>{Math.round(((questionIndex + 1) / game.questions.length) * 100)}%</span>
        </div>
        <Progress
          value={((questionIndex + 1) / game.questions.length) * 100}
          className="h-1.5 bg-white/10"
          indicatorClassName="bg-gradient-to-r from-cyan-500 to-purple-500"
        />
      </div>

      {/* LIFELINES – KBC STYLE */}
      <div className="flex justify-center gap-4 mt-4">
        <Button
          disabled={game.usedFiftyFifty || submitted}
          onClick={useFiftyFifty}
          className={cn(
            "px-6 rounded-full font-semibold",
            game.usedFiftyFifty || submitted
              ? "bg-[#1e1f6e]/50 text-slate-300 cursor-not-allowed"
              : "bg-[#1e1f6e] hover:bg-[#25279b] text-white"
          )}
        >
          50–50
        </Button>

        <Button
          disabled={game.usedFlip || submitted}
          onClick={useFlip}
          className={cn(
            "px-6 rounded-full font-semibold",
            game.usedFlip || submitted
              ? "bg-[#d6b100]/50 text-slate-500 cursor-not-allowed"
              : "bg-[#d6b100] hover:bg-[#e6c200] text-slate-900"
          )}
        >
          Flip
        </Button>
      </div>

      {/* QUESTION */}
      <Card className="w-full mt-4 glass border-white/10 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
        <CardHeader className="flex flex-row items-start gap-4 p-6">
          <CardTitle className="mr-5 flex flex-col items-center">
            <span className="font-bold text-xl text-white/90">Q{questionIndex + 1}</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest">of {game.questions.length}</span>
          </CardTitle>

          <CardDescription className="flex-grow text-lg font-medium text-white/90 leading-relaxed">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* OPTIONS */}
      <div className="flex flex-col w-full mt-4 gap-3">
        {displayedOptions.map((option, index) => {
          return (
            <MCQOption
              key={index}
              index={index}
              option={option}
              isSelected={selectedChoice === index}
              isCorrectOption={submitted && isCorrect && selectedChoice === index}
              isWrongSelected={submitted && !isCorrect && selectedChoice === index}
              submitted={submitted}
              onClick={() => handleOptionClick(index)}
            />
          );
        })}

        {/* SUBMIT BUTTON */}
        {!submitted && (
          <div className="w-full flex justify-center mt-6">
            <Button
              disabled={selectedChoice === null || isChecking}
              onClick={handleSubmit}
              className="w-40"
            >
              {isChecking && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              Submit
            </Button>
          </div>
        )}

        {/* NEXT BUTTON */}
        {submitted && (
          <div className="w-full flex justify-center mt-6">
            <Button onClick={handleNext} className="w-40">
              Next <ChevronRight className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQ;
