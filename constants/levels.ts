import { CalendarEvent } from '@/types';
import { CALENDAR_COLORS, SAMPLE_EVENTS } from './calendar';
import { addDays, setHours, setMinutes, startOfWeek } from 'date-fns';

interface Level {
  id: number;
  name: string;
  description: string;
  ballSpeed: number;
  paddleWidth: number;
  eventCount: number;
  specialRules?: string[];
}

export const GAME_LEVELS: Level[] = [
  {
    id: 1,
    name: 'Monday Morning',
    description: 'Start your week by clearing your Monday meetings',
    ballSpeed: 5,
    paddleWidth: 100,
    eventCount: 8,
  },
  {
    id: 2,
    name: 'Midweek Madness',
    description: 'Wednesday is packed! Clear all appointments',
    ballSpeed: 6,
    paddleWidth: 90,
    eventCount: 12,
  },
  {
    id: 3,
    name: 'Friday Rush',
    description: 'Finish strong before the weekend',
    ballSpeed: 7,
    paddleWidth: 80,
    eventCount: 15,
    specialRules: ['Ball speeds up after each hit'],
  },
  {
    id: 4,
    name: 'Weekend Warrior',
    description: 'Even weekends need organizing',
    ballSpeed: 8,
    paddleWidth: 70,
    eventCount: 18,
    specialRules: ['Smaller paddle', 'Extra life at 1000 points'],
  },
  {
    id: 5,
    name: 'Full Calendar Chaos',
    description: 'Master level - clear the entire week!',
    ballSpeed: 9,
    paddleWidth: 60,
    eventCount: 25,
    specialRules: ['Maximum difficulty', 'No room for error'],
  },
];

// Generate events for a specific level
export const generateLevelEvents = (level: Level): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const weekStart = startOfWeek(new Date());
  const colors = Object.values(CALENDAR_COLORS);
  
  // Event templates for variety
  const eventTemplates = [
    { title: 'Team Meeting', duration: 60 },
    { title: 'Project Review', duration: 90 },
    { title: '1:1 Sync', duration: 30 },
    { title: 'Client Call', duration: 45 },
    { title: 'Workshop', duration: 120 },
    { title: 'Presentation', duration: 60 },
    { title: 'Code Review', duration: 45 },
    { title: 'Planning Session', duration: 90 },
    { title: 'Training', duration: 120 },
    { title: 'Interview', duration: 60 },
    { title: 'Lunch Meeting', duration: 60 },
    { title: 'Design Review', duration: 45 },
    { title: 'Strategy Session', duration: 90 },
    { title: 'Brainstorming', duration: 60 },
    { title: 'Status Update', duration: 30 },
  ];

  // Distribute events across the week based on level
  for (let i = 0; i < level.eventCount; i++) {
    const template = eventTemplates[i % eventTemplates.length];
    const dayOffset = Math.floor(Math.random() * 7);
    const hour = 9 + Math.floor(Math.random() * 9); // 9 AM to 5 PM
    const minute = Math.random() > 0.5 ? 0 : 30;
    
    const startTime = setMinutes(setHours(addDays(weekStart, dayOffset), hour), minute);
    const endTime = new Date(startTime.getTime() + template.duration * 60000);
    
    events.push({
      id: `level-${level.id}-event-${i}`,
      title: template.title,
      startTime,
      endTime,
      color: colors[i % colors.length],
      description: `Level ${level.id} event`,
    });
  }

  return events;
};

// Get events for current level
export const getCurrentLevelEvents = (levelId: number): CalendarEvent[] => {
  const level = GAME_LEVELS.find(l => l.id === levelId);
  if (!level) return SAMPLE_EVENTS;
  
  return generateLevelEvents(level);
};

// Calculate score multiplier based on level
export const getLevelScoreMultiplier = (levelId: number): number => {
  return 1 + (levelId - 1) * 0.5; // 1x, 1.5x, 2x, 2.5x, 3x
};

// Get level completion bonus
export const getLevelCompletionBonus = (levelId: number): number => {
  return levelId * 1000; // 1000, 2000, 3000, etc.
};