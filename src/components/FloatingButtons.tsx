"use client";

import { useState, useEffect } from "react";

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

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 border border-gray-700 text-amber-400 shadow-lg transition-all duration-300 hover:border-amber-500 hover:bg-gray-800 hover:shadow-amber-500/20"
          title="回到顶部"
        >
          <span className="text-lg transition-transform group-hover:-translate-y-0.5">↑</span>
        </button>
      )}
      <button
        onClick={scrollToBottom}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 border border-gray-700 text-amber-400 shadow-lg transition-all duration-300 hover:border-amber-500 hover:bg-gray-800 hover:shadow-amber-500/20"
        title="去到底部"
      >
        <span className="text-lg transition-transform group-hover:translate-y-0.5">↓</span>
      </button>
    </div>
  );
}
