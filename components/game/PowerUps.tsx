'use client';

import React, { FC } from 'react';
import { Box } from '@mui/material';
import { POWERUP_CONFIG } from '@/constants/game';

export interface PowerUp {
  id: string;
  type: 'multiball' | 'widen-paddle' | 'slow-ball' | 'extra-life';
  x: number;
  y: number;
  active: boolean;
}

interface PowerUpsProps {
  powerUps: PowerUp[];
  onCollect: (powerUp: PowerUp) => void;
}

interface PowerUpItemProps {
  powerUp: PowerUp;
  onCollect: (powerUp: PowerUp) => void;
}

const PowerUpItemComponent: FC<PowerUpItemProps> = ({ powerUp, onCollect }) => {
  const config = POWERUP_CONFIG[powerUp.type];
  
  return (
    <Box
      onClick={() => onCollect(powerUp)}
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: config.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        boxShadow: `0 2px 8px ${config.color}40`,
        cursor: 'pointer',
        border: '2px solid white',
        willChange: 'transform',
        transform: `translate3d(${powerUp.x - 20}px, ${powerUp.y}px, 0)`,
        transition: 'transform 0.016s linear',
        zIndex: 120, // Below pause overlay (200)
      }}
    >
      {config.icon}
    </Box>
  );
};

export const PowerUpItem = React.memo(PowerUpItemComponent, (prevProps, nextProps) => {
  return prevProps.powerUp.x === nextProps.powerUp.x &&
         prevProps.powerUp.y === nextProps.powerUp.y &&
         prevProps.powerUp.id === nextProps.powerUp.id;
});

const PowerUpsComponent: FC<PowerUpsProps> = ({ powerUps, onCollect }) => {
  return (
    <>
      {powerUps.map((powerUp) => (
        <PowerUpItem
          key={powerUp.id}
          powerUp={powerUp}
          onCollect={onCollect}
        />
      ))}
    </>
  );
};

export const PowerUps = React.memo(PowerUpsComponent);

export default PowerUps;