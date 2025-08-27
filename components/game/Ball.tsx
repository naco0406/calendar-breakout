'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Ball as BallType } from '@/types/game';

interface BallProps {
  ball: BallType;
  isVisible: boolean;
}

const Ball = React.memo(({ ball, isVisible }: BallProps) => {
  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: ball.radius * 2,
        height: ball.radius * 2,
        borderRadius: '50%',
        backgroundColor: '#333',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 100,
        pointerEvents: 'none',
        willChange: 'transform',
        transform: `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0)`,
        // GPU acceleration optimizations
        backfaceVisibility: 'hidden',
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    />
  );
});

Ball.displayName = 'Ball';

export default Ball;