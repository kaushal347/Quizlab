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
