'use client';

import React, { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarEvent as CalendarEventType } from '@/types/calendar';

interface CalendarGridEventProps {
  event: CalendarEventType;
  onClick?: (event: CalendarEventType) => void;
  hourHeight: number;
}

export const CalendarGridEvent: FC<CalendarGridEventProps> = ({ event, onClick, hourHeight }) => {
  // Calculate position based on start and end times
  const startHour = event.startTime.getHours();
  const startMinute = event.startTime.getMinutes();
  const endHour = event.endTime.getHours();
  const endMinute = event.endTime.getMinutes();
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const duration = endMinutes - startMinutes;
  
  const top = (startMinutes / 60) * hourHeight;
  const height = (duration / 60) * hourHeight;
  
  return (
    <Box
      onClick={() => onClick?.(event)}
      sx={{
        position: 'absolute',
        top: `${top}px`,
        left: '4px',
        right: '4px',
        height: `${Math.max(height - 2, 20)}px`,
        backgroundColor: event.color,
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: '12px',
        color: 'white',
        fontWeight: 500,
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': onClick ? {
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          transform: 'translateX(1px)',
        } : {},
      }}
    >
      <Typography sx={{ 
        fontSize: 'inherit',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        lineHeight: 1.2,
      }}>
        {event.title}
      </Typography>
      {height > 40 && (
        <Typography sx={{ 
          fontSize: '10px',
          opacity: 0.9,
          mt: 0.5,
        }}>
          {event.startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - 
          {' '}{event.endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      )}
    </Box>
  );
};

export default CalendarGridEvent;