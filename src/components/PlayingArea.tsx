import { useState } from "react";
import { PaperHand, RockHand, ScissorsHand } from "./hands";
import { PixelButton } from "./PixelButton";

type HANDS = "ROCK" | "PAPER" | "SCISSORS";
type GameResult = "player" | "opponent" | "tie";

const HANDS_ARRAY: HANDS[] = ["ROCK", "PAPER", "SCISSORS"];

const WIN_CONDITIONS: Record<HANDS, HANDS> = {
  ROCK: "SCISSORS",
  PAPER: "ROCK",
  SCISSORS: "PAPER",
};

const RESULT_MESSAGES: Record<GameResult, string> = {
  player: "You Win!",
  opponent: "CPU Wins!",
  tie: "It's a Tie!",
};

export const PlayingArea: React.FC = () => {
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [playerSelectedHand, setPlayerSelectedHand] = useState<HANDS>("ROCK");
  const [opponentHand, setOpponentHand] = useState<HANDS | null>(null);
  const [gameResult, setGameResult] = useState<string>("");

  const getHandComponent = (hand: HANDS) => {
    const handComponents = {
      ROCK: <RockHand />,
      PAPER: <PaperHand />,
      SCISSORS: <ScissorsHand />,
    };
    return handComponents[hand];
  };

  const generateOpponentHand = (): HANDS => {
    return HANDS_ARRAY[Math.floor(Math.random() * HANDS_ARRAY.length)];
  };

  const determineWinner = (playerHand: HANDS, opponentHand: HANDS): GameResult => {
    if (playerHand === opponentHand) return "tie";
    return WIN_CONDITIONS[playerHand] === opponentHand ? "player" : "opponent";
  };

  const updateScore = (result: GameResult) => {
    if (result === "player") {
      setPlayerScore((prev) => prev + 1);
    } else if (result === "opponent") {
      setOpponentScore((prev) => prev + 1);
    }
  };

  const handlePlayHand = () => {
    const cpuHand = generateOpponentHand();
    setOpponentHand(cpuHand);

    const result = determineWinner(playerSelectedHand, cpuHand);
    updateScore(result);
    setGameResult(RESULT_MESSAGES[result]);
  };

  const resetGame = () => {
    setPlayerScore(0);
    setOpponentScore(0);
    setOpponentHand(null);
    setGameResult("");
    setPlayerSelectedHand("ROCK");
  };

  const getResultStyles = (result: string) => {
    const baseStyles = "text-2xl font-pixeboy text-center px-4 py-2 rounded min-w-[200px]";

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

  const getHandSelectionStyles = (hand: HANDS, isSelected: boolean) => {
    const baseStyles = "card w-24 h-24 flex items-center justify-center cursor-pointer transition-all duration-200";
    const selectedStyles = isSelected
      ? "bg-blue-500 text-white border-4 border-blue-700"
      : "bg-gray-200 text-black border-2 border-gray-400";

    return `${baseStyles} ${selectedStyles} hover:scale-105`;
  };

  return (
    <div>
      {/* Game Board */}
      <div className="flex gap-12">
        {/* Player Section */}
        <div className="flex flex-col gap-4 w-1/3">
          <div className="text-4xl font-pixeboy text-center">PLAYER</div>
          <div className="text-8xl font-pixeboy text-center">{playerScore}</div>
          <div className="flex items-center justify-center scale-x-[-1]">
            {getHandComponent(playerSelectedHand)}
          </div>
        </div>

        {/* VS Section */}
        <div className="w-1/3 flex flex-col items-center justify-center">
          <div className="text-4xl font-pixeboy mb-4">VS</div>
          <div className={getResultStyles(gameResult)}>{gameResult || "-"}</div>
        </div>

        {/* CPU Section */}
        <div className="flex flex-col gap-4 w-1/3">
          <div className="text-4xl font-pixeboy text-center">CPU</div>
          <div className="text-8xl font-pixeboy text-center">{opponentScore}</div>
          <div className="flex items-center justify-center">
            {opponentHand ? getHandComponent(opponentHand) : <RockHand />}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col items-center justify-center mt-12">
        <div className="flex gap-4 mb-4">
          <PixelButton
            onClick={handlePlayHand}
            variant="secondary"
            className="text-2xl font-pixeboy"
          >
            PLAY
          </PixelButton>
          <PixelButton
            onClick={resetGame}
            variant="danger"
            className="text-2xl font-pixeboy"
          >
            RESET
          </PixelButton>
        </div>

        {/* Hand Selection */}
        <div>
          <div className="text-2xl font-pixeboy text-center mt-4">Choose your hand:</div>
          <div className="flex items-center justify-center gap-4 mt-4">
            {HANDS_ARRAY.map((hand) => (
              <div
                key={hand}
                className={getHandSelectionStyles(hand, playerSelectedHand === hand)}
                onClick={() => setPlayerSelectedHand(hand)}
              >
                {getHandComponent(hand)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
