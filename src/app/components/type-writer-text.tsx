"use client";

import { useState, useEffect } from "react";

interface TypewriterTextProps {
  lines: string[];
  speed?: number;
}

export function TypewriterText({ lines, speed = 100 }: TypewriterTextProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>(lines.map(() => ""));
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);

  useEffect(() => {
    if (activeLineIndex >= lines.length) return;

    const currentLineOriginal = lines[activeLineIndex];

    if (currentMapIndex < currentLineOriginal.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[activeLineIndex] = currentLineOriginal.slice(0, currentMapIndex + 1);
          return newLines;
        });
        setCurrentMapIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setActiveLineIndex((prev) => prev + 1);
        setCurrentMapIndex(0);
      }, 500); 
      return () => clearTimeout(timeout);
    }
  }, [activeLineIndex, currentMapIndex, lines, speed]);

  // Style chung cho cả bản hiển thị và bản "giữ chỗ" để đảm bảo khớp khít
  const getLineStyles = (index: number) => `
    block font-bold text-4xl md:text-6xl leading-tight
    ${index === 0 ? "text-white" : "bg-gradient-to-r from-red-700 via-red-300 to-pink-500 bg-clip-text text-transparent"}
  `;

  return (
    <div className="relative">
      <div className="flex flex-col items-center text-center invisible select-none">
        {lines.map((line, index) => (
          <span 
            key={index} 
            className={`${getLineStyles(index)} border-r-4 border-transparent pr-2`} // Thêm border trong suốt để kích thước y hệt bản chính
          >
            {line}
          </span>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center text-center">
        {lines.map((line, index) => {
          const isCursorVisible = 
              index === activeLineIndex && 
              displayedLines[index].length < lines[index].length || 
              (index === activeLineIndex && index === lines.length - 1);

          return (
            <span
              key={index}
              className={`
                ${getLineStyles(index)}
                ${isCursorVisible ? "border-r-4 border-red-500 pr-2 animate-pulse" : "border-r-4 border-transparent pr-2"}
              `}
            >
              {displayedLines[index]}
            </span>
          );
        })}
      </div>
    </div>
  );
}