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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
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
