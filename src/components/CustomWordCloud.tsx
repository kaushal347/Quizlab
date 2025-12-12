"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WordCloud = dynamic<any>(() => import("react-d3-cloud"), {
  ssr: false,
});

type Word = {
  text: string;
  value: number;
};

type Props = {
  formattedTopics: Word[];
};

const fontSizeMapper = (word: Word) =>
  Math.log2(word.value) * 5 + 16;

const CustomWordCloud = ({ formattedTopics }: Props) => {
  const { theme } = useTheme();
  const router = useRouter();

  if (!formattedTopics || formattedTopics.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No topics yet.
      </div>
    );
  }

  return (
    <div className="w-full h-[550px]">
      <WordCloud
        data={formattedTopics}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme === "dark" ? "white" : "black"}
        onWordClick={(word: Word) => {
          router.push("/quiz?topic=" + word.text);
        }}
      />
    </div>
  );
};

export default CustomWordCloud;
