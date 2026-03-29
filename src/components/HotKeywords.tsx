'use client';

import { HotKeyword } from '@/types';
import { cn } from '@/lib/utils';

interface HotKeywordsProps {
  keywords: HotKeyword[];
}

export default function HotKeywords({ keywords }: HotKeywordsProps) {
  // Take only top 9 keywords
  const topKeywords = keywords.slice(0, 9);

  return (
    <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800/50 rounded-lg p-6 hover:border-gray-700/50 transition-colors">
      {/* Title */}
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
          本周热词 TOP 9
        </span>
      </h3>

      {/* Keywords List */}
      <div className="space-y-3">
        {topKeywords.map((item, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;
          const fontSize =
            rank === 1 ? 'text-lg' : rank === 2 ? 'text-base' : rank === 3 ? 'text-base' : 'text-sm';

          return (
            <div
              key={index}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg transition-all group',
                isTopThree
                  ? 'bg-gradient-to-r from-amber-950/40 to-amber-900/20 border border-amber-900/40 shadow-lg shadow-amber-900/20'
                  : 'hover:bg-gray-800/30'
              )}
            >
              {/* Rank */}
              <div
                className={cn(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                  isTopThree
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950'
                    : 'bg-gray-800 text-gray-400'
                )}
              >
                {rank}
              </div>

              {/* Keyword and Count */}
              <div className="flex-grow min-w-0">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span
                    className={cn(
                      'font-bold text-gray-200 truncate',
                      fontSize,
                      isTopThree && 'text-amber-300'
                    )}
                  >
                    {item.keyword}
                  </span>
                  <span className={cn('text-gray-500 flex-shrink-0', fontSize)}>
                    {item.count}次
                  </span>
                </div>
              </div>

              {/* Source Link */}
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex-shrink-0 text-sm font-medium transition-colors whitespace-nowrap',
                  'text-amber-400 hover:text-amber-300',
                  'group-hover:underline'
                )}
              >
                来源推文
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
