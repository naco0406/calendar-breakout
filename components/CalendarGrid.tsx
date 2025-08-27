'use client';

import { Box, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { CalendarEvent as CalendarEventType } from '@/types';
import CalendarEvent from './CalendarEvent';
import { getEventsForDay } from '@/utils/calendar';
import { TIME_SLOTS, DAYS_OF_WEEK, getHourLabel } from '@/constants/calendar';
import { addDays, format, startOfWeek } from 'date-fns';
import { useState } from 'react';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  events: CalendarEventType[];
  onEventClick?: (event: CalendarEventType) => void;
}

const CalendarGrid = ({ events, onEventClick }: CalendarGridProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [currentDate] = useState(new Date());
  const weekStart = startOfWeek(currentDate);

  const timeColumnWidth = isMobile ? 48 : isTablet ? 56 : 60;
  const headerHeight = isMobile ? 70 : 80;
  const hourHeight = isMobile ? 48 : 60;

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #dadce0',
        borderRadius: '8px',
        fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          height: `${headerHeight}px`,
          borderBottom: '1px solid #dadce0',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Time column header */}
        <Box
          sx={{
            width: `${timeColumnWidth}px`,
            borderRight: '1px solid #dadce0',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: isMobile ? '10px' : '11px',
              color: '#70757a',
              fontWeight: 400,
              fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
            }}
          >
            GMT+9
          </Typography>
        </Box>
        
        {/* Day headers */}
        <Box sx={{ flex: 1, display: 'flex' }}>
          {DAYS_OF_WEEK.map((day, index) => {
            const currentDay = addDays(weekStart, index);
            const isToday = format(currentDay, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
            
            return (
              <Box
                key={day}
                sx={{
                  flex: 1,
                  borderRight: index < 6 ? '1px solid #dadce0' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: isMobile ? 0.5 : 1,
                  backgroundColor: '#ffffff',
                }}
              >
                <Typography
                  sx={{
                    fontSize: isMobile ? '10px' : '11px',
                    fontWeight: 500,
                    color: isToday ? '#1a73e8' : '#70757a',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                    mb: 0.25,
                  }}
                >
                  {isMobile ? day.slice(0, 1) : day}
                </Typography>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? 28 : 40,
                    height: isMobile ? 28 : 40,
                    borderRadius: '50%',
                    backgroundColor: isToday ? '#1a73e8' : 'transparent',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: isToday ? '#1557b0' : '#f1f3f4',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: isMobile ? '16px' : '20px',
                      fontWeight: isToday ? 500 : 400,
                      color: isToday ? '#ffffff' : '#3c4043',
                      fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                      lineHeight: 1,
                    }}
                  >
                    {format(currentDay, 'd')}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Calendar body */}
      <Box
        className={styles.calendarScrollbar}
        sx={{
          display: 'flex',
          height: `calc(100% - ${headerHeight}px)`,
          overflow: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Time column */}
        <Box
          sx={{
            width: `${timeColumnWidth}px`,
            borderRight: '1px solid #dadce0',
            flexShrink: 0,
            backgroundColor: '#ffffff',
            position: 'sticky',
            left: 0,
            zIndex: 2,
          }}
        >
          {TIME_SLOTS.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: `${hourHeight}px`,
                borderBottom: hour === 23 ? 'none' : '1px solid #dadce0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                pr: 0.5,
                pt: hour === 0 ? 0 : 0.5,
                position: 'relative',
              }}
            >
              {hour > 0 && (
                <Typography
                  sx={{
                    fontSize: isMobile ? '10px' : '11px',
                    color: '#70757a',
                    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                    fontWeight: 400,
                    transform: 'translateY(-50%)',
                    backgroundColor: '#ffffff',
                    px: 0.5,
                    lineHeight: 1,
                  }}
                >
                  {getHourLabel(hour)}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        {/* Days columns */}
        <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
          {DAYS_OF_WEEK.map((_, dayIndex) => {
            const currentDay = addDays(weekStart, dayIndex);
            const dayEvents = getEventsForDay(events, currentDay);
            const isToday = format(currentDay, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
            
            return (
              <Box
                key={dayIndex}
                sx={{
                  flex: 1,
                  borderRight: dayIndex < 6 ? '1px solid #dadce0' : 'none',
                  position: 'relative',
                  backgroundColor: isToday ? '#fef7e0' : '#ffffff',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {/* Hour grid lines */}
                {TIME_SLOTS.map((hour) => (
                  <Box
                    key={hour}
                    sx={{
                      height: `${hourHeight}px`,
                      borderBottom: hour === 23 ? 'none' : '1px solid #dadce0',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      '&:hover': {
                        backgroundColor: isToday 
                          ? 'rgba(251, 188, 4, 0.08)' 
                          : 'rgba(60, 64, 67, 0.04)',
                      },
                    }}
                  />
                ))}
                
                {/* Events */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                  }}
                >
                  {dayEvents.map((event) => (
                    <CalendarEvent
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      hourHeight={hourHeight}
                    />
                  ))}
                </Box>

                {/* Today indicator line */}
                {isToday && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: `${((new Date().getHours() * 60 + new Date().getMinutes()) / 60) * hourHeight}px`,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: '#ea4335',
                      zIndex: 3,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -6,
                        top: -4,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#ea4335',
                      },
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default CalendarGrid;