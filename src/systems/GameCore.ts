/**
 * SYSTÈME DE JEU PRINCIPAL - Simulation Politique Avancée
 * 
 * Ce système gère tous les aspects de la simulation politique :
 * - Cycles politiques et mandats
 * - Dynamiques d'opinion publique
 * - Équilibres des pouvoirs
 * - Conséquences à court/moyen/long terme
 */

import { create } from 'zustand';

// Types principaux du système
export interface GameState {
  // Temps et cycles
  currentDate: Date;
  dayInMandate: number;
  mandate: {
    startDate: Date;
    endDate: Date;
    phase: 'honeymoon' | 'governing' | 'mid-term' | 'pre-election' | 'campaign';
    daysRemaining: number;
  };

  // Indicateurs fondamentaux
  indicators: {
    // Opinion publique (0-100)
    popularity: {
      overall: number;
      byDemographic: Record<DemographicGroup, number>;
      byRegion: Record<Region, number>;
      trend: number; // -10 à +10, évolution récente
      volatility: number; // 0-100, stabilité de l'opinion
    };

    // Économie
    economy: {
      gdpGrowth: number; // -10 à +10 (%)
      unemployment: number; // 0-30 (%)
      inflation: number; // -5 à +20 (%)
      publicDebt: number; // 50-150 (% du PIB)
      budget: {
        balance: number; // -200 à +50 (milliards €)
        income: number;
        expenses: number;
      };
      businessConfidence: number; // 0-100
      consumerConfidence: number; // 0-100
    };

    // Social et société
    social: {
      unrest: number; // 0-100, niveau de contestation
      strikes: number; // Nombre de jours de grève par mois
      crimeRate: number; // 0-100
      healthSystem: number; // 0-100, état du système de santé
      educationQuality: number; // 0-100
      environmentalHealth: number; // 0-100
    };

    // International
    international: {
      diplomaticInfluence: number; // 0-100
      europeanRelations: number; // 0-100
      natoStanding: number; // 0-100
      globalReputation: number; // 0-100
    };
  };

  // Acteurs politiques et leurs relations
  actors: {
    parties: Record<string, PoliticalActor>;
    media: Record<string, MediaOutlet>;
    unions: Record<string, Union>;
    businesses: Record<string, BusinessGroup>;
    civilSociety: Record<string, CivilSocietyGroup>;
  };

  // Événements en cours et historique
  events: {
    active: GameEvent[];
    pending: GameEvent[];
    history: CompletedEvent[];
    consequences: Consequence[];
  };

  // Mécaniques de jeu
  mechanics: {
    politicalCapital: number; // 0-100, capacité d'action
    mediaAttention: number; // 0-100, focus médiatique
    crisisMode: boolean;
    mandateObjectives: Objective[];
    achievements: Achievement[];
  };
}

// Types détaillés
export type DemographicGroup = 
  | 'young_adults' | 'middle_age' | 'seniors'
  | 'working_class' | 'middle_class' | 'upper_class'
  | 'urban' | 'suburban' | 'rural'
  | 'public_sector' | 'private_sector' | 'unemployed'
  | 'students' | 'retirees';

export type Region = 
  | 'ile_de_france' | 'paca' | 'auvergne_rhone_alpes' | 'hauts_de_france'
  | 'occitanie' | 'nouvelle_aquitaine' | 'grand_est' | 'pays_de_loire'
  | 'bretagne' | 'normandie' | 'bourgogne_franche_comte' | 'centre_val_loire'
  | 'corse' | 'overseas';

export interface PoliticalActor {
  id: string;
  name: string;
  type: 'party' | 'figure' | 'movement';
  ideology: IdeologyProfile;
  strength: number; // 0-100, influence politique
  position: 'support' | 'opposition' | 'neutral';
  relationship: number; // -100 à +100 avec le président
  
  // Capacités d'action
  capabilities: {
    mediaInfluence: number;
    streetMobilization: number;
    parliamentaryPower: number;
    institutionalWeight: number;
  };

  // Historique relationnel
  history: {
    agreements: string[];
    conflicts: string[];
    favorsDone: number;
    favorsOwed: number;
  };

  // Intelligence artificielle de l'acteur
  ai: {
    strategy: 'aggressive' | 'constructive' | 'opportunistic' | 'ideological';
    priorities: string[];
    redLines: string[];
    negotiationStyle: number; // 0-100, de rigide à flexible
  };
}

