'use client';

import React, { FC, useState } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface TutorialProps {
  onClose: () => void;
  isMobile: boolean;
}

interface PowerUpInfo {
  icon: string;
  name: string;
  effect: string;
}

interface TutorialStep {
  title: string;
  content: string;
  highlight: string | null;
  powerups?: PowerUpInfo[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Calendar Breakout!',
    content: 'Break through your calendar events in this unique game that combines scheduling with classic breakout gameplay.',
    highlight: null,
  },
  {
    title: 'Control the Paddle',
    content: 'Move your mouse (or touch and drag on mobile) to control the blue paddle at the bottom of the screen.',
    highlight: 'paddle',
  },
  {
    title: 'Break Calendar Events',
    content: 'Hit the calendar events with the ball to break them and earn points. Different colors give different scores!',
    highlight: 'events',
  },
  {
    title: 'Collect Power-ups',
    content: 'Sometimes power-ups will drop when you break events. Collect them for special abilities!',
    highlight: 'powerups',
    powerups: [
      { icon: '⚡', name: 'Multi Ball', effect: 'Split ball into multiple balls (coming soon!)' },
      { icon: '🔷', name: 'Wide Paddle', effect: 'Makes your paddle 50% wider for 10 seconds' },
      { icon: '🐌', name: 'Slow Ball', effect: 'Slows down ball speed by 50% for 8 seconds' },
      { icon: '❤️', name: 'Extra Life', effect: 'Adds one extra life (max 5)' },
    ],
  },
  {
    title: 'Build Combos',
    content: 'Hit multiple events in a row without missing to build combos and multiply your score!',
    highlight: 'combo',
  },
];

export const Tutorial: FC<TutorialProps> = ({ onClose, isMobile }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: isMobile ? '20px' : '40px',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: isMobile ? 3 : 4,
          maxWidth: isMobile ? '100%' : '500px',
          width: '100%',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ mb: 2, fontWeight: 700 }}>
          {step.title}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          {step.content}
        </Typography>

        {step.powerups && (
          <Box sx={{ mb: 4 }}>
            {step.powerups.map((powerup, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    backgroundColor: 'primary.light',
                  }}
                >
                  {powerup.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {powerup.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {powerup.effect}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            startIcon={<NavigateBeforeIcon />}
            variant="outlined"
          >
            Previous
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {TUTORIAL_STEPS.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === currentStep ? 'primary.main' : 'action.disabled',
                  transition: 'background-color 0.3s',
                }}
              />
            ))}
          </Box>

          <Button
            onClick={handleNext}
            endIcon={currentStep < TUTORIAL_STEPS.length - 1 && <NavigateNextIcon />}
            variant="contained"
          >
            {currentStep < TUTORIAL_STEPS.length - 1 ? 'Next' : 'Start Game'}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Tutorial;