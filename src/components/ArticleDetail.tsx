"use client";

import { SignalItem, PLATFORM_INFO } from "@/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { t, categoryName } from "@/i18n/translations";

interface ArticleDetailProps {
  item: SignalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleDetail({ item, isOpen, onClose }: ArticleDetailProps) {
  const { lang } = useLanguage();
  if (!item) return null;

  const platformInfo = PLATFORM_INFO[item.platform] || PLATFORM_INFO["other"];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:max-w-xl bg-[#0c0c0e] border-l border-zinc-800/60 z-50",
          "transform transition-transform duration-300 ease-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-8 space-y-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm flex items-center gap-2"
          >
            {t("detail.back", lang)}
          </button>

          {/* Meta badges */}
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-medium px-2.5 py-1 rounded"
              style={{ color: platformInfo.color, backgroundColor: `${platformInfo.color}15` }}
            >
              {platformInfo.icon} {platformInfo.name}
            </span>
            <span className="text-[11px] text-zinc-500 px-2.5 py-1 rounded bg-zinc-800/50">
              {categoryName(item.category, lang)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-medium text-zinc-100 leading-snug tracking-tight">
            {item.title}
          </h2>

          {/* Author & time */}
          <div className="flex items-center gap-3 py-3 border-y border-zinc-800/50">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-zinc-100"
              style={{ backgroundColor: `${platformInfo.color}30` }}
            >
              {item.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-zinc-300">{item.author}</p>
              <p className="text-[11px] text-zinc-600">{formatDate(item.publishedAt)}</p>
            </div>
          </div>

          {/* Content */}
          <div className="text-[14px] text-zinc-400 leading-[1.8] whitespace-pre-wrap">
            {item.content || item.summary}
          </div>

          {/* Xiaohongshu notice */}
          {item.platform === "xiaohongshu" && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/5 border border-rose-500/10">
              <span className="text-sm mt-0.5">📕</span>
              <div>
                <p className="text-xs text-rose-300/80">{t("detail.xhsNotice", lang)}</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">{t("detail.xhsHint", lang)}</p>
              </div>
            </div>
          )}

          {/* Original text */}
          {item.isTranslated && item.originalText && (
            <div className="space-y-2 border-t border-zinc-800/50 pt-5">
              <h3 className="text-[11px] text-[#c8a97e] tracking-widest uppercase">
                {t("detail.original", lang)}
              </h3>
              <p className="text-[13px] text-zinc-600 leading-relaxed italic">
                {item.originalText}
              </p>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-2 border-t border-zinc-800/50 pt-5">
              <h3 className="text-[11px] text-zinc-600 tracking-widest uppercase">
                {t("detail.tags", lang)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-zinc-500 bg-zinc-800/60 px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {(item.likes > 0 || item.comments > 0 || item.shares > 0) && (
            <div className="grid grid-cols-3 gap-3 border-t border-zinc-800/50 pt-5">
              <div className="text-center py-3 rounded bg-zinc-900/50">
                <p className="text-lg font-light text-zinc-200">{formatNumber(item.likes)}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">
                  {t("detail.likes", lang)}
                </p>
              </div>
              <div className="text-center py-3 rounded bg-zinc-900/50">
                <p className="text-lg font-light text-zinc-200">{formatNumber(item.comments)}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">
                  {t("detail.comments", lang)}
                </p>
              </div>
              <div className="text-center py-3 rounded bg-zinc-900/50">
                <p className="text-lg font-light text-zinc-200">{formatNumber(item.shares)}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">
                  {t("detail.shares", lang)}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <a
            href={item.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium rounded-lg transition-colors text-center mt-4"
          >
            {t("detail.viewSource", lang)}
          </a>
        </div>
      </div>
    </>
  );
}
