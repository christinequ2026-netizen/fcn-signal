"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/i18n/translations";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-zinc-800/40 mt-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <p className="text-[11px] text-[#c8a97e] tracking-[0.25em] uppercase font-medium">
              FCN | Signal
            </p>
            <p className="text-[12px] text-zinc-600">
              {t("footer.subtitle", lang)}
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">WeChat</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Zhihu</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Xueqiu</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Twitter</a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-800/40 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-700">
            &copy; 2026 FCN Signal &middot; {t("footer.rights", lang)}
          </p>
          <p className="text-[11px] text-zinc-700 max-w-md leading-relaxed">
            {t("footer.disclaimer", lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
