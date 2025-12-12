"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WordCloudComponent = dynamic<any>(
  () =>
    import("@isoterik/react-word-cloud").then(
      (mod) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mod as any).default ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mod as any).WordCloud ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mod as any).ReactWordCloud ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mod as any)
    ),
  { ssr: false }
);

type Props = {
  formattedTopics: { text: string; value: number }[];
};

export default function WordCloud({ formattedTopics }: Props) {
  const { theme } = useTheme();
  const router = useRouter();

  // 🟡 Show message if no data
  if (!formattedTopics || formattedTopics.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        No topics available yet.
      </div>
    );
  }

  return (
    <div className="w-full h-[500px]">
      <WordCloudComponent
        words={formattedTopics}
        options={{
          rotations: 0,
          rotationAngles: [0],
          fontSizes: [18, 60],
          colors: [theme === "dark" ? "white" : "black"],
        }}
        onWordClick={(word: { text: string }) => {
          router.push("/quiz?topic=" + word.text);
        }}
      />
    </div>
  );
}
