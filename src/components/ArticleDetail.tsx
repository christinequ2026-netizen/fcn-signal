"use client";

import { SignalItem, PLATFORM_INFO, CATEGORY_INFO } from "@/types";
import { cn, formatDate, formatNumber } from "@/lib/utils";

interface ArticleDetailProps {
  item: SignalItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleDetail({ item, isOpen, onClose }: ArticleDetailProps) {
  if (!item) return null;

  const platformInfo = PLATFORM_INFO[item.platform] || PLATFORM_INFO["other"];
  const categoryInfo = CATEGORY_INFO[item.category] || CATEGORY_INFO["all"];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-over Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:max-w-lg bg-gray-950 border-l border-gray-800 z-50",
          "transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-lg">←</span>
            <span className="text-sm">返回</span>
          </button>

          {/* Platform and Category Badges */}
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: platformInfo?.color || "#6B7280" }}
            >
              <span>{platformInfo?.icon}</span>
              {platformInfo?.name || item.platform}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
              <span>{categoryInfo?.icon}</span>
              {categoryInfo?.name || item.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-white leading-tight">{item.title}</h2>

          {/* Author and Time */}
          <div className="flex items-center gap-3 py-2 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: platformInfo?.color || "#6B7280" }}>
                {item.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.author}</p>
                <p className="text-xs text-gray-400">{formatDate(item.publishedAt)}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {item.content || item.summary}
          </div>

          {/* Xiaohongshu App Notice */}
          {item.platform === "xiaohongshu" && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <span className="text-lg mt-0.5">📕</span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-rose-300">小红书内容已内嵌展示</p>
                <p className="text-xs text-gray-400">小红书网页版需要扫码登录才能查看原帖。如需查看评论区互动，可在小红书 App 中搜索帖子标题。</p>
              </div>
            </div>
          )}

          {/* Original Text Section (if translated) */}
          {item.isTranslated && item.originalText && (
            <div className="space-y-3 border-t border-gray-800 pt-6">
              <h3 className="text-sm font-semibold text-amber-400">英文原文</h3>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap italic">
                {item.originalText}
              </p>
            </div>
          )}

          {/* Tags Section */}
          {item.tags && item.tags.length > 0 && (
            <div className="space-y-3 border-t border-gray-800 pt-6">
              <h3 className="text-sm font-semibold text-gray-300">标签</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="space-y-3 border-t border-gray-800 pt-6">
            <h3 className="text-sm font-semibold text-gray-300">互动数据</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-900">
                <p className="text-lg font-semibold text-white">
                  {formatNumber(item.likes)}
                </p>
                <p className="text-xs text-gray-400">❤️ 赞</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-900">
                <p className="text-lg font-semibold text-white">
                  {formatNumber(item.comments)}
                </p>
                <p className="text-xs text-gray-400">💬 评论</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-900">
                <p className="text-lg font-semibold text-white">
                  {formatNumber(item.shares)}
                </p>
                <p className="text-xs text-gray-400">🔄 分享</p>
              </div>
            </div>
          </div>

          {/* Video Button (if present) */}
          {item.videoUrl && (
            <a
              href={item.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-center"
            >
              ▶️ 播放视频
            </a>
          )}

          {/* View Original Button */}
          {item.platform === "xiaohongshu" ? (
            <div className="space-y-2">
              <a
                href={item.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg transition-colors text-center"
              >
                📕 在小红书中打开（需登录）
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(item.title);
                }}
                className="block w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors text-center cursor-pointer"
              >
                📋 复制标题到小红书搜索
              </button>
            </div>
          ) : (
            <a
              href={item.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors text-center"
            >
              查看原文 →
            </a>
          )}
        </div>
      </div>
    </>
  );
}
