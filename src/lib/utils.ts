import { SignalItem, TimeRange, Category, SortBy } from "@/types";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, "0");
  const min = date.getMinutes().toString().padStart(2, "0");
  return `${month}月${day}日 ${hour}:${min}`;
}

export function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

export function filterByTimeRange(items: SignalItem[], range: TimeRange): SignalItem[] {
  if (range === "all") return items;

  const now = new Date();
  const start = new Date();

  switch (range) {
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

  return items.filter((item) => new Date(item.publishedAt) >= start);
}

export function filterByCategory(items: SignalItem[], category: Category): SignalItem[] {
  if (category === "all") return items;
  return items.filter((item) => item.category === category);
}

export function sortItems(items: SignalItem[], sortBy: SortBy): SignalItem[] {
  const sorted = [...items];
  if (sortBy === "latest") {
    sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } else {
    sorted.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
  }
  return sorted;
}

export function getDateString(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
