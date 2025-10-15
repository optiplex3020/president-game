import { create } from 'zustand';
import { DEFAULT_START_DATE } from '../config/time';

export type CalendarEventCategory =
  | 'legislative'
  | 'parliament'
  | 'media'
  | 'diplomatic'
  | 'domestic'
  | 'crisis'
  | 'campaign'
  | 'economy'
  | 'internal';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  category: CalendarEventCategory;
  description?: string;
  importance?: 'low' | 'medium' | 'high' | 'critical';
  isBlocking?: boolean;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

export interface RecurringRule {
  id: string;
  label: string;
  category: CalendarEventCategory;
  cadence: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number; // 0 (dimanche) -> 6 (samedi)
  dayOfMonth?: number; // 1 -> 31
  month?: number; // 0 -> 11
  isBlocking?: boolean;
  metadata?: Record<string, unknown>;
}

interface CalendarState {
  startDate: Date;
  events: CalendarEvent[];
  recurringRules: RecurringRule[];
  initializeCalendar: (startDate: Date) => void;
  reset: (startDate: Date) => void;
  scheduleEvent: (payload: Omit<CalendarEvent, 'id'> & { id?: string }) => CalendarEvent;
  addRecurringRule: (rule: RecurringRule) => void;
  getEventsBetween: (start: Date, end: Date) => CalendarEvent[];
  getNextBlockingEvent: (after: Date) => CalendarEvent | undefined;
}

const makeEventId = (prefix: string) => {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
};

const generateBaselineEvents = (startDate: Date): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // Jour 1 : Conseil des ministres
  const firstCouncil = new Date(startDate);
  events.push({
    id: makeEventId('cal_evt'),
    title: 'Conseil des ministres inaugural',
    date: firstCouncil,
    category: 'legislative',
    importance: 'high',
    isBlocking: true,
    tags: ['government', 'cabinet']
  });

  // Jour 3 : Première séance de questions au gouvernement
  const qag = new Date(startDate);
  qag.setDate(qag.getDate() + 2);
  events.push({
    id: makeEventId('cal_evt'),
    title: 'Questions au gouvernement',
    date: qag,
    category: 'parliament',
    importance: 'medium',
    tags: ['assembly']
  });

  return events;
};

export const useCalendarEngine = create<CalendarState>((set, get) => ({
  startDate: DEFAULT_START_DATE,
  events: [],
  recurringRules: [],

  initializeCalendar: (startDate: Date) => {
    const seeds = generateBaselineEvents(startDate);
    set({
      startDate,
      events: seeds,
      recurringRules: [
        {
          id: 'recurring_council',
          label: 'Conseil des ministres (hebdomadaire)',
          category: 'legislative',
          cadence: 'weekly',
          dayOfWeek: 2,
          isBlocking: true,
          metadata: { begins: startDate }
        },
        {
          id: 'recurring_qag',
          label: 'Questions au gouvernement',
          category: 'parliament' as CalendarEventCategory,
          cadence: 'weekly',
          dayOfWeek: 2,
          metadata: { chamber: 'Assemblée nationale' }
        }
      ]
    });
  },

  reset: (startDate: Date) => {
    const seeds = generateBaselineEvents(startDate);
    set({
      startDate,
      events: seeds
    });
  },

  scheduleEvent: (payload) => {
    const id = payload.id ?? makeEventId('cal_evt');
    const event: CalendarEvent = {
      ...payload,
      id,
      date: payload.date instanceof Date ? payload.date : new Date(payload.date)
    };

    set(state => ({
      events: [...state.events, event]
    }));

    return event;
  },

  addRecurringRule: (rule) => {
    set(state => ({
      recurringRules: [...state.recurringRules, rule]
    }));
  },

  getEventsBetween: (start, end) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    return get()
      .events.filter(event => {
        const time = event.date.getTime();
        return time >= startTime && time <= endTime;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  getNextBlockingEvent: (after) => {
    const afterTime = after.getTime();
    return get()
      .events
      .filter(evt => evt.isBlocking)
      .filter(evt => evt.date.getTime() > afterTime)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }
}));
