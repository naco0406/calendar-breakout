'use client';

import React from 'react';
import { Box } from '@mui/material';

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

const POWER_UP_CONFIG = {
  multiball: {
    icon: '⚡',
    color: '#FFD700',
    name: 'Multi Ball',
  },
  'widen-paddle': {
    icon: '🔷',
    color: '#00BCD4',
    name: 'Wide Paddle',
  },
  'slow-ball': {
    icon: '🐌',
    color: '#4CAF50',
    name: 'Slow Ball',
  },
  'extra-life': {
    icon: '❤️',
    color: '#F44336',
    name: 'Extra Life',
  },
};

const PowerUpItem = React.memo(({ powerUp, onCollect }: { powerUp: PowerUp; onCollect: (powerUp: PowerUp) => void }) => {
  const config = POWER_UP_CONFIG[powerUp.type];
  
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
}, (prevProps, nextProps) => {
  return prevProps.powerUp.x === nextProps.powerUp.x &&
         prevProps.powerUp.y === nextProps.powerUp.y &&
         prevProps.powerUp.id === nextProps.powerUp.id;
});

PowerUpItem.displayName = 'PowerUpItem';

const PowerUps = React.memo(({ powerUps, onCollect }: PowerUpsProps) => {
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
});

PowerUps.displayName = 'PowerUps';

export default PowerUps;