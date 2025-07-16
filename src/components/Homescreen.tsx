import { useState } from "react";
import { PlayingArea } from "./PlayingArea";
import { RockHand, PaperHand, ScissorsHand } from "./hands";
import { PixelButton } from "./PixelButton";
import { FloatingHandMotion } from "./hands/FloatingHandMotion";

type Screens = "HOME" | "GAME";

export const HomeScreen: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<Screens>("HOME");
  const handleOnStartClick = () => {
    setActiveScreen("GAME");
  };
  return (
    <div className="flex flex-col items-center justify-center space-x-12 h-screen w-screen gap-12">
      {activeScreen === "HOME" && (
        <div>
          <div className="flex items-center space-y-4 gap-12">
            <FloatingHandMotion delay={0}>
              <RockHand />
            </FloatingHandMotion>
            <FloatingHandMotion delay={0.3}>
              <PaperHand />
            </FloatingHandMotion>
            <FloatingHandMotion delay={0.6}>
              <ScissorsHand />
            </FloatingHandMotion>
          </div>
          <div className="flex items-center justify-center mt-12">
            <PixelButton onClick={handleOnStartClick}>START GAME</PixelButton>
          </div>
        </div>
      )}
      {activeScreen === "GAME" && (
        <div className="flex">
          <PlayingArea />
        </div>
      )}
    </div>
  );
};
