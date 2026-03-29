'use client';

import { InsightItem } from '@/types';
import { cn } from '@/lib/utils';

interface InsightsPanelProps {
  todayInsights: InsightItem[];
  weekInsights: InsightItem[];
  monthInsights: InsightItem[];
  trends: InsightItem[];
}

const InsightSection = ({
  title,
  emoji,
  items,
}: {
  title: string;
  emoji: string;
  items: InsightItem[];
}) => (
  <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-lg p-6 hover:border-gray-700/50 transition-colors">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <span className="text-2xl">{emoji}</span>
      <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
        {title}
      </span>
    </h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3 group cursor-pointer hover:pl-1 transition-all"
        >
          <span className="flex-shrink-0 w-2 h-2 bg-amber-400 rounded-full mt-2 group-hover:bg-yellow-400 transition-colors" />
          <span className="text-gray-300 group-hover:text-gray-100 transition-colors text-sm">
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default function InsightsPanel({
  todayInsights,
  weekInsights,
  monthInsights,
  trends,
}: InsightsPanelProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightSection
          title="今日洞察"
          emoji="⚡"
          items={todayInsights}
        />
        <InsightSection
          title="本周洞察"
          emoji="📊"
          items={weekInsights}
        />
        <InsightSection
          title="本月洞察"
          emoji="📅"
          items={monthInsights}
        />
        <InsightSection
          title="趋势预判"
          emoji="🚀"
          items={trends}
        />
      </div>
    </div>
  );
}
