import { useRef, useCallback, useEffect } from 'react';

interface UseOptimizedGameLoopProps {
  callback: (deltaTime: number) => void;
  isRunning: boolean;
  targetFPS?: number;
}

export const useOptimizedGameLoop = ({ 
  callback, 
  isRunning, 
  targetFPS = 60 
}: UseOptimizedGameLoopProps) => {
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsIntervalRef = useRef<number>(1000 / targetFPS);
  const elapsedRef = useRef<number>(0);
  const accumulatorRef = useRef<number>(0);

  const animate = useCallback((currentTime: number) => {
    if (!isRunning) return;

    // Calculate elapsed time since last frame
    elapsedRef.current = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Accumulate time for fixed time step
    accumulatorRef.current += elapsedRef.current;

    // Fixed timestep with interpolation for smooth rendering
    const fixedTimeStep = 1000 / targetFPS;
    const maxSteps = 5; // Prevent spiral of death
    let steps = 0;

    while (accumulatorRef.current >= fixedTimeStep && steps < maxSteps) {
      // Calculate delta time in seconds
      const deltaTime = fixedTimeStep / 1000;
      
      // Call the game update callback with fixed timestep
      callback(deltaTime);
      
      accumulatorRef.current -= fixedTimeStep;
      steps++;
    }

    // Schedule next frame
    animationRef.current = requestAnimationFrame(animate);
  }, [callback, isRunning, targetFPS]);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, animate]);

  return {
    setTargetFPS: (fps: number) => {
      fpsIntervalRef.current = 1000 / fps;
    }
  };
};