"use client";

import { Stats } from "@/types";

interface StatsPanelProps {
  stats: Stats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const statCards = [
    { label: "Today", value: stats.today },
    { label: "This Week", value: stats.week },
    { label: "This Month", value: stats.month },
    { label: "Total Signals", value: stats.total },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {statCards.map((card) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-5 transition-all duration-300 hover:border-zinc-700"
        >
          <div className="text-3xl font-extralight tracking-tight text-zinc-100">
            {card.value}
          </div>
          <div className="mt-1.5 text-[11px] text-zinc-500 tracking-widest uppercase">
            {card.label}
          </div>
          {/* Subtle accent on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#c8a97e]/0 via-[#c8a97e]/40 to-[#c8a97e]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ))}
    </div>
  );
}
