"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const QuizMeCard = () => {
  const router = useRouter();
  return (
    <MagneticButton className="h-full">
      <Card
        className="h-full bento-card cursor-pointer group hover:bg-white/10"
        onClick={() => {
          router.push("/quiz");
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500">
            Quiz me!
          </CardTitle>
          <BrainCircuit
            size={36}
            strokeWidth={2}
            className="text-cyan-400 group-hover:rotate-12 transition-transform duration-500"
          />
        </CardHeader>
        <CardContent>
          <p className="text-base text-gray-300">
            Challenge yourself to a quiz with a topic of your choice.
          </p>
        </CardContent>
      </Card>
    </MagneticButton>
  );
};

export default QuizMeCard;
