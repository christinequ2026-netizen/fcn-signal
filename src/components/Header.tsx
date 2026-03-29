'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isBannerOpen, setIsBannerOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: '首页', href: '#' },
    { label: '产品', href: '#' },
    { label: '市场', href: '#' },
    { label: '策略', href: '#' },
    { label: '风险', href: '#' },
    { label: '关于', href: '#' },
  ];

  return (
    <header className="relative bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Top Banner */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isBannerOpen ? 'max-h-16' : 'max-h-0'
        )}
      >
        <div className="bg-gradient-to-r from-amber-950/20 to-amber-900/10 border-b border-amber-900/30 px-4 py-3">
          <p className="text-sm text-amber-200 font-medium text-center">
            FCN固定票息票据信号场 — 实时市场数据已上线
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm border-b border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <span className="text-slate-950 font-bold text-lg">F</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-amber-400">FCN 信号场</h1>
                <p className="text-xs text-amber-200/70">全球FCN资讯实时捕获</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-300 hover:text-amber-400 transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Live Indicator & Controls */}
            <div className="flex items-center gap-4">
              {/* Live Indicator */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-full border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-green-400">LIVE</span>
                </div>
              </div>

              {/* Collapse Banner Button */}
              <button
                onClick={() => setIsBannerOpen(!isBannerOpen)}
                className={cn(
                  'hidden sm:inline-flex p-2 rounded-lg transition-colors duration-200',
                  'text-slate-400 hover:text-amber-400 hover:bg-slate-800/50'
                )}
                aria-label="Toggle banner"
              >
                <span className={cn('inline-block transition-transform duration-300', !isBannerOpen && 'rotate-180')}>▲</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800/50 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
              isMobileMenuOpen ? 'max-h-64' : 'max-h-0'
            )}
          >
            <nav className="flex flex-col gap-2 py-3 border-t border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-300 hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
