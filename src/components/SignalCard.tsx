"use client";

import { useState } from "react";
import { SignalItem, PLATFORM_INFO, CATEGORY_INFO } from "@/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";

interface SignalCardProps {
  item: SignalItem;
  onClick: (item: SignalItem) => void;
}

export default function SignalCard({ item, onClick }: SignalCardProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const platformInfo = PLATFORM_INFO[item.platform] || PLATFORM_INFO["other"];
  const categoryInfo = CATEGORY_INFO[item.category] || CATEGORY_INFO["all"];
  const timeAgo = formatDate(item.publishedAt);

  return (
    <article
      onClick={() => onClick(item)}
      className={cn(
        "cursor-pointer rounded-xl border border-gray-800 bg-gray-900/80 p-4 transition-all duration-300",
        "hover:border-amber-500/30 hover:-translate-y-1"
      )}
    >
      {/* Top Row: Platform, Category, Time */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Platform Badge */}
          <div
            className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `${platformInfo.color}20`,
              color: platformInfo.color,
            }}
          >
            <span>{platformInfo.icon}</span>
            <span>{platformInfo.name}</span>
          </div>

          {/* Category Badge */}
          <div className="rounded-lg bg-gray-800/50 px-2.5 py-1 text-xs font-medium text-gray-300">
            {categoryInfo.name}
          </div>
        </div>

        {/* Time Ago */}
        <span className="text-xs text-gray-500">{timeAgo}</span>
      </div>

      {/* Author Name */}
      <h3 className="mb-2 text-sm font-semibold text-gray-100">
        {item.author}
      </h3>

      {/* Summary Text */}
      <p className="mb-3 line-clamp-3 text-sm text-gray-300">
        {item.summary}
      </p>

      {/* Translation Toggle and Original Text */}
      {item.isTranslated && item.originalText && (
        <div className="mb-3 border-t border-gray-800 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOriginal(!showOriginal);
            }}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            查看英文原文{" "}
            <span
              className={cn(
                "transition-transform duration-200",
                showOriginal && "rotate-180"
              )}
            >
              ▾
            </span>
          </button>

          {showOriginal && (
            <p className="mt-2 line-clamp-3 text-xs text-gray-400">
              {item.originalText}
            </p>
          )}
        </div>
      )}

      {/* Bottom Row: Stats and Tags */}
      <div className="space-y-3">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            ❤️ {formatNumber(item.likes)}
          </span>
          <span className="flex items-center gap-1">
            💬 {formatNumber(item.comments)}
          </span>
          <span className="flex items-center gap-1">
            🔄 {formatNumber(item.shares)}
          </span>
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 px-2.5 py-1 text-xs font-medium text-amber-300 border border-amber-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
