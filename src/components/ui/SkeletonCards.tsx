import React from "react";
import { Card, CardHeader, CardContent } from "./card";

export const CardSkeleton = () => {
    return (
        <Card className="h-full bento-card animate-pulse border-white/5">
            <CardHeader className="space-y-2">
                <div className="h-8 w-1/3 bg-white/10 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full bg-white/5 rounded-xl border border-white/5" />
            </CardContent>
        </Card>
    );
};

export const HistoryCardSkeleton = () => {
    return (
        <Card className="h-full bento-card animate-pulse border-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="h-8 w-32 bg-white/10 rounded-lg" />
                <div className="h-8 w-8 bg-white/10 rounded-full" />
            </CardHeader>
            <CardContent>
                <div className="h-20 w-full bg-white/5 rounded-lg" />
            </CardContent>
        </Card>
    );
};

export const RecentActivitySkeleton = () => {
    return (
        <Card className="h-full bento-card animate-pulse border-white/5">
            <CardHeader>
                <div className="h-8 w-48 bg-white/10 rounded-lg" />
                <div className="h-4 w-32 bg-white/5 rounded-lg mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white/10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-white/10 rounded" />
                            <div className="h-3 w-1/2 bg-white/5 rounded" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
export const QuizSkeleton = () => {
    return (
        <div className="select-none flex flex-col items-center min-h-screen px-4 pt-24 animate-pulse">
            <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex flex-col gap-2 self-start">
                    <div className="h-6 w-32 bg-white/10 rounded-full" />
                    <div className="h-12 w-48 bg-white/10 rounded-2xl" />
                </div>
                <div className="h-12 w-32 bg-white/10 rounded-2xl" />
            </div>

            <Card className="w-full max-w-4xl glass border-white/5 shadow-xl">
                <CardHeader className="flex flex-row items-center p-8">
                    <div className="h-20 w-20 bg-white/10 rounded-xl mr-5" />
                    <div className="flex-grow space-y-3">
                        <div className="h-4 w-full bg-white/10 rounded" />
                        <div className="h-4 w-3/4 bg-white/10 rounded" />
                    </div>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-16 w-full bg-white/5 rounded-xl border border-white/5" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
