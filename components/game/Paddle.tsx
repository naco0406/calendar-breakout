'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Paddle as PaddleType } from '@/types/game';

interface PaddleProps {
  paddle: PaddleType;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver' | 'victory';
}

const Paddle = React.memo(({ paddle, gameStatus }: PaddleProps) => {
  return (
    <>
      {/* Game Paddle */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          bottom: '80px',
          width: `${paddle.width}px`,
          height: `${paddle.height}px`,
          borderRadius: '4px',
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 300,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: `translate3d(${paddle.x}px, 0, 0)`,
        }}
      />

      {/* Paddle Label - Only show when idle */}
      {gameStatus === 'idle' && (
        <>
          <Box
            sx={{
              position: 'fixed',
              bottom: '110px',
              left: 0,
              width: '60px',
              height: '20px',
              backgroundColor: 'rgba(25, 118, 210, 0.9)',
              color: 'white',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              zIndex: 1001,
              pointerEvents: 'none',
              transform: `translate3d(${paddle.x + paddle.width / 2 - 30}px, 0, 0)`,
              transition: 'opacity 0.3s ease',
            }}
          >
            PADDLE
          </Box>

          {/* Arrow pointing to paddle */}
          {/* <Box
            sx={{
              position: 'fixed',
              bottom: '105px',
              left: 0,
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '12px solid rgba(25, 118, 210, 0.9)',
              zIndex: 1001,
              pointerEvents: 'none',
              transform: `translate3d(${paddle.x + paddle.width / 2 - 8}px, 0, 0)`,
              transition: 'opacity 0.3s ease',
            }}
          /> */}
        </>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Only re-render if paddle position or game status changes
  return prevProps.paddle.x === nextProps.paddle.x &&
         prevProps.paddle.width === nextProps.paddle.width &&
         prevProps.paddle.height === nextProps.paddle.height &&
         prevProps.gameStatus === nextProps.gameStatus;
});

Paddle.displayName = 'Paddle';

export default Paddle;