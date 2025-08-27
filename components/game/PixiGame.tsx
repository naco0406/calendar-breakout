'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { CalendarEvent } from '@/types/calendar';
import { GameState } from '@/types/game';
import { GameAudio } from '@/utils/audio';

interface PixiGameProps {
  events: CalendarEvent[];
  destroyedEvents: Set<string>;
  onEventDestroyed: (eventId: string) => void;
  onScoreUpdate: (score: number) => void;
  onLivesUpdate: (lives: number) => void;
  onGameOver: () => void;
  onVictory: () => void;
  gameState: GameState;
  soundEnabled: boolean;
  dimensions: {
    timeColumnWidth: number;
    headerHeight: number;
    hourHeight: number;
    ballRadius: number;
    paddleWidth: number;
    paddleHeight: number;
  };
  screenDimensions: { width: number; height: number };
  isMobile: boolean;
}

export default function PixiGame({
  events,
  destroyedEvents,
  onEventDestroyed,
  onScoreUpdate,
  onLivesUpdate,
  onGameOver,
  onVictory,
  gameState,
  soundEnabled,
  dimensions,
  screenDimensions,
  isMobile,
}: PixiGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballBodyRef = useRef<Matter.Body | null>(null);
  const paddleBodyRef = useRef<Matter.Body | null>(null);
  const eventBodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const ballSpriteRef = useRef<PIXI.Graphics | null>(null);
  const paddleSpriteRef = useRef<PIXI.Graphics | null>(null);
  const eventSpritesRef = useRef<Map<string, PIXI.Graphics>>(new Map());
  
  const [combo, setCombo] = useState(0);
  const [powerUps, setPowerUps] = useState<Array<any>>([]);

  // Initialize Pixi.js and Matter.js
  useEffect(() => {
    if (!containerRef.current) return;

    // Create Pixi Application
    const app = new PIXI.Application({
      width: screenDimensions.width,
      height: screenDimensions.height,
      backgroundColor: 0xffffff,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerRef.current.appendChild(app.view as HTMLCanvasElement);
    appRef.current = app;

    // Create Matter.js engine
    const engine = Matter.Engine.create();
    engine.gravity.scale = 0; // No gravity for breakout game
    engineRef.current = engine;

    // Create walls
    const walls = [
      // Top wall
      Matter.Bodies.rectangle(screenDimensions.width / 2, -25, screenDimensions.width, 50, { 
        isStatic: true,
        label: 'wall-top' 
      }),
      // Left wall
      Matter.Bodies.rectangle(dimensions.timeColumnWidth / 2, screenDimensions.height / 2, dimensions.timeColumnWidth, screenDimensions.height, { 
        isStatic: true,
        label: 'wall-left' 
      }),
      // Right wall
      Matter.Bodies.rectangle(screenDimensions.width - 5, screenDimensions.height / 2, 10, screenDimensions.height, { 
        isStatic: true,
        label: 'wall-right' 
      }),
    ];

    Matter.Composite.add(engine.world, walls);

    // Create ball
    const ballRadius = dimensions.ballRadius;
    const ball = Matter.Bodies.circle(
      screenDimensions.width / 2,
      screenDimensions.height - 200,
      ballRadius,
      {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        frictionStatic: 0,
        density: 0.001,
        label: 'ball',
      }
    );

    // Set initial velocity
    const initialSpeed = isMobile ? 4.5 : 6;
    Matter.Body.setVelocity(ball, {
      x: initialSpeed * Math.cos(-Math.PI / 4),
      y: initialSpeed * Math.sin(-Math.PI / 4),
    });

    ballBodyRef.current = ball;
    Matter.Composite.add(engine.world, ball);

    // Create ball sprite
    const ballSprite = new PIXI.Graphics();
    ballSprite.beginFill(0x333333);
    ballSprite.drawCircle(0, 0, ballRadius);
    ballSprite.endFill();
    app.stage.addChild(ballSprite);
    ballSpriteRef.current = ballSprite;

    // Create paddle
    const paddle = Matter.Bodies.rectangle(
      screenDimensions.width / 2,
      screenDimensions.height - 80,
      dimensions.paddleWidth,
      dimensions.paddleHeight,
      {
        isStatic: true,
        label: 'paddle',
        chamfer: { radius: 4 },
      }
    );
    paddleBodyRef.current = paddle;
    Matter.Composite.add(engine.world, paddle);

    // Create paddle sprite
    const paddleSprite = new PIXI.Graphics();
    paddleSprite.beginFill(0x1976d2);
    paddleSprite.drawRoundedRect(
      -dimensions.paddleWidth / 2,
      -dimensions.paddleHeight / 2,
      dimensions.paddleWidth,
      dimensions.paddleHeight,
      4
    );
    paddleSprite.endFill();
    app.stage.addChild(paddleSprite);
    paddleSpriteRef.current = paddleSprite;

    // Handle collisions
    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      
      pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // Ball collision with paddle
        if ((bodyA.label === 'ball' && bodyB.label === 'paddle') ||
            (bodyB.label === 'ball' && bodyA.label === 'paddle')) {
          
          const ball = bodyA.label === 'ball' ? bodyA : bodyB;
          const paddle = bodyA.label === 'paddle' ? bodyA : bodyB;
          
          // Calculate hit position for spin
          const relativeX = ball.position.x - paddle.position.x;
          const normalizedX = relativeX / (dimensions.paddleWidth / 2);
          const spin = normalizedX * 2;
          
          // Apply new velocity with spin
          const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
          const newSpeed = speed * 1.02; // Slight speed increase
          const angle = -Math.PI / 2 + spin * 0.5;
          
          Matter.Body.setVelocity(ball, {
            x: Math.cos(angle) * newSpeed,
            y: Math.sin(angle) * newSpeed,
          });
          
          if (soundEnabled) GameAudio.playHitSound();
        }
        
        // Ball collision with event
        if ((bodyA.label === 'ball' && bodyB.label?.startsWith('event-')) ||
            (bodyB.label === 'ball' && bodyA.label?.startsWith('event-'))) {
          
          const eventBody = bodyA.label?.startsWith('event-') ? bodyA : bodyB;
          const eventId = eventBody.label?.replace('event-', '');
          
          if (eventId && !destroyedEvents.has(eventId)) {
            onEventDestroyed(eventId);
            setCombo(prev => prev + 1);
            
            // Remove event body and sprite
            Matter.Composite.remove(engine.world, eventBody);
            const sprite = eventSpritesRef.current.get(eventId);
            if (sprite) {
              app.stage.removeChild(sprite);
              eventSpritesRef.current.delete(eventId);
            }
            eventBodiesRef.current.delete(eventId);
            
            // Update score
            const baseScore = 100;
            const comboMultiplier = Math.max(1, combo * 0.5);
            onScoreUpdate(Math.floor(baseScore * comboMultiplier));
            
            if (soundEnabled) GameAudio.playHitSound();
          }
        }
        
        // Ball collision with walls
        if ((bodyA.label === 'ball' && bodyB.label?.startsWith('wall-')) ||
            (bodyB.label === 'ball' && bodyA.label?.startsWith('wall-'))) {
          if (soundEnabled) GameAudio.playHitSound();
        }
      });
    });

    // Game loop
    const gameLoop = () => {
      if (gameState.status === 'playing') {
        Matter.Engine.update(engine, 1000 / 60);
        
        // Update sprites positions
        if (ballBodyRef.current && ballSpriteRef.current) {
          ballSpriteRef.current.position.set(
            ballBodyRef.current.position.x,
            ballBodyRef.current.position.y
          );
          
          // Check if ball fell off screen
          if (ballBodyRef.current.position.y > screenDimensions.height + 50) {
            setCombo(0);
            onLivesUpdate(-1);
            
            // Reset ball position
            Matter.Body.setPosition(ballBodyRef.current, {
              x: screenDimensions.width / 2,
              y: screenDimensions.height - 200,
            });
            
            const speed = isMobile ? 4.5 : 6;
            Matter.Body.setVelocity(ballBodyRef.current, {
              x: speed * Math.cos(-Math.PI / 4),
              y: speed * Math.sin(-Math.PI / 4),
            });
          }
        }
        
        if (paddleBodyRef.current && paddleSpriteRef.current) {
          paddleSpriteRef.current.position.set(
            paddleBodyRef.current.position.x,
            paddleBodyRef.current.position.y
          );
        }
        
        // Update event sprites
        eventBodiesRef.current.forEach((body, id) => {
          const sprite = eventSpritesRef.current.get(id);
          if (sprite) {
            sprite.position.set(body.position.x, body.position.y);
          }
        });
        
        // Check victory
        if (eventBodiesRef.current.size === 0 && events.length > 0) {
          onVictory();
        }
      }
    };

    app.ticker.add(gameLoop);

    // Cleanup
    return () => {
      app.ticker.remove(gameLoop);
      Matter.Events.off(engine, 'collisionStart');
      app.destroy(true, { children: true });
      if (containerRef.current && app.view) {
        containerRef.current.removeChild(app.view as HTMLCanvasElement);
      }
    };
  }, [screenDimensions, dimensions, isMobile, soundEnabled]);

  // Handle mouse/touch movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameState.status === 'playing' && paddleBodyRef.current) {
        const newX = Math.max(
          dimensions.timeColumnWidth + dimensions.paddleWidth / 2,
          Math.min(e.clientX, screenDimensions.width - dimensions.paddleWidth / 2)
        );
        Matter.Body.setPosition(paddleBodyRef.current, {
          x: newX,
          y: paddleBodyRef.current.position.y,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameState.status === 'playing' && e.touches.length > 0 && paddleBodyRef.current) {
        e.preventDefault();
        const touch = e.touches[0];
        const newX = Math.max(
          dimensions.timeColumnWidth + dimensions.paddleWidth / 2,
          Math.min(touch.clientX, screenDimensions.width - dimensions.paddleWidth / 2)
        );
        Matter.Body.setPosition(paddleBodyRef.current, {
          x: newX,
          y: paddleBodyRef.current.position.y,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState.status, dimensions, screenDimensions]);

  // Create event blocks
  useEffect(() => {
    if (!appRef.current || !engineRef.current || !containerRef.current) return;

    const app = appRef.current;
    const engine = engineRef.current;
    const container = containerRef.current;

    // Clear existing event bodies
    eventBodiesRef.current.forEach((body) => {
      Matter.Composite.remove(engine.world, body);
    });
    eventSpritesRef.current.forEach((sprite) => {
      app.stage.removeChild(sprite);
    });
    eventBodiesRef.current.clear();
    eventSpritesRef.current.clear();

    // Get calendar container rect
    const containerRect = container.getBoundingClientRect();

    // Create new event bodies
    events.forEach((event) => {
      if (!destroyedEvents.has(event.id)) {
        // Get event element from DOM
        const eventElement = document.querySelector(`[data-event-id="${event.id}"]`) as HTMLElement;
        if (eventElement) {
          const rect = eventElement.getBoundingClientRect();
          const relativeRect = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            width: rect.width,
            height: rect.height,
          };

          // Create Matter.js body
          const body = Matter.Bodies.rectangle(
            relativeRect.x,
            relativeRect.y,
            relativeRect.width,
            relativeRect.height,
            {
              isStatic: true,
              label: `event-${event.id}`,
            }
          );
          Matter.Composite.add(engine.world, body);
          eventBodiesRef.current.set(event.id, body);

          // Create visual representation (invisible as DOM handles display)
          const sprite = new PIXI.Graphics();
          sprite.alpha = 0; // Invisible
          app.stage.addChild(sprite);
          eventSpritesRef.current.set(event.id, sprite);
        }
      }
    });
  }, [events, destroyedEvents]);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
        pointerEvents: gameState.status === 'playing' ? 'auto' : 'none',
      }}
    />
  );
}