'use client';

import { InsightItem } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/i18n/translations';

interface InsightsPanelProps {
  todayInsights: InsightItem[];
  weekInsights: InsightItem[];
  monthInsights: InsightItem[];
  trends: InsightItem[];
}

const InsightSection = ({
  title,
  items,
}: {
  title: string;
  items: InsightItem[];
}) => (
  <div className="space-y-3">
    <h3 className="text-[11px] text-zinc-500 tracking-widest uppercase font-medium">
      {title}
    </h3>
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 group"
        >
          <span className="flex-shrink-0 w-1 h-1 bg-[#c8a97e]/60 rounded-full mt-2" />
          <span className="text-[13px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function InsightsPanel({
  todayInsights,
  weekInsights,
  monthInsights,
  trends,
}: InsightsPanelProps) {
  const { lang } = useLanguage();

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-6">
      <h2 className="text-[11px] text-[#c8a97e] tracking-widest uppercase font-medium mb-6">
        {t("insights.title", lang)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InsightSection title={t("insights.today", lang)} items={todayInsights} />
        <InsightSection title={t("insights.week", lang)} items={weekInsights} />
        <InsightSection title={t("insights.month", lang)} items={monthInsights} />
        <InsightSection title={t("insights.outlook", lang)} items={trends} />
      </div>
    </div>
  );
}
