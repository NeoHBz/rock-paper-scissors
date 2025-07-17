import React, { memo } from "react";
import { PaperHand, RockHand, ScissorsHand } from "./hands";
import type { HANDS } from "../types/game";

interface MemoizedHandProps {
  hand: HANDS;
  smallHands?: boolean;
}

const HandComponentMap: Record<HANDS, React.ComponentType<{ smallHands?: boolean }>> = {
  ROCK: RockHand,
  PAPER: PaperHand,
  SCISSORS: ScissorsHand,
};

export const MemoizedHand = memo<MemoizedHandProps>(({ hand, smallHands }) => {
  const HandComponent = HandComponentMap[hand];
  return <HandComponent smallHands={smallHands} />;
});

MemoizedHand.displayName = "MemoizedHand";
