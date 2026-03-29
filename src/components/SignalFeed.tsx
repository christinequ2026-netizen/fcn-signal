"use client";

import { useState } from "react";
import { SignalItem, Category, TimeRange, SortBy, CATEGORY_INFO } from "@/types";
import { cn, filterByTimeRange, filterByCategory, sortItems, getDateString } from "@/lib/utils";
import SignalCard from "./SignalCard";

interface SignalFeedProps {
  items: SignalItem[];
  onItemClick: (item: SignalItem) => void;
}

export default function SignalFeed({ items, onItemClick }: SignalFeedProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>("all");
  const [sortBy, setSortBy] = useState<SortBy>("latest");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const filteredItems = sortItems(
    filterByCategory(filterByTimeRange(items, activeTimeRange), activeCategory),
    sortBy
  );

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const dateString = getDateString(currentDate);
  const isToday = new Date().toDateString() === currentDate.toDateString();

  const categories: Category[] = [
    "all", "product", "market", "strategy", "risk", "issuance", "opinion", "tutorial",
  ];

  const timeRanges: TimeRange[] = ["today", "week", "month", "all"];
  const timeRangeLabels: Record<TimeRange, string> = {
    today: "今日",
    week: "本周",
    month: "本月",
    all: "全部",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white">
          信号流 · {dateString} {isToday ? "今日" : ""}{" "}
          <span className="text-amber-400">{filteredItems.length}</span> 条
        </h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const info = CATEGORY_INFO[category];
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              )}
            >
              {info.name}
            </button>
          );
        })}
      </div>

      {/* Time Filter + Sort + Date Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Time filters */}
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                activeTimeRange === range
                  ? "bg-amber-500 text-black"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {timeRangeLabels[range]}
            </button>
          ))}

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="ml-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="latest">按最新发布</option>
            <option value="hot">按热度排序</option>
          </select>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePreviousDay}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← 前一天
          </button>
          <span className="text-sm text-gray-300 font-medium min-w-[8rem] text-center">
            {dateString}
          </span>
          <button
            onClick={handleNextDay}
            className={cn(
              "text-sm transition-colors",
              isToday
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-400 hover:text-white"
            )}
            disabled={isToday}
          >
            后一天 →
          </button>
        </div>
      </div>

      {/* Signal List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <SignalCard key={item.id} item={item} onClick={onItemClick} />
          ))
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <p className="text-gray-500 text-lg">该分类暂无内容</p>
            <p className="text-gray-600 text-sm mt-2">试试切换其他分类或时间范围</p>
          </div>
        )}
      </div>
    </div>
  );
}
