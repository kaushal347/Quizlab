import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import HistoryComponent from '../HistoryComponent';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/db";


import { unstable_cache } from 'next/cache';

const getGamesCount = unstable_cache(
  async (userId: string) => {
    return await prisma.game.count({
      where: { userId }
    });
  },
  ["games-count"],
  { revalidate: 60, tags: ["activities"] }
);

export const RecentActivities = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/');
  }
  const gamesCount = await getGamesCount(session.user.id);
  return (
    <Card className="col-span-4 lg:col-span-3 h-full bento-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Recent Activities</CardTitle>
        <CardDescription className="text-gray-400">
          You have Played total of {gamesCount} games
        </CardDescription>
      </CardHeader>

      <CardContent className="max-h-[580px] overflow-scroll scrollbar-hide">
        <HistoryComponent limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};
