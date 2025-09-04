/**
 * GÉNÉRATEUR D'ÉVÉNEMENTS DYNAMIQUES
 * 
 * Ce système crée des événements politiques contextualisés basés sur :
 * - L'état actuel du pays (économie, société, relations internationales)
 * - Les décisions précédentes du joueur
 * - Les tendances historiques françaises
 * - Les cycles politiques et médiatiques
 */

import { create } from 'zustand';
import type { GameState, GameEvent, EventType, GameDomain } from './GameCore';

// Générateur de contexte pour les événements
export interface EventContext {
  // État général
  mandatePhase: 'honeymoon' | 'governing' | 'mid-term' | 'pre-election' | 'campaign';
  dayInMandate: number;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  
  // Tensions actuelles
  primaryTensions: TensionArea[];
  emergingCrises: string[];
  
  // Historique récent
  recentEvents: string[];
  playerDecisionPattern: DecisionPattern;
  
  // Contexte externe
  internationalEvents: InternationalContext;
  economicCycle: EconomicPhase;
  socialClimate: SocialClimate;
}

export interface TensionArea {
  domain: GameDomain;
  intensity: number; // 0-100
  actors: string[]; // Acteurs impliqués
  flashpoints: string[]; // Points de cristallisation
}

export interface DecisionPattern {
  ideology: {
    economic: number; // -100 à +100
    social: number;
    european: number;
    environmental: number;
  };
  style: 'authoritarian' | 'consensual' | 'technocratic' | 'populist';
  riskTolerance: number; // 0-100
}

export interface InternationalContext {
  euTensions: number;
  usRelations: number;
  globalCrises: string[];
  tradeIssues: string[];
}

export type EconomicPhase = 'growth' | 'stagnation' | 'recession' | 'recovery';
export type SocialClimate = 'calm' | 'tense' | 'mobilized' | 'explosive';

// Templates d'événements dynamiques
export interface DynamicEventTemplate {
  id: string;
  category: EventCategory;
  triggers: EventTrigger[];
  variations: EventVariation[];
  scalability: ScalabilityOptions;
}

export type EventCategory = 
  | 'economic_pressure' | 'social_movement' | 'institutional_crisis'
  | 'international_incident' | 'scandal_eruption' | 'opportunity_window'
  | 'seasonal_tradition' | 'anniversary_event' | 'media_campaign';

export interface EventTrigger {
  type: 'indicator_threshold' | 'time_based' | 'decision_consequence' | 'random_chance';
  conditions: Record<string, any>;
  weight: number;
}

export interface EventVariation {
  id: string;
  title: string;
  description: string;
  intensity: 'minor' | 'moderate' | 'major' | 'critical';
  stakeholders: string[];
}

export interface ScalabilityOptions {
  canEscalate: boolean;
  escalationTriggers: Record<string, number>;
  maxIntensity: 'moderate' | 'major' | 'critical';
}

