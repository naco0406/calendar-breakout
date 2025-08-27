'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarEvent as CalendarEventType } from '@/types/calendar';

interface CalendarEventProps {
  event: CalendarEventType;
  position: { top: number; height: number };
  isDestroyed: boolean;
  isMobile: boolean;
}

const CalendarEvent = React.memo(({ event, position, isDestroyed, isMobile }: CalendarEventProps) => {
  if (isDestroyed) return null;
  
  return (
    <Box
      data-event-id={event.id}
      sx={{
        position: 'absolute',
        top: `${position.top}px`,
        left: '4px',
        right: '4px',
        height: `${Math.max(position.height, 20)}px`,
        backgroundColor: event.color,
        borderRadius: '4px',
        padding: isMobile ? '2px 6px' : '4px 8px',
        fontSize: isMobile ? '10px' : '12px',
        color: 'white',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        zIndex: 2,
        overflow: 'hidden',
        willChange: 'transform',
      }}
    >
      <Typography sx={{ 
        fontSize: 'inherit',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {event.title}
      </Typography>
    </Box>
  );
}, (prevProps, nextProps) => {
  return prevProps.event.id === nextProps.event.id &&
         prevProps.isDestroyed === nextProps.isDestroyed &&
         prevProps.position.top === nextProps.position.top &&
         prevProps.position.height === nextProps.position.height;
});

CalendarEvent.displayName = 'CalendarEvent';

export default CalendarEvent;