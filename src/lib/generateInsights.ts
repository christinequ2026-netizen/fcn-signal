import { SignalItem, InsightItem, HotKeyword, Category } from "@/types";

/**
 * 从实际信号数据中动态生成情报摘要
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
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

  const todaySignals = signals.filter(s => s.publishedAt?.startsWith(todayStr));
  const weekSignals = signals.filter(s => s.publishedAt && s.publishedAt >= oneWeekAgo);
  const monthSignals = signals.filter(s => s.publishedAt && s.publishedAt >= oneMonthAgo);

  function extractInsights(items: SignalItem[], max: number): InsightItem[] {
    const sorted = [...items].sort((a, b) => {
      const engA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
      const engB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
      if (engA !== engB) return engB - engA;
      return (b.publishedAt || "").localeCompare(a.publishedAt || "");
    });

    return sorted.slice(0, max).map((s, i) => {
      const source = s.author && s.author !== s.platform ? s.author : "";
      const prefix = source ? `${source}：` : "";
      const text = `${prefix}${s.title}`;
      return { id: `insight-${s.id}-${i}`, text };
    });
  }

  // ===== 趋势展望：基于数据分析生成概括性洞察 =====
  function generateTrends(all: SignalItem[]): InsightItem[] {
    const trends: InsightItem[] = [];
    let trendId = 0;

    // --- 1. 分类热度变化趋势 ---
    const recentMonth = all.filter(s => s.publishedAt && s.publishedAt >= oneMonthAgo);
    const prevMonth = all.filter(
      s => s.publishedAt && s.publishedAt >= twoMonthsAgo && s.publishedAt < oneMonthAgo
    );

    const catCount = (items: SignalItem[]) => {
      const counts: Partial<Record<Category, number>> = {};
      for (const s of items) {
        counts[s.category] = (counts[s.category] || 0) + 1;
      }
      return counts;
    };

    const recentCats = catCount(recentMonth);
    const prevCats = catCount(prevMonth);

    // 找到增长最快的分类
    const catNames: Record<string, string> = {
      product: "产品解读", market: "市场动态", strategy: "投资策略",
      risk: "风险提示", issuance: "发行信息", opinion: "观点评论", tutorial: "学习教程",
    };

    let maxGrowthCat = "";
    let maxGrowthRatio = 0;
    for (const cat of Object.keys(catNames)) {
      const recent = recentCats[cat as Category] || 0;
      const prev = prevCats[cat as Category] || 1;
      const ratio = recent / prev;
      if (ratio > maxGrowthRatio && recent >= 3) {
        maxGrowthRatio = ratio;
        maxGrowthCat = cat;
      }
    }

    if (maxGrowthCat && maxGrowthRatio > 1.0) {
      const count = recentCats[maxGrowthCat as Category] || 0;
      trends.push({
        id: `trend-${trendId++}`,
        text: `近期「${catNames[maxGrowthCat]}」类信号活跃（${count}条），关注度持续攀升。`,
      });
    }

    // --- 2. 平台覆盖广度 ---
    const platformSet = new Set(recentMonth.map(s => s.platform));
    const platformCount = platformSet.size;
    if (platformCount >= 4) {
      trends.push({
        id: `trend-${trendId++}`,
        text: `FCN话题已覆盖${platformCount}个平台，从专业机构到社交媒体的传播链条正在形成。`,
      });
    }

    // --- 3. 关键词趋势分析 ---
    const kwPatterns: { pattern: RegExp; label: string; insight: string }[] = [
      {
        pattern: /雪球|snowball/i,
        label: "雪球",
        insight: "雪球类产品讨论热度居高不下，投资者对敲入风险和到期转化的关注持续。",
      },
      {
        pattern: /敲入|knock.?in/i,
        label: "敲入",
        insight: "敲入风险成为高频议题，市场震荡期投资者风险意识明显增强。",
      },
      {
        pattern: /收益凭证/,
        label: "收益凭证",
        insight: "券商收益凭证作为FCN的境内替代产品，散户关注度持续上升。",
      },
      {
        pattern: /私行|private.?bank|wealth/i,
        label: "私行",
        insight: "私人银行渠道FCN产品策略分化，保守型与进取型客户画像日趋清晰。",
      },
      {
        pattern: /小红书|xiaohongshu/i,
        label: "小红书",
        insight: "FCN科普内容在社交平台快速传播，结构化产品认知正从专业圈层向大众渗透。",
      },
      {
        pattern: /autocallable|自动赎回/i,
        label: "自动赎回",
        insight: "Autocallable结构持续主导亚太市场发行，标准化产品占比进一步提高。",
      },
    ];

    // 统计关键词命中频率（用全量数据，因为近期数据量可能较少）
    const allText = all.map(s => `${s.title} ${s.summary} ${(s.tags || []).join(" ")}`).join(" ");
    for (const kp of kwPatterns) {
      const matches = allText.match(new RegExp(kp.pattern, "gi"));
      if (matches && matches.length >= 3 && trends.length < 5) {
        trends.push({
          id: `trend-${trendId++}`,
          text: kp.insight,
        });
      }
    }

    // --- 4. 英文内容占比（国际化趋势）---
    const enCount = recentMonth.filter(s => /^[A-Za-z]/.test(s.title)).length;
    const enRatio = recentMonth.length > 0 ? enCount / recentMonth.length : 0;
    if (enRatio > 0.15 && trends.length < 5) {
      trends.push({
        id: `trend-${trendId++}`,
        text: `英文内容占比${Math.round(enRatio * 100)}%，海外机构对亚太结构化产品市场的研究与报道正在加速。`,
      });
    }

    // --- 5. 高互动内容特征 ---
    const highEng = all
      .filter(s => (s.likes || 0) + (s.comments || 0) + (s.shares || 0) > 50)
      .length;
    if (highEng >= 2 && trends.length < 5) {
      trends.push({
        id: `trend-${trendId++}`,
        text: `${highEng}篇文章互动量突出，高质量内容集中在产品科普和风险揭示两大方向。`,
      });
    }

    // 兜底：如果趋势不足3条，补充通用洞察
    if (trends.length < 3) {
      const totalRecent = recentMonth.length;
      const totalAll = all.length;
      if (totalRecent > 0) {
        trends.push({
          id: `trend-${trendId++}`,
          text: `近30天收录${totalRecent}条信号（总计${totalAll}条），FCN领域信息流保持活跃。`,
        });
      }
    }

    return trends.slice(0, 5);
  }

  return {
    today: extractInsights(todaySignals, 3),
    week: extractInsights(weekSignals, 3),
    month: extractInsights(monthSignals, 3),
    trends: generateTrends(signals),
  };
}

/**
 * 从实际信号数据中动态生成热门关键词
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
      if (s.originalUrl) {
        tagCount[key].url = s.originalUrl;
      }
    }
  }

  // 从标题中提取高频 FCN 核心词补充
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

  const sorted = Object.entries(tagCount)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12);

  return sorted.map(([keyword, info]) => ({
    keyword,
    count: info.count,
    sourceUrl: info.url,
  }));
}