// Bibliothèque d'événements dynamiques français réalistes
export const DYNAMIC_EVENT_TEMPLATES: DynamicEventTemplate[] = [
  // Grèves et mouvements sociaux
  {
    id: 'transport_strike_wave',
    category: 'social_movement',
    triggers: [
      {
        type: 'indicator_threshold',
        conditions: {
          'social.unrest': { min: 30 },
          'economy.unemployment': { min: 8.5 }
        },
        weight: 0.7
      },
      {
        type: 'decision_consequence',
        conditions: {
          recentDecisions: ['public_spending_cuts', 'transport_reform']
        },
        weight: 0.9
      }
    ],
    variations: [
      {
        id: 'ratp_strike',
        title: 'Grève générale à la RATP',
        description: 'Les syndicats de transport francilien appellent à une grève générale suite aux réformes annoncées.',
        intensity: 'moderate',
        stakeholders: ['cgt_ratp', 'unsa_transport', 'ile_de_france_residents']
      },
      {
        id: 'national_transport_strike',
        title: 'Paralysie nationale des transports',
        description: 'SNCF, RATP et transport routier unis dans une grève historique qui paralyse le pays.',
        intensity: 'major',
        stakeholders: ['cgt', 'fo', 'unsa', 'all_commuters', 'business_sector']
      }
    ],
    scalability: {
      canEscalate: true,
      escalationTriggers: {
        'government_intransigence': 0.8,
        'public_support': 0.6
      },
      maxIntensity: 'critical'
    }
  },

  // Crises économiques sectorielles
  {
    id: 'industrial_crisis',
    category: 'economic_pressure',
    triggers: [
      {
        type: 'indicator_threshold',
        conditions: {
          'economy.businessConfidence': { max: 40 },
          'economy.gdpGrowth': { max: 0.5 }
        },
        weight: 0.8
      }
    ],
    variations: [
      {
        id: 'automotive_plant_closure',
        title: 'Fermeture d\'usine automobile',
        description: 'Un grand constructeur annonce la fermeture de son site français, 3000 emplois menacés.',
        intensity: 'moderate',
        stakeholders: ['automotive_unions', 'local_politicians', 'affected_workers']
      },
      {
        id: 'steel_industry_collapse',
        title: 'Crise de la sidérurgie française',
        description: 'La concurrence internationale et les coûts énergétiques menacent tout un secteur industriel.',
        intensity: 'major',
        stakeholders: ['metallurgy_unions', 'industrial_regions', 'european_competitors']
      }
    ],
    scalability: {
      canEscalate: true,
      escalationTriggers: {
        'government_inaction': 0.7,
        'unemployment_spike': 0.8
      },
      maxIntensity: 'critical'
    }
  },

  // Crises institutionnelles
  {
    id: 'constitutional_crisis',
    category: 'institutional_crisis',
    triggers: [
      {
        type: 'indicator_threshold',
        conditions: {
          'mechanics.politicalCapital': { max: 30 },
          'popularity.overall': { max: 25 }
        },
        weight: 0.6
      },
      {
        type: 'decision_consequence',
        conditions: {
          controversialDecisions: 3 // Nombre de décisions controversées
        },
        weight: 0.8
      }
    ],
    variations: [
      {
        id: 'no_confidence_motion',
        title: 'Motion de censure déposée',
        description: 'L\'opposition dépose une motion de censure contre le gouvernement.',
        intensity: 'moderate',
        stakeholders: ['opposition_parties', 'assembly_deputies', 'constitutional_council']
      },
      {
        id: 'dissolution_pressure',
        title: 'Pression pour dissoudre l\'Assemblée',
        description: 'Face à la crise, certains réclament la dissolution de l\'Assemblée nationale.',
        intensity: 'major',
        stakeholders: ['all_parties', 'constitutional_experts', 'french_citizens']
      }
    ],
    scalability: {
      canEscalate: true,
      escalationTriggers: {
        'popular_pressure': 0.9,
        'institutional_deadlock': 0.8
      },
      maxIntensity: 'critical'
    }
  },

  // Événements internationaux
  {
    id: 'eu_diplomatic_crisis',
    category: 'international_incident',
    triggers: [
      {
        type: 'indicator_threshold',
        conditions: {
          'international.europeanRelations': { max: 50 }
        },
        weight: 0.5
      },
      {
        type: 'decision_consequence',
        conditions: {
          euSkepticalDecisions: 2
        },
        weight: 0.7
      }
    ],
    variations: [
      {
        id: 'budget_rules_conflict',
        title: 'Conflit sur les règles budgétaires européennes',
        description: 'Bruxelles menace de sanctions suite au non-respect des règles de déficit.',
        intensity: 'moderate',
        stakeholders: ['european_commission', 'finance_ministers', 'eu_skeptics']
      },
      {
        id: 'france_germany_rift',
        title: 'Crise diplomatique franco-allemande',
        description: 'Tensions majeures avec Berlin sur la politique économique européenne.',
        intensity: 'major',
        stakeholders: ['german_government', 'eu_institutions', 'european_media']
      }
    ],
    scalability: {
      canEscalate: true,
      escalationTriggers: {
        'nationalist_rhetoric': 0.8,
        'economic_impact': 0.7
      },
      maxIntensity: 'major'
    }
  },

  // Événements saisonniers et cycliques
  {
    id: 'back_to_school_issues',
    category: 'seasonal_tradition',
    triggers: [
      {
        type: 'time_based',
        conditions: {
          month: 9, // Septembre
          dayRange: [1, 15]
        },
        weight: 1.0
      }
    ],
    variations: [
      {
        id: 'teacher_shortage',
        title: 'Pénurie d\'enseignants à la rentrée',
        description: 'Manque critique de professeurs dans plusieurs académies pour la rentrée scolaire.',
        intensity: 'moderate',
        stakeholders: ['education_unions', 'parents_associations', 'students']
      },
      {
        id: 'school_infrastructure_crisis',
        title: 'Crise des infrastructures scolaires',
        description: 'Plusieurs établissements fermés pour raisons de sécurité à la rentrée.',
        intensity: 'major',
        stakeholders: ['local_authorities', 'parents', 'safety_inspectors']
      }
    ],
    scalability: {
      canEscalate: false,
      escalationTriggers: {},
      maxIntensity: 'moderate'
    }
  }
];

