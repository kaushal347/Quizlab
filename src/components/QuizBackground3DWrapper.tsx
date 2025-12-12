"use client";

import dynamic from "next/dynamic";
import React from "react";

const QuizBackground3D = dynamic(() => import("@/components/QuizBackground3D").then(mod => mod.QuizBackground3D), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black/20" />,
});

const QuizBackground3DWrapper = () => {
    return <QuizBackground3D />;
};

export default QuizBackground3DWrapper;
