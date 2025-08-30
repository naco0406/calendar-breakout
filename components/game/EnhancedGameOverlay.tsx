'use client';

import { Typography } from '@mui/material';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import { useIntl } from '@/hooks';

interface EnhancedGameOverlayProps {
  status: 'idle' | 'playing' | 'paused' | 'gameOver' | 'victory';
  score: number;
  onStartGame: () => void;
  onResetGame: () => void;
  isMobile: boolean;
}

const MotionTypography = motion(Typography);

export default function EnhancedGameOverlay({
  status,
  score,
  onStartGame,
  onResetGame,
  isMobile,
}: EnhancedGameOverlayProps) {
  const intl = useIntl();
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const contentVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === 'idle' && (
        <motion.div
          key="idle"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            backdropFilter: 'blur(20px)',
            zIndex: 200,
          }}
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            style={{
              textAlign: 'center',
              padding: '40px',
            }}
          >
            <motion.div variants={itemVariants}>
              <MotionTypography 
                variant={isMobile ? "h3" : "h2"} 
                sx={{ 
                  mb: 2, 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                {intl.t('home.title')}
              </MotionTypography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant="h6" sx={{ 
                mb: 4, 
                color: '#666',
                fontWeight: 400,
                maxWidth: 400,
                mx: 'auto',
              }}>
                {intl.t('game.clickToStart')}
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={onStartGame}
                style={{
                  padding: isMobile ? '16px 48px' : '20px 60px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 600,
                  borderRadius: '100px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <PlayArrowIcon /> {intl.t('home.startButton')}
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              style={{ marginTop: 24 }}
            >
              <Typography variant="body2" sx={{ color: '#999' }}>
                {isMobile ? intl.t('game.touchToMove') : intl.t('game.mouseToControl')}
              </Typography>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {status === 'paused' && (
        <motion.div
          key="paused"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 200,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <MotionTypography 
              variant={isMobile ? "h3" : "h2"} 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              {intl.t('game.paused')}
            </MotionTypography>
          </motion.div>
        </motion.div>
      )}

      {status === 'gameOver' && (
        <motion.div
          key="gameOver"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            zIndex: 200,
          }}
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            style={{
              textAlign: 'center',
              padding: '40px',
            }}
          >
            <motion.div variants={itemVariants}>
              <MotionTypography 
                variant={isMobile ? "h3" : "h2"} 
                sx={{ 
                  mb: 2,
                  fontWeight: 700,
                  color: '#ff4757',
                  textShadow: '0 4px 16px rgba(255, 71, 87, 0.3)',
                }}
              >
                {intl.t('game.gameOver')}
              </MotionTypography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                mb: 4, 
                color: 'white',
                opacity: 0.9,
              }}>
                {intl.t('game.finalScore')}: {score.toLocaleString()}
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={onResetGame}
                style={{
                  padding: isMobile ? '14px 40px' : '16px 48px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 600,
                  borderRadius: '100px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 71, 87, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(255, 71, 87, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <RestartAltIcon /> {intl.t('game.tryAgain')}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {status === 'victory' && (
        <motion.div
          key="victory"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {/* Confetti effect */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: 0
              }}
              animate={{ 
                y: window.innerHeight + 20,
                rotate: Math.random() * 720 - 360,
                scale: [0, 1, 1, 0],
              }}
              transition={{ 
                duration: Math.random() * 2 + 3,
                delay: Math.random() * 2,
                ease: "easeOut",
                repeat: Infinity,
              }}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: ['#FFD700', '#ff4757', '#667eea', '#00f2fe', '#f5576c'][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            style={{
              textAlign: 'center',
              padding: '40px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ marginBottom: 24 }}
            >
              <EmojiEventsIcon sx={{ 
                fontSize: isMobile ? 80 : 100, 
                color: '#FFD700',
                filter: 'drop-shadow(0 4px 16px rgba(255, 215, 0, 0.5))',
              }} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <MotionTypography 
                variant={isMobile ? "h3" : "h2"} 
                sx={{ 
                  mb: 2,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 16px rgba(255, 215, 0, 0.3)',
                }}
              >
                {intl.t('game.victory')}
              </MotionTypography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography variant={isMobile ? "h5" : "h4"} sx={{ 
                mb: 2, 
                color: 'white',
                opacity: 0.9,
              }}>
                {intl.t('game.score')}: {score.toLocaleString()}
              </Typography>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 32 }}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    rotate: [0, 360],
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <StarIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={onResetGame}
                style={{
                  padding: isMobile ? '14px 40px' : '16px 48px',
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 600,
                  borderRadius: '100px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: '#1a1a1a',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: '0 auto',
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 12px 32px rgba(255, 215, 0, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <RestartAltIcon /> {intl.t('game.playAgain')}
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}