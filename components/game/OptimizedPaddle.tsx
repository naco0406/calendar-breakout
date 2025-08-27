'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Paddle as PaddleType } from '@/types/game';

interface OptimizedPaddleProps {
  paddle: PaddleType;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameOver' | 'victory';
}

const OptimizedPaddle = React.memo(({ paddle, gameStatus }: OptimizedPaddleProps) => {
  const paddleRef = useRef<HTMLDivElement>(null);
  const lastXRef = useRef(paddle.x);

  useEffect(() => {
    if (!paddleRef.current) return;
    
    if (lastXRef.current !== paddle.x) {
      const transform = `translate3d(${paddle.x}px, 0, 0)`;
      paddleRef.current.style.transform = transform;
      lastXRef.current = paddle.x;
    }
  }, [paddle.x]);

  return (
    <>
      <div
        ref={paddleRef}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: 0,
          width: `${paddle.width}px`,
          height: `${paddle.height}px`,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3), 0 0 0 1px rgba(25, 118, 210, 0.2)',
          zIndex: 100, // Below pause overlay
          pointerEvents: 'none',
          willChange: 'transform',
          transform: `translate3d(${paddle.x}px, 0, 0)`,
          // Performance
          backfaceVisibility: 'hidden',
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
      />

      {/* Paddle hint for idle state */}
      {gameStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: '110px',
            left: paddle.x + paddle.width / 2 - 40,
            width: '80px',
            padding: '4px 12px',
            backgroundColor: 'rgba(25, 118, 210, 0.9)',
            color: 'white',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
            textAlign: 'center',
            zIndex: 101,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          PADDLE
        </motion.div>
      )}
    </>
  );
});

OptimizedPaddle.displayName = 'OptimizedPaddle';

export default OptimizedPaddle;