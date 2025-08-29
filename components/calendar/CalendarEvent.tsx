'use client';

import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarEvent as CalendarEventType } from '@/types/calendar';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface CalendarEventProps {
  event: CalendarEventType;
  position: { top: number; height: number };
  isDestroyed: boolean;
  isMobile: boolean;
}

const CalendarEventComponent: FC<CalendarEventProps> = ({ event, position, isDestroyed, isMobile }) => {
  if (isDestroyed) return null;
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };
  
  const startTime = formatTime(event.startTime);
  const isShortEvent = position.height < 40;
  const isMediumEvent = position.height < 60;
  
  return (
    <Box
      data-event-id={event.id}
      sx={{
        position: 'absolute',
        top: `${position.top}px`,
        left: '2px',
        right: '2px',
        height: `${Math.max(position.height - 1, 20)}px`,
        backgroundColor: event.color,
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        padding: isShortEvent ? '0 6px' : '2px 8px',
        fontSize: isMobile ? '11px' : '12px',
        color: 'white',
        fontWeight: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isShortEvent ? 'center' : 'flex-start',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        zIndex: 2,
        overflow: 'hidden',
        willChange: 'transform, opacity',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease',
        fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          zIndex: 3,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '4px 0 0 4px',
        }
      }}
    >
      {/* Title and Time */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 0.5,
        minHeight: 0,
      }}>
        {!isShortEvent && (
          <Typography sx={{ 
            fontSize: '11px',
            opacity: 0.9,
            flexShrink: 0,
          }}>
            {startTime}
          </Typography>
        )}
        <Typography sx={{ 
          fontSize: isShortEvent ? '11px' : '12px',
          fontWeight: isShortEvent ? 600 : 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
          flex: 1,
        }}>
          {isShortEvent && `${startTime} `}{event.title}
        </Typography>
      </Box>
      
      {/* Location - only show if there's enough space */}
      {!isShortEvent && !isMediumEvent && event.location && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 0.3,
          mt: 0.25,
          opacity: 0.85,
        }}>
          <LocationOnIcon sx={{ fontSize: '12px' }} />
          <Typography sx={{ 
            fontSize: '11px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {event.location}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export const CalendarEvent = React.memo(CalendarEventComponent, (prevProps, nextProps) => {
  return prevProps.event.id === nextProps.event.id &&
         prevProps.isDestroyed === nextProps.isDestroyed &&
         prevProps.position.top === nextProps.position.top &&
         prevProps.position.height === nextProps.position.height;
});

export default CalendarEvent;