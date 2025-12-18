"use client";

import { useState, useEffect } from "react";

export function TypewriterText({ text, speed = 100 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className="
      font-bold text-4xl md:text-6xl  /* Kích thước chữ */
      
      /* --- TẠO MÀU GRADIENT ĐỎ --- */
      bg-gradient-to-r from-red-700 via-red-500 to-orange-500
      bg-clip-text text-transparent
      
      /* Hiệu ứng nhấp nháy con trỏ (Option) */
      border-r-4 border-red-500 pr-2 animate-pulse
    ">
      {displayedText}
    </span>
  );
};