import { Suspense } from 'react';
import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import QuizMeCard from '@/components/dashboard/QuizMeCard';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { CardSkeleton, RecentActivitySkeleton } from '@/components/ui/SkeletonCards';

export const metadata = {
    title: "Dashboard | QuizLab",
};

const Dashboard = async () => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/');
    }

    return (
        <main className="p-8 mx-auto max-w-7xl">
            <DashboardClient
                quizMe={<QuizMeCard />}
                history={<HistoryCard />}
                hotTopics={
                    <Suspense fallback={<CardSkeleton />}>
                        <HotTopicsCard />
                    </Suspense>
                }
                recentActivities={
                    <Suspense fallback={<RecentActivitySkeleton />}>
                        <RecentActivities />
                    </Suspense>
                }
            />
        </main>
    );
};

export default Dashboard;