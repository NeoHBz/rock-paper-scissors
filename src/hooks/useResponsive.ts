import { useState, useEffect } from 'react';
import type { Breakpoint } from '../types/game';

const BREAKPOINTS = {
  mobile: 767,
  tablet: 1024,
} as const;

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width <= BREAKPOINTS.mobile) return 'mobile';
    if (width <= BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newBreakpoint: Breakpoint = 'desktop';
      
      if (width <= BREAKPOINTS.mobile) {
        newBreakpoint = 'mobile';
      } else if (width <= BREAKPOINTS.tablet) {
        newBreakpoint = 'tablet';
      }
      
      setBreakpoint(newBreakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isSmallScreen: breakpoint === 'mobile' || breakpoint === 'tablet',
  };
};
