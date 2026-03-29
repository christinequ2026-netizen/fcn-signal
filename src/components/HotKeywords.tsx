'use client';

import { HotKeyword } from '@/types';
import { cn } from '@/lib/utils';

interface HotKeywordsProps {
  keywords: HotKeyword[];
}

export default function HotKeywords({ keywords }: HotKeywordsProps) {
  const topKeywords = keywords.slice(0, 9);

  return (
    <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-6 h-full">
      <h2 className="text-[11px] text-[#c8a97e] tracking-widest uppercase font-medium mb-6">
        Trending Topics
      </h2>

      <div className="space-y-1">
        {topKeywords.map((item, index) => {
          const rank = index + 1;
          const isTop = rank <= 3;

          return (
            <a
              key={index}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group',
                'hover:bg-zinc-800/50'
              )}
            >
              <span className={cn(
                'flex-shrink-0 w-5 text-[13px] font-medium tabular-nums',
                isTop ? 'text-[#c8a97e]' : 'text-zinc-600'
              )}>
                {rank}
              </span>

              <span className={cn(
                'flex-grow text-[13px] truncate',
                isTop ? 'text-zinc-200' : 'text-zinc-400'
              )}>
                {item.keyword}
              </span>

              <span className="flex-shrink-0 text-[11px] text-zinc-600 tabular-nums">
                {item.count}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
