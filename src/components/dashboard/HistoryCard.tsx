"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

const HistoryCard = () => {
  const router = useRouter();
  return (
    <Card
      className="h-full bento-card cursor-pointer group hover:bg-white/10"
      onClick={() => {
        router.push("/history");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          History
        </CardTitle>
        <History
          size={32}
          strokeWidth={2}
          className="text-purple-400 group-hover:rotate-[-12deg] transition-transform duration-500"
        />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-300">
          View past quiz attempts and detailed statistics.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
