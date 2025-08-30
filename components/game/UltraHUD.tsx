'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { GameState } from '@/types/game';
import { useIntl } from '@/hooks';

interface UltraHUDProps {
  gameState: GameState;
  soundEnabled: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  isMobile: boolean;
}

const MotionBox = motion(Box);

export default function UltraHUD({
  gameState,
  soundEnabled,
  onStartGame, // eslint-disable-line @typescript-eslint/no-unused-vars
  onPauseGame,
  onResumeGame,
  onResetGame,
  onToggleSound,
  isMobile,
}: UltraHUDProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [forceExpanded, setForceExpanded] = useState(false);
  const intl = useIntl();
  
  // Expand when game is not playing or when paused
  useEffect(() => {
    setForceExpanded(gameState.gameStatus !== 'playing');
  }, [gameState.gameStatus]);

  const isExpanded = isHovered || forceExpanded;

  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: isMobile ? 12 : 20,
        right: isMobile ? 12 : 20,
        zIndex: 500, // Above pause overlay (200)
        pointerEvents: 'auto',
      }}
    >
      <MotionBox
        animate={{
          width: isExpanded ? (isMobile ? 250 : 300) : (isMobile ? 120 : 140),
          height: isExpanded ? 'auto' : (isMobile ? 40 : 44),
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          mass: 0.8
        }}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: isExpanded ? '20px' : '22px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Minimized view - only score and lives */}
        <AnimatePresence>
          {!isExpanded && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: isMobile ? 1.5 : 2,
                gap: 1.5,
              }}
            >
              {/* Score */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5,
                flex: 1,
              }}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3 }}
                  key={gameState.score}
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, sans-serif',
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {gameState.score.toLocaleString()}
                </motion.div>
              </Box>

              {/* Lives */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.4,
              }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: i < gameState.lives ? 1 : 0.7,
                      opacity: i < gameState.lives ? 1 : 0.3
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 25 
                    }}
                  >
                    <Box
                      sx={{
                        width: isMobile ? 8 : 10,
                        height: isMobile ? 8 : 10,
                        borderRadius: '50%',
                        backgroundColor: i < gameState.lives ? '#EA4C89' : '#E5E5E7',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </motion.div>
                ))}
              </Box>

              {/* Expand hint */}
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#007AFF',
                  opacity: 0.5,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { 
                      transform: 'scale(1)',
                      opacity: 0.5,
                    },
                    '50%': { 
                      transform: 'scale(1.2)',
                      opacity: 0.8,
                    },
                  },
                }}
              />
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Expanded view */}
        <AnimatePresence>
          {isExpanded && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                padding: isMobile ? '16px' : '20px',
              }}
            >
              {/* Score section */}
              <Box sx={{ mb: 2.5 }}>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 0.5 }}
                  key={gameState.score}
                  style={{
                    fontFamily: '"SF Pro Display", -apple-system, sans-serif',
                    fontSize: isMobile ? '28px' : '32px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '4px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {gameState.score.toLocaleString()}
                </motion.div>
                <motion.div
                  style={{
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#8E8E93',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {intl.t('game.score')}
                </motion.div>
              </Box>

              {/* Lives section */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 0.8 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: i < gameState.lives ? 1 : 0.8,
                        rotate: 0,
                        opacity: i < gameState.lives ? 1 : 0.2
                      }}
                      transition={{ 
                        delay: i * 0.05,
                        type: "spring", 
                        stiffness: 400, 
                        damping: 20 
                      }}
                      whileHover={{ 
                        scale: 1.15,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Box
                        sx={{
                          width: isMobile ? 20 : 24,
                          height: isMobile ? 20 : 24,
                          borderRadius: '50%',
                          background: i < gameState.lives 
                            ? 'linear-gradient(135deg, #EA4C89 0%, #ff6b9d 100%)' 
                            : '#E5E5E7',
                          boxShadow: i < gameState.lives 
                            ? '0 3px 12px rgba(234, 76, 137, 0.3)' 
                            : 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          '&::after': i < gameState.lives ? {
                            content: '""',
                            position: 'absolute',
                            top: '25%',
                            left: '25%',
                            width: '25%',
                            height: '25%',
                            background: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '50%',
                          } : {},
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
                <motion.div
                  style={{
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#8E8E93',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {intl.t('game.lives')}
                </motion.div>
              </Box>

              {/* Controls */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                justifyContent: 'center',
                pt: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              }}>
                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={gameState.gameStatus === 'playing' ? onPauseGame : onResumeGame}
                  style={{
                    width: isMobile ? 40 : 44,
                    height: isMobile ? 40 : 44,
                    borderRadius: '12px',
                    border: 'none',
                    background: gameState.gameStatus === 'playing' 
                      ? 'linear-gradient(135deg, #FF9500 0%, #FF5E3A 100%)'
                      : 'linear-gradient(135deg, #4CD964 0%, #35C759 100%)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {gameState.gameStatus === 'playing' ? 
                    <PauseIcon sx={{ fontSize: isMobile ? 20 : 22 }} /> : 
                    <PlayArrowIcon sx={{ fontSize: isMobile ? 20 : 22 }} />
                  }
                </motion.button>

                {/* Reset */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onResetGame}
                  style={{
                    width: isMobile ? 40 : 44,
                    height: isMobile ? 40 : 44,
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    background: 'white',
                    color: '#8E8E93',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RestartAltIcon sx={{ fontSize: isMobile ? 20 : 22 }} />
                </motion.button>

                {/* Sound */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    backgroundColor: soundEnabled ? '#007AFF' : '#E5E5E7',
                  }}
                  onClick={onToggleSound}
                  style={{
                    width: isMobile ? 40 : 44,
                    height: isMobile ? 40 : 44,
                    borderRadius: '12px',
                    border: 'none',
                    color: soundEnabled ? 'white' : '#8E8E93',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  {soundEnabled ? 
                    <VolumeUpIcon sx={{ fontSize: isMobile ? 20 : 22 }} /> : 
                    <VolumeOffIcon sx={{ fontSize: isMobile ? 20 : 22 }} />
                  }
                </motion.button>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </MotionBox>
    </MotionBox>
  );
}