// Store pour le générateur d'événements
export const useDynamicEventGenerator = create<{
  // État
  eventQueue: GameEvent[];
  contextAnalysis: EventContext | null;
  generationHistory: string[];
  
  // Actions principales
  generateEvents: (gameState: GameState) => GameEvent[];
  analyzeContext: (gameState: GameState) => EventContext;
  selectRelevantTemplates: (context: EventContext) => DynamicEventTemplate[];
  
  // Personnalisation et adaptation
  customizeEvent: (template: DynamicEventTemplate, context: EventContext) => GameEvent;
  calculateEventProbability: (template: DynamicEventTemplate, context: EventContext) => number;
  
  // Intelligence artificielle
  learnFromPlayerBehavior: (playerActions: any[]) => void;
  adaptEventFrequency: (playerEngagement: number) => void;
}>((set, get) => ({
  eventQueue: [],
  contextAnalysis: null,
  generationHistory: [],

  generateEvents: (gameState: GameState) => {
    const context = get().analyzeContext(gameState);
    const relevantTemplates = get().selectRelevantTemplates(context);
    
    const newEvents: GameEvent[] = [];
    
    relevantTemplates.forEach(template => {
      const probability = get().calculateEventProbability(template, context);
      
      if (Math.random() < probability) {
        const customizedEvent = get().customizeEvent(template, context);
        newEvents.push(customizedEvent);
      }
    });

    // Limitation pour éviter la surcharge
    const finalEvents = newEvents.slice(0, 3);

    set(state => ({
      eventQueue: [...state.eventQueue, ...finalEvents],
      generationHistory: [...state.generationHistory, ...finalEvents.map(e => e.id)]
    }));

    return finalEvents;
  },

  analyzeContext: (gameState: GameState) => {
    const context: EventContext = {
      mandatePhase: gameState.mandate.phase,
      dayInMandate: gameState.dayInMandate,
      season: getSeasonFromDate(gameState.currentDate),
      
      primaryTensions: identifyTensions(gameState),
      emergingCrises: identifyEmergingCrises(gameState),
      
      recentEvents: gameState.events.history.slice(-10).map(e => e.id),
      playerDecisionPattern: analyzeDecisionPattern(gameState),
      
      internationalEvents: analyzeInternationalContext(gameState),
      economicCycle: determineEconomicPhase(gameState),
      socialClimate: assessSocialClimate(gameState)
    };

    set({ contextAnalysis: context });
    return context;
  },

  selectRelevantTemplates: (context: EventContext) => {
    return DYNAMIC_EVENT_TEMPLATES.filter(template => {
      // Filtrage basé sur le contexte
      return template.triggers.some(trigger => 
        evaluateTrigger(trigger, context)
      );
    });
  },

  customizeEvent: (template: DynamicEventTemplate, context: EventContext) => {
    // Sélection de la variation appropriée
    const variation = selectBestVariation(template.variations, context);
    
    // Génération de l'événement complet
    const event: GameEvent = {
      id: `${template.id}_${Date.now()}`,
      type: mapCategoryToType(template.category),
      title: variation.title,
      description: variation.description,
      
      triggers: template.triggers,
      probability: get().calculateEventProbability(template, context),
      urgency: mapIntensityToUrgency(variation.intensity),
      
      options: generateEventOptions(template, variation, context),
      
      stakeholders: variation.stakeholders,
      domains: inferDomainsFromStakeholders(variation.stakeholders),
      
      deadline: calculateDeadline(variation.intensity),
      recurring: false,
      chainEvents: generateChainEvents(template, context)
    };

    return event;
  },

  calculateEventProbability: (template: DynamicEventTemplate, context: EventContext) => {
    let totalWeight = 0;
    let triggeredWeight = 0;

    template.triggers.forEach(trigger => {
      totalWeight += trigger.weight;
      if (evaluateTrigger(trigger, context)) {
        triggeredWeight += trigger.weight;
      }
    });

    const baseProbability = triggeredWeight / totalWeight;
    
    // Ajustements contextuels
    let adjusted = baseProbability;
    
    // Réduction si événements similaires récents
    if (context.recentEvents.some(e => e.includes(template.id))) {
      adjusted *= 0.3;
    }
    
    // Augmentation selon la phase du mandat
    if (context.mandatePhase === 'mid-term') adjusted *= 1.4;
    if (context.mandatePhase === 'pre-election') adjusted *= 1.6;
    
    return Math.min(1, adjusted);
  },

  learnFromPlayerBehavior: (playerActions: any[]) => {
    // Machine learning simple pour adapter les événements
    // au style de jeu du joueur
  },

  adaptEventFrequency: (playerEngagement: number) => {
    // Ajustement de la fréquence selon l'engagement du joueur
  }
}));

