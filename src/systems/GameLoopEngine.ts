/**
 * GAME LOOP ENGINE
 * Gère la boucle de gameplay active avec temps réel, événements et conséquences
 */

import { create } from 'zustand';
import { useParliamentEngine } from './ParliamentEngine';
import { useOpinionEngine } from './OpinionEngine';
import { useMediaEngine } from './MediaEngine';
import { useMasterGameEngine } from './MasterGameEngine';
import { useCalendarEngine } from './CalendarEngine';
import { useNotificationEngine } from './NotificationEngine';
import type { CalendarEventCategory } from './CalendarEngine';
import type { GameEvent } from '../types/events';
import { getRandomEvent } from '../data/eventBank';
import { allExtendedEvents } from '../data/eventBankExtended';

export type TimeScale = 'paused' | 'slow' | 'normal' | 'fast' | 'ultra';

interface ScheduledEvent {
  id: string;
  triggerDate: Date;
  event: GameEvent;
  executed: boolean;
}

interface ConsequenceChain {
  id: string;
  originEventId: string;
  consequences: {
    type: 'opinion' | 'parliament' | 'media' | 'economy' | 'international';
    description: string;
    severity: number; // 0-100
    delay: number; // heures avant déclenchement
    triggered: boolean;
  }[];
}

interface GameLoopState {
  // Système de temps
  isRunning: boolean;
  timeScale: TimeScale;
  lastTickTime: number;
  accumulatedTime: number;

  // Événements
  scheduledEvents: ScheduledEvent[];
  eventHistory: GameEvent[];
  consequenceChains: ConsequenceChain[];

  // Statistiques
  totalEventsTriggered: number;
  totalConsequencesExecuted: number;

  // Actions
  startGameLoop: () => void;
  stopGameLoop: () => void;
  setTimeScale: (scale: TimeScale) => void;
  scheduleEvent: (event: GameEvent, delayHours: number) => void;
  triggerRandomEvent: () => void;
  processConsequences: () => void;
  tick: (deltaTime: number) => void;
}

const TIME_SCALE_MULTIPLIERS: Record<TimeScale, number> = {
  'paused': 0,
  'slow': 0.5,
  'normal': 1,
  'fast': 3,
  'ultra': 10
};

