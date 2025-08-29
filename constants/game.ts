export const GAME_CONSTANTS = {
  // Dimensions
  BALL_RADIUS: {
    MOBILE: 6,
    DESKTOP: 8,
  },
  PADDLE: {
    WIDTH: {
      MOBILE: 80,
      DESKTOP: 120,
    },
    HEIGHT: {
      MOBILE: 10,
      DESKTOP: 14,
    },
    SPEED: 8,
    EXTEND_MULTIPLIER: 1.5,
    EXTEND_DURATION: 10000, // 10 seconds
  },
  
  // Physics
  BALL_SPEED: {
    INITIAL: {
      MOBILE: 4,
      DESKTOP: 5.5,
    },
    MAX: {
      MOBILE: 8,
      DESKTOP: 10,
    },
  },
  
  // Game
  MAX_LIVES: 5,
  INITIAL_LIVES: 3,
  
  // Scoring
  BASE_SCORE: 100,
  COMBO_MULTIPLIER: 0.5,
  
  // Power-ups
  POWERUP_DROP_CHANCE: 0.2,
  POWERUP_FALL_SPEED: {
    MOBILE: 2,
    DESKTOP: 3,
  },
  POWERUP_EFFECTS: {
    SLOW_BALL_MULTIPLIER: 0.5,
    SLOW_BALL_DURATION: 8000, // 8 seconds
  },
  
  // UI
  PADDLE_BOTTOM_OFFSET: 80,
  POWERUP_SIZE: 40,
  POWERUP_COLLECTION_THRESHOLD: 30,
  
  // Animation
  TARGET_FPS: 60,
  EVENT_DESTROY_ANIMATION_DURATION: 200, // ms
} as const;

export const POWERUP_TYPES = {
  MULTIBALL: 'multiball',
  WIDEN_PADDLE: 'widen-paddle',
  SLOW_BALL: 'slow-ball',
  EXTRA_LIFE: 'extra-life',
} as const;

export const POWERUP_CONFIG = {
  [POWERUP_TYPES.MULTIBALL]: {
    icon: '⚡',
    color: '#FFD700',
    name: 'Multi Ball',
    effect: 'Split ball into multiple balls',
  },
  [POWERUP_TYPES.WIDEN_PADDLE]: {
    icon: '🔷',
    color: '#00BCD4',
    name: 'Wide Paddle',
    effect: 'Makes paddle 50% wider for 10 seconds',
  },
  [POWERUP_TYPES.SLOW_BALL]: {
    icon: '🐌',
    color: '#4CAF50',
    name: 'Slow Ball',
    effect: 'Slows ball speed by 50% for 8 seconds',
  },
  [POWERUP_TYPES.EXTRA_LIFE]: {
    icon: '❤️',
    color: '#F44336',
    name: 'Extra Life',
    effect: 'Adds one extra life (max 5)',
  },
} as const;

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
} as const;

export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];
export type PowerUpType = typeof POWERUP_TYPES[keyof typeof POWERUP_TYPES];