import { NextRequest, NextResponse } from "next/server";
import { mockSignals, mockStats, mockInsights, mockHotKeywords } from "@/data/mock";

/**
 * GET /api/signals
 *
 * 获取信号流数据
 * Query params:
 *   - category: 分类筛选 (product|market|strategy|risk|issuance|opinion|tutorial|all)
 *   - timeRange: 时间范围 (today|week|month|all)
 *   - sortBy: 排序方式 (latest|hot)
 *   - page: 页码 (default: 1)
 *   - limit: 每页数量 (default: 20)
 *
 * 当前使用 Mock 数据。
 * 生产环境中，这里将集成多个数据源的 RSS/API 抓取逻辑：
 *
 * 数据源架构（待实现）：
 * ┌──────────────────────────────────────────┐
 * │              数据聚合引擎                 │
 * ├──────────┬──────────┬───────────────────┤
 * │ 国内平台  │ 海外平台  │ 专业渠道           │
 * ├──────────┼──────────┼───────────────────┤
 * │ 微信公众号│ Twitter/X│ Bloomberg Terminal │
 * │ 小红书    │ YouTube  │ Reuters            │
 * │ 知乎     │          │ 私人银行网站         │
 * │ 微博     │          │ (汇丰/瑞银/高盛等)   │
 * │ 雪球     │          │ 东方财富             │
 * │          │          │ Wind资讯             │
 * └──────────┴──────────┴───────────────────┘
 *
 * 每个数据源适配器实现统一接口：
 * interface DataSourceAdapter {
 *   name: string;
 *   platform: Platform;
 *   fetch(): Promise<RawItem[]>;
 *   transform(raw: RawItem): SignalItem;
 *   getSchedule(): CronExpression;
 * }
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const timeRange = searchParams.get("timeRange") || "all";
  const sortBy = searchParams.get("sortBy") || "latest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  // Filter by category
  let filtered = category === "all"
    ? [...mockSignals]
    : mockSignals.filter((s) => s.category === category);

  // Filter by time range
  if (timeRange !== "all") {
    const now = new Date();
    const start = new Date();
    switch (timeRange) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week":
        start.setDate(now.getDate() - 7);
        break;
      case "month":
        start.setMonth(now.getMonth() - 1);
        break;
    }
    filtered = filtered.filter((s) => new Date(s.publishedAt) >= start);
  }

  // Sort
  if (sortBy === "latest") {
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } else {
    filtered.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
  }

  // Paginate
  const total = filtered.length;
  const startIdx = (page - 1) * limit;
  const items = filtered.slice(startIdx, startIdx + limit);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    stats: mockStats,
    insights: mockInsights,
    hotKeywords: mockHotKeywords,
  });
}
