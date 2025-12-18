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
      font-bold text-4xl md:text-6xl
      bg-gradient-to-r from-red-700 via-red-500 to-pink-500
      bg-clip-text text-transparent
      border-r-4 border-red-500 pr-2 animate-pulse
    ">
      {displayedText}
    </span>
  );
};