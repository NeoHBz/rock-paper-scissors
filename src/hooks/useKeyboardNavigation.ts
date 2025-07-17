import { useEffect, useCallback } from "react";
import { useGameStore } from "../store/gameStore";

export const useKeyboardNavigation = () => {
  const {
    isPlaying,
    gameWinner,
    selectedHandIndex,
    setSelectedHandIndex,
    setPlayerSelectedHand,
    playHand,
    resetGame,
  } = useGameStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent default behavior for space to avoid page scrolling
      if (event.code === "Space") {
        event.preventDefault();
      }

      if (isPlaying) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setSelectedHandIndex(selectedHandIndex - 1);
          break;
        case "ArrowRight":
          event.preventDefault();
          setSelectedHandIndex(selectedHandIndex + 1);
          break;
        case "Enter":
        case " ": // Space bar
          event.preventDefault();
          if (!gameWinner) {
            playHand();
          }
          break;
        case "Escape":
          event.preventDefault();
          resetGame();
          break;
        case "1":
          setPlayerSelectedHand("ROCK");
          if (!gameWinner) playHand();
          break;
        case "2":
          setPlayerSelectedHand("PAPER");
          if (!gameWinner) playHand();
          break;
        case "3":
          setPlayerSelectedHand("SCISSORS");
          if (!gameWinner) playHand();
          break;
        case "r":
        case "R":
          event.preventDefault();
          resetGame();
          break;
        default:
          return;
      }
    },
    [
      isPlaying,
      gameWinner,
      selectedHandIndex,
      setSelectedHandIndex,
      setPlayerSelectedHand,
      playHand,
      resetGame,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    selectedHandIndex,
    setSelectedHandIndex,
  };
};
