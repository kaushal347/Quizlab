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
    <Card className="h-full bento-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Hot Topics</CardTitle>
        <CardDescription className="text-gray-400">
          Click on a topic to start a quiz on it.
        </CardDescription>
      </CardHeader>

      <CardContent className="pl-2">
        <CustomWordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
};

export default HotTopicsCard;
