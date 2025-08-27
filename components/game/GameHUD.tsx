'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Fade, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { GameState } from '@/types/game';

interface GameHUDProps {
  gameState: GameState;
  soundEnabled: boolean;
  onStartGame: () => void;
  onPauseGame: () => void;
  onResumeGame: () => void;
  onResetGame: () => void;
  onToggleSound: () => void;
  isMobile: boolean;
}

export default function GameHUD({
  gameState,
  soundEnabled,
  onStartGame,
  onPauseGame,
  onResumeGame,
  onResetGame,
  onToggleSound,
  isMobile,
}: GameHUDProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isHovered || gameState.status !== 'playing';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        top: isMobile ? 16 : 24,
        right: isMobile ? 16 : 24,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: isMobile ? '12px 16px' : '14px 20px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: isExpanded ? (isMobile ? '260px' : '280px') : 'auto',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2.5,
        }}>
          {/* Score */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography 
              sx={{ 
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 600,
                color: '#1a1a1a',
                fontSize: isMobile ? '16px' : '18px',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {gameState.score.toLocaleString()}
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                color: '#666',
                fontSize: isMobile ? '12px' : '14px',
                fontWeight: 500,
              }}
            >
              pts
            </Typography>
          </Box>
          
          {/* Lives */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.4,
            padding: '0 8px',
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: i * 0.05, 
                  type: 'spring', 
                  stiffness: 400,
                  damping: 15 
                }}
              >
                <FavoriteIcon
                  sx={{
                    fontSize: isMobile ? 16 : 18,
                    color: i < gameState.lives ? '#EA4C89' : '#E5E5E7',
                    transition: 'all 0.2s ease',
                  }}
                />
              </motion.div>
            ))}
          </Box>

          {/* Controls */}
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 0.8,
                  alignItems: 'center',
                }}>
                  {gameState.status === 'idle' && (
                    <IconButton 
                      onClick={onStartGame} 
                      size="small"
                      sx={{
                        color: '#007AFF',
                        backgroundColor: 'rgba(0, 122, 255, 0.08)',
                        padding: '6px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 122, 255, 0.12)',
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    </IconButton>
                  )}
                  {gameState.status === 'playing' && (
                    <IconButton 
                      onClick={onPauseGame} 
                      size="small"
                      sx={{
                        color: '#FF9500',
                        backgroundColor: 'rgba(255, 149, 0, 0.08)',
                        padding: '6px',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 149, 0, 0.12)',
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <PauseIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    </IconButton>
                  )}
                  {gameState.status === 'paused' && (
                    <IconButton 
                      onClick={onResumeGame} 
                      size="small"
                      sx={{
                        color: '#34C759',
                        backgroundColor: 'rgba(52, 199, 89, 0.08)',
                        padding: '6px',
                        '&:hover': {
                          backgroundColor: 'rgba(52, 199, 89, 0.12)',
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    </IconButton>
                  )}
                  <IconButton 
                    onClick={onResetGame} 
                    size="small"
                    sx={{
                      color: '#8E8E93',
                      backgroundColor: 'rgba(142, 142, 147, 0.08)',
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: 'rgba(142, 142, 147, 0.12)',
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <RestartAltIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                  </IconButton>
                  <IconButton 
                    onClick={onToggleSound} 
                    size="small"
                    sx={{
                      color: soundEnabled ? '#007AFF' : '#8E8E93',
                      backgroundColor: soundEnabled ? 'rgba(0, 122, 255, 0.08)' : 'rgba(142, 142, 147, 0.08)',
                      padding: '6px',
                      '&:hover': {
                        backgroundColor: soundEnabled ? 'rgba(0, 122, 255, 0.12)' : 'rgba(142, 142, 147, 0.12)',
                      },
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {soundEnabled ? 
                      <VolumeUpIcon sx={{ fontSize: isMobile ? 18 : 20 }} /> : 
                      <VolumeOffIcon sx={{ fontSize: isMobile ? 18 : 20 }} />
                    }
                  </IconButton>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover hint */}
          <AnimatePresence>
            {!isExpanded && gameState.status === 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#007AFF',
                    opacity: 0.4,
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { 
                        transform: 'scale(1)',
                        opacity: 0.4,
                      },
                      '50%': { 
                        transform: 'scale(1.2)',
                        opacity: 0.6,
                      },
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </motion.div>
  );
}