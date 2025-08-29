'use client';

import { Box, Typography } from '@mui/material';
import { format, addDays } from 'date-fns';
import { CalendarEvent as CalendarEventType } from '@/types/calendar';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import { TIME_SLOTS, DAYS_OF_WEEK, getHourLabel } from '@/constants/calendar';
import { getEventsForDay, getEventPosition } from '@/utils/calendar';

interface CalendarBodyProps {
  weekStart: Date;
  currentDate: Date;
  events: CalendarEventType[];
  destroyedEvents: Set<string>;
  timeColumnWidth: number;
  hourHeight: number;
  calendarHeight: number;
  isMobile: boolean;
}

export default function CalendarBody({
  weekStart,
  currentDate,
  events,
  destroyedEvents,
  timeColumnWidth,
  hourHeight,
  calendarHeight,
  isMobile,
}: CalendarBodyProps) {
  return (
    <Box sx={{ display: 'flex', height: `${calendarHeight}px`, position: 'relative' }}>
      {/* Time Column */}
      <Box
        sx={{
          width: `${timeColumnWidth}px`,
          borderRight: '1px solid #dadce0',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
        {TIME_SLOTS.map((hour, index) => (
          <Box
            key={hour}
            sx={{
              height: `${hourHeight}px`,
              borderBottom: index === TIME_SLOTS.length - 1 ? 'none' : '1px solid #dadce0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pt: 0.5,
            }}
          >
            <Typography sx={{ 
              fontSize: isMobile ? '10px' : '11px', 
              fontWeight: isMobile ? 500 : 400,
              color: '#70757a', 
              transform: 'translateY(-50%)',
              letterSpacing: isMobile ? '0.02em' : 'normal',
              fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
            }}>
              {isMobile && hour % 2 !== 0 ? '' : getHourLabel(hour)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar Days */}
      <Box sx={{ flex: 1, display: 'flex', position: 'relative' }}>
        {DAYS_OF_WEEK.map((day, index) => {
          const currentDay = addDays(weekStart, index);
          const dayEvents = getEventsForDay(events.filter(e => !destroyedEvents.has(e.id)), currentDay);
          const isToday = format(currentDay, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
          
          return (
            <Box
              key={`${day}-${index}`}
              sx={{
                flex: 1,
                borderRight: index < 6 ? '1px solid #dadce0' : 'none',
                position: 'relative',
                backgroundColor: isToday ? '#fef7e0' : '#ffffff',
              }}
            >
              {/* Hour lines */}
              {TIME_SLOTS.map((hour, index) => (
                <Box
                  key={hour}
                  sx={{
                    height: `${hourHeight}px`,
                    borderBottom: index === TIME_SLOTS.length - 1 ? 'none' : 
                      (isMobile && hour % 2 !== 0 ? '1px solid #e8e8e8' : '1px solid #dadce0'),
                  }}
                />
              ))}
              
              {/* Events */}
              {dayEvents.map((event) => {
                const position = getEventPosition(event, hourHeight);
                return (
                  <CalendarEvent
                    key={event.id}
                    event={event}
                    position={position}
                    isDestroyed={destroyedEvents.has(event.id)}
                    isMobile={isMobile}
                  />
                );
              })}

              {/* Current time indicator */}
              {isToday && (() => {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinutes = now.getMinutes();
                
                // Adjust for calendar starting at 6 AM
                let adjustedHour = currentHour;
                if (currentHour < 6) {
                  adjustedHour = currentHour + 18; // 0 becomes 18, 1 becomes 19, etc.
                } else {
                  adjustedHour = currentHour - 6; // 6 becomes 0, 7 becomes 1, etc.
                }
                
                // Only show indicator if current time falls within the calendar range
                if (currentHour >= 6 || currentHour <= 3) {
                  return (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: `${(adjustedHour * hourHeight) + (currentMinutes * (hourHeight / 60))}px`,
                        left: 0,
                        right: 0,
                        height: isMobile ? '1.5px' : '2px',
                        backgroundColor: '#ea4335',
                        zIndex: 3,
                        boxShadow: '0 1px 3px rgba(234, 67, 53, 0.3)',
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
                  );
                }
                return null;
              })()}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}