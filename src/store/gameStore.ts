import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, GameStats, GameSettings, HANDS, GameResult } from '../types/game';
import { HANDS_ARRAY, WIN_CONDITIONS, RESULT_MESSAGES } from '../types/game';

interface GameStore extends GameState {
  stats: GameStats;
  settings: GameSettings;
  
  // Actions
  setPlayerSelectedHand: (hand: HANDS) => void;
  setSelectedHandIndex: (index: number) => void;
  setOpponentHand: (hand: HANDS | null) => void;
  setGameResult: (result: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setGameWinner: (winner: string) => void;
  setHasInitialAnimationCompleted: (completed: boolean) => void;
  updateScore: (result: GameResult) => void;
  resetGame: () => void;
  playHand: () => Promise<void>;
  updateStats: (result: GameResult) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

const initialGameState: GameState = {
  playerScore: 0,
  opponentScore: 0,
  playerSelectedHand: "ROCK",
  opponentHand: null,
  gameResult: "",
  isPlaying: false,
  gameWinner: "",
  hasInitialAnimationCompleted: false,
  selectedHandIndex: 0,
  winningScore: 5,
};

const initialStats: GameStats = {
  totalGames: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  winStreak: 0,
  longestStreak: 0,
  favoriteHand: "ROCK",
  handUsageStats: {
    ROCK: 0,
    PAPER: 0,
    SCISSORS: 0,
  },
};

const initialSettings: GameSettings = {
  winningScore: 5,
  handshakeCount: 3,
  soundEnabled: true,
  animationSpeed: 1,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameState,
      stats: initialStats,
      settings: initialSettings,

      setPlayerSelectedHand: (hand: HANDS) => {
        const index = HANDS_ARRAY.indexOf(hand);
        set({ playerSelectedHand: hand, selectedHandIndex: index });
      },

      setSelectedHandIndex: (index: number) => {
        const normalizedIndex = ((index % HANDS_ARRAY.length) + HANDS_ARRAY.length) % HANDS_ARRAY.length;
        const hand = HANDS_ARRAY[normalizedIndex];
        set({ selectedHandIndex: normalizedIndex, playerSelectedHand: hand });
      },

      setOpponentHand: (hand: HANDS | null) => set({ opponentHand: hand }),
      setGameResult: (result: string) => set({ gameResult: result }),
      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
      setGameWinner: (winner: string) => set({ gameWinner: winner }),
      setHasInitialAnimationCompleted: (completed: boolean) => 
        set({ hasInitialAnimationCompleted: completed }),

      updateScore: (result: GameResult) => {
        const state = get();
        const { playerScore, opponentScore, settings } = state;
        
        if (result === "player") {
          const newScore = playerScore + 1;
          set({ playerScore: newScore });
          if (newScore >= settings.winningScore) {
            set({ gameWinner: "PLAYER WINS THE GAME!" });
          }
        } else if (result === "opponent") {
          const newScore = opponentScore + 1;
          set({ opponentScore: newScore });
          if (newScore >= settings.winningScore) {
            set({ gameWinner: "CPU WINS THE GAME!" });
          }
        }
        
        get().updateStats(result);
      },

      resetGame: () => set({
        playerScore: 0,
        opponentScore: 0,
        opponentHand: null,
        gameResult: "",
        playerSelectedHand: "ROCK",
        selectedHandIndex: 0,
        isPlaying: false,
        gameWinner: "",
      }),

      playHand: async () => {
        const state = get();
        if (state.gameWinner || state.isPlaying) return;

        set({ isPlaying: true });

        // Simulate handshake animation delay
        await new Promise<void>((resolve) => 
          setTimeout(resolve, state.settings.handshakeCount * 500)
        );

        const cpuHand = HANDS_ARRAY[Math.floor(Math.random() * HANDS_ARRAY.length)];
        set({ opponentHand: cpuHand });

        const result = state.playerSelectedHand === cpuHand 
          ? "tie" 
          : WIN_CONDITIONS[state.playerSelectedHand] === cpuHand 
            ? "player" 
            : "opponent";

        get().updateScore(result);
        set({ gameResult: RESULT_MESSAGES[result], isPlaying: false });
      },

      updateStats: (result: GameResult) => {
        const state = get();
        const newStats = { ...state.stats };
        
        newStats.totalGames++;
        newStats.handUsageStats[state.playerSelectedHand]++;
        
        // Update favorite hand
        const maxUsage = Math.max(...Object.values(newStats.handUsageStats));
        newStats.favoriteHand = Object.entries(newStats.handUsageStats)
          .find(([, count]) => count === maxUsage)?.[0] as HANDS || "ROCK";
        
        if (result === "player") {
          newStats.wins++;
          newStats.winStreak++;
          newStats.longestStreak = Math.max(newStats.longestStreak, newStats.winStreak);
        } else {
          newStats.winStreak = 0;
          if (result === "opponent") {
            newStats.losses++;
          } else {
            newStats.ties++;
          }
        }
        
        set({ stats: newStats });
      },

      updateSettings: (newSettings: Partial<GameSettings>) => {
        const state = get();
        set({ 
          settings: { ...state.settings, ...newSettings },
          winningScore: newSettings.winningScore || state.settings.winningScore,
        });
      },
    }),
    {
      name: 'rock-paper-scissors-game',
      partialize: (state) => ({
        stats: state.stats,
        settings: state.settings,
      }),
    }
  )
);
