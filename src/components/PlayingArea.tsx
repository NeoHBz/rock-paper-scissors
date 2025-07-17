import { useEffect, memo } from "react";
import { RockHand } from "./hands";
import { PixelButton } from "./PixelButton";
import { PageTransition } from "./PageTransition";
import { MemoizedHand } from "./MemoizedHand";
import * as motion from "motion/react-client";
import { useGameStore } from "../store/gameStore";
import { useResponsive } from "../hooks/useResponsive";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useGameAnimations } from "../hooks/useGameAnimations";
import { useGameStyles } from "../hooks/useGameStyles";
import { HANDS_ARRAY } from "../types/game";

export const PlayingArea: React.FC = memo(() => {
  const {
    playerScore,
    opponentScore,
    playerSelectedHand,
    opponentHand,
    gameResult,
    isPlaying,
    gameWinner,
    hasInitialAnimationCompleted,
    settings,
    setPlayerSelectedHand,
    setHasInitialAnimationCompleted,
    playHand,
    resetGame,
  } = useGameStore();

  const { breakpoint, isSmallScreen } = useResponsive();
  const { selectedHandIndex: keyboardSelectedIndex } = useKeyboardNavigation();
  const { handshakeAnimation, scoreAnimation, handTransition, resultAnimation } = useGameAnimations();
  const { getResultStyles, getHandSelectionStyles, getResponsiveTextClasses } = useGameStyles(breakpoint);

  const textClasses = getResponsiveTextClasses;

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialAnimationCompleted(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [setHasInitialAnimationCompleted]);

  return (
    <PageTransition>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Game Board */}
        <div className={`flex ${breakpoint === 'mobile' ? 'gap-4' : 'gap-12'}`}>
          {/* Player Section */}
          <motion.div
            className="flex flex-col gap-4 w-1/3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={`${textClasses.title} font-pixeboy text-center`}>PLAYER</div>
            <motion.div
              className={`${textClasses.score} font-pixeboy text-center`}
              key={playerScore}
              {...scoreAnimation}
            >
              {playerScore}
            </motion.div>
            <motion.div
              className="flex items-center justify-center scale-x-[-1]"
              key={`${playerSelectedHand}-${isPlaying}`}
              animate={
                isPlaying ? handshakeAnimation.keyframes : { y: 0, scale: 1 }
              }
              transition={
                isPlaying ? handshakeAnimation.transition : { duration: 0.4 }
              }
            >
              <div className="scale-x-[-1]">
                <motion.div
                  className="scale-x-[-1]"
                  key={playerSelectedHand}
                  {...handTransition}
                >
                  <MemoizedHand 
                    hand={isPlaying ? "ROCK" : playerSelectedHand} 
                    smallHands={isSmallScreen} 
                  />
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
            <div className={`${textClasses.title} font-pixeboy mb-4`}>VS</div>
            <motion.div
              className={getResultStyles(gameResult, gameWinner)}
              key={gameWinner || gameResult}
              {...resultAnimation}
            >
              <span className={`text-center ${textClasses.instruction === 'text-lg' ? 'text-sm' : 'text-sm sm:text-lg md:text-xl lg:text-2xl'} font-pixeboy text-black dark:text-white`}>
                {gameWinner || gameResult || `${settings.winningScore} points to win!`}
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
            <div className={`${textClasses.title} font-pixeboy text-center`}>CPU</div>
            <motion.div
              className={`${textClasses.score} font-pixeboy text-center`}
              key={opponentScore}
              {...scoreAnimation}
            >
              {opponentScore}
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              key={`${opponentHand}-${isPlaying}`}
              animate={
                isPlaying ? handshakeAnimation.keyframes : { y: 0, scale: 1 }
              }
              transition={
                isPlaying ? handshakeAnimation.transition : { duration: 0.4 }
              }
            >
              <motion.div
                key={opponentHand || "default"}
                {...handTransition}
              >
                {isPlaying ? (
                  <RockHand smallHands={isSmallScreen} />
                ) : opponentHand ? (
                  <MemoizedHand hand={opponentHand} smallHands={isSmallScreen} />
                ) : (
                  <RockHand smallHands={isSmallScreen} />
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
          <div className={`flex gap-4 ${breakpoint === 'mobile' ? 'mb-2' : 'mb-4'}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PixelButton
                onClick={playHand}
                variant="secondary"
                className={`${breakpoint === 'mobile' ? 'text-lg' : 'text-2xl'} font-pixeboy`}
                disabled={isPlaying || !!gameWinner}
              >
                {isPlaying ? "PLAYING..." : gameWinner ? "GAME OVER" : "PLAY"}
              </PixelButton>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <PixelButton
                onClick={resetGame}
                variant="danger"
                className={`${breakpoint === 'mobile' ? 'text-lg' : 'text-2xl'} font-pixeboy`}
                disabled={isPlaying}
              >
                {gameWinner ? "NEW GAME" : "RESET"}
              </PixelButton>
            </motion.div>
          </div>

          {/* Hand Selection */}
          <div>
            <div className={`font-pixeboy text-center ${textClasses.instruction} mb-2`}>
              Click to choose your hand:
            </div>
            {!isSmallScreen && (
              <div className={`font-pixeboy text-center ${textClasses.subInstruction} mb-4`}>
                Use ←→ arrows to navigate, Space/Enter to play, 1-3 for quick select
              </div>
            )}
            <div className="flex items-center justify-center gap-4 mt-4">
              {HANDS_ARRAY.map((hand, index) => {
                const isSelected = playerSelectedHand === hand;
                const isFocused = keyboardSelectedIndex === index;
                
                return (
                  <div
                    onClick={() => !isPlaying && !gameWinner && setPlayerSelectedHand(hand)}
                    key={hand}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className={`${breakpoint === 'mobile' ? 'text-sm' : 'text-lg'} font-pixeboy mb-1`}>
                      {hand}
                    </span>
                    <motion.div
                      key={hand}
                      className={getHandSelectionStyles(hand, isSelected, isFocused)}
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
                      <MemoizedHand hand={hand} smallHands={isSmallScreen} />
                    </motion.div>
                    <span className={`${breakpoint === 'mobile' ? 'text-xs' : 'text-sm'} font-pixeboy mt-1`}>
                      {index + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
});
