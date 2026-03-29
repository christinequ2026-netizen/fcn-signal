import { Lang } from "@/context/LanguageContext";
import { Category } from "@/types";

const translations = {
  // Header nav
  "nav.overview": { en: "Overview", zh: "概览" },
  "nav.products": { en: "Products", zh: "产品" },
  "nav.markets": { en: "Markets", zh: "市场" },
  "nav.research": { en: "Research", zh: "研究" },
  "nav.risk": { en: "Risk", zh: "风控" },
  "header.live": { en: "Live", zh: "实时" },

  // Hero
  "hero.title.1": { en: "Structured Products", zh: "结构化产品" },
  "hero.title.2": { en: "Intelligence", zh: "情报中心" },
  "hero.subtitle": {
    en: "Real-time signals across FCN, Autocallable, and Snowball instruments",
    zh: "FCN · 雪球 · 自动赎回等结构化产品实时信号追踪",
  },

  // StatsPanel
  "stats.today": { en: "Today", zh: "今日" },
  "stats.week": { en: "This Week", zh: "本周" },
  "stats.month": { en: "This Month", zh: "本月" },
  "stats.total": { en: "Total Signals", zh: "信号总数" },

  // InsightsPanel
  "insights.title": { en: "Intelligence Brief", zh: "情报摘要" },
  "insights.today": { en: "Today", zh: "今日" },
  "insights.week": { en: "This Week", zh: "本周" },
  "insights.month": { en: "This Month", zh: "本月" },
  "insights.outlook": { en: "Outlook", zh: "趋势展望" },

  // HotKeywords
  "hot.title": { en: "Trending Topics", zh: "热门话题" },

  // SignalFeed
  "feed.title": { en: "Signal Feed", zh: "信号流" },
  "feed.results": { en: "results", zh: "条结果" },
  "feed.prev": { en: "← Prev", zh: "← 前一天" },
  "feed.next": { en: "Next →", zh: "后一天 →" },
  "feed.empty.title": { en: "No signals found for this filter", zh: "未找到符合条件的信号" },
  "feed.empty.subtitle": {
    en: "Try adjusting your category or time range",
    zh: "试试调整分类或时间范围",
  },

  // Time ranges
  "time.today": { en: "Today", zh: "今日" },
  "time.week": { en: "Week", zh: "本周" },
  "time.month": { en: "Month", zh: "本月" },
  "time.all": { en: "All", zh: "全部" },

  // Sort
  "sort.latest": { en: "Latest", zh: "最新" },
  "sort.popular": { en: "Popular", zh: "最热" },

  // SignalCard
  "card.likes": { en: "likes", zh: "赞" },
  "card.comments": { en: "comments", zh: "评论" },
  "card.shares": { en: "shares", zh: "转发" },
  "card.viewOriginal": { en: "View original", zh: "查看原文" },
  "card.hideOriginal": { en: "Hide original", zh: "收起原文" },

  // ArticleDetail
  "detail.back": { en: "← Back", zh: "← 返回" },
  "detail.original": { en: "Original", zh: "原文" },
  "detail.tags": { en: "Tags", zh: "标签" },
  "detail.likes": { en: "Likes", zh: "点赞" },
  "detail.comments": { en: "Comments", zh: "评论" },
  "detail.shares": { en: "Shares", zh: "转发" },
  "detail.viewSource": { en: "View Source →", zh: "查看原文 →" },
  "detail.xhsNotice": {
    en: "Xiaohongshu requires login to view original post",
    zh: "小红书网页版需登录查看原帖",
  },
  "detail.xhsHint": {
    en: "Search the title in the App to view full content",
    zh: "可在 App 中搜索标题查看完整内容",
  },

  // Footer
  "footer.subtitle": {
    en: "Structured Products Intelligence Platform",
    zh: "结构化产品情报平台",
  },
  "footer.rights": { en: "All rights reserved", zh: "版权所有" },
  "footer.disclaimer": {
    en: "Disclaimer: Content is for informational purposes only and does not constitute investment advice.",
    zh: "免责声明：本站内容仅供参考，不构成投资建议。投资有风险，入市需谨慎。",
  },
} as const;

// Category names bilingual
export const CATEGORY_NAMES: Record<Category, { en: string; zh: string }> = {
  all: { en: "All", zh: "全部" },
  product: { en: "Products", zh: "产品解读" },
  market: { en: "Markets", zh: "市场动态" },
  strategy: { en: "Strategy", zh: "投资策略" },
  risk: { en: "Risk", zh: "风险提示" },
  issuance: { en: "Issuance", zh: "发行信息" },
  opinion: { en: "Opinion", zh: "观点评论" },
  tutorial: { en: "Tutorial", zh: "学习教程" },
};

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}

export function categoryName(cat: Category, lang: Lang): string {
  return CATEGORY_NAMES[cat][lang];
}