export interface IdeologyProfile {
  economic: number; // -100 (gauche) à +100 (droite)
  social: number; // -100 (conservateur) à +100 (progressiste)  
  european: number; // -100 (souverainiste) à +100 (européiste)
  environmental: number; // 0-100 (priorité écologie)
  authority: number; // 0-100 (autoritarisme vs libéralisme)
}

export interface MediaOutlet {
  id: string;
  name: string;
  type: 'tv' | 'radio' | 'press' | 'online' | 'social';
  audience: number; // Millions de personnes touchées
  audienceProfile: Record<DemographicGroup, number>;
  
  editorial: {
    bias: IdeologyProfile;
    credibility: number; // 0-100
    sensationalism: number; // 0-100
    investigationCapacity: number; // 0-100
  };

  relationship: number; // -100 à +100 avec le gouvernement
  influence: number; // 0-100 sur l'opinion
}

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  
  // Contexte et déclenchement
  triggers: EventTrigger[];
  probability: number; // 0-100
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  
  // Options de réponse
  options: EventOption[];
  
  // Impact et conséquences
  stakeholders: string[]; // IDs des acteurs concernés
  domains: GameDomain[];
  
  // Mécaniques
  deadline?: Date;
  recurring?: boolean;
  chainEvents?: string[]; // Événements qui peuvent suivre
}

export type EventType = 
  | 'crisis' | 'opportunity' | 'domestic_policy' | 'international'
  | 'economic' | 'social' | 'environmental' | 'institutional'
  | 'scandal' | 'achievement' | 'external_shock';

export type GameDomain = 
  | 'economy' | 'social' | 'security' | 'environment' | 'education'
  | 'health' | 'justice' | 'defense' | 'diplomacy' | 'institutions';

export interface EventOption {
  id: string;
  title: string;
  description: string;
  
  // Coûts et prérequis
  requirements: {
    politicalCapital?: number;
    parliamentSupport?: number;
    popularityThreshold?: number;
    budgetCost?: number;
    ministerCompetence?: Record<string, number>;
  };

  // Conséquences immédiates et à long terme
  consequences: {
    immediate: ConsequenceSet;
    shortTerm: ConsequenceSet; // 1-3 mois
    mediumTerm: ConsequenceSet; // 6-12 mois  
    longTerm: ConsequenceSet; // 1-5 ans
  };

  // Réactions des acteurs
  reactions: Record<string, ActorReaction>;
  
  // Probabilités de succès/échec
  successRate: number; // 0-100
  riskFactors: RiskFactor[];
}

export interface ConsequenceSet {
  indicators?: Partial<GameState['indicators']>;
  events?: string[]; // IDs d'événements déclenchés
  relationships?: Record<string, number>;
  narrative?: string;
}

export interface Consequence {
  id: string;
  sourceEventId: string;
  sourceOptionId: string;
  
  scheduledDate: Date;
  type: 'indicator_change' | 'event_trigger' | 'relationship_change' | 'narrative';
  
  data: any;
  applied: boolean;
}

export interface ActorReaction {
  type: 'support' | 'oppose' | 'neutral' | 'conditional';
  intensity: number; // 0-100
  publicStatement?: string;
  actions?: ActorAction[];
  relationshipChange: number;
}

export interface ActorAction {
  type: 'media_campaign' | 'protest' | 'parliamentary_action' | 'negotiation';
  duration: number; // jours
  impact: ConsequenceSet;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  category: 'campaign_promise' | 'institutional' | 'crisis_response' | 'legacy';
  
  target: {
    indicator: keyof GameState['indicators'];
    value: number;
    deadline: Date;
  };
  
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'abandoned';
  
  politicalCost: number;
  publicVisibility: number; // 0-100
}

