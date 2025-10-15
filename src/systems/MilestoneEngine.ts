import { create } from 'zustand';
import { DEFAULT_START_DATE, DAYS_PER_MANDATE } from '../config/time';
import { useCalendarEngine } from './CalendarEngine';

export type MilestoneCategory =
  | 'election'
  | 'legislative'
  | 'budget'
  | 'diplomacy'
  | 'campaign'
  | 'crisis'
  | 'social'
  | 'economy';

export interface Milestone {
  id: string;
  title: string;
  date: Date;
  category: MilestoneCategory;
  description?: string;
  isMajor?: boolean;
  autoPause?: boolean;
  metadata?: Record<string, unknown>;
}

interface MilestoneState {
  startDate: Date;
  milestones: Milestone[];
  initializeMilestones: (startDate: Date) => void;
  addMilestone: (payload: Omit<Milestone, 'id'> & { id?: string }) => Milestone;
  getUpcomingMilestones: (after: Date, limit?: number) => Milestone[];
  getNextMilestoneByCategory: (category: MilestoneCategory, after?: Date) => Milestone | undefined;
}

const makeMilestoneId = (prefix: string) => {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const generateCoreMilestones = (startDate: Date): Milestone[] => {
  const milestones: Milestone[] = [];

  // Première échéance : discours de politique générale (jour 15)
  milestones.push({
    id: makeMilestoneId('milestone'),
    title: 'Discours de politique générale',
    date: addDays(startDate, 14),
    category: 'legislative',
    description: 'Définir les priorités du quinquennat devant l’Assemblée nationale.',
    isMajor: true,
    autoPause: true,
    metadata: { chamber: 'Assemblée nationale' }
  });

  // Budget - rentrée (début octobre)
  const budgetDate = new Date(startDate);
  budgetDate.setMonth(9, 1); // 1er octobre
  milestones.push({
    id: makeMilestoneId('milestone'),
    title: 'Présentation du Projet de loi de finances',
    date: budgetDate,
    category: 'budget',
    description: 'Début du marathon budgétaire devant le Parlement.',
    isMajor: true,
    autoPause: true
  });

  // Élection mi-mandat (municipales / européennes placeholder)
  const midTerm = addDays(startDate, Math.floor(DAYS_PER_MANDATE / 2));
  milestones.push({
    id: makeMilestoneId('milestone'),
    title: 'Élections intermédiaires',
    date: midTerm,
    category: 'election',
    description: 'Scrutin intermédiaire clé pour la légitimité du président.',
    isMajor: true,
    autoPause: true
  });

  // Fin de mandat
  const endOfMandate = addDays(startDate, DAYS_PER_MANDATE);
  milestones.push({
    id: makeMilestoneId('milestone'),
    title: 'Élection présidentielle',
    date: endOfMandate,
    category: 'election',
    description: 'Fin de premier mandat – lancement de la campagne présidentielle.',
    isMajor: true,
    autoPause: true
  });

  return milestones;
};

export const useMilestoneEngine = create<MilestoneState>((set, get) => ({
  startDate: DEFAULT_START_DATE,
  milestones: [],

  initializeMilestones: (startDate: Date) => {
    const coreMilestones = generateCoreMilestones(startDate);
    const calendar = useCalendarEngine.getState();

    coreMilestones.forEach(milestone => {
      calendar.scheduleEvent({
        id: `milestone_evt_${milestone.id}`,
        title: milestone.title,
        date: milestone.date,
        category: milestone.category === 'election' ? 'campaign' : 'legislative',
        description: milestone.description,
        importance: milestone.isMajor ? 'critical' : 'high',
        isBlocking: milestone.autoPause,
        tags: ['milestone']
      });
    });

    set({
      startDate,
      milestones: coreMilestones
    });
  },

  addMilestone: (payload) => {
    const milestone: Milestone = {
      ...payload,
      id: payload.id ?? makeMilestoneId('milestone'),
      date: payload.date instanceof Date ? payload.date : new Date(payload.date)
    };

    set(state => ({
      milestones: [...state.milestones, milestone]
    }));

    // Synchroniser avec le calendrier
    const calendar = useCalendarEngine.getState();
    calendar.scheduleEvent({
      id: `milestone_evt_${milestone.id}`,
      title: milestone.title,
      date: milestone.date,
      category: milestone.category === 'election' ? 'campaign' : 'legislative',
      description: milestone.description,
      importance: milestone.isMajor ? 'critical' : 'high',
      isBlocking: milestone.autoPause,
      tags: ['milestone'],
      metadata: milestone.metadata
    });

    return milestone;
  },

  getUpcomingMilestones: (after, limit = 5) => {
    const afterTime = after.getTime();
    return get()
      .milestones
      .filter(m => m.date.getTime() > afterTime)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
  },

  getNextMilestoneByCategory: (category, after = new Date()) => {
    const afterTime = after.getTime();
    return get()
      .milestones
      .filter(m => m.category === category && m.date.getTime() > afterTime)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  }
}));
