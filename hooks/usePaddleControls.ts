import { useEffect, useCallback } from 'react';
import { Paddle } from '@/types/game';
import { GameStatus } from '@/constants/game';

interface UsePaddleControlsProps {
  gameStatus: GameStatus;
  paddle: Paddle;
  screenDimensions: { width: number; height: number };
  timeColumnWidth: number;
  setPaddle: React.Dispatch<React.SetStateAction<Paddle>>;
}

export const usePaddleControls = ({
  gameStatus,
  paddle,
  screenDimensions,
  timeColumnWidth,
  setPaddle,
}: UsePaddleControlsProps) => {
  const updatePaddlePosition = useCallback((clientX: number) => {
    const newX = Math.max(
      timeColumnWidth,
      Math.min(clientX - paddle.width / 2, screenDimensions.width - paddle.width)
    );
    setPaddle(prev => ({ ...prev, x: newX }));
  }, [paddle.width, screenDimensions.width, timeColumnWidth, setPaddle]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    let isMoving = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoving) {
        isMoving = true;
        requestAnimationFrame(() => {
          updatePaddlePosition(e.clientX);
          isMoving = false;
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && !isMoving) {
        e.preventDefault();
        isMoving = true;
        const touch = e.touches[0];
        requestAnimationFrame(() => {
          updatePaddlePosition(touch.clientX);
          isMoving = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameStatus, updatePaddlePosition]);
};