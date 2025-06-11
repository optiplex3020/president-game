import { create } from 'zustand';
import eventsData from '../../data/events.json';

export type EventType = 'international' | 'parlement' | 'social' | 'media' | 'event';

export type CalendarEvent = {
  title: string;
  type: EventType;
  description?: string;
  gameEvent?: GameEventData;
};

export type CalendarEventData = {
  description: string;
  type?: EventType;
  date?: string;
};

interface GameEventData {
  id: number;
  description: string;
  image: string;
  options: Array<{
    text: string;
    effects: {
      syndicats?: number;
      popularity?: number;
      budget?: number;
      cgt?: number;
      stability?: number;
      medias?: number;
      relations?: number;
      entreprises?: number;
      ecologistes?: number;
      ue?: number;
    };
  }>;
  conditions?: Record<string, { min?: number; max?: number }>;
}

type CalendarStore = {
  currentDate: string;
  calendar: Record<string, CalendarEvent[]>;
  selectedDay: string | null;
  selectDay: (date: string) => void;
  goToNextEvent: () => void;
  advanceOneDay: () => void;
  addEvent: (date: string, event: CalendarEvent) => void;
  generateEvents: () => void;
};

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  currentDate: '2027-09-01',
  calendar: {
    '2027-09-05': [{ 
      title: "Sommet de l'ONU",
      type: 'international' 
    }],
    '2027-09-07': [{ 
      title: "Vote sur la réforme du RSA",
      type: 'parlement'
    }],
  },
  selectedDay: null,

  selectDay: (date) => set({ selectedDay: date }),

  advanceOneDay: () => {
    const curr = new Date(get().currentDate);
    curr.setDate(curr.getDate() + 1);
    const next = curr.toISOString().split('T')[0];
    set({ currentDate: next, selectedDay: next });
  },

  goToNextEvent: () => {
    const allDates = Object.keys(get().calendar).sort();
    const now = get().currentDate;
    const next = allDates.find(d => d > now);
    if (next) set({ currentDate: next, selectedDay: next });
  },

  addEvent: (date, event) => {
    const existing = get().calendar[date] || [];
    set(state => ({
      calendar: {
        ...state.calendar,
        [date]: [...existing, event]
      }
    }));
  },

  generateEvents: () => {
    const currentDate = get().currentDate;
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    (eventsData as GameEventData[]).forEach((gameEvent) => {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const eventDate = new Date(currentDate);
      eventDate.setDate(randomDay);
      
      if (Math.random() > 0.7) {
        const newEvent: CalendarEvent = {
          title: gameEvent.description,
          type: 'event',
          description: gameEvent.description,
          gameEvent
        };
        
        set(state => ({
          calendar: {
            ...state.calendar,
            [eventDate.toISOString().split('T')[0]]: [newEvent]
          }
        }));
      }
    });
  },
}));