// Fonctions utilitaires d'analyse
function getSeasonFromDate(date: Date): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function identifyTensions(gameState: GameState): TensionArea[] {
  const tensions: TensionArea[] = [];
  
  if (gameState.indicators.social.unrest > 40) {
    tensions.push({
      domain: 'social',
      intensity: gameState.indicators.social.unrest,
      actors: ['unions', 'civil_society'],
      flashpoints: ['worker_rights', 'public_services']
    });
  }
  
  if (gameState.indicators.economy.unemployment > 9) {
    tensions.push({
      domain: 'economy',
      intensity: gameState.indicators.economy.unemployment * 8,
      actors: ['business_groups', 'unemployed'],
      flashpoints: ['job_creation', 'social_benefits']
    });
  }
  
  return tensions;
}

function identifyEmergingCrises(gameState: GameState): string[] {
  const crises: string[] = [];
  
  if (gameState.indicators.social.unrest > 60) crises.push('social_explosion');
  if (gameState.indicators.economy.gdpGrowth < -2) crises.push('economic_recession');
  if (gameState.indicators.popularity.overall < 20) crises.push('legitimacy_crisis');
  
  return crises;
}

function analyzeDecisionPattern(gameState: GameState): DecisionPattern {
  // Analyse des décisions récentes pour déterminer le pattern
  return {
    ideology: {
      economic: 0, // À calculer basé sur les décisions
      social: 0,
      european: 0,
      environmental: 0
    },
    style: 'consensual', // À déterminer
    riskTolerance: 50
  };
}

function analyzeInternationalContext(gameState: GameState): InternationalContext {
  return {
    euTensions: 100 - gameState.indicators.international.europeanRelations,
    usRelations: gameState.indicators.international.natoStanding,
    globalCrises: [],
    tradeIssues: []
  };
}

function determineEconomicPhase(gameState: GameState): EconomicPhase {
  const growth = gameState.indicators.economy.gdpGrowth;
  if (growth > 2) return 'growth';
  if (growth < -1) return 'recession';
  if (growth < 0.5) return 'stagnation';
  return 'recovery';
}

function assessSocialClimate(gameState: GameState): SocialClimate {
  const unrest = gameState.indicators.social.unrest;
  if (unrest < 20) return 'calm';
  if (unrest < 40) return 'tense';
  if (unrest < 70) return 'mobilized';
  return 'explosive';
}

function evaluateTrigger(trigger: EventTrigger, context: EventContext): boolean {
  switch (trigger.type) {
    case 'time_based':
      // Évaluation des conditions temporelles
      return true;
    case 'indicator_threshold':
      // Évaluation des seuils d'indicateurs
      return true;
    default:
      return Math.random() < 0.5;
  }
}

function selectBestVariation(variations: EventVariation[], context: EventContext): EventVariation {
  // Sélection de la variation la plus appropriée au contexte
  return variations[0]; // Simplified for now
}

function mapCategoryToType(category: EventCategory): EventType {
  const mapping: Record<EventCategory, EventType> = {
    'economic_pressure': 'economic',
    'social_movement': 'social',
    'institutional_crisis': 'institutional',
    'international_incident': 'international',
    'scandal_eruption': 'scandal',
    'opportunity_window': 'opportunity',
    'seasonal_tradition': 'domestic_policy',
    'anniversary_event': 'domestic_policy',
    'media_campaign': 'social'
  };
  return mapping[category] || 'domestic_policy';
}

function mapIntensityToUrgency(intensity: string): 'immediate' | 'short_term' | 'medium_term' | 'long_term' {
  const mapping: Record<string, any> = {
    'minor': 'medium_term',
    'moderate': 'short_term',
    'major': 'immediate',
    'critical': 'immediate'
  };
  return mapping[intensity] || 'medium_term';
}

function generateEventOptions(template: DynamicEventTemplate, variation: EventVariation, context: EventContext): any[] {
  // Génération dynamique des options de réponse
  return [];
}

function inferDomainsFromStakeholders(stakeholders: string[]): GameDomain[] {
  // Inférence des domaines basée sur les parties prenantes
  return ['social'];
}

function calculateDeadline(intensity: string): Date | undefined {
  if (intensity === 'critical') {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 3);
    return deadline;
  }
  return undefined;
}

function generateChainEvents(template: DynamicEventTemplate, context: EventContext): string[] {
  return [];
}