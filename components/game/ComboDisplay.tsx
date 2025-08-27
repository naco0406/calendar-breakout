'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ComboDisplayProps {
  combo: number;
  maxCombo: number;
}

const ComboDisplay = React.memo(({ combo, maxCombo }: ComboDisplayProps) => {
  const getComboColor = () => {
    if (combo >= 10) return '#FFD700';
    if (combo >= 5) return '#FF6B6B';
    if (combo >= 3) return '#4ECDC4';
    return '#1a73e8';
  };

  const getComboText = () => {
    if (combo >= 10) return 'UNSTOPPABLE!';
    if (combo >= 5) return 'ON FIRE!';
    if (combo >= 3) return 'COMBO!';
    return '';
  };

  return (
    <AnimatePresence>
      {combo >= 3 && (
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 150, // Below pause overlay (200)
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '48px', sm: '64px', md: '72px' },
                  fontWeight: 900,
                  color: getComboColor(),
                  textShadow: `0 0 30px ${getComboColor()}66, 0 0 60px ${getComboColor()}33`,
                  mb: 0.5,
                  lineHeight: 1,
                  fontFamily: '"SF Pro Display", -apple-system, sans-serif',
                }}
              >
                {combo}x
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '18px', sm: '24px', md: '28px' },
                  fontWeight: 700,
                  color: getComboColor(),
                  textShadow: `0 0 20px ${getComboColor()}66`,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: '"SF Pro Display", -apple-system, sans-serif',
                }}
              >
                {getComboText()}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      )}
      
      {maxCombo > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 150, // Below pause overlay
          }}
        >
          <Box
            sx={{
              backdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#333',
              padding: '12px 20px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Gradient shine effect */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
                animation: 'shine 3s infinite',
                '@keyframes shine': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
              }}
            />
            
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: '#FFD700',
                boxShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { 
                    transform: 'scale(1)',
                    opacity: 1,
                  },
                  '50%': { 
                    transform: 'scale(1.2)',
                    opacity: 0.8,
                  },
                },
              }}
            />
            
            <Typography sx={{ fontSize: 'inherit' }}>
              Best Combo: 
            </Typography>
            
            <Typography 
              sx={{ 
                color: '#FFD700', 
                fontWeight: 800,
                fontSize: '16px',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.4)',
              }}
            >
              {maxCombo}x
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ComboDisplay.displayName = 'ComboDisplay';

export default ComboDisplay;