export type GameInitStep = 'personal' | 'party' | 'prime-minister' | 'cabinet' | 'confirmation';

// PoliticalParty type moved to src/types/party.ts
export type { PoliticalParty } from './party';

// PotentialMinister type moved to src/types/cabinet.ts
export type { PotentialMinister } from './cabinet';

export type MandatePhase = 'honeymoon' | 'governing' | 'midterm' | 'campaign';
export type MediaAttention = 'low' | 'medium' | 'high' | 'crisis';
export type DemographicGroup = 'young_adults' | 'middle_aged' | 'seniors' | 'working_class' | 'middle_class' | 'upper_class';

// Effets riches et multi-conséquences
export interface Effects {
  popularity?: {
    overall?: number;
    byDemographic?: Partial<Record<DemographicGroup, number>>;
    trend?: number;
  };
  politicalCapitalDelta?: number; // variation +/- du capital politique
  economy?: {
    gdpGrowth?: number; // delta
    unemployment?: number; // delta
    inflation?: number; // delta
    budget?: {
      balance?: number; // delta en €
      debt?: number; // delta en €
    };
  };
  social?: {
    unrest?: number; // delta 0-100
    healthSystem?: number; // delta 0-100
    education?: number; // delta 0-100
    security?: number; // delta 0-100
  };
  international?: {
    diplomaticRelations?: Record<string, number>; // delta par pays 0-100
    europeanInfluence?: number; // delta 0-100
  };
  coalitionStability?: number; // delta 0-100
  mediaAttention?: MediaAttention; // positionnement direct
}

export interface GameState {
  currentDate: Date;
  dayInMandate: number;
  mandate: {
    phase: MandatePhase;
    timeRemaining: number; // jours restants
    totalDays: number;
  };
  indicators: {
    popularity: {
      overall: number;
      trend: number;
      byDemographic: Record<DemographicGroup, number>;
    };
    economy: {
      gdpGrowth: number;
      unemployment: number;
      inflation: number;
      budget: {
        balance: number; // en euros
        debt: number;
      };
    };
    social: {
      unrest: number; // 0-100
      healthSystem: number; // 0-100
      education: number; // 0-100
      security: number; // 0-100
    };
    international: {
      diplomaticRelations: Record<string, number>; // 0-100 par pays
      europeanInfluence: number; // 0-100
    };
  };
  politicalCapital: number; // 0-200
  coalitionStability: number; // 0-100
  mediaAttention: MediaAttention;
}

export type EventCategory = 'domestic' | 'international' | 'economic' | 'social' | 'crisis' | 'opportunity';
export type EventSeverity = 'minor' | 'moderate' | 'major' | 'critical';

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  severity: EventSeverity;
  triggerDate: Date;
  requiresDecision: boolean;
  timeLimit?: number; // en heures
  
  // Effets automatiques
  immediateEffects?: {
    type: 'popularity' | 'political_capital' | 'social_unrest' | 'economic_indicator';
    value: number;
    description?: string;
  }[];
  
  // Options de décision si applicable
  options?: DecisionOption[];
  
  // Contexte pour l'IA
  context?: {
    relatedEvents?: string[];
    prerequisites?: string[];
    triggers?: string[];
  };
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  
  // Conséquences prévisibles
  consequences?: {
    popularity?: number;
    politicalCapital?: number;
    economicImpact?: number;
    socialStability?: number;
  };

  // Effets détaillés (multi-conséquences)
  effects?: Effects;
  
  // Scénarios alternatifs probabilistes (applique l'un des effets)
  outcomes?: Array<{
    chance: number; // 0..1
    description?: string;
    effects: Effects;
  }>;
  
  // Coût en capital politique
  politicalCost?: number;
  
  // Conditions requises
  requirements?: {
    minPoliticalCapital?: number;
    minPopularity?: number;
    coalitionSupport?: boolean;
  };
  
  // Effets narratifs
  consequence?: string;
  immediateEffects?: string[];
  delayedEffects?: (
    | { type: string; value: number; delay: number }
    | { afterHours: number; effects: Effects }
  )[];
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  priority: 'urgent' | 'normal' | 'low';
  category: EventCategory;
  options: DecisionOption[];
  
  // Contexte
  backgroundInfo?: string;
  advisorRecommendations?: {
    advisor: string;
    recommendation: string;
    preferredOption: string;
  }[];
}

export interface DecisionConsequence {
  decisionId: string;
  choiceId: string;
  effects: {
    popularity?: number;
    politicalCapital?: number;
    economicImpact?: number;
    socialStability?: number;
  };
  description: string;
  immediateEffects?: string[];
  delayedEffects?: {
    type: string;
    value: number;
  }[];
  appliedEffects?: Effects;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  category: EventCategory;
  sentiment: 'positive' | 'negative' | 'neutral';
  popularity: number; // impact sur l'opinion
  publishDate: Date;
  content: string;
  relatedDecisions?: string[];
}

export interface PoliticalActor {
  id: string;
  name: string;
  role: 'opposition_leader' | 'media_figure' | 'union_leader' | 'business_leader' | 'international_leader';
  influence: number; // 0-100
  relationship: number; // -100 à +100
  agenda: string[];
  
  // Réactions automatiques
  reactions?: {
    trigger: string;
    response: string;
    impact: {
      popularity?: number;
      politicalCapital?: number;
    };
  }[];
}
