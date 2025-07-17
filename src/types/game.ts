export type HANDS = "ROCK" | "PAPER" | "SCISSORS";
export type GameResult = "player" | "opponent" | "tie";
export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface GameState {
  playerScore: number;
  opponentScore: number;
  playerSelectedHand: HANDS;
  opponentHand: HANDS | null;
  gameResult: string;
  isPlaying: boolean;
  gameWinner: string;
  hasInitialAnimationCompleted: boolean;
  selectedHandIndex: number;
  winningScore: number;
}

export interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
  winStreak: number;
  longestStreak: number;
  favoriteHand: HANDS;
  handUsageStats: Record<HANDS, number>;
}

export interface GameSettings {
  winningScore: number;
  handshakeCount: number;
  soundEnabled: boolean;
  animationSpeed: number;
}

export const HANDS_ARRAY: HANDS[] = ["ROCK", "PAPER", "SCISSORS"];

export const WIN_CONDITIONS: Record<HANDS, HANDS> = {
  ROCK: "SCISSORS",
  PAPER: "ROCK",
  SCISSORS: "PAPER",
};

export const RESULT_MESSAGES: Record<GameResult, string> = {
  player: "You Win!",
  opponent: "CPU Wins!",
  tie: "It's a Tie!",
};
