'use client';

import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

export default function HomePage() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: Math.random() * 300 + 100,
            height: Math.random() * 300 + 100,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 155}, 0.1) 0%, transparent 70%)`,
          }}
          animate={{
            x: mousePosition.x * 0.01 * (i + 1),
            y: mousePosition.y * 0.01 * (i + 1),
            scale: [1, 1.1, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 50 },
            y: { type: "spring", stiffness: 50 },
            scale: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" }
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: { xs: 4, md: 8 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <MotionTypography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                  }}
                >
                  Calendar
                  <br />
                  Breakout
                </MotionTypography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#4a5568',
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  Transform your schedule into an addictive game. Break through calendar events and have fun with productivity!
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/game')}
                      sx={{
                        borderRadius: '100px',
                        padding: { xs: '14px 32px', sm: '16px 40px' },
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                        textTransform: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
                          '&::before': {
                            left: '100%',
                          }
                        }
                      }}
                      endIcon={<SportsEsportsIcon />}
                    >
                      Play Now
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.push('/calendar')}
                      sx={{
                        borderRadius: '100px',
                        padding: { xs: '14px 32px', sm: '16px 40px' },
                        fontSize: { xs: '16px', sm: '18px' },
                        fontWeight: 600,
                        borderColor: 'rgba(102, 126, 234, 0.5)',
                        color: '#667eea',
                        textTransform: 'none',
                        borderWidth: 2,
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          borderColor: '#667eea',
                          borderWidth: 2,
                          background: 'rgba(102, 126, 234, 0.05)',
                          boxShadow: '0 5px 20px rgba(102, 126, 234, 0.15)',
                        }
                      }}
                      endIcon={<CalendarMonthIcon />}
                    >
                      Calendar
                    </Button>
                  </motion.div>
                </Box>
              </motion.div>

              {/* Social proof */}
              <motion.div variants={itemVariants} style={{ marginTop: 40 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GitHubIcon sx={{ fontSize: 20, color: '#666' }} />
                    <Typography sx={{ color: '#666', fontSize: '14px' }}>
                      Open Source
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                      >
                        ⭐
                      </motion.div>
                    ))}
                  </Box>
                  <Typography sx={{ color: '#666', fontSize: '14px' }}>
                    Loved by developers
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <MotionBox
                sx={{ 
                  position: 'relative',
                  height: { xs: 300, sm: 400, md: 500 },
                }}
              >
                {/* Interactive calendar preview */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    perspective: 1000,
                  }}
                  animate={{
                    rotateY: mousePosition.x * 0.01,
                    rotateX: -mousePosition.y * 0.01,
                  }}
                  transition={{ type: "spring", stiffness: 50 }}
                >
                  <Grid container spacing={2} sx={{ height: '100%' }}>
                    {[...Array(6)].map((_, i) => (
                      <Grid item xs={6} sm={4} key={i}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          whileHover={{ 
                            scale: 1.1,
                            rotate: Math.random() * 10 - 5,
                            transition: { type: "spring", stiffness: 300 }
                          }}
                          style={{ height: '100%' }}
                        >
                          <Paper
                            sx={{
                              height: { xs: 80, sm: 100, md: 120 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][i]}40 0%, ${['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][i]}20 100%)`,
                              border: `2px solid ${['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][i]}30`,
                              borderRadius: 3,
                              cursor: 'pointer',
                              position: 'relative',
                              overflow: 'hidden',
                              transformStyle: 'preserve-3d',
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                width: '200%',
                                height: '200%',
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                                transform: 'rotate(45deg)',
                                pointerEvents: 'none',
                              }
                            }}
                          >
                            <CalendarMonthIcon 
                              sx={{ 
                                fontSize: { xs: 32, sm: 40, md: 48 },
                                color: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'][i],
                                opacity: 0.8,
                              }} 
                            />
                          </Paper>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Animated ball */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #667eea, #764ba2)',
                      boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                    }}
                    animate={{
                      x: [0, 200, 0, -200, 0],
                      y: [0, -100, 200, -50, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </MotionBox>
            </Grid>
          </Grid>

          {/* Features */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mt: { xs: 4, md: 8 } }}>
              {[
                {
                  title: 'Break Events',
                  description: 'Smash through calendar blocks with precision',
                  icon: '🎯',
                  color: '#667eea',
                },
                {
                  title: 'Score Big',
                  description: 'Chain combos and unlock achievements',
                  icon: '⚡',
                  color: '#764ba2',
                },
                {
                  title: 'Power Up',
                  description: 'Collect boosts to dominate your schedule',
                  icon: '🚀',
                  color: '#f093fb',
                },
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Paper
                      sx={{
                        p: { xs: 3, sm: 4 },
                        height: '100%',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 20px 40px ${feature.color}20`,
                          border: `1px solid ${feature.color}40`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${feature.color}05 0%, ${feature.color}10 100%)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        }
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          delay: index * 0.2,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        style={{ fontSize: { xs: 48, sm: 60 }, marginBottom: 16 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: feature.color }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </MotionBox>
      </Container>
    </Box>
  );
}