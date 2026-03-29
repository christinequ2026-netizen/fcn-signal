'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#' },
    { label: 'Products', href: '#' },
    { label: 'Markets', href: '#' },
    { label: 'Research', href: '#' },
    { label: 'Risk', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-md">
      {/* Accent line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c8a97e]/60 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#c8a97e] text-xl font-light tracking-[0.15em]">FCN</span>
              <span className="hidden sm:block w-px h-5 bg-zinc-700" />
              <span className="hidden sm:block text-zinc-400 text-xs tracking-widest uppercase">Signal</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-[13px] text-zinc-400 hover:text-zinc-100 transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-live" />
              <span className="text-[11px] text-emerald-400 tracking-widest uppercase font-medium">Live</span>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isMobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
        )}>
          <div className="border-t border-zinc-800 pt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="h-px bg-zinc-800/80" />
    </header>
  );
}
