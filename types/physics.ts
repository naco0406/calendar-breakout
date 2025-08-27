export interface Vector2D {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export interface CollisionResult {
  hit: boolean;
  normal?: Vector2D;
  point?: Vector2D;
  side?: 'top' | 'bottom' | 'left' | 'right';
  penetration?: number;
}