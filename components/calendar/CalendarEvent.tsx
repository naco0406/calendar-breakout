'use client';

import React, { FC, useState } from 'react';
import { Box, Typography, Tooltip, ClickAwayListener } from '@mui/material';
import { CalendarEvent as CalendarEventType } from '@/types/calendar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface CalendarEventProps {
  event: CalendarEventType;
  position: { top: number; height: number };
  isDestroyed: boolean;
  isMobile: boolean;
}

const CalendarEventComponent: FC<CalendarEventProps> = ({ event, position, isDestroyed, isMobile }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
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
  
  // Mobile-specific adjustments
  const isMobileShortEvent = isMobile && position.height < 50;
  const showTimeOnMobile = isMobile && position.height > 25;
  
  // Create abbreviated title for very small mobile events
  const getDisplayTitle = () => {
    if (isMobile && position.height < 25) {
      // Show first 3-4 letters or first word
      const words = event.title.split(' ');
      if (words[0].length <= 4) return words[0];
      return event.title.substring(0, 4) + '...';
    }
    return event.title;
  };
  
  const handleEventClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setShowTooltip(!showTooltip);
    }
  };
  
  const tooltipContent = (
    <Box sx={{ p: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {event.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
        <AccessTimeIcon sx={{ fontSize: 14 }} />
        <Typography variant="body2">
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </Typography>
      </Box>
      {event.location && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 14 }} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>
      )}
    </Box>
  );
  
  const eventBox = (
    <Box
      data-event-id={event.id}
      onClick={handleEventClick}
      sx={{
        position: 'absolute',
        top: `${position.top}px`,
        left: '2px',
        right: '2px',
        height: `${Math.max(position.height - 1, 20)}px`,
        backgroundColor: event.color,
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        padding: isMobile ? '1px 4px' : (isShortEvent ? '0 6px' : '2px 8px'),
        fontSize: isMobile ? '10px' : '12px',
        color: 'white',
        fontWeight: isMobile ? 600 : 500,
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
          width: isMobile ? '2px' : '4px',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '4px 0 0 4px',
        }
      }}
    >
      {/* Title and Time */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile && isMobileShortEvent ? 'column' : 'row',
        alignItems: isMobile && isMobileShortEvent ? 'flex-start' : 'center',
        gap: isMobile ? 0.25 : 0.5,
        minHeight: 0,
      }}>
        {!isShortEvent && !isMobile && (
          <Typography sx={{ 
            fontSize: '11px',
            opacity: 0.9,
            flexShrink: 0,
          }}>
            {startTime}
          </Typography>
        )}
        {isMobile && showTimeOnMobile && (
          <Typography sx={{ 
            fontSize: '9px',
            opacity: 0.9,
            fontWeight: 500,
            flexShrink: 0,
            lineHeight: 1,
          }}>
            {startTime}
          </Typography>
        )}
        <Typography sx={{ 
          fontSize: isMobile ? (isMobileShortEvent ? '9px' : '10px') : (isShortEvent ? '11px' : '12px'),
          fontWeight: isMobile ? 700 : (isShortEvent ? 600 : 500),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: isMobile ? 1 : 1.2,
          flex: 1,
          letterSpacing: isMobile ? '0.02em' : 'normal',
          textShadow: isMobile ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
        }}>
          {!isMobile && isShortEvent && `${startTime} `}{getDisplayTitle()}
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
  
  if (isMobile) {
    return (
      <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
        <div>
          <Tooltip
            open={showTooltip}
            title={tooltipContent}
            placement="top"
            arrow
            PopperProps={{
              sx: {
                '& .MuiTooltip-tooltip': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  fontSize: '12px',
                  maxWidth: 300,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                },
                '& .MuiTooltip-arrow': {
                  color: 'rgba(0, 0, 0, 0.9)',
                },
              },
            }}
          >
            {eventBox}
          </Tooltip>
        </div>
      </ClickAwayListener>
    );
  }
  
  return eventBox;
};

export const CalendarEvent = React.memo(CalendarEventComponent, (prevProps, nextProps) => {
  return prevProps.event.id === nextProps.event.id &&
         prevProps.isDestroyed === nextProps.isDestroyed &&
         prevProps.position.top === nextProps.position.top &&
         prevProps.position.height === nextProps.position.height;
});

export default CalendarEvent;