// Banque d'événements aléatoires
const RANDOM_EVENTS: Omit<GameEvent, 'id' | 'date'>[] = [
  // Économie
  {
    type: 'economic_crisis',
    title: 'Crise économique mondiale',
    description: 'Une récession mondiale frappe la France. Le chômage augmente.',
    severity: 80,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15, segments: { 'ouvriers': -25, 'chomeurs': -30 } },
      economy: { gdpGrowth: -2, unemployment: 1.5 }
    },
    choices: [
      {
        id: 'choice_1',
        label: 'Plan de relance massif (50 Mds €)',
        description: 'Investir massivement pour soutenir l\'économie',
        consequences: {
          opinion: { overall: 10, segments: { 'ouvriers': 20 } },
          economy: { publicDebt: 3, gdpGrowth: 0.5 },
          politicalCapital: -20
        }
      },
      {
        id: 'choice_2',
        label: 'Austérité budgétaire',
        description: 'Réduire les dépenses publiques',
        consequences: {
          opinion: { overall: -20, segments: { 'fonctionnaires': -35 } },
          economy: { publicDebt: -1 },
          politicalCapital: -15
        }
      }
    ]
  },
  {
    type: 'social_movement',
    title: 'Mouvement social d\'ampleur',
    description: 'Des manifestations massives éclatent contre la réforme des retraites.',
    severity: 70,
    category: 'crisis',
    impacts: {
      opinion: { overall: -10, segments: { 'ouvriers': -20, 'fonctionnaires': -25 } },
      social: { unrest: 30 }
    },
    choices: [
      {
        id: 'choice_1',
        label: 'Retirer la réforme',
        description: 'Abandonner le projet face à la pression',
        consequences: {
          opinion: { overall: 15, segments: { 'ouvriers': 25 } },
          politicalCapital: -30
        }
      },
      {
        id: 'choice_2',
        label: 'Maintenir fermement',
        description: 'Tenir bon malgré l\'opposition',
        consequences: {
          opinion: { overall: -15, segments: { 'ouvriers': -30 } },
          social: { unrest: 20 },
          politicalCapital: 10
        }
      },
      {
        id: 'choice_3',
        label: 'Négocier des compromis',
        description: 'Dialoguer et adapter la réforme',
        consequences: {
          opinion: { overall: 5, segments: { 'ouvriers': 10 } },
          politicalCapital: -10
        }
      }
    ]
  },
  {
    type: 'international_crisis',
    title: 'Crise diplomatique',
    description: 'Tensions avec un pays voisin suite à des déclarations présidentielles.',
    severity: 60,
    category: 'crisis',
    impacts: {
      international: { europeanInfluence: -10 },
      opinion: { overall: -5 }
    },
    choices: [
      {
        id: 'choice_1',
        label: 'S\'excuser publiquement',
        description: 'Présenter des excuses pour apaiser',
        consequences: {
          international: { europeanInfluence: 5 },
          opinion: { overall: -10, segments: { 'ouvriers': -15 } }
        }
      },
      {
        id: 'choice_2',
        label: 'Maintenir sa position',
        description: 'Défendre les propos tenus',
        consequences: {
          international: { europeanInfluence: -15 },
          opinion: { overall: 5, segments: { 'ouvriers': 10 } }
        }
      }
    ]
  },
  {
    type: 'success',
    title: 'Victoire diplomatique européenne',
    description: 'La France obtient un succès majeur lors du sommet européen.',
    severity: 40,
    category: 'opportunity',
    impacts: {
      opinion: { overall: 10 },
      international: { europeanInfluence: 15 }
    },
    choices: []
  },
  {
    type: 'scandal',
    title: 'Scandale ministériel',
    description: 'Un ministre est soupçonné de conflits d\'intérêts.',
    severity: 75,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15 },
      politicalCapital: -25
    },
    choices: [
      {
        id: 'choice_1',
        label: 'Limoger le ministre immédiatement',
        description: 'Montrer une réaction ferme',
        consequences: {
          opinion: { overall: 5 },
          politicalCapital: -10
        }
      },
      {
        id: 'choice_2',
        label: 'Attendre l\'enquête',
        description: 'Ne pas préjuger de la culpabilité',
        consequences: {
          opinion: { overall: -10 },
          politicalCapital: 5
        }
      }
    ]
  },
  {
    type: 'natural_disaster',
    title: 'Catastrophe naturelle',
    description: 'De graves inondations frappent plusieurs régions.',
    severity: 85,
    category: 'crisis',
    impacts: {
      opinion: { overall: 0 },
      economy: { gdpGrowth: -0.5 }
    },
    choices: [
      {
        id: 'choice_1',
        label: 'Plan d\'urgence exceptionnel',
        description: 'Mobiliser tous les moyens de l\'État',
        consequences: {
          opinion: { overall: 15 },
          economy: { publicDebt: 1 },
          politicalCapital: 10
        }
      },
      {
        id: 'choice_2',
        label: 'Aide standard',
        description: 'Activer les dispositifs existants',
        consequences: {
          opinion: { overall: -5 }
        }
      }
    ]
  },
  {
    type: 'terrorist_attack',
    title: 'Attentat terroriste',
    description: 'Un attentat frappe Paris, faisant plusieurs victimes.',
    severity: 95,
    category: 'crisis',
    impacts: {
      opinion: { overall: 0 },
      social: { unrest: 40 }
    },
    choices: [
      {
        id: 'choice_1',
        label: 'État d\'urgence',
        description: 'Proclamer l\'état d\'urgence national',
        consequences: {
          opinion: { overall: 10, segments: { 'ouvriers': 15 } },
          social: { unrest: -20 },
          politicalCapital: 20
        }
      },
      {
        id: 'choice_2',
        label: 'Renforcement sécuritaire ciblé',
        description: 'Augmenter la sécurité sans état d\'urgence',
        consequences: {
          opinion: { overall: 5 },
          social: { unrest: -10 }
        }
      }
    ]
  }
];

const mapSeverityToImportance = (severity?: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (typeof severity !== 'number') return 'medium';
  if (severity >= 80) return 'critical';
  if (severity >= 60) return 'high';
  if (severity >= 30) return 'medium';
  return 'low';
};

const mapCategoryToCalendar = (category?: string): CalendarEventCategory => {
  switch (category) {
    case 'crisis':
    case 'international_crisis':
      return 'crisis';
    case 'international':
    case 'diplomacy':
      return 'diplomatic';
    case 'economy':
    case 'economic':
      return 'economy';
    case 'media':
      return 'media';
    case 'campaign':
      return 'campaign';
    case 'legislative':
      return 'legislative';
    case 'parliament':
      return 'parliament';
    default:
      return 'domestic';
  }
};

