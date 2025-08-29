import { CalendarEvent } from '@/types';
import { addDays, startOfWeek, setHours, setMinutes } from 'date-fns';
import { CALENDAR_COLORS } from './calendar';

// Generate persona-specific events
const now = new Date();
const weekStart = startOfWeek(now);

// Developer events
export const DEVELOPER_EVENTS: CalendarEvent[] = [
  // Monday
  {
    id: 'dev-1',
    title: 'Daily Standup',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 9), 15),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 9), 30),
    color: CALENDAR_COLORS.peacock,
    location: 'Team Channel',
    description: 'Daily sync with development team',
  },
  {
    id: 'dev-2',
    title: 'Code Review Session',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 11), 30),
    color: CALENDAR_COLORS.blueberry,
    location: 'GitHub PR #421',
    description: 'Review authentication refactor',
  },
  {
    id: 'dev-3',
    title: 'Deep Work Block',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 17), 0),
    color: CALENDAR_COLORS.sage,
    location: 'Focus Time',
    description: 'Implement new feature',
  },
  
  // Tuesday
  {
    id: 'dev-4',
    title: 'Architecture Meeting',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 12), 0),
    color: CALENDAR_COLORS.grape,
    location: 'Tech Conference Room',
    description: 'Microservices design discussion',
  },
  {
    id: 'dev-5',
    title: 'Pair Programming',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 13), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 15), 0),
    color: CALENDAR_COLORS.tangerine,
    location: 'VS Code Live Share',
    description: 'Refactor payment module with John',
  },
  {
    id: 'dev-6',
    title: 'Tech Talk: Rust',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 16), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 17), 0),
    color: CALENDAR_COLORS.lavender,
    location: 'Main Hall',
    description: 'Introduction to Rust programming',
  },
  
  // Wednesday
  {
    id: 'dev-7',
    title: 'Sprint Planning',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 11), 0),
    color: CALENDAR_COLORS.banana,
    location: 'Scrum Board',
    description: 'Plan next sprint tasks',
  },
  {
    id: 'dev-8',
    title: 'Debug Production Issue',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 15), 30),
    color: CALENDAR_COLORS.tomato,
    location: 'War Room',
    description: 'Investigate API timeout issues',
  },
  {
    id: 'dev-9',
    title: 'Security Training',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 16), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 17), 0),
    color: CALENDAR_COLORS.graphite,
    location: 'Online',
    description: 'OWASP best practices',
  },
  
  // Thursday
  {
    id: 'dev-10',
    title: 'API Design Review',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 11), 30),
    color: CALENDAR_COLORS.peacock,
    location: 'Design Docs',
    description: 'Review v2 API specifications',
  },
  {
    id: 'dev-11',
    title: 'CI/CD Pipeline Work',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 13), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 15), 0),
    color: CALENDAR_COLORS.basil,
    location: 'GitHub Actions',
    description: 'Set up automated testing',
  },
  {
    id: 'dev-12',
    title: '1:1 with Tech Lead',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 16), 30),
    color: CALENDAR_COLORS.flamingo,
    location: "Manager's Office",
    description: 'Career development discussion',
  },
  
  // Friday
  {
    id: 'dev-13',
    title: 'Sprint Review',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 11), 0),
    color: CALENDAR_COLORS.blueberry,
    location: 'Demo Room',
    description: 'Demo completed features',
  },
  {
    id: 'dev-14',
    title: 'Hackathon Planning',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 13), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 14), 0),
    color: CALENDAR_COLORS.grape,
    location: 'Innovation Lab',
    description: 'Brainstorm project ideas',
  },
  {
    id: 'dev-15',
    title: 'Code Cleanup Time',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 14), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 16), 30),
    color: CALENDAR_COLORS.sage,
    location: 'IDE',
    description: 'Refactor and document code',
  },
];

