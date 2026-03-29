"use client";

import { useState } from "react";
import { SignalItem, PLATFORM_INFO, CATEGORY_INFO } from "@/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { t, categoryName } from "@/i18n/translations";

interface SignalCardProps {
  item: SignalItem;
  onClick: (item: SignalItem) => void;
}

export default function SignalCard({ item, onClick }: SignalCardProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const { lang } = useLanguage();

  const platformInfo = PLATFORM_INFO[item.platform] || PLATFORM_INFO["other"];
  const timeAgo = formatDate(item.publishedAt);

  return (
    <article
      onClick={() => onClick(item)}
      className={cn(
        "cursor-pointer rounded-lg border border-zinc-800/40 bg-zinc-900/20 px-5 py-4 transition-all duration-200",
        "hover:bg-zinc-900/60 hover:border-zinc-700/60"
      )}
    >
      {/* Top row: meta */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Platform */}
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded"
            style={{
              color: platformInfo.color,
              backgroundColor: `${platformInfo.color}12`,
            }}
          >
            {platformInfo.name}
          </span>

          {/* Category */}
          <span className="text-[11px] text-zinc-600">
            {categoryName(item.category, lang)}
          </span>
        </div>

        {/* Time */}
        <span className="text-[11px] text-zinc-600 tabular-nums flex-shrink-0">{timeAgo}</span>
      </div>

      {/* Author */}
      <p className="text-[12px] text-zinc-500 mb-1">{item.author}</p>

      {/* Title */}
      <h3 className="text-[14px] font-medium text-zinc-200 leading-snug mb-1.5 line-clamp-2">
        {item.title}
      </h3>

      {/* Summary */}
      {item.summary && item.summary !== item.title && (
        <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 mb-3">
          {item.summary}
        </p>
      )}

      {/* Translation toggle */}
      {item.isTranslated && item.originalText && (
        <div className="mb-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowOriginal(!showOriginal);
            }}
            className="text-[11px] text-[#c8a97e]/80 hover:text-[#c8a97e] transition-colors"
          >
            {showOriginal ? t("card.hideOriginal", lang) : t("card.viewOriginal", lang)} {showOriginal ? "↑" : "↓"}
          </button>
          {showOriginal && (
            <p className="mt-2 text-[12px] text-zinc-600 leading-relaxed italic line-clamp-3">
              {item.originalText}
            </p>
          )}
        </div>
      )}

      {/* Bottom row: engagement + tags */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-[11px] text-zinc-600">
          {item.likes > 0 && <span>{formatNumber(item.likes)} {t("card.likes", lang)}</span>}
          {item.comments > 0 && <span>{formatNumber(item.comments)} {t("card.comments", lang)}</span>}
          {item.shares > 0 && <span>{formatNumber(item.shares)} {t("card.shares", lang)}</span>}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1.5 overflow-hidden">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded truncate max-w-[100px]"
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
