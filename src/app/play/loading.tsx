import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-purple-500/30 animate-pulse rounded-full" />
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin relative z-10" />
                </div>
                <p className="text-sm font-mono text-gray-400 animate-pulse">
                    INITIALIZING GAME ENVIRONMENT...
                </p>
            </div>
        </div>
    );
}
