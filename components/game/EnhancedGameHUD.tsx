'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, Variants } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { GameState } from '@/types/game';

interface EnhancedGameHUDProps {
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
const MotionTypography = motion(Typography);

export default function EnhancedGameHUD({
  gameState,
  soundEnabled,
  onStartGame,
  onPauseGame,
  onResumeGame,
  onResetGame,
  onToggleSound,
  isMobile,
}: EnhancedGameHUDProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scoreVariants: Variants = {
    initial: { scale: 1 },
    update: { 
      scale: [1, 1.2, 1],
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const heartVariants: Variants = {
    full: { 
      scale: 1, 
      rotate: 0,
      filter: "drop-shadow(0 2px 8px rgba(234, 76, 137, 0.4))"
    },
    empty: { 
      scale: 0.8, 
      rotate: -180,
      filter: "drop-shadow(0 0 0 rgba(0, 0, 0, 0))"
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.1 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        top: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        zIndex: 1000,
        perspective: 1000,
      }}
    >
      <MotionBox
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        sx={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '20px',
          padding: isMobile ? '14px 18px' : '16px 24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2.5,
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Animated Score */}
          <AnimatePresence mode="wait">
            <MotionBox 
              key={gameState.score}
              variants={scoreVariants}
              initial="initial"
              animate="update"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <MotionTypography
                sx={{ 
                  fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 700,
                  fontSize: isMobile ? '18px' : '22px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }}
              >
                {gameState.score.toLocaleString()}
              </MotionTypography>
              <Typography sx={{ 
                color: '#8E8E93', 
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 500,
              }}>
                pts
              </Typography>
            </MotionBox>
          </AnimatePresence>

          {/* Animated Lives */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            padding: '0 12px',
            borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
          }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <MotionBox
                key={i}
                initial="empty"
                animate={i < gameState.lives ? "full" : "empty"}
                variants={heartVariants}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 20,
                  delay: i * 0.05 
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <FavoriteIcon
                  sx={{
                    fontSize: isMobile ? 18 : 20,
                    color: i < gameState.lives ? '#EA4C89' : '#E5E5E7',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer',
                  }}
                />
              </MotionBox>
            ))}
          </Box>

          {/* Animated Controls */}
          <AnimatePresence mode="wait">
            <MotionBox
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              sx={{ display: 'flex', gap: 1 }}
            >
              {/* Play/Pause Button */}
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {gameState.gameStatus === 'idle' && (
                  <motion.button
                    onClick={onStartGame}
                    style={{
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    }}
                    whileHover={{ 
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
                  </motion.button>
                )}
                
                {gameState.gameStatus === 'playing' && (
                  <motion.button
                    onClick={onPauseGame}
                    style={{
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
                    }}
                  >
                    <PauseIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
                  </motion.button>
                )}
                
                {gameState.gameStatus === 'paused' && (
                  <motion.button
                    onClick={onResumeGame}
                    style={{
                      padding: '8px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
                  </motion.button>
                )}
              </MotionBox>

              {/* Reset Button */}
              <MotionBox
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.button
                  onClick={onResetGame}
                  style={{
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    background: 'white',
                    color: '#8E8E93',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  whileHover={{ 
                    background: 'rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <RestartAltIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
                </motion.button>
              </MotionBox>

              {/* Sound Toggle */}
              <MotionBox
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: soundEnabled ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.button
                  onClick={onToggleSound}
                  style={{
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    background: soundEnabled ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                    color: soundEnabled ? 'white' : '#8E8E93',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {soundEnabled ? 
                    <VolumeUpIcon sx={{ fontSize: isMobile ? 20 : 24 }} /> : 
                    <VolumeOffIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
                  }
                </motion.button>
              </MotionBox>
            </MotionBox>
          </AnimatePresence>
        </Box>
      </MotionBox>
    </MotionBox>
  );
}