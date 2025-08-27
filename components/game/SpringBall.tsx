'use client';

import React from 'react';
import { animated } from '@react-spring/web';
import { Ball as BallType } from '@/types/game';

interface SpringBallProps {
  ball: BallType;
  isVisible: boolean;
}

const SpringBall = React.memo(({ ball, isVisible }: SpringBallProps) => {
  if (!isVisible) return null;

  return (
    <animated.div
      style={{
        position: 'fixed',
        width: ball.radius * 2,
        height: ball.radius * 2,
        borderRadius: '50%',
        backgroundColor: '#333',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 100,
        pointerEvents: 'none',
        willChange: 'transform',
        transform: `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0)`,
        // Force hardware acceleration
        backfaceVisibility: 'hidden',
        perspective: 1000,
      }}
    />
  );
});

SpringBall.displayName = 'SpringBall';

export default SpringBall;