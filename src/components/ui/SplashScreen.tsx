"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => setShouldRender(false), 1000); // Wait for fade out
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    if (!shouldRender) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-1000",
                isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
        >
            <div className="flex flex-col items-center">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse">
                    QuizLab
                </h1>
                <div className="mt-4 flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-3 w-3 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-3 w-3 rounded-full bg-pink-500 animate-bounce" />
                </div>
            </div>
        </div>
    );
};
