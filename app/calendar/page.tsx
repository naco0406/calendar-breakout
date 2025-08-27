'use client';

import CalendarGrid from '@/components/CalendarGrid';
import { SAMPLE_EVENTS } from '@/constants/calendar';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function CalendarPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <Container maxWidth="xl">
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ py: 4 }}
      >
        <motion.div variants={itemVariants}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <MotionTypography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Calendar View
            </MotionTypography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => router.push('/')}
                  sx={{ 
                    borderRadius: '100px',
                    px: 3,
                    py: 1,
                    borderColor: '#667eea',
                    color: '#667eea',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#764ba2',
                      color: '#764ba2',
                      background: 'rgba(118, 75, 162, 0.04)',
                    }
                  }}
                >
                  Home
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<SportsEsportsIcon />}
                  onClick={() => router.push('/game')}
                  sx={{ 
                    borderRadius: '100px',
                    px: 3,
                    py: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                >
                  Play Game
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          style={{ height: 'calc(100vh - 200px)', minHeight: 600 }}
        >
          <MotionBox
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2
            }}
            sx={{ 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <CalendarGrid events={SAMPLE_EVENTS} />
          </MotionBox>
        </motion.div>
      </MotionBox>
    </Container>
  );
}