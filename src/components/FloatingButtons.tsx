"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function FloatingButtons() {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <button
        onClick={scrollToTop}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          "bg-zinc-900/90 border border-zinc-700/50 text-zinc-400",
          "backdrop-blur-sm transition-all duration-300",
          "hover:border-[#c8a97e]/40 hover:text-[#c8a97e]",
          showTopButton
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Back to top"
      >
        <span className="text-sm">↑</span>
      </button>
    </div>
  );
}
