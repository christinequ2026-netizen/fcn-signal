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
    today: "Today",
    week: "Week",
    month: "Month",
    all: "All",
  };

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-[11px] text-[#c8a97e] tracking-widest uppercase font-medium">
            Signal Feed
          </h2>
          <span className="text-xs text-zinc-600">{filteredItems.length} results</span>
        </div>

        {/* Date Navigation */}
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <button
            onClick={handlePreviousDay}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-zinc-400 tabular-nums min-w-[7rem] text-center">{dateString}</span>
          <button
            onClick={handleNextDay}
            className={cn(
              "transition-colors",
              isToday ? "text-zinc-700 cursor-not-allowed" : "text-zinc-500 hover:text-zinc-300"
            )}
            disabled={isToday}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const info = CATEGORY_INFO[category];
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-3 py-1.5 rounded text-[12px] transition-all",
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                )}
              >
                {info.name}
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Time range + Sort */}
        <div className="flex items-center gap-1.5">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveTimeRange(range)}
              className={cn(
                "px-2.5 py-1.5 rounded text-[12px] transition-all",
                activeTimeRange === range
                  ? "bg-zinc-800 text-zinc-200"
                  : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              {timeRangeLabels[range]}
            </button>
          ))}

          <span className="w-px h-4 bg-zinc-800 mx-1" />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-transparent text-zinc-500 text-[12px] focus:outline-none cursor-pointer hover:text-zinc-300 transition-colors"
          >
            <option value="latest">Latest</option>
            <option value="hot">Popular</option>
          </select>
        </div>
      </div>

      {/* Signal list */}
      <div className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, i) => (
            <div key={item.id} className="fade-in" style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
              <SignalCard item={item} onClick={onItemClick} />
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm">No signals found for this filter</p>
            <p className="text-zinc-700 text-xs mt-1">Try adjusting your category or time range</p>
          </div>
        )}
      </div>
    </div>
  );
}
