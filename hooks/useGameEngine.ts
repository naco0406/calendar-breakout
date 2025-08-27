import { useRef, useCallback, useEffect, useState } from 'react';
import { GameState, Ball, Paddle } from '@/types/game';
import { CalendarEvent } from '@/types/calendar';
import { Vector2D, Particle } from '@/types/physics';
import { 
  checkCircleRectCollision, 
  calculatePaddleReflection, 
  reflect,
  clamp,
  easeOutQuad
} from '@/utils/physics';

interface GameEngineOptions {
  width: number;
  height: number;
  events: CalendarEvent[];
  onEventHit?: (event: CalendarEvent) => void;
  onGameOver?: () => void;
  onLevelComplete?: () => void;
}

export const useGameEngine = ({
  width,
  height,
  events,
  onEventHit,
  onGameOver,
  onLevelComplete,
}: GameEngineOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const ballTrailRef = useRef<Vector2D[]>([]);
  const screenShakeRef = useRef({ x: 0, y: 0, intensity: 0 });

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    gameStatus: 'idle',
  });

  const [ball, setBall] = useState<Ball>({
    x: width / 2,
    y: height - 100,
    dx: 4,
    dy: -4,
    radius: 8,
    speed: 5,
  });

  const [paddle, setPaddle] = useState<Paddle>({
    x: width / 2 - 50,
    y: height - 30,
    width: 100,
    height: 15,
    speed: 8,
  });

  const [activeEvents, setActiveEvents] = useState<Set<string>>(
    new Set(events.map(e => e.id))
  );

  // Input handling
  const mousePosition = useRef({ x: width / 2 });
  const touchPosition = useRef({ x: width / 2 });
  const keysPressed = useRef<Set<string>>(new Set());

  // Create particles effect
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: 3 + Math.random() * 3,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
  }, []);

  // Screen shake effect
  const triggerScreenShake = useCallback((intensity: number) => {
    screenShakeRef.current.intensity = intensity;
  }, []);

  // Ball trail effect
  const updateBallTrail = useCallback((x: number, y: number) => {
    ballTrailRef.current.push({ x, y });
    if (ballTrailRef.current.length > 10) {
      ballTrailRef.current.shift();
    }
  }, []);

  // Update particles
  const updateParticles = useCallback((deltaTime: number) => {
    particlesRef.current = particlesRef.current
      .map(p => ({
        ...p,
        x: p.x + p.vx * deltaTime * 60,
        y: p.y + p.vy * deltaTime * 60,
        vy: p.vy + 0.2, // gravity
        life: p.life - deltaTime * 2,
      }))
      .filter(p => p.life > 0);
  }, []);

  // Update screen shake
  const updateScreenShake = useCallback((deltaTime: number) => {
    if (screenShakeRef.current.intensity > 0) {
      screenShakeRef.current.x = (Math.random() - 0.5) * screenShakeRef.current.intensity;
      screenShakeRef.current.y = (Math.random() - 0.5) * screenShakeRef.current.intensity;
      screenShakeRef.current.intensity *= 0.9;
      if (screenShakeRef.current.intensity < 0.1) {
        screenShakeRef.current.intensity = 0;
      }
    }
  }, []);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;

    const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
    lastTimeRef.current = currentTime;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply screen shake
    ctx.save();
    ctx.translate(screenShakeRef.current.x, screenShakeRef.current.y);

    if (gameState.gameStatus === 'playing') {
      // Update ball position
      setBall(prevBall => {
        let newX = prevBall.x + prevBall.dx;
        let newY = prevBall.y + prevBall.dy;
        let newDx = prevBall.dx;
        let newDy = prevBall.dy;

        // Wall collisions
        if (newX - prevBall.radius <= 0 || newX + prevBall.radius >= width) {
          newDx = -newDx;
          newX = clamp(newX, prevBall.radius, width - prevBall.radius);
          triggerScreenShake(5);
        }

        if (newY - prevBall.radius <= 0) {
          newDy = -newDy;
          newY = prevBall.radius;
          triggerScreenShake(5);
        }

        // Bottom boundary (lose life)
        if (newY + prevBall.radius >= height) {
          setGameState(prev => {
            const newLives = prev.lives - 1;
            if (newLives <= 0) {
              onGameOver?.();
              return { ...prev, lives: 0, gameStatus: 'gameOver' };
            }
            return { ...prev, lives: newLives };
          });
          // Reset ball position
          return {
            ...prevBall,
            x: width / 2,
            y: height - 100,
            dx: 4,
            dy: -4,
          };
        }

        // Paddle collision
        const paddleRect = {
          x: paddle.x,
          y: paddle.y,
          width: paddle.width,
          height: paddle.height,
        };

        const ballCircle = {
          x: newX,
          y: newY,
          radius: prevBall.radius,
        };

        const paddleCollision = checkCircleRectCollision(ballCircle, paddleRect);
        if (paddleCollision.hit && prevBall.dy > 0) {
          const newVelocity = calculatePaddleReflection(
            newX,
            paddle.x,
            paddle.width,
            { x: newDx, y: newDy }
          );
          newDx = newVelocity.x;
          newDy = newVelocity.y;
          triggerScreenShake(8);
        }

        updateBallTrail(newX, newY);

        return {
          ...prevBall,
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy,
        };
      });

      // Update paddle position
      setPaddle(prevPaddle => {
        let targetX = mousePosition.current.x - prevPaddle.width / 2;
        
        // Keyboard controls
        if (keysPressed.current.has('ArrowLeft')) {
          targetX = prevPaddle.x - prevPaddle.speed;
        } else if (keysPressed.current.has('ArrowRight')) {
          targetX = prevPaddle.x + prevPaddle.speed;
        }

        const newX = clamp(targetX, 0, width - prevPaddle.width);
        return { ...prevPaddle, x: newX };
      });
    }

    // Update effects
    updateParticles(deltaTime);
    updateScreenShake(deltaTime);

    // Draw ball trail
    ctx.globalAlpha = 0.3;
    ballTrailRef.current.forEach((point, index) => {
      const size = (index / ballTrailRef.current.length) * ball.radius;
      ctx.fillStyle = '#2196f3';
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw ball
    const gradient = ctx.createRadialGradient(
      ball.x - ball.radius / 3,
      ball.y - ball.radius / 3,
      0,
      ball.x,
      ball.y,
      ball.radius
    );
    gradient.addColorStop(0, '#64b5f6');
    gradient.addColorStop(1, '#1976d2');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddle
    const paddleGradient = ctx.createLinearGradient(
      paddle.x,
      paddle.y,
      paddle.x,
      paddle.y + paddle.height
    );
    paddleGradient.addColorStop(0, '#424242');
    paddleGradient.addColorStop(1, '#212121');
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        particle.x - particle.size / 2,
        particle.y - particle.size / 2,
        particle.size,
        particle.size
      );
    });
    ctx.globalAlpha = 1;

    ctx.restore();

    if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'paused') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [ball, paddle, gameState, width, height, createParticles, triggerScreenShake, updateBallTrail, updateParticles, updateScreenShake, onGameOver]);

  // Start game
  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
    cancelAnimationFrame(animationRef.current);
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mousePosition.current.x = e.clientX - rect.left;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect && e.touches.length > 0) {
        touchPosition.current.x = e.touches[0].clientX - rect.left;
        mousePosition.current.x = touchPosition.current.x;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState.gameStatus === 'playing') {
          pauseGame();
        } else if (gameState.gameStatus === 'paused') {
          resumeGame();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState.gameStatus, pauseGame, resumeGame]);

  return {
    canvasRef,
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    ball,
    paddle,
    activeEvents,
  };
};