import { Vector2D, Rectangle, Circle, CollisionResult } from '@/types/physics';

// Vector math utilities
export const normalize = (vector: Vector2D): Vector2D => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (magnitude === 0) return { x: 0, y: 0 };
  return { x: vector.x / magnitude, y: vector.y / magnitude };
};

export const dot = (a: Vector2D, b: Vector2D): number => {
  return a.x * b.x + a.y * b.y;
};

export const reflect = (vector: Vector2D, normal: Vector2D): Vector2D => {
  const d = 2 * dot(vector, normal);
  return {
    x: vector.x - d * normal.x,
    y: vector.y - d * normal.y,
  };
};

// Enhanced Circle-Rectangle collision detection with proper side detection
export const checkCircleRectCollision = (circle: Circle, rect: Rectangle): CollisionResult => {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // Calculate the distance between the circle's center and the closest point
  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // No collision if distance is greater than radius
  if (distanceSquared >= circle.radius * circle.radius) {
    return { hit: false };
  }

  const distance = Math.sqrt(distanceSquared);
  
  // Improved collision normal calculation
  let normal: Vector2D;
  let side: 'top' | 'bottom' | 'left' | 'right';

  // Check if circle center is inside rectangle
  const insideRect = circle.x >= rect.x && circle.x <= rect.x + rect.width &&
                    circle.y >= rect.y && circle.y <= rect.y + rect.height;

  if (insideRect) {
    // Circle center is inside rectangle, find closest edge
    const toLeft = circle.x - rect.x;
    const toRight = (rect.x + rect.width) - circle.x;
    const toTop = circle.y - rect.y;
    const toBottom = (rect.y + rect.height) - circle.y;

    const minDistance = Math.min(toLeft, toRight, toTop, toBottom);

    if (minDistance === toLeft) {
      normal = { x: -1, y: 0 };
      side = 'left';
    } else if (minDistance === toRight) {
      normal = { x: 1, y: 0 };
      side = 'right';
    } else if (minDistance === toTop) {
      normal = { x: 0, y: -1 };
      side = 'top';
    } else {
      normal = { x: 0, y: 1 };
      side = 'bottom';
    }
  } else {
    // Circle center is outside rectangle
    if (distance === 0) {
      // Edge case: exactly on edge
      normal = { x: 0, y: -1 };
      side = 'top';
    } else {
      // Normal is the direction from closest point to circle center
      normal = normalize({ x: distanceX, y: distanceY });

      // Determine which side based on the position of the closest point
      const epsilon = 0.001;
      if (Math.abs(closestX - rect.x) < epsilon) {
        side = 'left';
      } else if (Math.abs(closestX - (rect.x + rect.width)) < epsilon) {
        side = 'right';
      } else if (Math.abs(closestY - rect.y) < epsilon) {
        side = 'top';
      } else {
        side = 'bottom';
      }
    }
  }

  return {
    hit: true,
    normal,
    point: { x: closestX, y: closestY },
    side,
    penetration: circle.radius - distance
  };
};

// Improved collision response with proper physics
export const applyCollisionResponse = (
  ball: { x: number; y: number; dx: number; dy: number; radius: number },
  collision: CollisionResult
): { x: number; y: number; dx: number; dy: number } => {
  if (!collision.hit || !collision.normal) {
    return ball;
  }

  // Apply position correction to prevent overlap
  if (collision.penetration && collision.penetration > 0) {
    ball.x += collision.normal.x * collision.penetration;
    ball.y += collision.normal.y * collision.penetration;
  }

  // Reflect velocity based on collision normal
  const velocity = { x: ball.dx, y: ball.dy };
  const reflected = reflect(velocity, collision.normal);

  // Apply some damping for more realistic physics
  const damping = 0.98;

  return {
    x: ball.x,
    y: ball.y,
    dx: reflected.x * damping,
    dy: reflected.y * damping
  };
};

// Continuous collision detection for fast-moving objects
export const predictCollision = (
  ball: { x: number; y: number; dx: number; dy: number; radius: number },
  rect: Rectangle,
  deltaTime: number
): { willCollide: boolean; timeOfImpact?: number } => {
  // Ray cast from current position in direction of velocity
  const rayLength = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy) * deltaTime;
  
  if (rayLength === 0) {
    return { willCollide: false };
  }

  // Expand rectangle by ball radius
  const expandedRect = {
    x: rect.x - ball.radius,
    y: rect.y - ball.radius,
    width: rect.width + ball.radius * 2,
    height: rect.height + ball.radius * 2
  };

  // Ray-rectangle intersection
  const dirX = ball.dx / rayLength;
  const dirY = ball.dy / rayLength;

  const tMinX = (expandedRect.x - ball.x) / dirX;
  const tMaxX = (expandedRect.x + expandedRect.width - ball.x) / dirX;
  const tMinY = (expandedRect.y - ball.y) / dirY;
  const tMaxY = (expandedRect.y + expandedRect.height - ball.y) / dirY;

  const tMin = Math.max(Math.min(tMinX, tMaxX), Math.min(tMinY, tMaxY));
  const tMax = Math.min(Math.max(tMinX, tMaxX), Math.max(tMinY, tMaxY));

  if (tMax < 0 || tMin > tMax || tMin > rayLength) {
    return { willCollide: false };
  }

  return { 
    willCollide: true, 
    timeOfImpact: Math.max(0, tMin) / rayLength 
  };
};

// Enhanced paddle collision with realistic physics
export const calculatePaddleReflection = (
  ballX: number,
  paddleX: number,
  paddleWidth: number,
  currentVelocity: Vector2D,
  maxAngleDeviation: number = Math.PI / 3 // 60 degrees
): Vector2D => {
  // Calculate hit position (0 = left edge, 1 = right edge)
  const hitPosition = Math.max(0, Math.min(1, (ballX - paddleX) / paddleWidth));
  
  // Convert to normalized position (-1 to 1, where 0 is center)
  const normalizedPosition = (hitPosition - 0.5) * 2;
  
  // Calculate angle based on hit position
  const baseAngle = -Math.PI / 2; // Straight up
  const angleOffset = normalizedPosition * maxAngleDeviation;
  const finalAngle = baseAngle + angleOffset;
  
  // Maintain current speed but change direction
  const currentSpeed = Math.sqrt(currentVelocity.x * currentVelocity.x + currentVelocity.y * currentVelocity.y);
  
  // Add slight speed boost based on hit position (edges give more speed)
  const speedBoost = 1 + Math.abs(normalizedPosition) * 0.15;
  const newSpeed = currentSpeed * speedBoost;
  
  return {
    x: Math.cos(finalAngle) * newSpeed,
    y: Math.sin(finalAngle) * newSpeed
  };
};

// AABB collision detection
export const checkAABBCollision = (rect1: Rectangle, rect2: Rectangle): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Clamp value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Linear interpolation
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

// Easing functions for smooth animations
export const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};

export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};