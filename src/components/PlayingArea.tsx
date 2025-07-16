import { useState } from "react";
import { PaperHand, RockHand, ScissorsHand } from "./hands";
import { PixelButton } from "./PixelButton";
import * as motion from "motion/react-client";

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
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Customizable handshake count
  const HANDSHAKE_COUNT = 3;

  const getHandComponent = (hand: HANDS): React.ReactElement => {
    const handComponents: Record<HANDS, React.ReactElement> = {
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

  const updateScore = (result: GameResult): void => {
    if (result === "player") {
      setPlayerScore((prev) => prev + 1);
    } else if (result === "opponent") {
      setOpponentScore((prev) => prev + 1);
    }
  };

  const createHandshakeAnimation = (shakeCount: number = HANDSHAKE_COUNT) => {
    const keyframes: Record<string, number[] | number> = { scale: [1, 0.9, 1] };

    // Create shake pattern for n times
    const shakePattern: number[] = [];
    for (let i = 0; i < shakeCount; i++) {
      shakePattern.push(0, -10, 0, 10, 0);
    }
    keyframes.y = shakePattern;

    return {
      keyframes,
      transition: {
        duration: shakeCount * 0.5,
        ease: "easeInOut" as const,
      },
    };
  };

  const handlePlayHand = async (): Promise<void> => {
    setIsPlaying(true);

    // Wait for handshake animation to complete
    await new Promise<void>((resolve) => setTimeout(resolve, HANDSHAKE_COUNT * 500));

    const cpuHand = generateOpponentHand();
    setOpponentHand(cpuHand);

    const result = determineWinner(playerSelectedHand, cpuHand);
    updateScore(result);
    setGameResult(RESULT_MESSAGES[result]);
    setIsPlaying(false);
  };

  const resetGame = (): void => {
    setPlayerScore(0);
    setOpponentScore(0);
    setOpponentHand(null);
    setGameResult("");
    setPlayerSelectedHand("ROCK");
    setIsPlaying(false);
  };

  const getResultStyles = (result: string): string => {
    const baseStyles =
      "text-2xl font-pixeboy text-center px-4 py-2 rounded min-w-[200px]";

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

  const getHandSelectionStyles = (_hand: HANDS, isSelected: boolean): string => {
    const baseStyles =
      "card w-24 h-24 flex items-center justify-center cursor-pointer transition-all duration-200";
    const selectedStyles = isSelected
      ? "bg-blue-500 text-white border-4 border-blue-700"
      : "bg-gray-200 text-black border-2 border-gray-400";

    return `${baseStyles} ${selectedStyles}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Game Board */}
      <div className="flex gap-12">
        {/* Player Section */}
        <motion.div
          className="flex flex-col gap-4 w-1/3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-4xl font-pixeboy text-center">PLAYER</div>
          <motion.div
            className="text-8xl font-pixeboy text-center"
            key={playerScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {playerScore}
          </motion.div>
          <motion.div
            className="flex items-center justify-center scale-x-[-1]"
            key={`${playerSelectedHand}-${isPlaying}`}
            animate={
              isPlaying ? createHandshakeAnimation().keyframes : { y: 0, scale: 1 }
            }
            transition={
              isPlaying ? createHandshakeAnimation().transition : { duration: 0.4 }
            }
          >
            <div className="scale-x-[-1]">
              {getHandComponent(isPlaying ? "ROCK" : playerSelectedHand)}
            </div>
          </motion.div>
        </motion.div>

        {/* VS Section */}
        <motion.div
          className="w-1/3 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-4xl font-pixeboy mb-4">VS</div>
          <motion.div
            className={getResultStyles(gameResult)}
            key={gameResult}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            {gameResult || "5 points to win!"}
          </motion.div>
        </motion.div>

        {/* CPU Section */}
        <motion.div
          className="flex flex-col gap-4 w-1/3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-4xl font-pixeboy text-center">CPU</div>
          <motion.div
            className="text-8xl font-pixeboy text-center"
            key={opponentScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {opponentScore}
          </motion.div>
          <motion.div
            className="flex items-center justify-center"
            key={`${opponentHand}-${isPlaying}`}
            animate={
              isPlaying ? createHandshakeAnimation().keyframes : { y: 0, scale: 1 }
            }
            transition={
              isPlaying ? createHandshakeAnimation().transition : { duration: 0.4 }
            }
          >
            {isPlaying ? (
              <RockHand />
            ) : opponentHand ? (
              getHandComponent(opponentHand)
            ) : (
              <RockHand />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Controls Section */}
      <motion.div
        className="flex flex-col items-center justify-center mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex gap-4 mb-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PixelButton
              onClick={handlePlayHand}
              variant="secondary"
              className="text-2xl font-pixeboy"
              disabled={isPlaying}
            >
              {isPlaying ? "PLAYING..." : "PLAY"}
            </PixelButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PixelButton
              onClick={resetGame}
              variant="danger"
              className="text-2xl font-pixeboy"
              disabled={isPlaying}
            >
              RESET
            </PixelButton>
          </motion.div>
        </div>

        {/* Hand Selection */}
        <div>
          <div className="text-2xl font-pixeboy text-center mt-4">Choose your hand:</div>
          <div className="flex items-center justify-center gap-4 mt-4">
            {HANDS_ARRAY.map((hand, index) => (
              <motion.div
                key={hand}
                className={getHandSelectionStyles(hand, playerSelectedHand === hand)}
                onClick={() => !isPlaying && setPlayerSelectedHand(hand)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                whileHover={!isPlaying ? { scale: 1.1 } : {}}
                whileTap={!isPlaying ? { scale: 0.9 } : {}}
                layout
                style={{ cursor: isPlaying ? "not-allowed" : "pointer" }}
              >
                {getHandComponent(hand)}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
