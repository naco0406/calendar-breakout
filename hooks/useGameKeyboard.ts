import { useEffect } from 'react';
import { GameStatus } from '@/constants/game';

interface UseGameKeyboardProps {
  gameStatus: GameStatus;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

export const useGameKeyboard = ({
  gameStatus,
  startGame,
  pauseGame,
  resumeGame,
  resetGame,
}: UseGameKeyboardProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (gameStatus === 'playing') {
            pauseGame();
          } else if (gameStatus === 'paused') {
            resumeGame();
          } else if (gameStatus === 'idle') {
            startGame();
          }
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, pauseGame, resumeGame, startGame, resetGame]);
};