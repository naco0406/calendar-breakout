'use client';

import React, { FC, useState, useMemo } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useIntl } from '@/hooks';

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

export const Tutorial: FC<TutorialProps> = ({ onClose, isMobile }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const intl = useIntl();

  const TUTORIAL_STEPS: TutorialStep[] = useMemo(() => [
    {
      title: intl.t('tutorial.title'),
      content: intl.t('tutorial.subtitle'),
      highlight: null,
    },
    {
      title: intl.t('tutorial.step2.title'),
      content: intl.t('tutorial.step2.description'),
      highlight: 'paddle',
    },
    {
      title: intl.t('tutorial.step1.title'),
      content: intl.t('tutorial.step1.description'),
      highlight: 'events',
    },
    {
      title: intl.t('tutorial.step3.title'),
      content: intl.t('tutorial.step3.description'),
      highlight: 'powerups',
      powerups: [
        { icon: '⚡', name: intl.t('tutorial.powerups.multiball'), effect: intl.t('tutorial.powerups.multiball.effect') },
        { icon: '🔷', name: intl.t('tutorial.powerups.widePaddle'), effect: intl.t('tutorial.powerups.widePaddle.effect') },
        { icon: '🐌', name: intl.t('tutorial.powerups.slowBall'), effect: intl.t('tutorial.powerups.slowBall.effect') },
        { icon: '❤️', name: intl.t('tutorial.powerups.extraLife'), effect: intl.t('tutorial.powerups.extraLife.effect') },
      ],
    },
    {
      title: intl.t('tutorial.step4.title'),
      content: intl.t('tutorial.step4.description'),
      highlight: 'combo',
    },
  ], [intl]);

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
            {intl.t('tutorial.previous')}
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
            {currentStep < TUTORIAL_STEPS.length - 1 ? intl.t('tutorial.next') : intl.t('tutorial.startGame')}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Tutorial;