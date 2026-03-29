"use client";

import { Stats } from "@/types";
import { cn } from "@/lib/utils";

interface StatsPanelProps {
  stats: Stats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const statCards = [
    { label: "今日推文", value: stats.today },
    { label: "本周推文", value: stats.week },
    { label: "本月推文", value: stats.month },
    { label: "全部推文", value: stats.total },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "rounded-lg border border-gray-800 bg-gray-900/80 p-6 transition-all duration-300",
            "hover:scale-105 hover:border-amber-500/50"
          )}
        >
          <div className="text-3xl font-bold" style={{ color: "#f59e0b" }}>
            {card.value}
          </div>
          <div className="mt-2 text-sm text-gray-400">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
