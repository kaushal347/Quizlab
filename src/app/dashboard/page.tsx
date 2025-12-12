import { Suspense } from 'react';
import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import QuizMeCard from '@/components/dashboard/QuizMeCard';

import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata = {
    title: "Dashboard | QuizLab",
};

export const Dashboard = async () => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/');
    }
    return (
        <main className="p-8 mx-auto max-w-7xl">


            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7 auto-rows-[minmax(180px,auto)]">
                {/* Row 1 */}
                <div className="md:col-span-1 lg:col-span-4 h-full">
                    <QuizMeCard />
                </div>
                <div className="md:col-span-1 lg:col-span-3 h-full">
                    <HistoryCard />
                </div>

                {/* Row 2 */}
                <div className="md:col-span-1 lg:col-span-4 h-full">
                    <Suspense fallback={<div className="h-full min-h-[180px] w-full bg-white/5 animate-pulse rounded-xl border border-white/10" />}>
                        <HotTopicsCard />
                    </Suspense>
                </div>
                <div className="md:col-span-1 lg:col-span-3 h-full">
                    <Suspense fallback={<div className="h-full min-h-[180px] w-full bg-white/5 animate-pulse rounded-xl border border-white/10" />}>
                        <RecentActivities />
                    </Suspense>
                </div>
            </div>
        </main>
    );
};
export default Dashboard;