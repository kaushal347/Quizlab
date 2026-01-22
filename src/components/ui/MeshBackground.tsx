"use client";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import NoiseTexture from "./NoiseTexture";

interface MeshBackgroundProps extends React.HTMLProps<HTMLDivElement> {
    children?: ReactNode;
}

export const MeshBackground = ({
    className,
    children,
    ...props
}: MeshBackgroundProps) => {
    return (
        <div
            className={cn(
                "relative flex flex-col min-h-screen bg-zinc-950 text-slate-950 overflow-hidden",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Static Mesh Gradient */}
                <div
                    className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]"
                    style={{
                        backgroundImage: `
                            radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.4) 0%, transparent 60%),
                            radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.4) 0%, transparent 60%),
                            radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.4) 0%, transparent 60%),
                            radial-gradient(at 0% 100%, rgba(34, 211, 238, 0.4) 0%, transparent 60%)
                        `
                    }}
                />
                <NoiseTexture />
            </div>
            <div className="relative z-10 w-full">
                {children}
            </div>
        </div>
    );
};
