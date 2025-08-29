import { GAME_CONSTANTS } from '@/constants/game';

export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 600 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

export const getBallSpeed = (isMobile: boolean): number => {
  return isMobile ? GAME_CONSTANTS.BALL_SPEED.INITIAL.MOBILE : GAME_CONSTANTS.BALL_SPEED.INITIAL.DESKTOP;
};

export const getMaxSpeed = (isMobile: boolean): number => {
  return isMobile ? GAME_CONSTANTS.BALL_SPEED.MAX.MOBILE : GAME_CONSTANTS.BALL_SPEED.MAX.DESKTOP;
};

export const getPaddleDimensions = (isMobile: boolean) => {
  return {
    width: isMobile ? GAME_CONSTANTS.PADDLE.WIDTH.MOBILE : GAME_CONSTANTS.PADDLE.WIDTH.DESKTOP,
    height: isMobile ? GAME_CONSTANTS.PADDLE.HEIGHT.MOBILE : GAME_CONSTANTS.PADDLE.HEIGHT.DESKTOP,
  };
};

export const getBallRadius = (isMobile: boolean): number => {
  return isMobile ? GAME_CONSTANTS.BALL_RADIUS.MOBILE : GAME_CONSTANTS.BALL_RADIUS.DESKTOP;
};

export const getPowerUpFallSpeed = (isMobile: boolean): number => {
  return isMobile ? GAME_CONSTANTS.POWERUP_FALL_SPEED.MOBILE : GAME_CONSTANTS.POWERUP_FALL_SPEED.DESKTOP;
};

export const calculateScore = (baseScore: number, combo: number): number => {
  const comboMultiplier = Math.max(1, combo * GAME_CONSTANTS.COMBO_MULTIPLIER);
  return Math.floor(baseScore * comboMultiplier);
};

export const generatePowerUpId = (): string => {
  return `powerup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  
  return (...args: Parameters<T>): void => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getRandomPowerUpType = (): string => {
  const types = ['multiball', 'widen-paddle', 'slow-ball', 'extra-life'];
  return types[Math.floor(Math.random() * types.length)];
};

export const shouldDropPowerUp = (): boolean => {
  return Math.random() < GAME_CONSTANTS.POWERUP_DROP_CHANCE;
};