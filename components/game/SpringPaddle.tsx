'use client';

import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { Paddle as PaddleType } from '@/types/game';

interface SpringPaddleProps {
  paddle: PaddleType;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver' | 'victory';
}

const SpringPaddle = React.memo(({ paddle, gameStatus }: SpringPaddleProps) => {
  const paddleSpring = useSpring({
    transform: `translate3d(${paddle.x}px, 0, 0)`,
    immediate: true,
    config: { tension: 1000, friction: 0, mass: 0.1 },
  });

  return (
    <>
      <animated.div
        style={{
          ...paddleSpring,
          position: 'fixed',
          bottom: '80px',
          width: `${paddle.width}px`,
          height: `${paddle.height}px`,
          borderRadius: '4px',
          backgroundColor: '#1976d2',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          zIndex: 300,
          pointerEvents: 'none',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      />

      {gameStatus === 'idle' && (
        <animated.div
          style={{
            ...paddleSpring,
            position: 'fixed',
            bottom: '110px',
            width: '60px',
            height: '20px',
            marginLeft: `${paddle.width / 2 - 30}px`,
            backgroundColor: 'rgba(25, 118, 210, 0.9)',
            color: 'white',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            zIndex: 301,
            pointerEvents: 'none',
          }}
        >
          PADDLE
        </animated.div>
      )}
    </>
  );
});

SpringPaddle.displayName = 'SpringPaddle';

export default SpringPaddle;