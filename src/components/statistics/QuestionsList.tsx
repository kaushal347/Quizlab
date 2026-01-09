"use client";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "@prisma/client";
type Props = {
  questions: Question[];
};

const QuestionsList = ({ questions }: Props) => {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 backdrop-blur-md p-6 shadow-xl">
      <Table className="mt-4">
        <TableCaption className="text-gray-400">End of list.</TableCaption>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="w-[10px] text-gray-400">No.</TableHead>
            <TableHead className="text-gray-300">Question & Correct Answer</TableHead>
            <TableHead className="text-gray-300">Your Answer</TableHead>

            {questions[0].questionType === "open_ended" && (
              <TableHead className="w-[10px] text-right text-gray-300">Accuracy</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <>
            {questions.map(
              (
                { answer, question, userAnswer, percentageCorrect, isCorrect },
                index
              ) => {
                return (
                  <TableRow key={index} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{index + 1}</TableCell>
                    <TableCell className="text-gray-300">
                      <span className="text-white text-lg block mb-2">{question}</span>
                      <span className="font-semibold text-cyan-400 block p-2 bg-cyan-950/30 rounded-md w-fit">
                        Correct: {answer}
                      </span>
                    </TableCell>
                    {questions[0].questionType === "open_ended" ? (
                      <TableCell className={`${(percentageCorrect && percentageCorrect > 75) ? "text-green-400" : "text-red-400"} font-semibold text-lg`}>
                        {userAnswer}
                      </TableCell>
                    ) : (
                      <TableCell
                        className={`${isCorrect ? "text-green-400" : "text-red-400"
                          } font-semibold text-lg`}
                      >
                        {userAnswer}
                      </TableCell>
                    )}

                    {(percentageCorrect !== null && percentageCorrect !== undefined) && (
                      <TableCell className="text-right text-white font-semibold">
                        {percentageCorrect}
                      </TableCell>
                    )}
                  </TableRow>
                );
              }
            )}
          </>
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsList;
