import { useMemo } from "react";
import type { HANDS, Breakpoint } from "../types/game";

export const useGameStyles = (breakpoint: Breakpoint) => {
  const getResultStyles = useMemo(() => {
    return (result: string, gameWinner: string) => {
      const baseStyles =
        breakpoint === "mobile"
          ? "text-sm font-pixeboy text-center px-2 py-2 rounded min-w-[120px]"
          : breakpoint === "tablet"
            ? "text-lg font-pixeboy text-center px-3 py-2 rounded min-w-[180px]"
            : "text-lg sm:text-xl md:text-2xl lg:text-3xl font-pixeboy text-center px-2 sm:px-4 py-2 rounded min-w-[150px] sm:min-w-[200px] md:min-w-[250px]";

      if (gameWinner) {
        return `${baseStyles} bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse`;
      }
      if (result === "You Win!") {
        return `${baseStyles} bg-green-500 text-white`;
      }
      if (result === "CPU Wins!") {
        return `${baseStyles} bg-red-500 text-white`;
      }
      if (result) {
        return `${baseStyles} bg-yellow-500 text-white`;
      }
      return `${baseStyles} text-white`;
    };
  }, [breakpoint]);

  const getHandSelectionStyles = useMemo(() => {
    return (_hand: HANDS, isSelected: boolean, isFocused: boolean = false) => {
      const sizeClasses =
        breakpoint === "mobile"
          ? "w-16 h-16"
          : breakpoint === "tablet"
            ? "w-24 h-24"
            : "w-24 h-24 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-24 lg:h-24";

      const baseStyles = `card ${sizeClasses} flex items-center justify-center cursor-pointer transition-all duration-200`;

      let selectionStyles = "";
      if (isSelected && isFocused) {
        selectionStyles =
          "bg-purple-500 text-white border-2 border-purple-700 ring-2 ring-purple-300";
      } else if (isSelected) {
        selectionStyles = "bg-blue-500 text-white border-2 border-blue-700";
      } else if (isFocused) {
        selectionStyles =
          "bg-gray-300 text-black border-2 border-gray-500 ring-2 ring-blue-200";
      } else {
        selectionStyles = "bg-gray-200 text-black border border-gray-400";
      }

      return `${baseStyles} ${selectionStyles}`;
    };
  }, [breakpoint]);

  const getResponsiveTextClasses = useMemo(() => {
    return {
      title:
        breakpoint === "mobile"
          ? "text-2xl"
          : breakpoint === "tablet"
            ? "text-3xl"
            : "text-4xl",
      score:
        breakpoint === "mobile"
          ? "text-6xl"
          : breakpoint === "tablet"
            ? "text-7xl"
            : "text-8xl",
      instruction:
        breakpoint === "mobile"
          ? "text-lg"
          : breakpoint === "tablet"
            ? "text-xl"
            : "text-2xl sm:text-3xl md:text-4xl lg:text-4xl",
      subInstruction:
        breakpoint === "mobile" ? "text-sm" : "text-lg sm:text-lg md:text-xl lg:text-xl",
    };
  }, [breakpoint]);

  return {
    getResultStyles,
    getHandSelectionStyles,
    getResponsiveTextClasses,
  };
};
