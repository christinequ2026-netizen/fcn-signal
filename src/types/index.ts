// ====== 平台来源 ======
export type Platform =
  | "wechat"       // 微信公众号
  | "xiaohongshu"  // 小红书
  | "zhihu"        // 知乎
  | "weibo"        // 微博
  | "twitter"      // Twitter/X
  | "youtube"      // YouTube
  | "xueqiu"       // 雪球
  | "eastmoney"    // 东方财富
  | "private_bank" // 私人银行
  | "bloomberg"    // Bloomberg
  | "reuters"      // Reuters
  | "bilibili"     // B站
  | "news"         // 新闻资讯 (Google News等)
  | "other";       // 其他渠道

// ====== 内容分类 ======
export type Category =
  | "all"
  | "product"     // 产品解读
  | "market"      // 市场动态
  | "strategy"    // 投资策略
  | "risk"        // 风险提示
  | "issuance"    // 发行信息
  | "opinion"     // 观点评论
  | "tutorial";   // 学习教程

// ====== 时间范围 ======
export type TimeRange = "today" | "week" | "month" | "all";

// ====== 排序方式 ======
export type SortBy = "latest" | "hot";

// ====== 文章/信号条目 ======
export interface SignalItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  author: string;
  authorAvatar?: string;
  platform: Platform;
  category: Category;
  originalUrl: string;
  imageUrl?: string;
  videoUrl?: string;
  publishedAt: string; // ISO date string
  likes: number;
  comments: number;
  shares: number;
  isTranslated?: boolean;
  originalText?: string;
  tags: string[];
}

// ====== 洞察条目 ======
export interface InsightItem {
  id: string;
  text: string;
  sourceId?: string;
}

// ====== 热词条目 ======
export interface HotKeyword {
  keyword: string;
  count: number;
  sourceUrl: string;
}

// ====== 统计数据 ======
export interface Stats {
  today: number;
  week: number;
  month: number;
  total: number;
}

// ====== 平台显示信息 ======
export const PLATFORM_INFO: Record<Platform, { name: string; icon: string; color: string }> = {
  wechat:       { name: "微信公众号", icon: "💬", color: "#07C160" },
  xiaohongshu:  { name: "小红书",     icon: "📕", color: "#FE2C55" },
  zhihu:        { name: "知乎",       icon: "🔵", color: "#0066FF" },
  weibo:        { name: "微博",       icon: "🔴", color: "#E6162D" },
  twitter:      { name: "Twitter/X",  icon: "𝕏",  color: "#000000" },
  youtube:      { name: "YouTube",    icon: "▶️", color: "#FF0000" },
  xueqiu:       { name: "雪球",       icon: "⛷️", color: "#1DA1F2" },
  eastmoney:    { name: "东方财富",   icon: "📈", color: "#E74C3C" },
  private_bank: { name: "私人银行",   icon: "🏦", color: "#2C3E50" },
  bloomberg:    { name: "Bloomberg",  icon: "🅱️", color: "#472A91" },
  reuters:      { name: "Reuters",    icon: "📰", color: "#FF8000" },
  bilibili:     { name: "B站",        icon: "📺", color: "#00A1D6" },
  news:         { name: "新闻资讯",   icon: "📰", color: "#4A90D9" },
  other:        { name: "其他",       icon: "🌐", color: "#95A5A6" },
};

// ====== 分类显示信息 ======
export const CATEGORY_INFO: Record<Category, { name: string; icon: string }> = {
  all:       { name: "全部",     icon: "📋" },
  product:   { name: "产品解读", icon: "🔍" },
  market:    { name: "市场动态", icon: "📊" },
  strategy:  { name: "投资策略", icon: "💡" },
  risk:      { name: "风险提示", icon: "⚠️" },
  issuance:  { name: "发行信息", icon: "📄" },
  opinion:   { name: "观点评论", icon: "💭" },
  tutorial:  { name: "学习教程", icon: "📚" },
};
