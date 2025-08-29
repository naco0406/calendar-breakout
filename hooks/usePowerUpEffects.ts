import { useCallback } from 'react';
import { PowerUp } from '@/components/game/PowerUps';
import { Ball, Paddle, GameState } from '@/types/game';
import { GAME_CONSTANTS, POWERUP_TYPES } from '@/constants/game';
import { GameAudio } from '@/utils/audio';

interface UsePowerUpEffectsProps {
  soundEnabled: boolean;
  initialPaddleWidth: number;
}

interface UsePowerUpEffectsReturn {
  handlePowerUpCollection: (
    powerUp: PowerUp,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setPaddle: React.Dispatch<React.SetStateAction<Paddle>>,
    setBall: React.Dispatch<React.SetStateAction<Ball>>
  ) => void;
}

export const usePowerUpEffects = ({
  soundEnabled,
  initialPaddleWidth,
}: UsePowerUpEffectsProps): UsePowerUpEffectsReturn => {
  const handlePowerUpCollection = useCallback((
    powerUp: PowerUp,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setPaddle: React.Dispatch<React.SetStateAction<Paddle>>,
    setBall: React.Dispatch<React.SetStateAction<Ball>>
  ) => {
    switch (powerUp.type) {
      case POWERUP_TYPES.EXTRA_LIFE:
        setGameState(prev => ({
          ...prev,
          lives: Math.min(prev.lives + 1, GAME_CONSTANTS.MAX_LIVES)
        }));
        break;
        
      case POWERUP_TYPES.WIDEN_PADDLE:
        setPaddle(prev => ({
          ...prev,
          width: prev.width * GAME_CONSTANTS.PADDLE.EXTEND_MULTIPLIER
        }));
        setTimeout(() => {
          setPaddle(prev => ({ ...prev, width: initialPaddleWidth }));
        }, GAME_CONSTANTS.PADDLE.EXTEND_DURATION);
        break;
        
      case POWERUP_TYPES.SLOW_BALL:
        setBall(prev => ({
          ...prev,
          dx: prev.dx * GAME_CONSTANTS.POWERUP_EFFECTS.SLOW_BALL_MULTIPLIER,
          dy: prev.dy * GAME_CONSTANTS.POWERUP_EFFECTS.SLOW_BALL_MULTIPLIER
        }));
        setTimeout(() => {
          setBall(prev => ({
            ...prev,
            dx: prev.dx / GAME_CONSTANTS.POWERUP_EFFECTS.SLOW_BALL_MULTIPLIER,
            dy: prev.dy / GAME_CONSTANTS.POWERUP_EFFECTS.SLOW_BALL_MULTIPLIER
          }));
        }, GAME_CONSTANTS.POWERUP_EFFECTS.SLOW_BALL_DURATION);
        break;
    }
    
    if (soundEnabled) GameAudio.playHitSound();
  }, [soundEnabled, initialPaddleWidth]);

  return { handlePowerUpCollection };
};