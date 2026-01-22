"use client";
import React from "react";
import { Button } from "./ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { UseMutateFunction } from "@tanstack/react-query";

type Props = {
  answerWithBlanks: string;
  checkAnswer: UseMutateFunction<any, Error, string, unknown>;
  isPending: boolean;
  onNext: (accuracy: number) => void;
};

const blank = "_____";

const BlankAnswerInput = ({ answerWithBlanks, checkAnswer, isPending, onNext }: Props) => {
  const [answer, setAnswer] = React.useState("");

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    checkAnswer(answer, {
      onSuccess: ({ percentage }) => {
        onNext(percentage);
        setAnswer(""); // Reset for next question
      },
    });
  };

  // Focus the input when question changes
  React.useEffect(() => {
    const input = document.querySelector('input[data-blank-input]') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }, [answerWithBlanks]);

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      <div className="flex justify-start w-full">
        <h1 className="text-xl font-semibold leading-relaxed">
          {answerWithBlanks.split(blank).map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < answerWithBlanks.split(blank).length - 1 && (
                <input
                  data-blank-input
                  value={answer}
                  onChange={handleAnswerChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && answer.trim() && !isPending) {
                      handleSubmit();
                    }
                  }}
                  className="mx-2 text-center text-cyan-400 bg-white/5 border-b-2 border-cyan-500/50 w-40 focus:border-cyan-400 focus:bg-white/10 focus:outline-none placeholder-slate-500 transition-all rounded-t-md px-2"
                  type="text"
                  placeholder="type here..."
                  autoComplete="off"
                />
              )}
            </React.Fragment>
          ))}
        </h1>
      </div>

      <Button
        disabled={isPending || !answer.trim()}
        onClick={handleSubmit}
        className="w-full max-w-xs bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ChevronRight className="w-4 h-4 mr-2" />
        )}
        Submit Answer
      </Button>
    </div>
  );
};

export default BlankAnswerInput;
