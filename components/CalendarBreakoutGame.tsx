'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { CalendarEvent } from '@/types/calendar';
import { SAMPLE_EVENTS, TIME_SLOTS } from '@/constants/calendar';
import { GameAudio } from '@/utils/audio';
import { startOfWeek } from 'date-fns';
import OptimizedPaddle from '@/components/game/OptimizedPaddle';
import OptimizedBall from '@/components/game/OptimizedBall';
import UltraHUD from '@/components/game/UltraHUD';
import EnhancedGameOverlay from '@/components/game/EnhancedGameOverlay';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarBody from '@/components/calendar/CalendarBody';
import PowerUps, { PowerUp } from '@/components/game/PowerUps';
import ComboDisplay from '@/components/game/ComboDisplay';
import Tutorial from '@/components/game/Tutorial';
import { useGamePhysics } from '@/hooks/useGamePhysics';
import { useOptimizedGameLoop } from '@/hooks/useOptimizedGameLoop';
import { checkCircleRectCollision, applyCollisionResponse, calculatePaddleReflection } from '@/utils/physics';

interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'gameOver' | 'victory';
  score: number;
  lives: number;
  level: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  width: number;
  height: number;
}

const CalendarBreakoutGame = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate);

  // Screen dimensions state should be before dimensions calculation
  const [screenDimensions, setScreenDimensions] = useState({ width: 800, height: 600 });
  
  // Memoized responsive dimensions
  const dimensions = useMemo(() => {
    // Calculate hour height based on screen height to fill the screen
    const availableHeight = screenDimensions.height - (isMobile ? 50 : 60); // Subtract header height
    const hourHeight = Math.floor(availableHeight / TIME_SLOTS.length);
    
    return {
      timeColumnWidth: isMobile ? 48 : 60,
      headerHeight: isMobile ? 50 : 60,
      hourHeight: hourHeight,
      ballRadius: isMobile ? 6 : 8,
      paddleWidth: isMobile ? 80 : 120,
      paddleHeight: isMobile ? 10 : 14,
    };
  }, [isMobile, screenDimensions.height]);

  const calendarHeight = TIME_SLOTS.length * dimensions.hourHeight;

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    status: 'idle',
    score: 0,
    lives: 3,
    level: 1,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [events] = useState<CalendarEvent[]>(SAMPLE_EVENTS);
  const [destroyedEvents, setDestroyedEvents] = useState<Set<string>>(new Set());
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showTutorial, setShowTutorial] = useState(() => {
    const hasSeenTutorial = typeof window !== 'undefined' ? localStorage.getItem('hasSeenTutorial') : null;
    return !hasSeenTutorial;
  });

  // Game Objects with proper initial positioning
  const [ball, setBall] = useState<Ball>({
    x: 400,
    y: 450,  // Start lower on the screen
    dx: isMobile ? 4 : 5.5,
    dy: isMobile ? -4 : -5.5,
    radius: dimensions.ballRadius,
  });

  const [paddle, setPaddle] = useState<Paddle>({
    x: 300,
    width: dimensions.paddleWidth,
    height: dimensions.paddleHeight,
  });

  // Screen dimensions with debounced updates
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenDimensions({ width, height });
      
      // Reset paddle position to center when screen resizes
      setPaddle(prev => ({
        ...prev,
        x: Math.max(dimensions.timeColumnWidth, Math.min(width / 2 - prev.width / 2, width - prev.width - dimensions.timeColumnWidth))
      }));
    };

    updateDimensions();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', debouncedUpdate);
    window.addEventListener('orientationchange', debouncedUpdate);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('orientationchange', debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, [dimensions.timeColumnWidth, dimensions.paddleWidth]);

  // Game physics hook
  const { updatePowerUps, checkPaddlePowerUpCollision } = useGamePhysics({
    screenDimensions,
    isMobile,
  });
  
  // Handle power-up collection
  const handlePowerUpCollection = useCallback((powerUp: PowerUp) => {
    switch (powerUp.type) {
      case 'extra-life':
        setGameState(prev => ({ ...prev, lives: Math.min(prev.lives + 1, 5) }));
        break;
      case 'widen-paddle':
        setPaddle(prev => ({ ...prev, width: prev.width * 1.5 }));
        setTimeout(() => {
          setPaddle(prev => ({ ...prev, width: dimensions.paddleWidth }));
        }, 10000);
        break;
      case 'slow-ball':
        setBall(prev => ({ ...prev, dx: prev.dx * 0.5, dy: prev.dy * 0.5 }));
        setTimeout(() => {
          setBall(prev => ({ ...prev, dx: prev.dx * 2, dy: prev.dy * 2 }));
        }, 8000);
        break;
    }
    
    if (soundEnabled) GameAudio.playHitSound();
  }, [soundEnabled, dimensions.paddleWidth]);

  // Memoized active events to prevent unnecessary recalculations
  const activeEvents = useMemo(() => 
    events.filter(event => !destroyedEvents.has(event.id)), 
    [events, destroyedEvents]
  );

  // Cache DOM elements for collision detection
  const eventElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const newMap = new Map<string, HTMLElement>();
    activeEvents.forEach(event => {
      const element = containerRef.current?.querySelector(`[data-event-id="${event.id}"]`) as HTMLElement;
      if (element) {
        newMap.set(event.id, element);
      }
    });
    eventElementsRef.current = newMap;
  }, [activeEvents]);

  // Optimized collision detection with improved physics
  const checkEventCollisions = useCallback(() => {
    if (!containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    for (const event of activeEvents) {
      const eventElement = eventElementsRef.current.get(event.id);
      if (eventElement) {
        const rect = eventElement.getBoundingClientRect();
        const relativeRect = {
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        };

        // Use improved physics collision detection
        const collision = checkCircleRectCollision(
          { x: ball.x, y: ball.y, radius: ball.radius },
          relativeRect
        );
        
        if (collision.hit) {
          return { event, collision };
        }
      }
    }
    return null;
  }, [activeEvents, ball.x, ball.y, ball.radius]);

  // Optimized game loop
  const gameLoop = useCallback((deltaTime: number) => {
    if (gameState.status !== 'playing') return;

    setBall(prevBall => {
      let newX = prevBall.x + prevBall.dx;
      let newY = prevBall.y + prevBall.dy;
      let newDx = prevBall.dx;
      let newDy = prevBall.dy;

      // Wall collisions
      if (newX - prevBall.radius <= dimensions.timeColumnWidth) {
        newX = dimensions.timeColumnWidth + prevBall.radius;
        newDx = Math.abs(newDx);
        if (soundEnabled) GameAudio.playHitSound();
      } else if (newX + prevBall.radius >= screenDimensions.width) {
        newX = screenDimensions.width - prevBall.radius;
        newDx = -Math.abs(newDx);
        if (soundEnabled) GameAudio.playHitSound();
      }

      // Top boundary (respect calendar header)
      const topBoundary = dimensions.headerHeight;
      if (newY - prevBall.radius <= topBoundary) {
        newY = topBoundary + prevBall.radius;
        newDy = Math.abs(newDy);
        if (soundEnabled) GameAudio.playHitSound();
      }

      // Simple paddle collision detection
      const paddleY = screenDimensions.height - 80 - dimensions.paddleHeight;
      if (newY + prevBall.radius >= paddleY &&
          newY + prevBall.radius <= paddleY + dimensions.paddleHeight + 10 &&
          newX >= paddle.x - 10 &&
          newX <= paddle.x + dimensions.paddleWidth + 10) {
        
        // Calculate hit position and apply spin
        const paddleCenter = paddle.x + dimensions.paddleWidth / 2;
        const hitPosition = (newX - paddleCenter) / (dimensions.paddleWidth / 2);
        
        newY = paddleY - prevBall.radius;
        newDy = -Math.abs(newDy);
        newDx = newDx + hitPosition * 2;
        
        // Speed limit
        const maxSpeed = isMobile ? 8 : 10;
        newDx = Math.max(-maxSpeed, Math.min(maxSpeed, newDx));
        
        if (soundEnabled) GameAudio.playHitSound();
      }

      // Bottom boundary
      if (newY > screenDimensions.height + 50) {
        setCombo(0); // Reset combo on miss
        setGameState(prev => {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            if (soundEnabled) GameAudio.playGameOverSound();
            return { ...prev, status: 'gameOver', lives: 0 };
          }
          return { ...prev, lives: newLives };
        });
        
        // Reset ball
        return {
          x: screenDimensions.width / 2,
          y: screenDimensions.height - 200,  // Start near bottom
          dx: isMobile ? 4 : 5.5,
          dy: isMobile ? -4 : -5.5,
          radius: prevBall.radius,
        };
      }

      // Speed limit
      const maxSpeed = isMobile ? 8 : 10;
      newDx = Math.max(-maxSpeed, Math.min(maxSpeed, newDx));
      newDy = Math.max(-maxSpeed, Math.min(maxSpeed, newDy));

      return { ...prevBall, x: newX, y: newY, dx: newDx, dy: newDy };
    });

    // Update power-ups
    setPowerUps(prev => {
      const updated = updatePowerUps(prev, deltaTime);
      
      // Check collisions with paddle
      return updated.filter(powerUp => {
        const paddleY = screenDimensions.height - 80 - dimensions.paddleHeight;
        if (checkPaddlePowerUpCollision(paddle, powerUp, paddleY)) {
          // Trigger collection
          handlePowerUpCollection(powerUp);
          return false;
        }
        return true;
      });
    });
  }, [gameState.status, soundEnabled, dimensions, screenDimensions, isMobile, paddle.x, activeEvents.length, updatePowerUps, checkPaddlePowerUpCollision, handlePowerUpCollection]);

  // Use optimized game loop
  useOptimizedGameLoop({
    callback: gameLoop,
    isRunning: gameState.status === 'playing',
    targetFPS: 60
  });

  // Check event collisions after ball position updates
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const collisionResult = checkEventCollisions();
    if (collisionResult) {
      const { event: hitEvent, collision } = collisionResult;
      
      // Destroy event
      setDestroyedEvents(prev => new Set([...prev, hitEvent.id]));
      
      // Update combo
      setCombo(prev => {
        const newCombo = prev + 1;
        setMaxCombo(max => Math.max(max, newCombo));
        return newCombo;
      });
      
      // Update score
      const baseScore = 100;
      const comboMultiplier = Math.max(1, combo * 0.5);
      const finalScore = Math.floor(baseScore * comboMultiplier);
      setGameState(prev => ({ ...prev, score: prev.score + finalScore }));
      
      // Spawn power-up chance
      if (Math.random() < 0.2) {
        const newPowerUp: PowerUp = {
          id: `powerup-${Date.now()}`,
          type: (['multiball', 'widen-paddle', 'slow-ball', 'extra-life'] as const)[Math.floor(Math.random() * 4)],
          x: ball.x,
          y: ball.y,
          active: true,
        };
        setPowerUps(prev => [...prev, newPowerUp]);
      }
      
      if (soundEnabled) GameAudio.playHitSound();
      
      // Apply collision response
      setBall(prev => {
        const response = applyCollisionResponse(prev, collision);
        return {
          ...prev,
          x: response.x,
          y: response.y,
          dx: response.dx,
          dy: response.dy
        };
      });

      // Animate event destruction
      const eventElement = containerRef.current?.querySelector(`[data-event-id="${hitEvent.id}"]`) as HTMLElement;
      if (eventElement) {
        eventElement.style.transform = 'scale(0)';
        eventElement.style.opacity = '0';
        eventElement.style.transition = 'all 0.2s ease-out';
        setTimeout(() => eventElement.style.display = 'none', 200);
      }
    }
  }, [ball.x, ball.y, gameState.status, checkEventCollisions, combo, soundEnabled]);

  // Optimized mouse/touch controls
  useEffect(() => {
    let isMoving = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (gameState.status === 'playing' && !isMoving) {
        isMoving = true;
        requestAnimationFrame(() => {
          const newX = Math.max(
            dimensions.timeColumnWidth, 
            Math.min(e.clientX - paddle.width / 2, screenDimensions.width - paddle.width - dimensions.timeColumnWidth)
          );
          setPaddle(prev => ({ ...prev, x: newX }));
          isMoving = false;
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (gameState.status === 'playing' && e.touches.length > 0 && !isMoving) {
        e.preventDefault();
        isMoving = true;
        const touch = e.touches[0];
        requestAnimationFrame(() => {
          const newX = Math.max(
            dimensions.timeColumnWidth, 
            Math.min(touch.clientX - paddle.width / 2, screenDimensions.width - paddle.width - dimensions.timeColumnWidth)
          );
          setPaddle(prev => ({ ...prev, x: newX }));
          isMoving = false;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState.status, dimensions, paddle.width, screenDimensions]);

  // Game controls
  const startGame = useCallback(() => {
    if (showTutorial) {
      return;
    }
    
    const centerX = screenDimensions.width / 2;
    const startY = screenDimensions.height - 200;  // Start near bottom
    
    setGameState(prev => ({ ...prev, status: 'playing' }));
    setBall({
      x: centerX,
      y: startY,
      dx: isMobile ? 4 : 5.5,
      dy: isMobile ? -4 : -5.5,
      radius: dimensions.ballRadius,
    });
    setPaddle({
      x: centerX - dimensions.paddleWidth / 2,
      width: dimensions.paddleWidth,
      height: dimensions.paddleHeight,
    });
    setCombo(0);
    setPowerUps([]);
  }, [screenDimensions, isMobile, dimensions, showTutorial]);

  const pauseGame = useCallback(() => setGameState(prev => ({ ...prev, status: 'paused' })), []);
  const resumeGame = useCallback(() => setGameState(prev => ({ ...prev, status: 'playing' })), []);
  
  const resetGame = useCallback(() => {
    setGameState({ status: 'idle', score: 0, lives: 3, level: 1 });
    setDestroyedEvents(new Set());
    const centerX = screenDimensions.width / 2;
    const startY = screenDimensions.height - 200;  // Start near bottom
    setBall({
      x: centerX,
      y: startY,
      dx: isMobile ? 4 : 5.5,
      dy: isMobile ? -4 : -5.5,
      radius: dimensions.ballRadius,
    });
    setPaddle({
      x: centerX - dimensions.paddleWidth / 2,
      width: dimensions.paddleWidth,
      height: dimensions.paddleHeight,
    });
    setCombo(0);
    setMaxCombo(0);
    setPowerUps([]);
  }, [screenDimensions, isMobile, dimensions]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (gameState.status === 'playing') pauseGame();
          else if (gameState.status === 'paused') resumeGame();
          else if (gameState.status === 'idle') startGame();
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, pauseGame, resumeGame, startGame, resetGame]);


  return (
    <Box
      ref={containerRef}
      sx={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
        touchAction: 'none',
        userSelect: 'none',
        // Performance optimizations
        willChange: gameState.status === 'playing' ? 'transform' : 'auto',
        contain: 'layout style paint',
      }}
    >
      {/* Game HUD */}
      <UltraHUD
        gameState={gameState}
        soundEnabled={soundEnabled}
        onStartGame={startGame}
        onPauseGame={pauseGame}
        onResumeGame={resumeGame}
        onResetGame={resetGame}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isMobile={isMobile}
      />

      {/* Calendar Container */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 1,
      }}>
        {/* Calendar Header */}
        <CalendarHeader
          weekStart={weekStart}
          currentDate={currentDate}
          timeColumnWidth={dimensions.timeColumnWidth}
          headerHeight={dimensions.headerHeight}
        />

        {/* Calendar Body */}
        <CalendarBody
          weekStart={weekStart}
          currentDate={currentDate}
          events={events}
          destroyedEvents={destroyedEvents}
          timeColumnWidth={dimensions.timeColumnWidth}
          hourHeight={dimensions.hourHeight}
          calendarHeight={calendarHeight}
          isMobile={isMobile}
        />
      </Box>



      {/* Game Ball */}
      <OptimizedBall
        ball={ball}
        isVisible={gameState.status === 'playing' || gameState.status === 'paused'}
      />

      {/* Game Paddle */}
      <OptimizedPaddle
        paddle={paddle}
        gameStatus={gameState.status}
      />

      {/* Power-ups */}
      <PowerUps
        powerUps={powerUps}
        onCollect={(powerUp) => {
          setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
          handlePowerUpCollection(powerUp);
        }}
      />

      {/* Combo Display */}
      {/* <ComboDisplay combo={combo} maxCombo={maxCombo} /> */}

      {/* Tutorial */}
      {showTutorial && (
        <Tutorial
          onClose={() => {
            setShowTutorial(false);
            localStorage.setItem('hasSeenTutorial', 'true');
          }}
          isMobile={isMobile}
        />
      )}

      {/* Game Status Overlays */}
      <EnhancedGameOverlay
        status={gameState.status}
        score={gameState.score}
        onStartGame={startGame}
        onResetGame={resetGame}
        isMobile={isMobile}
      />
    </Box>
  );
};

export default CalendarBreakoutGame; 