import * as motion from "motion/react-client";
import { useAnimationControls } from "motion/react";
import { useEffect, useState, useRef } from "react";

interface FloatingHandMotionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  pauseOnHover?: boolean;
  intensity?: number; // How far up/down to float
  className?: string;
  onClick?: () => void;
}

export const FloatingHandMotion: React.FC<FloatingHandMotionProps> = ({
  children,
  delay = 0,
  duration = 2.5,
  pauseOnHover = true,
  intensity = 15,
  className = "",
  onClick,
}) => {
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    const startAnimation = () => {
      animationRef.current = controls.start({
        y: [0, -intensity, 0],
        scale: [0.95, 1, 0.95],
        transition: {
          duration,
          ease: "easeInOut",
          repeat: Infinity,
          delay,
          repeatType: "reverse",
        },
      });
    };

    if (!isHovered) {
      startAnimation();
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.stop?.();
      }
    };
  }, [controls, delay, duration, intensity, isHovered]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
      controls.stop();
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };

  return (
    <motion.div
      animate={controls}
      initial={{ scale: 0.9, y: 0 }}
      className={`flex items-center justify-center cursor-pointer select-none transition-all ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{
        scale: 0.95,
        transition: { duration: 0.1 },
      }}
      style={{
        filter: isHovered ? "brightness(0.8)" : "brightness(1)",
      }}
    >
      {children}
    </motion.div>
  );
};
