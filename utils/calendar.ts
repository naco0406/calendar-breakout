import { CalendarEvent } from '@/types';
import { isSameDay, getHours, getMinutes, differenceInMinutes } from 'date-fns';

export const getEventPosition = (event: CalendarEvent, hourHeight: number = 60) => {
  const startHour = getHours(event.startTime);
  const startMinutes = getMinutes(event.startTime);
  const duration = differenceInMinutes(event.endTime, event.startTime);
  
  // Adjust for calendar starting at 6 AM
  // Hours 0-5 should appear at the end (after 23)
  let adjustedHour = startHour;
  if (startHour < 6) {
    adjustedHour = startHour + 18; // 0 becomes 18 (position after 23), 1 becomes 19, etc.
  } else {
    adjustedHour = startHour - 6; // 6 becomes 0, 7 becomes 1, etc.
  }
  
  // Calculate top position based on adjusted hour
  const top = (adjustedHour * hourHeight) + (startMinutes * (hourHeight / 60));
  
  // Calculate height based on duration, with minimum height
  const minHeight = Math.max(16, hourHeight * 0.3);
  const height = Math.max(minHeight, (duration * hourHeight) / 60);
  
  return { top, height };
};

export const getEventsForDay = (events: CalendarEvent[], day: Date): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.startTime, day));
};

export const formatEventTime = (startTime: Date, endTime: Date): string => {
  const formatTime = (date: Date) => {
    const hours = getHours(date);
    const minutes = getMinutes(date);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    return `${displayHours}${displayMinutes} ${period}`;
  };
  
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};