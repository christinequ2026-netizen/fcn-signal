"use client";

import { useState } from "react";
import StatsPanel from "@/components/StatsPanel";
import InsightsPanel from "@/components/InsightsPanel";
import HotKeywords from "@/components/HotKeywords";
import SignalFeed from "@/components/SignalFeed";
import ArticleDetail from "@/components/ArticleDetail";
import { SignalItem } from "@/types";

interface HomeClientProps {
  signals: SignalItem[];
  stats: { today: number; week: number; month: number; total: number };
  insights: {
    today: { id: string; text: string }[];
    week: { id: string; text: string }[];
    month: { id: string; text: string }[];
    trends: { id: string; text: string }[];
  };
  hotKeywords: { keyword: string; count: number; sourceUrl: string }[];
}

export default function HomeClient({ signals, stats, insights, hotKeywords }: HomeClientProps) {
  const [selectedItem, setSelectedItem] = useState<SignalItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleItemClick = (item: SignalItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <>
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 space-y-8">
        {/* Hero section */}
        <div className="space-y-2 pb-2">
          <h1 className="text-2xl font-light text-zinc-100 tracking-tight">
            Structured Products <span className="text-[#c8a97e]">Intelligence</span>
          </h1>
          <p className="text-sm text-zinc-500">
            Real-time signals across FCN, Autocallable, and Snowball instruments
          </p>
        </div>

        <StatsPanel stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <InsightsPanel
              todayInsights={insights.today}
              weekInsights={insights.week}
              monthInsights={insights.month}
              trends={insights.trends}
            />
          </div>
          <div className="lg:col-span-1">
            <HotKeywords keywords={hotKeywords} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

        <SignalFeed items={signals} onItemClick={handleItemClick} />
      </main>

      <ArticleDetail
        item={selectedItem}
        isOpen={detailOpen}
        onClose={handleDetailClose}
      />
    </>
  );
}
