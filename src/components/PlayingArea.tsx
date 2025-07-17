import { useState, useEffect, useCallback } from "react";
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
  const [gameWinner, setGameWinner] = useState<string>("");
  const [hasInitialAnimationCompleted, setHasInitialAnimationCompleted] =
    useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  const HANDSHAKE_COUNT = 3;
  const WINNING_SCORE = 5;

  const getHandComponent = (hand: HANDS, smallHands?: boolean): React.ReactElement => {
    const handComponents: Record<HANDS, React.ReactElement> = {
      ROCK: <RockHand smallHands={smallHands} />,
      PAPER: <PaperHand smallHands={smallHands} />,
      SCISSORS: <ScissorsHand smallHands={smallHands} />,
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

  const updateScore = useCallback(
    (result: GameResult): void => {
      if (result === "player") {
        const newScore = playerScore + 1;
        setPlayerScore(newScore);
        if (newScore >= WINNING_SCORE) {
          setGameWinner("PLAYER WINS THE GAME!");
        }
      } else if (result === "opponent") {
        const newScore = opponentScore + 1;
        setOpponentScore(newScore);
        if (newScore >= WINNING_SCORE) {
          setGameWinner("CPU WINS THE GAME!");
        }
      }
    },
    [playerScore, opponentScore, WINNING_SCORE],
  );

  const createHandshakeAnimation = (shakeCount: number = HANDSHAKE_COUNT) => {
    const keyframes: Record<string, number[] | number> = { scale: [1, 0.9, 1] };

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

  const handlePlayHand = useCallback(async (): Promise<void> => {
    if (gameWinner) return;

    setIsPlaying(true);

    await new Promise<void>((resolve) => setTimeout(resolve, HANDSHAKE_COUNT * 500));

    const cpuHand = generateOpponentHand();
    setOpponentHand(cpuHand);

    const result = determineWinner(playerSelectedHand, cpuHand);
    updateScore(result);
    setGameResult(RESULT_MESSAGES[result]);
    setIsPlaying(false);
  }, [gameWinner, playerSelectedHand, updateScore]);

  const resetGame = (): void => {
    setPlayerScore(0);
    setOpponentScore(0);
    setOpponentHand(null);
    setGameResult("");
    setPlayerSelectedHand("ROCK");
    setIsPlaying(false);
    setGameWinner("");
  };

  const getResultStyles = (result: string): string => {
    const baseStyles =
      "text-lg sm:text-xl md:text-2xl lg:text-3xl font-pixeboy text-center px-2 sm:px-4 py-2 rounded min-w-[150px] sm:min-w-[200px] md:min-w-[250px]";

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

  const getHandSelectionStyles = (_hand: HANDS, isSelected: boolean): string => {
    const baseStyles =
      "card w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center cursor-pointer transition-all duration-200";
    const selectedStyles = isSelected
      ? "bg-blue-500 text-white border-2 sm:border-3 md:border-4 border-blue-700"
      : "bg-gray-200 text-black border border-gray-400 sm:border-2";

    return `${baseStyles} ${selectedStyles}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialAnimationCompleted(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    setIsSmallScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPlaying) return;

      let shouldPlay = false;

      switch (event.key) {
        case "1":
          setPlayerSelectedHand("ROCK");
          shouldPlay = true;
          break;
        case "2":
          setPlayerSelectedHand("PAPER");
          shouldPlay = true;
          break;
        case "3":
          setPlayerSelectedHand("SCISSORS");
          shouldPlay = true;
          break;
        default:
          return;
      }

      if (shouldPlay && !isPlaying && !gameWinner) {
        handlePlayHand();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying, gameWinner, handlePlayHand]);

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
              <motion.div
                className="scale-x-[-1]"
                key={playerSelectedHand}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {getHandComponent(isPlaying ? "ROCK" : playerSelectedHand)}
              </motion.div>
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
            key={gameWinner || gameResult}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <span className="text-center text-sm sm:text-lg md:text-xl lg:text-2xl font-pixeboy text-black dark:text-white">
              {gameWinner || gameResult || `${WINNING_SCORE} points to win!`}
            </span>
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
            <motion.div
              key={opponentHand || "default"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
        </motion.div>
      </div>

      {/* Controls Section */}
      <motion.div
        className="flex flex-col items-center justify-center mt-2"
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
              disabled={isPlaying || !!gameWinner}
            >
              {isPlaying ? "PLAYING..." : gameWinner ? "GAME OVER" : "PLAY"}
            </PixelButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <PixelButton
              onClick={resetGame}
              variant="danger"
              className="text-2xl font-pixeboy"
              disabled={isPlaying}
            >
              {gameWinner ? "NEW GAME" : "RESET"}
            </PixelButton>
          </motion.div>
        </div>

        {/* Hand Selection */}
        <div>
          <div className="font-pixeboy text-center text-2xl sm:text-3xl md:text-4xl lg:text-4xl mb-2">
            Click to choose your hand:
          </div>
          {!isSmallScreen && (
            <div className="font-pixeboy text-center text-xl sm:text-xl md:text-2xl lg:text-2xl mb-4">
              Or Press 1, 2, 3 on keyboard
            </div>
          )}
          <div className="flex items-center justify-center gap-4 mt-4">
            {HANDS_ARRAY.map((hand, index) => (
              <div
                onClick={() => !isPlaying && !gameWinner && setPlayerSelectedHand(hand)}
                key={hand}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-lg font-pixeboy mb-1">{hand}</span>
                <motion.div
                  key={hand}
                  className={getHandSelectionStyles(hand, playerSelectedHand === hand)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    hasInitialAnimationCompleted
                      ? { duration: 0.1 }
                      : { duration: 0.5, delay: 0.6 + index * 0.1 }
                  }
                  whileHover={!isPlaying && !gameWinner ? { scale: 1.1 } : {}}
                  whileTap={!isPlaying && !gameWinner ? { scale: 0.9 } : {}}
                  layout
                  style={{ cursor: isPlaying || gameWinner ? "not-allowed" : "pointer" }}
                >
                  {getHandComponent(hand, isSmallScreen)}
                </motion.div>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
