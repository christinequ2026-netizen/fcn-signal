import { SignalItem, InsightItem, HotKeyword } from "@/types";

/**
 * 从实际信号数据中动态生成情报摘要
 * 每个时间段取最相关的文章标题作为摘要
 */
export function generateInsights(signals: SignalItem[]): {
  today: InsightItem[];
  week: InsightItem[];
  month: InsightItem[];
  trends: InsightItem[];
} {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  // 按时间段分组
  const todaySignals = signals.filter(s => s.publishedAt?.startsWith(todayStr));
  const weekSignals = signals.filter(s => s.publishedAt && s.publishedAt >= oneWeekAgo);
  const monthSignals = signals.filter(s => s.publishedAt && s.publishedAt >= oneMonthAgo);

  // 从信号中提取摘要文本
  function extractInsights(items: SignalItem[], max: number): InsightItem[] {
    // 按互动量排序（有互动的优先），否则按时间
    const sorted = [...items].sort((a, b) => {
      const engA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
      const engB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
      if (engA !== engB) return engB - engA;
      return (b.publishedAt || "").localeCompare(a.publishedAt || "");
    });

    return sorted.slice(0, max).map((s, i) => {
      // 生成简洁的摘要文本：来源 + 标题核心
      const source = s.author && s.author !== s.platform ? s.author : "";
      const prefix = source ? `${source}：` : "";
      const text = `${prefix}${s.title}`;
      return { id: `insight-${s.id}-${i}`, text };
    });
  }

  // 趋势：从全部数据中选互动最高的文章（代表持续关注的话题）
  function extractTrends(items: SignalItem[]): InsightItem[] {
    const sorted = [...items].sort((a, b) => {
      const engA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
      const engB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
      return engB - engA;
    });
    // 取互动量最高的，且和 today/week 不完全重复
    return sorted.slice(0, 5).map((s, i) => ({
      id: `trend-${s.id}-${i}`,
      text: s.title,
    }));
  }

  return {
    today: extractInsights(todaySignals, 3),
    week: extractInsights(weekSignals, 3),
    month: extractInsights(monthSignals, 3),
    trends: extractTrends(signals),
  };
}

/**
 * 从实际信号数据中动态生成热门关键词
 * 统计所有文章 tags 的出现频率
 */
export function generateHotKeywords(signals: SignalItem[]): HotKeyword[] {
  const tagCount: Record<string, { count: number; url: string }> = {};

  for (const s of signals) {
    if (!s.tags) continue;
    for (const tag of s.tags) {
      const key = tag.trim();
      if (!key || key === "预过滤" || key.length < 2) continue;
      if (!tagCount[key]) {
        tagCount[key] = { count: 0, url: s.originalUrl || "" };
      }
      tagCount[key].count++;
      // 保留最近的 URL
      if (s.originalUrl) {
        tagCount[key].url = s.originalUrl;
      }
    }
  }

  // 如果 tags 太少，从标题中提取高频关键词补充
  const fcnKeywords = [
    "FCN", "固定票息", "雪球", "敲入", "敲出", "结构化产品", "收益凭证",
    "autocallable", "knock-in", "knock-out", "barrier", "structured product",
    "场外期权", "私人银行", "看跌期权", "波动率", "票息",
    "Worst-of", "ELN", "DCI", "挂钩票据",
  ];

  for (const s of signals) {
    const text = `${s.title} ${s.summary}`.toLowerCase();
    for (const kw of fcnKeywords) {
      if (text.includes(kw.toLowerCase())) {
        if (!tagCount[kw]) {
          tagCount[kw] = { count: 0, url: s.originalUrl || "" };
        }
        tagCount[kw].count++;
      }
    }
  }

  // 排序并取前12
  const sorted = Object.entries(tagCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12);

  return sorted.map(([keyword, info]) => ({
    keyword,
    count: info.count,
    sourceUrl: info.url,
  }));
}
