import { CalendarEvent } from '@/types';
import { addDays, startOfWeek, setHours, setMinutes } from 'date-fns';

// Google Calendar color palette
export const CALENDAR_COLORS = {
  tomato: '#d50000',
  flamingo: '#e67c73',
  tangerine: '#f4511e',
  banana: '#f6bf26',
  sage: '#33b679',
  basil: '#0b8043',
  peacock: '#039be5',
  blueberry: '#3f51b5',
  lavender: '#7986cb',
  grape: '#8e24aa',
  graphite: '#616161',
} as const;

// Time slots for the calendar (6 AM to 3 AM next day)
export const TIME_SLOTS = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3
];

// Days of the week
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate sample events
const now = new Date();
const weekStart = startOfWeek(now);

export const SAMPLE_EVENTS: CalendarEvent[] = [
  // Monday
  {
    id: '1',
    title: 'Team Standup',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 9), 30),
    color: CALENDAR_COLORS.peacock,
    description: 'Daily team sync',
  },
  {
    id: '2',
    title: 'Product Review Meeting',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 12), 30),
    color: CALENDAR_COLORS.grape,
    description: 'Q4 product roadmap review',
  },
  {
    id: '3',
    title: 'Lunch with Sarah',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 12), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 13), 30),
    color: CALENDAR_COLORS.tangerine,
    description: 'Catch up at downtown cafe',
  },
  
  // Tuesday
  {
    id: '4',
    title: 'Design Sprint',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 12), 0),
    color: CALENDAR_COLORS.flamingo,
    description: 'New feature design workshop',
  },
  {
    id: '5',
    title: 'Client Presentation',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 15), 30),
    color: CALENDAR_COLORS.tomato,
    description: 'Project milestone demo',
  },
  {
    id: '6',
    title: 'Yoga Class',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 17), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 18), 30),
    color: CALENDAR_COLORS.basil,
    description: 'Weekly wellness session',
  },
  
  // Wednesday
  {
    id: '7',
    title: 'Marketing Sync',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 11), 0),
    color: CALENDAR_COLORS.banana,
    description: 'Campaign planning',
  },
  {
    id: '8',
    title: 'Code Review',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 15), 0),
    color: CALENDAR_COLORS.blueberry,
    description: 'PR reviews and feedback',
  },
  {
    id: '9',
    title: 'Team Building Event',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 16), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 18), 0),
    color: CALENDAR_COLORS.sage,
    description: 'Escape room activity',
  },
  
  // Thursday
  {
    id: '10',
    title: 'All Hands Meeting',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 10), 0),
    color: CALENDAR_COLORS.peacock,
    description: 'Company-wide update',
  },
  {
    id: '11',
    title: 'Dentist Appointment',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 11), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 12), 30),
    color: CALENDAR_COLORS.lavender,
    description: 'Regular checkup',
  },
  {
    id: '12',
    title: 'Project Planning',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 16), 0),
    color: CALENDAR_COLORS.grape,
    description: 'Q1 2025 planning session',
  },
  {
    id: '13',
    title: 'Happy Hour',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 17), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 18), 30),
    color: CALENDAR_COLORS.tangerine,
    description: 'Team social at local pub',
  },
  
  // Friday
  {
    id: '14',
    title: 'Sprint Review',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 11), 30),
    color: CALENDAR_COLORS.blueberry,
    description: 'End of sprint demo',
  },
  {
    id: '15',
    title: 'Lunch & Learn',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 12), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 13), 0),
    color: CALENDAR_COLORS.sage,
    description: 'AI/ML workshop',
  },
  {
    id: '16',
    title: '1:1 with Manager',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 15), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 15), 45),
    color: CALENDAR_COLORS.graphite,
    description: 'Weekly check-in',
  },
  
  // Saturday
  {
    id: '17',
    title: 'Brunch with Friends',
    startTime: setMinutes(setHours(addDays(weekStart, 6), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 6), 13), 0),
    color: CALENDAR_COLORS.flamingo,
    description: 'Weekend catchup',
  },
  {
    id: '18',
    title: 'Movie Night',
    startTime: setMinutes(setHours(addDays(weekStart, 6), 19), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 6), 21), 30),
    color: CALENDAR_COLORS.lavender,
    description: 'New release at cinema',
  },
  
  // Sunday
  {
    id: '19',
    title: 'Morning Run',
    startTime: setMinutes(setHours(addDays(weekStart, 0), 7), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 0), 8), 0),
    color: CALENDAR_COLORS.basil,
    description: '5K training',
  },
  {
    id: '20',
    title: 'Family Dinner',
    startTime: setMinutes(setHours(addDays(weekStart, 0), 18), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 0), 20), 0),
    color: CALENDAR_COLORS.tomato,
    description: 'Sunday family tradition',
  },
  
  // Additional events in normal hours
  {
    id: '21',
    title: 'Morning Coffee',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 6), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 7), 0),
    color: CALENDAR_COLORS.banana,
    description: 'Team coffee break',
  },
  {
    id: '22',
    title: 'Tech Talk',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 16), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 17), 0),
    color: CALENDAR_COLORS.lavender,
    description: 'AI/ML presentation',
  },
];

// Helper function to get hour label
export const getHourLabel = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
};