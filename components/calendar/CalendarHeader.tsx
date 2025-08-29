'use client';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { format, addDays } from 'date-fns';
import { DAYS_OF_WEEK } from '@/constants/calendar';

interface CalendarHeaderProps {
  weekStart: Date;
  currentDate: Date;
  timeColumnWidth: number;
  headerHeight: number;
}

export default function CalendarHeader({
  weekStart,
  currentDate,
  timeColumnWidth,
  headerHeight,
}: CalendarHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        height: `${headerHeight}px`,
        borderBottom: '1px solid #dadce0',
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          width: `${timeColumnWidth}px`,
          borderRight: '1px solid #dadce0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ 
          fontSize: isMobile ? '10px' : '11px', 
          color: '#70757a',
          fontWeight: isMobile ? 500 : 400,
          letterSpacing: '0.02em',
          fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
        }}>
          {isMobile ? 'GMT' : 'GMT+9'}
        </Typography>
      </Box>
      
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
              }}
            >
              <Typography sx={{ 
                fontSize: isMobile ? '10px' : '11px', 
                fontWeight: isMobile ? 600 : 500, 
                color: isToday ? '#1a73e8' : '#70757a', 
                mb: 0.25,
                letterSpacing: isMobile ? '0.03em' : 'normal',
                fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
              }}>
                {isMobile ? day.slice(0, 1) : day}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isMobile ? 24 : 32,
                  height: isMobile ? 24 : 32,
                  borderRadius: '50%',
                  backgroundColor: isToday ? '#1a73e8' : 'transparent',
                }}
              >
                <Typography sx={{ 
                  fontSize: isMobile ? '14px' : '16px', 
                  fontWeight: isToday ? 600 : 400, 
                  color: isToday ? '#ffffff' : '#3c4043',
                  fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                  lineHeight: 1,
                }}>
                  {format(currentDay, 'd')}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}