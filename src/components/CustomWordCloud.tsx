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

const colors = [
  "#22d3ee", // cyan
  "#818cf8", // indigo
  "#c084fc", // purple
  "#fb7185", // rose
  "#fbbf24", // amber
  "#34d399", // emerald
];

const fontSizeMapper = (word: Word) =>
  Math.sqrt(word.value) * 15 + 16;

const CustomWordCloud = ({ formattedTopics }: Props) => {
  const router = useRouter();

  if (!formattedTopics || formattedTopics.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No topics yet.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <WordCloud
        data={formattedTopics}
        height={400}
        width={500}
        font="Inter, sans-serif"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={() => colors[Math.floor(Math.random() * colors.length)]}
        onWordClick={(word: Word) => {
          router.push("/quiz?topic=" + word.text);
        }}
      />
    </div>
  );
};

export default CustomWordCloud;
