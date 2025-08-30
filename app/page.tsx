'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/navigation';
import { useIntl } from '@/hooks';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Optimized game preview component
const GamePreview = React.memo(() => {
  const [paddleX, setPaddleX] = useState(200);
  const canvasRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const ballRef = useRef({ x: 200, y: 150, dx: 2, dy: -2 });
  const ballElementRef = useRef<HTMLDivElement>(null);
  const paddleElementRef = useRef<HTMLDivElement>(null);

  // Use RAF for smooth 60fps animation
  useEffect(() => {
    const animate = () => {
      const ball = ballRef.current;
      
      // Update position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Bounce off walls
      if (ball.x <= 10 || ball.x >= 390) {
        ball.dx = -ball.dx * 0.95;
        ball.x = ball.x <= 10 ? 10 : 390;
      }
      if (ball.y <= 10) {
        ball.dy = Math.abs(ball.dy) * 0.95;
        ball.y = 10;
      }
      
      // Reset if ball goes off bottom
      if (ball.y >= 290) {
        ball.x = 200;
        ball.y = 200;
        ball.dx = (Math.random() - 0.5) * 4;
        ball.dy = -2;
      }

      // Paddle bounce
      if (ball.y >= 235 && ball.y <= 265 && Math.abs(ball.x - paddleX) < 60) {
        ball.dy = -Math.abs(ball.dy) * 1.05;
        const relativeX = (ball.x - paddleX) / 60;
        ball.dx = relativeX * 4;
        ball.y = 235;
      }

      // Update ball position using transform (GPU accelerated)
      if (ballElementRef.current) {
        ballElementRef.current.style.transform = `translate3d(${ball.x - 8}px, ${ball.y - 8}px, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paddleX]);

  // Optimized input handling with throttling
  useEffect(() => {
    let frameId: number;
    let lastX = paddleX;
    
    const updatePaddle = (clientX: number) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(50, Math.min(350, clientX - rect.left));
        if (Math.abs(x - lastX) > 1) { // Only update if moved significantly
          lastX = x;
          if (frameId) cancelAnimationFrame(frameId);
          frameId = requestAnimationFrame(() => {
            setPaddleX(x);
            if (paddleElementRef.current) {
              paddleElementRef.current.style.transform = `translate3d(${x - 50}px, 0, 0)`;
            }
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => updatePaddle(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) updatePaddle(e.touches[0].clientX);
    };

    const container = canvasRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [paddleX]);

  return (
    <Box
      ref={canvasRef}
      sx={{
        position: 'relative',
        width: 400,
        height: 300,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'none',
      }}
    >
      {/* Removed calendar blocks for cleaner preview */}

      {/* Ball - Using ref for direct DOM manipulation */}
      <div
        ref={ballElementRef}
        style={{
          position: 'absolute',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #fff, #ddd)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transform: 'translate3d(192px, 142px, 0)',
          willChange: 'transform',
        }}
      />

      {/* Paddle - Using ref for direct DOM manipulation */}
      <div
        ref={paddleElementRef}
        style={{
          position: 'absolute',
          width: 100,
          height: 14,
          borderRadius: 7,
          background: 'linear-gradient(90deg, #667eea, #764ba2)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.6)',
          bottom: 40,
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transform: 'translate3d(150px, 0, 0)',
          willChange: 'transform',
        }}
      />

      {/* Subtle hint */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 30,
          height: 3,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 10,
        }}
      />
    </Box>
  );
});

GamePreview.displayName = 'GamePreview';

export default function HomePage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const intl = useIntl();
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showPersonaSelect, setShowPersonaSelect] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const personas = [
    {
      id: 'developer',
      title: intl.t('persona.developer.title'),
      icon: '👨‍💻',
      description: intl.t('persona.developer.description'),
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'pm',
      title: intl.t('persona.pm.title'),
      icon: '📊',
      description: intl.t('persona.pm.description'),
      color: '#4ECDC4',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    },
    {
      id: 'sales',
      title: intl.t('persona.sales.title'),
      icon: '💼',
      description: intl.t('persona.sales.description'),
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)',
    },
  ];

  const handlePlayClick = () => {
    setShowPersonaSelect(true);
  };

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId);
    // Store in localStorage for game to use
    localStorage.setItem('selectedPersona', personaId);
    // Navigate to game after a brief delay with smooth transition
    setTimeout(() => {
      router.push('/game');
    }, 500);
  };

  // Handle swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && carouselIndex < personas.length - 1) {
      setCarouselIndex(carouselIndex + 1);
    }
    if (isRightSwipe && carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Optimized gradient orbs using CSS animations */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: 600,
              height: 600,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${['#667eea20', '#4ECDC420', '#FF6B6B20'][i]} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              left: [100, 600, 300][i],
              top: [100, 300, 500][i],
              animation: `float${i} ${20 + i * 5}s linear infinite`,
              willChange: 'transform',
              '@keyframes float0': {
                '0%': { transform: 'translate(0, 0)' },
                '25%': { transform: 'translate(100px, -100px)' },
                '50%': { transform: 'translate(-100px, 100px)' },
                '75%': { transform: 'translate(-50px, -50px)' },
                '100%': { transform: 'translate(0, 0)' },
              },
              '@keyframes float1': {
                '0%': { transform: 'translate(0, 0)' },
                '25%': { transform: 'translate(-100px, 100px)' },
                '50%': { transform: 'translate(100px, -100px)' },
                '75%': { transform: 'translate(50px, 50px)' },
                '100%': { transform: 'translate(0, 0)' },
              },
              '@keyframes float2': {
                '0%': { transform: 'translate(0, 0)' },
                '25%': { transform: 'translate(50px, 50px)' },
                '50%': { transform: 'translate(-50px, -50px)' },
                '75%': { transform: 'translate(100px, -100px)' },
                '100%': { transform: 'translate(0, 0)' },
              },
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: { xs: 4, md: 8 },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <MotionTypography
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              sx={{
                fontSize: { xs: 12, sm: 14 },
                color: '#667eea',
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              {intl.t('home.subtitle')}
            </MotionTypography>

            <MotionTypography
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {intl.t('home.title')}
            </MotionTypography>

            <MotionTypography
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
              }}
            >
              {intl.t('home.description')}
            </MotionTypography>
          </Box>

          {/* Game Preview */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 6,
              perspective: 1000,
            }}
          >
            <Box
              sx={{
                transform: 'rotateX(5deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <GamePreview />
            </Box>
          </MotionBox>

          {/* Call to Action */}
          <MotionBox
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            sx={{ textAlign: 'center' }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handlePlayClick}
              sx={{
                fontSize: { xs: 18, sm: 20 },
                fontWeight: 700,
                px: { xs: 6, sm: 8 },
                py: { xs: 2, sm: 2.5 },
                borderRadius: 100,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                textTransform: 'none',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 25px 50px rgba(102, 126, 234, 0.4)',
                  '&::before': {
                    left: '100%',
                  },
                },
              }}
              endIcon={<PlayArrowIcon sx={{ fontSize: 24 }} />}
            >
              {intl.t('home.startButton')}
            </Button>

            <Typography
              sx={{
                mt: 3,
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: 14,
              }}
            >
              {intl.t('home.freeToPlay')}
            </Typography>
          </MotionBox>
        </MotionBox>
      </Container>

      {/* Persona Selection Modal */}
      <AnimatePresence>
        {showPersonaSelect && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(20px) saturate(180%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              p: 2,
            }}
            onClick={() => setShowPersonaSelect(false)}
          >
            <MotionBox
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              sx={{
                background: '#1a1a2e',
                borderRadius: { xs: 3, sm: 4 },
                p: { xs: 2, sm: 3, md: 4 },
                maxWidth: { xs: 'calc(100% - 32px)', sm: 520 },
                width: '100%',
                maxHeight: { xs: '85vh', sm: 'auto' },
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  fontWeight: 700,
                  mb: 1,
                  color: 'white',
                  fontSize: { xs: '1.75rem', sm: '2.125rem' },
                }}
              >
                {intl.t('persona.title')}
              </Typography>
              <Typography
                sx={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.6)',
                  mb: { xs: 3, sm: 4 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                {intl.t('persona.subtitle')}
              </Typography>

              {/* Carousel Container */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  mb: 1,
                }}
              >
                {/* Single Card Display */}
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 320, sm: 380 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={carouselIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        onClick={() => setSelectedPersona(personas[carouselIndex].id)}
                        sx={{
                          width: '100%',
                          maxWidth: { xs: '90%', sm: 340 },
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid',
                          borderColor: selectedPersona === personas[carouselIndex].id 
                            ? personas[carouselIndex].color 
                            : 'rgba(255, 255, 255, 0.15)',
                          borderRadius: { xs: 2.5, sm: 3 },
                          p: { xs: 3, sm: 4 },
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          transform: selectedPersona === personas[carouselIndex].id ? 'scale(1.02)' : 'scale(1)',
                          boxShadow: selectedPersona === personas[carouselIndex].id 
                            ? `0 0 0 3px ${personas[carouselIndex].color}40, 0 20px 40px rgba(0,0,0,0.3)` 
                            : '0 10px 30px rgba(0,0,0,0.2)',
                          '&:hover': {
                            borderColor: personas[carouselIndex].color,
                            transform: 'scale(1.02)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: personas[carouselIndex].gradient,
                            opacity: selectedPersona === personas[carouselIndex].id ? 0.08 : 0,
                            transition: 'opacity 0.3s ease',
                          },
                        }}
                      >
                        <Box sx={{ textAlign: 'center', position: 'relative' }}>
                          <Box
                            sx={{
                              fontSize: { xs: '3.5rem', sm: '4rem' },
                              mb: 2,
                              height: { xs: 70, sm: 80 },
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {personas[carouselIndex].icon}
                          </Box>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: 'white',
                              mb: 1.5,
                              fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            }}
                          >
                            {personas[carouselIndex].title}
                          </Typography>
                          <Typography
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: { xs: '0.875rem', sm: '1rem' },
                              lineHeight: 1.6,
                              px: 1,
                            }}
                          >
                            {personas[carouselIndex].description}
                          </Typography>
                          
                          {selectedPersona === personas[carouselIndex].id && (
                            <motion.div
                              initial={{ scale: 0, y: 10 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                              <Box
                                sx={{
                                  mt: 2.5,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  px: 2,
                                  py: 0.75,
                                  borderRadius: 100,
                                  background: personas[carouselIndex].gradient,
                                  boxShadow: `0 4px 16px ${personas[carouselIndex].color}40`,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    opacity: 0.9,
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'white',
                                    letterSpacing: '0.05em',
                                  }}
                                >
                                  {intl.t('persona.selected')}
                                </Typography>
                              </Box>
                            </motion.div>
                          )}
                        </Box>
                      </Box>
                    </motion.div>
                  </AnimatePresence>
                </Box>

                {/* Navigation Arrows - Inside Container */}
                {!isMobile && (
                  <>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setCarouselIndex(Math.max(0, carouselIndex - 1));
                        }}
                        disabled={carouselIndex === 0}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                          },
                          '&:disabled': {
                            opacity: 0.3,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      >
                        <ChevronLeftIcon />
                      </IconButton>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 10,
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          setCarouselIndex(Math.min(personas.length - 1, carouselIndex + 1));
                        }}
                        disabled={carouselIndex === personas.length - 1}
                        sx={{
                          color: 'white',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                          },
                          '&:disabled': {
                            opacity: 0.3,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>
                  </>
                )}

              </Box>

              {/* Minimal Dots Indicator */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 2.5,
                  mb: 3,
                }}
              >
                {personas.map((persona, index) => (
                  <Box
                    key={persona.id}
                    onClick={() => {
                      setCarouselIndex(index);
                    }}
                    sx={{
                      width: index === carouselIndex ? { xs: 16, sm: 20 } : { xs: 4, sm: 6 },
                      height: { xs: 4, sm: 6 },
                      borderRadius: { xs: 2, sm: 3 },
                      bgcolor: index === carouselIndex 
                        ? persona.color 
                        : 'rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      mx: 0.25,
                      '&:hover': {
                        bgcolor: index === carouselIndex 
                          ? persona.color 
                          : 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  />
                ))}
              </Box>
              
              {/* Page Number Indicator */}
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.4)',
                  mt: 1.5,
                  mb: 2.5,
                }}
              >
                {carouselIndex + 1} / {personas.length}
              </Typography>

              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    transform: selectedPersona ? 'scale(1)' : 'scale(0.95)',
                    opacity: selectedPersona ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedPersona}
                    onClick={() => selectedPersona && handlePersonaSelect(selectedPersona)}
                    sx={{
                      background: selectedPersona
                        ? personas.find(p => p.id === selectedPersona)?.gradient
                        : 'rgba(255, 255, 255, 0.05)',
                      px: { xs: 3, sm: 4 },
                      py: { xs: 1.25, sm: 1.5 },
                      borderRadius: 100,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                      textTransform: 'none',
                      letterSpacing: '0.02em',
                      border: '1px solid',
                      borderColor: selectedPersona 
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: selectedPersona
                        ? `0 8px 24px ${personas.find(p => p.id === selectedPersona)?.color}40`
                        : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: selectedPersona ? 'translateY(-2px)' : 'none',
                        boxShadow: selectedPersona
                          ? `0 12px 32px ${personas.find(p => p.id === selectedPersona)?.color}50`
                          : 'none',
                      },
                      '&:disabled': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.3)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                    endIcon={<ArrowForwardIcon sx={{ ml: 0.5 }} />}
                  >
                    {intl.t('persona.continueButton')}
                  </Button>
                </Box>
              </Box>
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}