// Store principal du jeu
export const useGameCore = create<GameState & {
  // Actions principales
  processDay: () => void;
  handleEvent: (eventId: string, optionId: string) => void;
  triggerEvent: (eventId: string) => void;
  
  // Simulation et calculs
  updateIndicators: () => void;
  calculateActorReactions: (event: GameEvent, option: EventOption) => void;
  processConsequences: () => void;
  
  // Intelligence artificielle
  generateDynamicEvents: () => GameEvent[];
  simulateActorBehavior: () => void;
  updateMediaNarratives: () => void;
}>((set, get) => ({
  // État initial
  currentDate: new Date('2024-05-15'), // Début du mandat
  dayInMandate: 1,
  mandate: {
    startDate: new Date('2024-05-15'),
    endDate: new Date('2027-05-15'),
    phase: 'honeymoon',
    daysRemaining: 1095 // 3 ans
  },

  indicators: {
    popularity: {
      overall: 55, // Traditionnel début de mandat
      byDemographic: {
        young_adults: 45, middle_age: 58, seniors: 62,
        working_class: 48, middle_class: 61, upper_class: 72,
        urban: 52, suburban: 57, rural: 51,
        public_sector: 49, private_sector: 58, unemployed: 38,
        students: 43, retirees: 65
      },
      byRegion: {
        ile_de_france: 61, paca: 53, auvergne_rhone_alpes: 56,
        hauts_de_france: 47, occitanie: 54, nouvelle_aquitaine: 55,
        grand_est: 52, pays_de_loire: 58, bretagne: 57,
        normandie: 51, bourgogne_franche_comte: 53, centre_val_loire: 54,
        corse: 48, overseas: 44
      },
      trend: 0,
      volatility: 25 // Période de lune de miel, opinion stable
    },

    economy: {
      gdpGrowth: 1.2,
      unemployment: 7.4,
      inflation: 2.1,
      publicDebt: 110.8,
      budget: {
        balance: -154, // Déficit réaliste
        income: 1200,
        expenses: 1354
      },
      businessConfidence: 58,
      consumerConfidence: 62
    },

    social: {
      unrest: 15, // Niveau de base français
      strikes: 2.8,
      crimeRate: 32,
      healthSystem: 72,
      educationQuality: 68,
      environmentalHealth: 45
    },

    international: {
      diplomaticInfluence: 75,
      europeanRelations: 78,
      natoStanding: 82,
      globalReputation: 71
    }
  },

  actors: {
    parties: {},
    media: {},
    unions: {},
    businesses: {},
    civilSociety: {}
  },

  events: {
    active: [],
    pending: [],
    history: [],
    consequences: []
  },

  mechanics: {
    politicalCapital: 85, // Début de mandat élevé
    mediaAttention: 45,
    crisisMode: false,
    mandateObjectives: [],
    achievements: []
  },

  // Actions du système
  processDay: () => {
    const state = get();
    const newDay = state.dayInMandate + 1;
    const newDate = new Date(state.currentDate);
    newDate.setDate(newDate.getDate() + 1);

    // Calcul de la phase du mandat
    let phase: typeof state.mandate.phase = 'governing';
    if (newDay <= 100) phase = 'honeymoon';
    else if (newDay >= 730) phase = 'mid-term';
    else if (newDay >= 1000) phase = 'pre-election';

    set({
      currentDate: newDate,
      dayInMandate: newDay,
      mandate: {
        ...state.mandate,
        phase,
        daysRemaining: state.mandate.daysRemaining - 1
      }
    });

    // Processus quotidiens
    get().updateIndicators();
    get().processConsequences();
    get().simulateActorBehavior();
  },

  handleEvent: (eventId: string, optionId: string) => {
    // Implémentation détaillée dans la suite...
  },

  triggerEvent: (eventId: string) => {
    // Implémentation détaillée dans la suite...
  },

  updateIndicators: () => {
    // Simulation des évolutions naturelles des indicateurs
    const state = get();
    // Implémentation détaillée dans la suite...
  },

  calculateActorReactions: (event: GameEvent, option: EventOption) => {
    // Calcul IA des réactions des acteurs politiques
    // Implémentation détaillée dans la suite...
  },

  processConsequences: () => {
    const state = get();
    const today = state.currentDate;
    
    // Traite toutes les conséquences programmées pour aujourd'hui
    const toProcess = state.events.consequences.filter(c => 
      !c.applied && c.scheduledDate <= today
    );

    // Implémentation détaillée dans la suite...
  },

  generateDynamicEvents: () => {
    // Génération procédurale d'événements basée sur le contexte
    // Implémentation détaillée dans la suite...
    return [];
  },

  simulateActorBehavior: () => {
    // IA comportementale pour tous les acteurs politiques
    // Implémentation détaillée dans la suite...
  },

  updateMediaNarratives: () => {
    // Système de narratifs médiatiques dynamiques
    // Implémentation détaillée dans la suite...
  }
}));