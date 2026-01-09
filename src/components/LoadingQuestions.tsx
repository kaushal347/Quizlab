
import React from "react";
import { Progress } from "./ui/progress";
import Image from "next/image";

type Props = { finished: boolean };

const loadingTexts = [
  "Generating questions...",
  "Unleashing the power of curiosity...",
  "Diving deep into the ocean of questions..",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

const LoadingQuestions = ({ finished }: Props) => {
  const [progress, setProgress] = React.useState(10);
  const [loadingText, setLoadingText] = React.useState(loadingTexts[0]);
  React.useEffect(() => {
    let active = true;
    const interval = setInterval(() => {
      if (!active) return;
      setLoadingText((prev) => {
        const currentIndex = loadingTexts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (finished) {
      setProgress(100);
      return;
    }
    let active = true;
    const interval = setInterval(() => {
      if (!active) return;
      setProgress((prev) => {
        if (prev >= 100) return 0;
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 200);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [finished]);

  return (
    <>
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
        <Image src={"/loading.gif"} width={400} height={400} alt="loading" priority />
        <Progress value={progress} className="w-full mt-4" />
        <h1 className="mt-4 text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse text-center">
          {loadingText}
        </h1>
      </div>
      {/* Remove loading page-specific copyright/footer. Only use global footer. */}
    </>
  );
};

export default LoadingQuestions;
