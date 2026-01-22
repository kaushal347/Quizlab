import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomWordCloud from "../CustomWordCloud";
import { prisma } from "@/lib/db";

import { unstable_cache } from "next/cache";

const getHotTopics = unstable_cache(
  async () => {
    return await prisma.topic_count.findMany({
      orderBy: {
        count: "desc",
      },
    });
  },
  ["hot-topics"],
  { revalidate: 3600, tags: ["topics"] }
);

const HotTopicsCard = async () => {
  const topics = await getHotTopics();

  const formattedTopics = topics.map((topic) => ({
    text: topic.topic,
    value: topic.count,
  }));

  return (
    <Card className="h-full bento-card hover-glow transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
          Hot Topics
        </CardTitle>
        <CardDescription className="text-gray-400">
          Most popular quiz categories right now.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-center p-0">
        <CustomWordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
