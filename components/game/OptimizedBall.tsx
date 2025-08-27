'use client';

import React, { useRef, useEffect } from 'react';
import { Ball as BallType } from '@/types/game';

interface OptimizedBallProps {
  ball: BallType;
  isVisible: boolean;
}

const OptimizedBall = React.memo(({ ball, isVisible }: OptimizedBallProps) => {
  const ballRef = useRef<HTMLDivElement>(null);
  const lastPositionRef = useRef({ x: ball.x, y: ball.y });

  useEffect(() => {
    if (!ballRef.current || !isVisible) return;
    
    // Only update if position actually changed
    if (lastPositionRef.current.x !== ball.x || lastPositionRef.current.y !== ball.y) {
      const transform = `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0)`;
      ballRef.current.style.transform = transform;
      lastPositionRef.current = { x: ball.x, y: ball.y };
    }
  }, [ball.x, ball.y, ball.radius, isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={ballRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: ball.radius * 2,
        height: ball.radius * 2,
        borderRadius: '50%',
        backgroundColor: '#1a1a1a',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
        zIndex: 100, // Below pause overlay
        pointerEvents: 'none',
        willChange: 'transform',
        transform: `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0)`,
        // Performance optimizations
        backfaceVisibility: 'hidden',
        perspective: 1000,
        transformStyle: 'preserve-3d',
        // Add gradient for better visual
        background: 'radial-gradient(circle at 30% 30%, #333, #000)',
      }}
    />
  );
});

OptimizedBall.displayName = 'OptimizedBall';

export default OptimizedBall;