import { CalendarEvent } from '@/types';

// Map of event titles to translation keys
const EVENT_TRANSLATION_MAP: Record<string, string> = {
  // Developer events
  'Daily Standup': 'events.dev.standup',
  'Code Review Session': 'events.dev.codeReview',
  'Deep Work Block': 'events.dev.deepWork',
  'Architecture Meeting': 'events.dev.architecture',
  'Pair Programming': 'events.dev.pairProgramming',
  'Tech Talk: Rust': 'events.dev.techTalk',
  'Sprint Planning': 'events.dev.sprintPlanning',
  'Debug Production Issue': 'events.dev.debugProd',
  'Security Training': 'events.dev.security',
  'API Design Review': 'events.dev.apiDesign',
  'CI/CD Pipeline Work': 'events.dev.cicd',
  '1:1 with Tech Lead': 'events.dev.oneOnOne',
  'Sprint Review': 'events.dev.sprintReview',
  'Hackathon Planning': 'events.dev.hackathon',
  'Code Cleanup Time': 'events.dev.codeCleanup',
  
  // PM events
  'Product Strategy Meeting': 'events.pm.strategy',
  'User Research Review': 'events.pm.userResearch',
  'Stakeholder Sync': 'events.pm.stakeholder',
  'Competitive Analysis': 'events.pm.competitive',
  'Feature Spec Review': 'events.pm.featureSpec',
  'Customer Success Meeting': 'events.pm.customerSuccess',
  'Product Marketing Sync': 'events.pm.marketing',
  'Executive Presentation': 'events.pm.executive',
  'Design Sprint': 'events.pm.design',
  'Analytics Review': 'events.pm.analytics',
  'Partner Meeting': 'events.pm.partner',
  'User Testing Session': 'events.pm.userTesting',
  'Roadmap Planning': 'events.pm.roadmap',
  'All Hands Prep': 'events.pm.allHands',
  'Engineering Sync': 'events.pm.engineering',
  'Customer Call': 'events.pm.customerCall',
  '1:1 with CEO': 'events.pm.ceo',
  
  // Sales events
  'Sales Team Huddle': 'events.sales.huddle',
  'Client Demo - Acme Corp': 'events.sales.demo',
  'Cold Calling Block': 'events.sales.coldCalling',
  'Follow-up Emails': 'events.sales.followUp',
  'Contract Negotiation': 'events.sales.negotiation',
  'Lunch with Prospect': 'events.sales.lunch',
  'Sales Training': 'events.sales.training',
  'CRM Updates': 'events.sales.crmUpdate',
  'Territory Planning': 'events.sales.territory',
  'Client Presentation': 'events.sales.presentation',
  'Sales & Marketing Sync': 'events.sales.marketingSync',
  'Deal Review': 'events.sales.dealReview',
  'Industry Conference Call': 'events.sales.conference',
  'Proposal Writing': 'events.sales.proposal',
  'Client Check-in Call': 'events.sales.checkIn',
  'Happy Hour with Team': 'events.sales.happyHour',
  'Pipeline Review': 'events.sales.pipeline',
  'Reference Call': 'events.sales.reference',
  '1:1 with Manager': 'events.sales.oneOnOne',
  'Competitive Intel Review': 'events.sales.competitive',
};

// Function to get translation key for an event title
export const getEventTranslationKey = (title: string): string => {
  return EVENT_TRANSLATION_MAP[title] || title;
};

// Function to translate calendar events
export const translateCalendarEvents = (
  events: CalendarEvent[], 
  intl: { t: (key: string) => string }
): CalendarEvent[] => {
  return events.map(event => ({
    ...event,
    title: intl.t(getEventTranslationKey(event.title)),
  }));
};