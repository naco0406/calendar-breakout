'use client';

import React, { FC, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { startOfWeek } from 'date-fns';

// Types
import { CalendarEvent } from '@/types/calendar';
import { GameState, Ball, Paddle } from '@/types/game';

// Constants
import { 
  SAMPLE_EVENTS, 
  TIME_SLOTS,
  GAME_CONSTANTS,
  GAME_STATUS,
  getEventsByPersona,
} from '@/constants';

// Utils
import { 
  GameAudio, 
  checkCircleRectCollision, 
  applyCollisionResponse,
  getBallSpeed,
  getMaxSpeed,
  getPaddleDimensions,
  getBallRadius,
  calculateScore,
  generatePowerUpId,
  getRandomPowerUpType,
  shouldDropPowerUp,
} from '@/utils';
import { translateCalendarEvents } from '@/utils/eventTranslations';

// Components
import { 
  OptimizedPaddle, 
  OptimizedBall, 
  PowerUps, 
  PowerUp, 
  Tutorial, 
  UltraHUD, 
  EnhancedGameOverlay 
} from '@/components/game';
import { CalendarHeader, CalendarBody } from '@/components/calendar';
import ParticleSystem, { createParticles, Particle } from '@/components/game/ParticleSystem';
import VictoryOverlay from '@/components/game/VictoryOverlay';

// Hooks
import { 
  useGamePhysics,
  useOptimizedGameLoop,
  usePaddleControls,
  useGameKeyboard,
  usePowerUpEffects,
  useWindowDimensions,
  useIntl,
} from '@/hooks';

export const CalendarBreakoutGame: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate);
  const intl = useIntl();

  // Window dimensions
  const screenDimensions = useWindowDimensions();
  
  // Memoized responsive dimensions
  const dimensions = useMemo(() => {
    const availableHeight = screenDimensions.height - (isMobile ? 50 : 60);
    const hourHeight = Math.floor(availableHeight / TIME_SLOTS.length);
    const paddleDims = getPaddleDimensions(isMobile);
    
    return {
      timeColumnWidth: isMobile ? 48 : 60,
      headerHeight: isMobile ? 50 : 60,
      hourHeight,
      ballRadius: getBallRadius(isMobile),
      paddleWidth: paddleDims.width,
      paddleHeight: paddleDims.height,
    };
  }, [isMobile, screenDimensions.height]);

  const calendarHeight = TIME_SLOTS.length * dimensions.hourHeight;

  // Game State
  const [gameState, setGameState] = useState<GameState>({
    gameStatus: GAME_STATUS.IDLE,
    score: 0,
    lives: GAME_CONSTANTS.INITIAL_LIVES,
    level: 1,
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Get persona from localStorage and load appropriate events
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const selectedPersona = localStorage.getItem('selectedPersona');
      const personaEvents = getEventsByPersona(selectedPersona);
      return personaEvents.length > 0 ? personaEvents : SAMPLE_EVENTS;
    }
    return SAMPLE_EVENTS;
  });
  const [destroyedEvents, setDestroyedEvents] = useState<Set<string>>(new Set());
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showTutorial, setShowTutorial] = useState(() => {
    const hasSeenTutorial = typeof window !== 'undefined' ? localStorage.getItem('hasSeenTutorial') : null;
    return !hasSeenTutorial;
  });
  const [showPersonaInfo, setShowPersonaInfo] = useState<string | null>(null);

  // Game Objects
  const ballSpeed = getBallSpeed(isMobile);
  const [ball, setBall] = useState<Ball>({
    x: 400,
    y: 450,
    dx: ballSpeed,
    dy: -ballSpeed,
    radius: dimensions.ballRadius,
    speed: ballSpeed,
  });

  const [paddle, setPaddle] = useState<Paddle>({
    x: 300,
    y: screenDimensions.height - GAME_CONSTANTS.PADDLE_BOTTOM_OFFSET - dimensions.paddleHeight,
    width: dimensions.paddleWidth,
    height: dimensions.paddleHeight,
    speed: GAME_CONSTANTS.PADDLE.SPEED,
  });

  // Translate events when component mounts or locale changes
  useEffect(() => {
    const selectedPersona = localStorage.getItem('selectedPersona');
    const personaEvents = getEventsByPersona(selectedPersona);
    const eventsToUse = personaEvents.length > 0 ? personaEvents : SAMPLE_EVENTS;
    setEvents(translateCalendarEvents(eventsToUse, intl));
  }, [intl]);

  // Update paddle position when screen resizes
  useEffect(() => {
    setPaddle(prev => ({
      ...prev,
      x: Math.max(dimensions.timeColumnWidth, Math.min(screenDimensions.width / 2 - prev.width / 2, screenDimensions.width - prev.width)),
      y: screenDimensions.height - GAME_CONSTANTS.PADDLE_BOTTOM_OFFSET - dimensions.paddleHeight,
    }));
  }, [screenDimensions, dimensions]);

  // Show persona info briefly at game start
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedPersona = localStorage.getItem('selectedPersona');
      if (selectedPersona) {
        setShowPersonaInfo(selectedPersona);
        const timer = setTimeout(() => {
          setShowPersonaInfo(null);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Custom hooks
  const { updatePowerUps, checkPaddlePowerUpCollision } = useGamePhysics({
    screenDimensions,
    isMobile,
  });

  const { handlePowerUpCollection } = usePowerUpEffects({
    soundEnabled,
    initialPaddleWidth: dimensions.paddleWidth,
  });

  usePaddleControls({
    gameStatus: gameState.gameStatus,
    paddle,
    screenDimensions,
    timeColumnWidth: dimensions.timeColumnWidth,
    setPaddle,
  });

  // Memoized active events
  const activeEvents = useMemo(() => 
    events.filter(event => !destroyedEvents.has(event.id)), 
    [events, destroyedEvents]
  );

  // Check for victory condition
  useEffect(() => {
    if (gameState.gameStatus === GAME_STATUS.PLAYING && activeEvents.length === 0 && events.length > 0) {
      setGameState(prev => ({ ...prev, gameStatus: GAME_STATUS.VICTORY }));
      if (soundEnabled) GameAudio.playGameOverSound(); // TODO: Add victory sound
    }
  }, [activeEvents.length, events.length, gameState.gameStatus, soundEnabled]);

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

  // Optimized collision detection
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
  }, [activeEvents, ball]);

  // Game loop
  const gameLoop = useCallback((deltaTime: number) => {
    if (gameState.gameStatus !== GAME_STATUS.PLAYING) return;

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

      // Top boundary
      const topBoundary = dimensions.headerHeight;
      if (newY - prevBall.radius <= topBoundary) {
        newY = topBoundary + prevBall.radius;
        newDy = Math.abs(newDy);
        if (soundEnabled) GameAudio.playHitSound();
      }

      // Paddle collision
      const paddleY = screenDimensions.height - GAME_CONSTANTS.PADDLE_BOTTOM_OFFSET - dimensions.paddleHeight;
      if (newY + prevBall.radius >= paddleY &&
          newY + prevBall.radius <= paddleY + dimensions.paddleHeight + 10 &&
          newX >= paddle.x - 10 &&
          newX <= paddle.x + paddle.width + 10) {
        
        const paddleCenter = paddle.x + paddle.width / 2;
        const hitPosition = (newX - paddleCenter) / (paddle.width / 2);
        
        newY = paddleY - prevBall.radius;
        newDy = -Math.abs(newDy);
        newDx = newDx + hitPosition * 2;
        
        const maxSpeed = getMaxSpeed(isMobile);
        newDx = Math.max(-maxSpeed, Math.min(maxSpeed, newDx));
        
        if (soundEnabled) GameAudio.playHitSound();
      }

      // Bottom boundary
      if (newY > screenDimensions.height + 50) {
        setCombo(0);
        setGameState(prev => {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            if (soundEnabled) GameAudio.playGameOverSound();
            return { ...prev, gameStatus: GAME_STATUS.GAME_OVER, lives: 0 };
          }
          return { ...prev, lives: newLives };
        });
        
        // Reset ball
        const centerX = screenDimensions.width / 2;
        const startY = screenDimensions.height - 200;
        const speed = getBallSpeed(isMobile);
        return {
          x: centerX,
          y: startY,
          dx: speed,
          dy: -speed,
          radius: prevBall.radius,
          speed: prevBall.speed,
        };
      }

      // Speed limit
      const maxSpeed = getMaxSpeed(isMobile);
      newDx = Math.max(-maxSpeed, Math.min(maxSpeed, newDx));
      newDy = Math.max(-maxSpeed, Math.min(maxSpeed, newDy));

      return { ...prevBall, x: newX, y: newY, dx: newDx, dy: newDy };
    });

    // Update power-ups
    setPowerUps(prev => {
      const updated = updatePowerUps(prev, deltaTime);
      
      return updated.filter(powerUp => {
        const paddleY = screenDimensions.height - GAME_CONSTANTS.PADDLE_BOTTOM_OFFSET - dimensions.paddleHeight;
        if (checkPaddlePowerUpCollision(paddle, powerUp, paddleY)) {
          handlePowerUpCollection(powerUp, setGameState, setPaddle, setBall);
          return false;
        }
        return true;
      });
    });
  }, [
    gameState.gameStatus, 
    soundEnabled, 
    dimensions, 
    screenDimensions, 
    isMobile, 
    paddle, 
    updatePowerUps, 
    checkPaddlePowerUpCollision, 
    handlePowerUpCollection
  ]);

  // Use optimized game loop
  useOptimizedGameLoop({
    callback: gameLoop,
    isRunning: gameState.gameStatus === GAME_STATUS.PLAYING,
    targetFPS: GAME_CONSTANTS.TARGET_FPS,
  });

  // Check event collisions
  useEffect(() => {
    if (gameState.gameStatus !== GAME_STATUS.PLAYING) return;

    const collisionResult = checkEventCollisions();
    if (collisionResult) {
      const { event: hitEvent, collision } = collisionResult;
      
      setDestroyedEvents(prev => new Set([...prev, hitEvent.id]));
      setCombo(prev => prev + 1);
      
      const finalScore = calculateScore(GAME_CONSTANTS.BASE_SCORE, combo);
      setGameState(prev => ({ ...prev, score: prev.score + finalScore }));
      
      if (shouldDropPowerUp()) {
        const newPowerUp: PowerUp = {
          id: generatePowerUpId(),
          type: getRandomPowerUpType() as PowerUp['type'],
          x: ball.x,
          y: ball.y,
          active: true,
        };
        setPowerUps(prev => [...prev, newPowerUp]);
      }
      
      if (soundEnabled) GameAudio.playHitSound();
      
      setBall(prev => {
        const response = applyCollisionResponse(prev, collision);
        return { ...prev, ...response };
      });

      // Create particle effect and animate event destruction
      const eventElement = containerRef.current?.querySelector(`[data-event-id="${hitEvent.id}"]`) as HTMLElement;
      if (eventElement) {
        const rect = eventElement.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        const relativeX = rect.left - containerRect.left;
        const relativeY = rect.top - containerRect.top;
        
        // Create particles at the event location
        const newParticles = createParticles(
          relativeX,
          relativeY,
          rect.width,
          rect.height,
          hitEvent.color
        );
        setParticles(prev => [...prev, ...newParticles]);
        
        // Animate event destruction
        eventElement.style.transform = 'scale(0)';
        eventElement.style.opacity = '0';
        eventElement.style.transition = 'all 0.2s ease-out';
        setTimeout(() => eventElement.style.display = 'none', GAME_CONSTANTS.EVENT_DESTROY_ANIMATION_DURATION);
      }
    }
  }, [ball, gameState.gameStatus, checkEventCollisions, combo, soundEnabled]);

  // Game controls
  const startGame = useCallback(() => {
    if (showTutorial) return;
    
    const centerX = screenDimensions.width / 2;
    const startY = screenDimensions.height - 200;
    const speed = getBallSpeed(isMobile);
    
    setGameState(prev => ({ ...prev, gameStatus: GAME_STATUS.PLAYING }));
    setBall({
      x: centerX,
      y: startY,
      dx: speed,
      dy: -speed,
      radius: dimensions.ballRadius,
      speed,
    });
    setPaddle({
      x: centerX - dimensions.paddleWidth / 2,
      y: screenDimensions.height - GAME_CONSTANTS.PADDLE_BOTTOM_OFFSET - dimensions.paddleHeight,
      width: dimensions.paddleWidth,
      height: dimensions.paddleHeight,
      speed: GAME_CONSTANTS.PADDLE.SPEED,
    });
    setCombo(0);
    setPowerUps([]);
    setParticles([]);
  }, [screenDimensions, isMobile, dimensions, showTutorial]);

  const pauseGame = useCallback(() => setGameState(prev => ({ ...prev, gameStatus: GAME_STATUS.PAUSED })), []);
  const resumeGame = useCallback(() => setGameState(prev => ({ ...prev, gameStatus: GAME_STATUS.PLAYING })), []);
  
  const resetGame = useCallback(() => {
    const centerX = screenDimensions.width / 2;
    const startY = screenDimensions.height - 200;
    const speed = getBallSpeed(isMobile);
    
    setGameState({ 
      gameStatus: GAME_STATUS.IDLE, 
      score: 0, 
      lives: GAME_CONSTANTS.INITIAL_LIVES, 
      level: 1 
    });
    setDestroyedEvents(new Set());
    setBall({
      x: centerX,
      y: startY,
      dx: speed,
      dy: -speed,
      radius: dimensions.ballRadius,
      speed,
    });
    setPaddle({
      x: centerX - dimensions.paddleWidth / 2,
      y: screenDimensions.height - GAME_CONSTANTS.PADDLE_BOTTOM_OFFSET - dimensions.paddleHeight,
      width: dimensions.paddleWidth,
      height: dimensions.paddleHeight,
      speed: GAME_CONSTANTS.PADDLE.SPEED,
    });
    setCombo(0);
    setPowerUps([]);
    setParticles([]);
  }, [screenDimensions, isMobile, dimensions]);

  // Keyboard controls
  useGameKeyboard({
    gameStatus: gameState.gameStatus,
    startGame,
    pauseGame,
    resumeGame,
    resetGame,
  });

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
        willChange: gameState.gameStatus === GAME_STATUS.PLAYING ? 'transform' : 'auto',
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
        <CalendarHeader
          weekStart={weekStart}
          currentDate={currentDate}
          timeColumnWidth={dimensions.timeColumnWidth}
          headerHeight={dimensions.headerHeight}
        />

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

      {/* Game Elements */}
      <OptimizedBall
        ball={ball}
        isVisible={gameState.gameStatus === GAME_STATUS.PLAYING || gameState.gameStatus === GAME_STATUS.PAUSED}
      />

      <OptimizedPaddle
        paddle={paddle}
        gameStatus={gameState.gameStatus}
      />

      <PowerUps
        powerUps={powerUps}
        onCollect={(powerUp) => {
          setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
          handlePowerUpCollection(powerUp, setGameState, setPaddle, setBall);
        }}
      />

      {/* Particle System */}
      <ParticleSystem
        particles={particles}
        onComplete={(id) => {
          setParticles(prev => prev.filter(p => p.id !== id));
        }}
      />

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

      {/* Victory Overlay */}
      <VictoryOverlay
        isVisible={gameState.gameStatus === GAME_STATUS.VICTORY}
        score={gameState.score + (gameState.lives * 500)} // Bonus for remaining lives
        lives={gameState.lives}
        onPlayAgain={resetGame}
        isMobile={isMobile}
      />

      {/* Game Status Overlays */}
      <EnhancedGameOverlay
        status={gameState.gameStatus === GAME_STATUS.VICTORY ? GAME_STATUS.IDLE : gameState.gameStatus}
        score={gameState.score}
        onStartGame={startGame}
        onResetGame={resetGame}
        isMobile={isMobile}
      />

      {/* Persona Info */}
      {showPersonaInfo && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '16px',
            zIndex: 1000,
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeInOut 3s ease-in-out',
            '@keyframes fadeInOut': {
              '0%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.8)' },
              '20%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
              '80%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
              '100%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.9)' },
            },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {showPersonaInfo === 'developer' && '👨‍💻 Developer Mode'}
            {showPersonaInfo === 'pm' && '📊 Product Manager Mode'}
            {showPersonaInfo === 'sales' && '💼 Sales Mode'}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Break through your {showPersonaInfo} calendar!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CalendarBreakoutGame;