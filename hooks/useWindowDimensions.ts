import { useState, useEffect } from 'react';
import { debounce } from '@/utils/game';

interface WindowDimensions {
  width: number;
  height: number;
}

export const useWindowDimensions = (debounceDelay: number = 100): WindowDimensions => {
  const [dimensions, setDimensions] = useState<WindowDimensions>(() => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 800, height: 600 };
  });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const debouncedUpdate = debounce(updateDimensions, debounceDelay);

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);

    // Initial update
    updateDimensions();

    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
    };
  }, [debounceDelay]);

  return dimensions;
};