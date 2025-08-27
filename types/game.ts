export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver' | 'won';

export interface GameState {
  score: number;
  lives: number;
  level: number;
  gameStatus: GameStatus;
}

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}