export const useGameLoopEngine = create<GameLoopState>((set, get) => ({
  isRunning: false,
  timeScale: 'paused',
  lastTickTime: Date.now(),
  accumulatedTime: 0,
  scheduledEvents: [],
  eventHistory: [],
  consequenceChains: [],
  totalEventsTriggered: 0,
  totalConsequencesExecuted: 0,

  startGameLoop: () => {
    set({ isRunning: true, lastTickTime: Date.now() });
    console.log('🎮 Boucle de gameplay démarrée');
  },

  stopGameLoop: () => {
    set({ isRunning: false, timeScale: 'paused' });
    console.log('⏸️ Boucle de gameplay mise en pause');
  },

  setTimeScale: (scale: TimeScale) => {
    set({ timeScale: scale });
    console.log(`⏱️ Vitesse du temps: ${scale}`);
  },

  scheduleEvent: (event: GameEvent, delayHours: number) => {
    const master = useMasterGameEngine.getState();
    const triggerDate = new Date(master.currentDate);
    triggerDate.setHours(triggerDate.getHours() + delayHours);

    const scheduledEvent: ScheduledEvent = {
      id: `scheduled_${Date.now()}_${Math.random()}`,
      triggerDate,
      event: {
        ...event,
        id: event.id || `event_${Date.now()}`,
        date: triggerDate
      },
      executed: false
    };

    set(state => ({
      scheduledEvents: [...state.scheduledEvents, scheduledEvent]
    }));

    const calendar = useCalendarEngine.getState();
    calendar.scheduleEvent({
      id: `scheduled_evt_${scheduledEvent.id}`,
      title: event.title,
      date: triggerDate,
      category: mapCategoryToCalendar(event.category),
      description: event.description,
      importance: mapSeverityToImportance(event.severity),
      isBlocking: Boolean(event.type?.includes('crisis')),
      metadata: {
        source: 'game_loop',
        delayHours
      },
      tags: ['scheduled', 'game_loop']
    });
  },

  triggerRandomEvent: () => {
    // Utiliser la banque massive d'événements
    const allEvents = [...getRandomEvent ? [getRandomEvent()] : [], ...allExtendedEvents];
    const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
    const master = useMasterGameEngine.getState();

    const event: GameEvent = {
      ...randomEvent,
      id: `event_${Date.now()}`,
      date: master.currentDate
    };

    // Créer une chaîne de conséquences
    const chain: ConsequenceChain = {
      id: `chain_${event.id}`,
      originEventId: event.id,
      consequences: []
    };

    // Générer des conséquences en cascade selon le type d'événement
    if (event.type === 'economic_crisis') {
      chain.consequences.push(
        {
          type: 'opinion',
          description: 'Baisse de confiance dans la capacité du gouvernement',
          severity: 50,
          delay: 24,
          triggered: false
        },
        {
          type: 'media',
          description: 'Les médias critiquent la gestion de la crise',
          severity: 60,
          delay: 12,
          triggered: false
        }
      );
    }

    if (event.type === 'social_movement') {
      chain.consequences.push(
        {
          type: 'parliament',
          description: 'Des députés remettent en question le gouvernement',
          severity: 40,
          delay: 48,
          triggered: false
        },
        {
          type: 'economy',
          description: 'Impact économique des grèves',
          severity: 30,
          delay: 72,
          triggered: false
        }
      );
    }

    if (event.type === 'scandal') {
      chain.consequences.push(
        {
          type: 'media',
          description: 'Les médias d\'opposition amplifient le scandale',
          severity: 70,
          delay: 6,
          triggered: false
        },
        {
          type: 'parliament',
          description: 'L\'opposition demande une commission d\'enquête',
          severity: 60,
          delay: 24,
          triggered: false
        }
      );
    }

    set(state => ({
      eventHistory: [...state.eventHistory, event],
      consequenceChains: [...state.consequenceChains, chain],
      totalEventsTriggered: state.totalEventsTriggered + 1
    }));

    console.log(`📢 Événement déclenché: ${event.title}`);

    // Notification de l'événement
    const notifications = useNotificationEngine.getState();
    const severityType = event.severity >= 80 ? 'danger' : event.severity >= 60 ? 'warning' : 'info';

    notifications.notify({
      type: severityType,
      title: `📢 ${event.title}`,
      message: event.description,
      icon: event.severity >= 80 ? '🚨' : event.severity >= 60 ? '⚠️' : '📰',
      duration: 8000,
      metadata: {
        category: event.category,
        relatedEventId: event.id
      }
    });

    return event;
  },

  processConsequences: () => {
    const state = get();
    const master = useMasterGameEngine.getState();
    const currentTime = master.currentDate.getTime();

    state.consequenceChains.forEach(chain => {
      const originEvent = state.eventHistory.find(e => e.id === chain.originEventId);
      if (!originEvent) return;

      const eventTime = originEvent.date.getTime();

      chain.consequences.forEach(consequence => {
        if (consequence.triggered) return;

        const triggerTime = eventTime + (consequence.delay * 60 * 60 * 1000);

        if (currentTime >= triggerTime) {
          // Déclencher la conséquence
          console.log(`⚡ Conséquence déclenchée: ${consequence.description}`);

          const opinion = useOpinionEngine.getState();
          const media = useMediaEngine.getState();
          const parliament = useParliamentEngine.getState();
          const notifications = useNotificationEngine.getState();

          switch (consequence.type) {
            case 'opinion':
              // Simuler une baisse d'opinion
              console.log(`⚡ Conséquence opinion: ${consequence.description} (severity: ${consequence.severity})`);

              notifications.notifyOpinionChange(
                'Opinion générale',
                -Math.round(consequence.severity / 5),
                consequence.description
              );
              break;

            case 'media':
              // Générer des articles négatifs
              for (let i = 0; i < Math.ceil(consequence.severity / 30); i++) {
                media.generateArticle({
                  topic: consequence.description,
                  sentiment: -consequence.severity
                });
              }

              notifications.notifyMediaArticle(
                'Presse',
                consequence.description,
                -consequence.severity
              );
              break;

            case 'parliament':
              // Impact sur les relations avec les députés
              const deputies = parliament.deputies;
              deputies.slice(0, Math.ceil(consequence.severity / 10)).forEach(deputy => {
                parliament.influenceDeputy(deputy.id, {
                  relationshipChange: -consequence.severity / 5,
                  message: consequence.description
                });
              });

              notifications.notify({
                type: 'parliament',
                title: 'Impact parlementaire',
                message: consequence.description,
                icon: '⚖️',
                duration: 6000
              });
              break;

            case 'economy':
              notifications.notifyEconomicChange(
                'Impact économique',
                -Math.round(consequence.severity / 10),
                consequence.description
              );
              break;

            case 'international':
              notifications.notify({
                type: 'diplomatic',
                title: 'Relations internationales',
                message: consequence.description,
                icon: '🌍',
                duration: 6000
              });
              break;
          }

          consequence.triggered = true;

          set(state => ({
            totalConsequencesExecuted: state.totalConsequencesExecuted + 1
          }));
        }
      });
    });
  },

  tick: (deltaTime: number) => {
    const state = get();

    if (!state.isRunning || state.timeScale === 'paused') return;

    const master = useMasterGameEngine.getState();
    if (!master.initialized) return;

    const multiplier = TIME_SCALE_MULTIPLIERS[state.timeScale];
    const adjustedDelta = deltaTime * multiplier;

    set({
      accumulatedTime: state.accumulatedTime + adjustedDelta,
      lastTickTime: Date.now()
    });

    // Toutes les secondes de jeu accumulées
    if (state.accumulatedTime >= 1000) {
      const hoursToAdvance = Math.floor(state.accumulatedTime / 1000) * 0.1; // 0.1h par seconde réelle

      // Avancer le temps
      master.advanceTime(hoursToAdvance);

      // Vérifier les événements programmés
      const currentDate = master.currentDate;
      state.scheduledEvents.forEach(scheduledEvent => {
        if (!scheduledEvent.executed && currentDate >= scheduledEvent.triggerDate) {
          set(state => ({
            eventHistory: [...state.eventHistory, scheduledEvent.event],
            totalEventsTriggered: state.totalEventsTriggered + 1
          }));
          scheduledEvent.executed = true;
          console.log(`📅 Événement programmé déclenché: ${scheduledEvent.event.title}`);
        }
      });

      // Traiter les conséquences
      get().processConsequences();

      // Chance aléatoire d'événement (5% par heure de jeu)
      if (Math.random() < 0.05 * hoursToAdvance) {
        get().triggerRandomEvent();
      }

      set({ accumulatedTime: 0 });
    }
  }
}));
