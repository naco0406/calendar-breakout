'use client';

import React, { FC, useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { formatScore } from '@/utils/game';
import { useIntl } from '@/hooks';

interface VictoryOverlayProps {
  isVisible: boolean;
  score: number;
  lives: number;
  onPlayAgain: () => void;
  isMobile: boolean;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
}

export const VictoryOverlay: FC<VictoryOverlayProps> = ({ 
  isVisible, 
  score, 
  lives,
  onPlayAgain, 
  isMobile 
}) => {
  const [showContent, setShowContent] = useState(false);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const intl = useIntl();

  useEffect(() => {
    if (isVisible) {
      // Delay content to sync with HUD expansion
      const contentTimer = setTimeout(() => setShowContent(true), 600);
      
      // Create fireworks
      const createFirework = () => {
        const newFirework: Firework = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight,
          color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
        };
        setFireworks(prev => [...prev, newFirework]);
        
        // Remove firework after animation
        setTimeout(() => {
          setFireworks(prev => prev.filter(f => f.id !== newFirework.id));
        }, 3000);
      };

      // Create multiple fireworks
      const fireworkInterval = setInterval(createFirework, 300);
      setTimeout(() => clearInterval(fireworkInterval), 2000);

      return () => {
        clearTimeout(contentTimer);
        clearInterval(fireworkInterval);
      };
    } else {
      setShowContent(false);
      setFireworks([]);
    }
  }, [isVisible]);

  const calculateStars = () => {
    if (score > 10000) return 3;
    if (score > 5000) return 2;
    return 1;
  };

  const stars = calculateStars();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* HUD Background Expansion */}
          <motion.div
            initial={{ 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '60px',
              borderRadius: '0'
            }}
            animate={{ 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              borderRadius: '0'
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.43, 0.13, 0.23, 0.96] 
            }}
            style={{
              position: 'fixed',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              zIndex: 900,
            }}
          />

          {/* Fireworks */}
          {fireworks.map(firework => (
            <motion.div
              key={firework.id}
              initial={{ x: firework.x, y: firework.y, scale: 0 }}
              animate={{ 
                y: firework.y * 0.3,
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                width: '100px',
                height: '100px',
                left: -50,
                top: -50,
                zIndex: 950,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: `radial-gradient(circle, ${firework.color} 0%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(2px)',
                }}
              />
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: '4px',
                    height: '20px',
                    backgroundColor: firework.color,
                    left: '48px',
                    top: '40px',
                    transformOrigin: 'center bottom',
                    transform: `rotate(${i * 45}deg) translateY(-30px)`,
                    opacity: 0.8,
                  }}
                />
              ))}
            </motion.div>
          ))}

          {/* Victory Content */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: isMobile ? '20px' : '40px',
              }}
            >
              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: 0.3 
                }}
              >
                <EmojiEventsIcon 
                  sx={{ 
                    fontSize: isMobile ? 80 : 120, 
                    color: '#FFD700',
                    filter: 'drop-shadow(0 4px 20px rgba(255, 215, 0, 0.5))',
                    mb: 2,
                  }} 
                />
              </motion.div>

              {/* Victory Text */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                    mb: 2,
                    textShadow: '0 2px 10px rgba(255, 215, 0, 0.3)',
                  }}
                >
                  {intl.t('game.victory')}
                </Typography>
              </motion.div>

              {/* Stars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -360 }}
                    animate={{ 
                      scale: i < stars ? 1 : 0.7,
                      rotate: 0,
                      opacity: i < stars ? 1 : 0.3
                    }}
                    transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                  >
                    <StarIcon
                      sx={{
                        fontSize: isMobile ? 40 : 60,
                        color: i < stars ? '#FFD700' : '#666',
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Score Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: isMobile ? '20px 30px' : '30px 50px',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '20px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    textAlign: 'center',
                    mb: 1 
                  }}
                >
                  {intl.t('game.victoryScore')}
                </Typography>
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  sx={{ 
                    color: 'white', 
                    fontWeight: 700,
                    textAlign: 'center',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {formatScore(score)}
                </Typography>
                {lives > 0 && (
                  <Typography
                    variant="body1"
                    sx={{ 
                      color: '#4ECDC4', 
                      textAlign: 'center',
                      mt: 1,
                      fontWeight: 500
                    }}
                  >
                    {intl.t('game.bonusLives', { bonus: lives * 500 })}
                  </Typography>
                )}
              </motion.div>

              {/* Play Again Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={onPlayAgain}
                  sx={{
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: 'black',
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: 700,
                    padding: isMobile ? '12px 30px' : '15px 40px',
                    borderRadius: '30px',
                    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FFA500, #FFD700)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 25px rgba(255, 215, 0, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {intl.t('game.playAgain')}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default VictoryOverlay;