import { useCallback } from 'react';
import { Ball, Paddle } from '@/types/game';
import { PowerUp } from '@/components/game/PowerUps';

interface UseGamePhysicsProps {
  screenDimensions: { width: number; height: number };
  isMobile: boolean;
}

export const useGamePhysics = ({ screenDimensions, isMobile }: UseGamePhysicsProps) => {
  // Update power-ups physics
  const updatePowerUps = useCallback((powerUps: PowerUp[], deltaTime: number): PowerUp[] => {
    return powerUps.map(powerUp => ({
      ...powerUp,
      y: powerUp.y + (isMobile ? 2 : 3) * deltaTime * 60,
    })).filter(powerUp => powerUp.y < screenDimensions.height);
  }, [screenDimensions.height, isMobile]);

  // Check power-up collection
  const checkPowerUpCollision = useCallback((
    ball: Ball,
    powerUp: PowerUp,
    threshold: number = 30
  ): boolean => {
    const distance = Math.sqrt(
      Math.pow(ball.x - powerUp.x, 2) + 
      Math.pow(ball.y - powerUp.y, 2)
    );
    return distance < threshold;
  }, []);

  // Check paddle-powerup collision
  const checkPaddlePowerUpCollision = useCallback((
    paddle: Paddle,
    powerUp: PowerUp,
    paddleY: number
  ): boolean => {
    return powerUp.y + 20 >= paddleY &&
           powerUp.y - 20 <= paddleY + paddle.height &&
           powerUp.x >= paddle.x - 20 &&
           powerUp.x <= paddle.x + paddle.width + 20;
  }, []);

  return {
    updatePowerUps,
    checkPowerUpCollision,
    checkPaddlePowerUpCollision,
  };
};