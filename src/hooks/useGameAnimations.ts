import { useMemo } from 'react';

export const useHandshakeAnimation = (shakeCount: number = 3) => {
  return useMemo(() => {
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
  }, [shakeCount]);
};

export const useGameAnimations = () => {
  const handshakeAnimation = useHandshakeAnimation();
  
  const scoreAnimation = useMemo(() => ({
    initial: { scale: 1.2 },
    animate: { scale: 1 },
    transition: { duration: 0.3 }
  }), []);

  const handTransition = useMemo(() => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3, ease: "easeInOut" as const }
  }), []);

  const resultAnimation = useMemo(() => ({
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, type: "spring" as const, stiffness: 200 }
  }), []);

  return {
    handshakeAnimation,
    scoreAnimation,
    handTransition,
    resultAnimation,
  };
};
