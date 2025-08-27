'use client';

import { Typography, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface GameOverlayProps {
  status: 'idle' | 'playing' | 'paused' | 'gameOver' | 'victory';
  score: number;
  onStartGame: () => void;
  onResetGame: () => void;
  isMobile: boolean;
}

export default function GameOverlay({
  status,
  score,
  onStartGame,
  onResetGame,
  isMobile,
}: GameOverlayProps) {
  return (
    <AnimatePresence>
      {status === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
        >
          <Typography variant={isMobile ? "h4" : "h3"} sx={{ mb: 2, color: '#1a73e8', fontWeight: 700 }}>
            Calendar Breakout
          </Typography>
          <Typography variant="body1" sx={{ 
            mb: 4, 
            color: '#5f6368', 
            textAlign: 'center',
            px: 2,
          }}>
            Break through your calendar events!<br />
            {isMobile ? 'Touch and drag to move the blue paddle below' : 'Move mouse to control the blue paddle, Space to start'}
          </Typography>
          <IconButton
            onClick={onStartGame}
            sx={{
              width: isMobile ? 60 : 80,
              height: isMobile ? 60 : 80,
              backgroundColor: '#1a73e8',
              color: 'white',
              '&:hover': { backgroundColor: '#1557b0' },
              boxShadow: '0 4px 12px rgba(26, 115, 232, 0.4)',
            }}
          >
            <PlayArrowIcon sx={{ fontSize: isMobile ? 30 : 40 }} />
          </IconButton>
        </motion.div>
      )}

      {status === 'paused' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
        >
          <Typography variant={isMobile ? "h3" : "h2"} sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            PAUSED
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', opacity: 0.8, textAlign: 'center', px: 2 }}>
            {isMobile ? 'Tap play to continue' : 'Press SPACE or click play to continue'}
          </Typography>
        </motion.div>
      )}

      {status === 'gameOver' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
          }}
        >
          <Typography variant={isMobile ? "h3" : "h2"} sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Game Over
          </Typography>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
            Final Score: {score.toLocaleString()}
          </Typography>
          <IconButton
            onClick={onResetGame}
            sx={{
              width: isMobile ? 50 : 60,
              height: isMobile ? 50 : 60,
              backgroundColor: '#ea4335',
              color: 'white',
              '&:hover': { backgroundColor: '#d33b2c' },
            }}
          >
            <RestartAltIcon sx={{ fontSize: isMobile ? 25 : 30 }} />
          </IconButton>
        </motion.div>
      )}

      {status === 'victory' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 200,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <EmojiEventsIcon sx={{ fontSize: isMobile ? 60 : 80, color: '#FFD700', mb: 2 }} />
          </motion.div>
          <Typography variant={isMobile ? "h3" : "h2"} sx={{ color: '#FFD700', fontWeight: 700, mb: 2 }}>
            Victory!
          </Typography>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
            Score: {score.toLocaleString()}
          </Typography>
          <IconButton
            onClick={onResetGame}
            sx={{
              width: isMobile ? 50 : 60,
              height: isMobile ? 50 : 60,
              backgroundColor: '#FFD700',
              color: 'black',
              '&:hover': { backgroundColor: '#FFC700' },
            }}
          >
            <RestartAltIcon sx={{ fontSize: isMobile ? 25 : 30 }} />
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}