// Product Manager events
export const PM_EVENTS: CalendarEvent[] = [
  // Monday
  {
    id: 'pm-1',
    title: 'Product Strategy Meeting',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 10), 30),
    color: CALENDAR_COLORS.grape,
    location: 'Executive Conference Room',
    description: 'Q1 2025 product roadmap',
  },
  {
    id: 'pm-2',
    title: 'User Research Review',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 12), 0),
    color: CALENDAR_COLORS.peacock,
    location: 'UX Lab',
    description: 'Review latest user interviews',
  },
  {
    id: 'pm-3',
    title: 'Stakeholder Sync',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 15), 0),
    color: CALENDAR_COLORS.tangerine,
    location: 'Zoom',
    description: 'Weekly alignment with C-suite',
  },
  {
    id: 'pm-4',
    title: 'Sprint Planning',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 17), 0),
    color: CALENDAR_COLORS.banana,
    location: 'Agile Room',
    description: 'Prioritize next sprint backlog',
  },
  
  // Tuesday
  {
    id: 'pm-5',
    title: 'Competitive Analysis',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 10), 30),
    color: CALENDAR_COLORS.lavender,
    location: 'Research Room',
    description: 'Review competitor features',
  },
  {
    id: 'pm-6',
    title: 'Feature Spec Review',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 12), 30),
    color: CALENDAR_COLORS.blueberry,
    location: 'Design Studio',
    description: 'Review checkout flow redesign',
  },
  {
    id: 'pm-7',
    title: 'Customer Success Meeting',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 15), 0),
    color: CALENDAR_COLORS.tomato,
    location: 'Customer Success Hub',
    description: 'Review customer feedback',
  },
  {
    id: 'pm-8',
    title: 'Product Marketing Sync',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 16), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 17), 0),
    color: CALENDAR_COLORS.sage,
    location: 'Marketing Floor',
    description: 'Launch campaign planning',
  },
  
  // Wednesday
  {
    id: 'pm-9',
    title: 'Executive Presentation',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 11), 30),
    color: CALENDAR_COLORS.tomato,
    location: 'Board Room',
    description: 'Monthly product update',
  },
  {
    id: 'pm-10',
    title: 'Design Sprint',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 13), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 15), 0),
    color: CALENDAR_COLORS.flamingo,
    location: 'Design Lab',
    description: 'Mobile app redesign workshop',
  },
  {
    id: 'pm-11',
    title: 'Analytics Review',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 16), 30),
    color: CALENDAR_COLORS.basil,
    location: 'Data Room',
    description: 'Review product metrics',
  },
  
  // Thursday
  {
    id: 'pm-12',
    title: 'Partner Meeting',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 10), 30),
    color: CALENDAR_COLORS.peacock,
    location: 'External - Downtown',
    description: 'Integration partnership discussion',
  },
  {
    id: 'pm-13',
    title: 'User Testing Session',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 12), 30),
    color: CALENDAR_COLORS.grape,
    location: 'UX Lab',
    description: 'Observe prototype testing',
  },
  {
    id: 'pm-14',
    title: 'Roadmap Planning',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 16), 0),
    color: CALENDAR_COLORS.banana,
    location: 'Strategy Room',
    description: 'Q2 2025 feature planning',
  },
  
  // Friday
  {
    id: 'pm-15',
    title: 'All Hands Prep',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 10), 0),
    color: CALENDAR_COLORS.graphite,
    location: 'Office',
    description: 'Prepare product update slides',
  },
  {
    id: 'pm-16',
    title: 'Engineering Sync',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 10), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 11), 30),
    color: CALENDAR_COLORS.blueberry,
    location: 'Tech Room',
    description: 'Technical feasibility discussion',
  },
  {
    id: 'pm-17',
    title: 'Customer Call',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 15), 0),
    color: CALENDAR_COLORS.tangerine,
    location: 'Video Call',
    description: 'Enterprise customer feedback',
  },
  {
    id: 'pm-18',
    title: '1:1 with CEO',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 16), 30),
    color: CALENDAR_COLORS.flamingo,
    location: "CEO's Office",
    description: 'Strategic alignment',
  },
];

