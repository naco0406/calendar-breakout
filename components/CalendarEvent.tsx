'use client';

import { Box, Typography } from '@mui/material';
import { CalendarEvent as CalendarEventType } from '@/types';
import { formatEventTime, getEventPosition } from '@/utils/calendar';
import { motion } from 'framer-motion';

interface CalendarEventProps {
  event: CalendarEventType;
  onClick?: (event: CalendarEventType) => void;
  hourHeight?: number;
}

const CalendarEvent = ({ event, onClick, hourHeight = 60 }: CalendarEventProps) => {
  const { top, height } = getEventPosition(event, hourHeight);
  const timeString = formatEventTime(event.startTime, event.endTime);
  const isShort = height < 32;
  const isVeryShort = height < 20;

  // Calculate text color based on background color brightness
  const getTextColor = (backgroundColor: string) => {
    const rgb = backgroundColor.match(/\w\w/g);
    if (!rgb) return '#ffffff';
    
    const [r, g, b] = rgb.map((x) => parseInt(x, 16));
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#3c4043' : '#ffffff';
  };

  const textColor = getTextColor(event.color);
  const isLightBackground = textColor === '#3c4043';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -4 }}
      transition={{ 
        duration: 0.2, 
        ease: [0.4, 0.0, 0.2, 1] // Google's standard easing
      }}
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: '4px',
        right: '4px',
        height: `${Math.max(height - 1, 16)}px`,
        cursor: 'pointer',
        zIndex: 10,
      }}
      whileHover={{ 
        scale: 1.02,
        zIndex: 20,
        transition: { duration: 0.15 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      <Box
        data-event-id={event.id}
        onClick={() => onClick?.(event)}
        sx={{
          height: '100%',
          backgroundColor: event.color,
          borderRadius: '4px',
          padding: isVeryShort ? '2px 6px' : isShort ? '4px 8px' : '6px 12px',
          overflow: 'hidden',
          color: textColor,
          fontSize: isVeryShort ? '10px' : isShort ? '11px' : '12px',
          lineHeight: isVeryShort ? 1 : 1.2,
          fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
          boxShadow: isLightBackground 
            ? '0 1px 2px 0 rgba(60,64,67,.1), 0 1px 3px 1px rgba(60,64,67,.08)'
            : '0 1px 3px 0 rgba(0,0,0,.2), 0 2px 6px 2px rgba(0,0,0,.15)',
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          position: 'relative',
          border: isLightBackground ? `1px solid ${event.color}dd` : 'none',
          '&:hover': {
            boxShadow: isLightBackground
              ? '0 2px 4px 0 rgba(60,64,67,.2), 0 4px 12px 6px rgba(60,64,67,.1)'
              : '0 2px 8px 0 rgba(0,0,0,.3), 0 6px 20px 4px rgba(0,0,0,.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
            transform: 'translateY(0px)',
          },
          // Google Calendar's gradient overlay for better text readability
          '&::before': !isLightBackground ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.05) 100%)',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          } : {},
        }}
      >
        <Typography
          sx={{
            fontSize: 'inherit',
            fontWeight: 500,
            lineHeight: 'inherit',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: isVeryShort ? 'nowrap' : isShort ? 'nowrap' : 'normal',
            fontFamily: 'inherit',
            display: '-webkit-box',
            WebkitLineClamp: isVeryShort ? 1 : isShort ? 1 : 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          }}
        >
          {event.title}
        </Typography>
        
        {!isShort && !isVeryShort && (
          <Typography
            sx={{
              fontSize: '10px',
              lineHeight: 1.1,
              opacity: isLightBackground ? 0.7 : 0.85,
              mt: 0.25,
              fontFamily: 'inherit',
              fontWeight: 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {timeString}
          </Typography>
        )}

        {/* Resize handle for longer events */}
        {height > 40 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 8,
              height: 8,
              opacity: 0,
              cursor: 'ns-resize',
              transition: 'opacity 0.2s ease',
              '&:hover': {
                opacity: 0.6,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderBottom: `8px solid ${isLightBackground ? 'rgba(60,64,67,0.3)' : 'rgba(255,255,255,0.3)'}`,
              },
            }}
          />
        )}
      </Box>
    </motion.div>
  );
};

export default CalendarEvent;