// Sales events
export const SALES_EVENTS: CalendarEvent[] = [
  // Monday
  {
    id: 'sales-1',
    title: 'Sales Team Huddle',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 8), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 9), 0),
    color: CALENDAR_COLORS.tomato,
    location: 'Sales Floor',
    description: 'Daily pipeline review',
  },
  {
    id: 'sales-2',
    title: 'Client Demo - Acme Corp',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 11), 30),
    color: CALENDAR_COLORS.peacock,
    location: 'Demo Room A',
    description: 'Product demo for enterprise client',
  },
  {
    id: 'sales-3',
    title: 'Cold Calling Block',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 13), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 15), 0),
    color: CALENDAR_COLORS.banana,
    location: 'Phone Booth',
    description: 'Prospecting new leads',
  },
  {
    id: 'sales-4',
    title: 'Follow-up Emails',
    startTime: setMinutes(setHours(addDays(weekStart, 1), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 1), 16), 30),
    color: CALENDAR_COLORS.sage,
    location: 'Desk',
    description: 'Send proposal follow-ups',
  },
  
  // Tuesday
  {
    id: 'sales-5',
    title: 'Contract Negotiation',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 10), 30),
    color: CALENDAR_COLORS.grape,
    location: 'Conference Call',
    description: 'Finalize terms with TechCo',
  },
  {
    id: 'sales-6',
    title: 'Lunch with Prospect',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 12), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 13), 30),
    color: CALENDAR_COLORS.tangerine,
    location: 'The Capital Grille',
    description: 'Relationship building',
  },
  {
    id: 'sales-7',
    title: 'Sales Training',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 15), 30),
    color: CALENDAR_COLORS.lavender,
    location: 'Training Room',
    description: 'Advanced closing techniques',
  },
  {
    id: 'sales-8',
    title: 'CRM Updates',
    startTime: setMinutes(setHours(addDays(weekStart, 2), 16), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 2), 17), 0),
    color: CALENDAR_COLORS.basil,
    location: 'Salesforce',
    description: 'Update opportunity stages',
  },
  
  // Wednesday
  {
    id: 'sales-9',
    title: 'Territory Planning',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 10), 0),
    color: CALENDAR_COLORS.flamingo,
    location: 'Strategy Room',
    description: 'Q2 territory mapping',
  },
  {
    id: 'sales-10',
    title: 'Client Presentation',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 12), 30),
    color: CALENDAR_COLORS.tomato,
    location: 'Client Office - Downtown',
    description: 'Final proposal presentation',
  },
  {
    id: 'sales-11',
    title: 'Sales & Marketing Sync',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 15), 0),
    color: CALENDAR_COLORS.peacock,
    location: 'Marketing Floor',
    description: 'Lead generation strategies',
  },
  {
    id: 'sales-12',
    title: 'Deal Review',
    startTime: setMinutes(setHours(addDays(weekStart, 3), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 3), 16), 30),
    color: CALENDAR_COLORS.blueberry,
    location: 'VP Sales Office',
    description: 'Review large opportunities',
  },
  
  // Thursday
  {
    id: 'sales-13',
    title: 'Industry Conference Call',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 8), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 9), 0),
    color: CALENDAR_COLORS.graphite,
    location: 'Virtual',
    description: 'Healthcare industry trends',
  },
  {
    id: 'sales-14',
    title: 'Proposal Writing',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 10), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 12), 0),
    color: CALENDAR_COLORS.banana,
    location: 'Quiet Room',
    description: 'RFP response for BigCo',
  },
  {
    id: 'sales-15',
    title: 'Client Check-in Call',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 14), 30),
    color: CALENDAR_COLORS.sage,
    location: 'Phone',
    description: 'Quarterly business review prep',
  },
  {
    id: 'sales-16',
    title: 'Happy Hour with Team',
    startTime: setMinutes(setHours(addDays(weekStart, 4), 17), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 4), 19), 0),
    color: CALENDAR_COLORS.tangerine,
    location: "O'Malley's Pub",
    description: 'Team celebration - hit quota!',
  },
  
  // Friday
  {
    id: 'sales-17',
    title: 'Pipeline Review',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 9), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 10), 30),
    color: CALENDAR_COLORS.grape,
    location: 'Sales War Room',
    description: 'End of week forecast',
  },
  {
    id: 'sales-18',
    title: 'Reference Call',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 11), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 11), 30),
    color: CALENDAR_COLORS.peacock,
    location: 'Conference Call',
    description: 'Customer reference for prospect',
  },
  {
    id: 'sales-19',
    title: '1:1 with Manager',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 14), 0),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 15), 0),
    color: CALENDAR_COLORS.flamingo,
    location: "Manager's Office",
    description: 'Performance review',
  },
  {
    id: 'sales-20',
    title: 'Competitive Intel Review',
    startTime: setMinutes(setHours(addDays(weekStart, 5), 15), 30),
    endTime: setMinutes(setHours(addDays(weekStart, 5), 16), 30),
    color: CALENDAR_COLORS.lavender,
    location: 'Strategy Room',
    description: 'Review competitor pricing',
  },
];

// Function to get events based on persona
export const getEventsByPersona = (persona: string | null): CalendarEvent[] => {
  switch (persona) {
    case 'developer':
      return DEVELOPER_EVENTS;
    case 'pm':
      return PM_EVENTS;
    case 'sales':
      return SALES_EVENTS;
    default:
      // Return default events from calendar.ts if no persona selected
      return [];
  }
};