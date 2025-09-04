/**
 * MOTEUR DE CONSÉQUENCES DES DÉCISIONS POLITIQUES
 * 
 * Ce système calcule les impacts réalistes des décisions présidentielles
 * en tenant compte des dynamiques politiques, économiques et sociales françaises
 */

import { create } from 'zustand';
import type { GameState } from './GameCore';

// Types pour le système de conséquences
export interface DecisionConsequence {
  id: string;
  decisionId: string;
  type: ConsequenceType;
  timeframe: ConsequenceTimeframe;
  probability: number; // 0-100
  
  // Impacts sur les indicateurs
  impacts: {
    direct: IndicatorImpact[];
    indirect: IndicatorImpact[];
    cascading: CascadingEffect[];
  };
  
  // Réactions des acteurs
  reactions: ActorReactionSet;
  
  // Mécaniques spéciales
  triggers?: {
    events?: string[];
    crises?: CrisisScenario[];
    opportunities?: OpportunityWindow[];
  };
}

export type ConsequenceType = 
  | 'policy_implementation' | 'political_reaction' | 'economic_shift'
  | 'social_movement' | 'media_narrative' | 'international_relations'
  | 'institutional_change' | 'crisis_emergence' | 'opportunity_creation';

export type ConsequenceTimeframe = 
  | 'immediate' // 0-7 jours
  | 'short_term' // 1-3 mois
  | 'medium_term' // 6-18 mois
  | 'long_term' // 2-5 ans
  | 'legacy'; // Impact permanent

export interface IndicatorImpact {
  indicator: string;
  change: number;
  uncertainty: number; // Variance possible
  conditions?: ImpactCondition[];
}

export interface CascadingEffect {
  trigger: {
    indicator: string;
    threshold: number;
    operator: 'greater' | 'less' | 'equal';
  };
  effects: IndicatorImpact[];
  probability: number;
}

export interface ActorReactionSet {
  parties: Record<string, ActorReaction>;
  media: Record<string, MediaReaction>;
  unions: Record<string, UnionReaction>;
  businesses: Record<string, BusinessReaction>;
  publicOpinion: OpinionReaction;
}

export interface ActorReaction {
  stance: 'strongly_support' | 'support' | 'neutral' | 'oppose' | 'strongly_oppose';
  actions: ActorAction[];
  mediaStrategy: MediaStrategy;
  electoralImpact: number; // Sur leur base électorale
}

export interface MediaReaction {
  coverage: 'positive' | 'neutral' | 'negative' | 'scandal';
  intensity: number; // 1-100
  duration: number; // Jours de couverture
  focusAreas: string[];
  narrativeFraming: string;
}

export interface UnionReaction {
  mobilization: number; // 0-100
  strikeRisk: number; // 0-100
  sectors: string[];
  negotiationStance: 'cooperative' | 'confrontational';
}

export interface BusinessReaction {
  confidence: number; // -50 à +50
  investment: number; // Impact sur l'investissement
  employment: number; // Impact sur l'emploi
  sectors: string[];
}

export interface OpinionReaction {
  overall: number; // -20 à +20
  demographics: Record<string, number>;
  regions: Record<string, number>;
  volatility: number; // Augmentation de la volatilité
}

// Scénarios prédéfinis de conséquences réalistes
export const REALISTIC_CONSEQUENCE_PATTERNS: Record<string, DecisionConsequence[]> = {
  // Réforme des retraites
  pension_reform: [
    {
      id: 'pension_immediate_protests',
      decisionId: 'pension_reform',
      type: 'social_movement',
      timeframe: 'immediate',
      probability: 85,
      impacts: {
        direct: [
          { indicator: 'social.unrest', change: 25, uncertainty: 5 },
          { indicator: 'popularity.overall', change: -15, uncertainty: 3 }
        ],
        indirect: [
          { indicator: 'economy.businessConfidence', change: -5, uncertainty: 3 }
        ],
        cascading: [
          {
            trigger: { indicator: 'social.unrest', threshold: 40, operator: 'greater' },
            effects: [
              { indicator: 'social.strikes', change: 15, uncertainty: 5 },
              { indicator: 'mechanics.politicalCapital', change: -10, uncertainty: 2 }
            ],
            probability: 70
          }
        ]
      },
      reactions: {
        parties: {
          'left_alliance': {
            stance: 'strongly_oppose',
            actions: [
              { type: 'parliamentary_obstruction', intensity: 80, duration: 30 },
              { type: 'street_mobilization', intensity: 90, duration: 21 }
            ],
            mediaStrategy: { focus: 'social_justice', tone: 'confrontational' },
            electoralImpact: 8
          }
        },
        media: {
          'mainstream_media': {
            coverage: 'negative',
            intensity: 75,
            duration: 14,
            focusAreas: ['social_impact', 'protests', 'government_response'],
            narrativeFraming: 'Social crisis deepens as reform sparks nationwide protests'
          }
        },
        unions: {
          'cgt': {
            mobilization: 95,
            strikeRisk: 85,
            sectors: ['public_transport', 'education', 'healthcare'],
            negotiationStance: 'confrontational'
          }
        },
        businesses: {
          'employers_union': {
            confidence: 15,
            investment: 5,
            employment: -2,
            sectors: ['services', 'manufacturing']
          }
        },
        publicOpinion: {
          overall: -12,
          demographics: {
            'working_class': -20,
            'public_sector': -25,
            'retirees': -15,
            'young_adults': -18
          },
          regions: {
            'ile_de_france': -15,
            'hauts_de_france': -18
          },
          volatility: 15
        }
      }
    },
    {
      id: 'pension_long_term_savings',
      decisionId: 'pension_reform',
      type: 'economic_shift',
      timeframe: 'long_term',
      probability: 65,
      impacts: {
        direct: [
          { indicator: 'economy.publicDebt', change: -8, uncertainty: 3 },
          { indicator: 'economy.budget.balance', change: 25, uncertainty: 8 }
        ],
        indirect: [
          { indicator: 'economy.gdpGrowth', change: 0.3, uncertainty: 0.2 }
        ],
        cascading: []
      },
      reactions: {
        parties: {},
        media: {
          'financial_press': {
            coverage: 'positive',
            intensity: 60,
            duration: 7,
            focusAreas: ['fiscal_responsibility', 'long_term_sustainability'],
            narrativeFraming: 'Reform delivers promised fiscal benefits'
          }
        },
        unions: {},
        businesses: {
          'financial_sector': {
            confidence: 20,
            investment: 8,
            employment: 3,
            sectors: ['insurance', 'banking']
          }
        },
        publicOpinion: {
          overall: 5,
          demographics: {
            'middle_class': 8,
            'upper_class': 12
          },
          regions: {},
          volatility: -5
        }
      }
    }
  ],

  // Réforme fiscale
  tax_reform: [
    {
      id: 'tax_business_response',
      decisionId: 'corporate_tax_reduction',
      type: 'economic_shift',
      timeframe: 'short_term',
      probability: 75,
      impacts: {
        direct: [
          { indicator: 'economy.businessConfidence', change: 20, uncertainty: 5 },
          { indicator: 'economy.budget.income', change: -45, uncertainty: 10 }
        ],
        indirect: [
          { indicator: 'economy.investment', change: 12, uncertainty: 6 }
        ],
        cascading: [
          {
            trigger: { indicator: 'economy.businessConfidence', threshold: 75, operator: 'greater' },
            effects: [
              { indicator: 'economy.employment', change: 0.5, uncertainty: 0.3 },
              { indicator: 'economy.gdpGrowth', change: 0.2, uncertainty: 0.1 }
            ],
            probability: 60
          }
        ]
      },
      reactions: {
        parties: {
          'business_friendly': {
            stance: 'strongly_support',
            actions: [
              { type: 'public_endorsement', intensity: 70, duration: 14 }
            ],
            mediaStrategy: { focus: 'economic_growth', tone: 'supportive' },
            electoralImpact: 5
          }
        },
        media: {
          'left_media': {
            coverage: 'negative',
            intensity: 65,
            duration: 10,
            focusAreas: ['inequality', 'public_services'],
            narrativeFraming: 'Tax cuts for the wealthy while services suffer'
          }
        },
        unions: {
          'public_unions': {
            mobilization: 45,
            strikeRisk: 25,
            sectors: ['public_services'],
            negotiationStance: 'cooperative'
          }
        },
        businesses: {
          'large_corporations': {
            confidence: 35,
            investment: 15,
            employment: 8,
            sectors: ['technology', 'manufacturing', 'services']
          }
        },
        publicOpinion: {
          overall: -5,
          demographics: {
            'working_class': -15,
            'middle_class': -2,
            'upper_class': 20,
            'business_owners': 25
          },
          regions: {},
          volatility: 8
        }
      }
    }
  ],

  // Politique environnementale
  carbon_tax: [
    {
      id: 'carbon_tax_protests',
      decisionId: 'carbon_tax_increase',
      type: 'social_movement',
      timeframe: 'immediate',
      probability: 80,
      impacts: {
        direct: [
          { indicator: 'social.unrest', change: 20, uncertainty: 8 },
          { indicator: 'popularity.rural', change: -25, uncertainty: 5 }
        ],
        indirect: [
          { indicator: 'economy.consumerConfidence', change: -10, uncertainty: 4 }
        ],
        cascading: [
          {
            trigger: { indicator: 'popularity.rural', threshold: 30, operator: 'less' },
            effects: [
              { indicator: 'social.protests', change: 30, uncertainty: 10 },
              { indicator: 'mechanics.politicalCapital', change: -15, uncertainty: 3 }
            ],
            probability: 85
          }
        ]
      },
      reactions: {
        parties: {
          'populist_right': {
            stance: 'strongly_oppose',
            actions: [
              { type: 'rural_mobilization', intensity: 90, duration: 45 }
            ],
            mediaStrategy: { focus: 'rural_hardship', tone: 'populist' },
            electoralImpact: 15
          }
        },
        media: {
          'social_media': {
            coverage: 'negative',
            intensity: 85,
            duration: 21,
            focusAreas: ['cost_of_living', 'rural_impact', 'yellow_vests'],
            narrativeFraming: 'Government ignores rural France with punitive green taxes'
          }
        },
        unions: {
          'transport_unions': {
            mobilization: 60,
            strikeRisk: 40,
            sectors: ['transport', 'logistics'],
            negotiationStance: 'confrontational'
          }
        },
        businesses: {
          'transport_sector': {
            confidence: -20,
            investment: -10,
            employment: -5,
            sectors: ['transport', 'logistics', 'retail']
          }
        },
        publicOpinion: {
          overall: -8,
          demographics: {
            'rural': -30,
            'working_class': -20,
            'suburban': -12,
            'urban': 5
          },
          regions: {
            'rural_regions': -25,
            'industrial_regions': -18
          },
          volatility: 20
        }
      }
    }
  ]
};

// Store pour le moteur de conséquences
export const useDecisionConsequenceEngine = create<{
  // État
  activeConsequences: DecisionConsequence[];
  consequenceHistory: Record<string, DecisionConsequence[]>;
  
  // Actions
  processDecision: (decisionId: string, decisionContext: any) => DecisionConsequence[];
  applyConsequences: (consequences: DecisionConsequence[], gameState: GameState) => GameState;
  calculateCascadingEffects: (gameState: GameState) => IndicatorImpact[];
  
  // Simulation avancée
  predictConsequences: (decisionId: string, context: any) => {
    likely: DecisionConsequence[];
    possible: DecisionConsequence[];
    risks: DecisionConsequence[];
  };
  
  // Intelligence artificielle
  adaptConsequenceProbabilities: (historicalOutcomes: any[]) => void;
}>((set, get) => ({
  activeConsequences: [],
  consequenceHistory: {},

  processDecision: (decisionId: string, decisionContext: any) => {
    const patterns = REALISTIC_CONSEQUENCE_PATTERNS[decisionId] || [];
    const contextualConsequences = patterns.map(pattern => ({
      ...pattern,
      // Ajustement basé sur le contexte
      probability: adjustProbabilityByContext(pattern.probability, decisionContext),
      impacts: adjustImpactsByContext(pattern.impacts, decisionContext)
    }));

    // Sélection des conséquences qui se déclenchent
    const triggeredConsequences = contextualConsequences.filter(
      consequence => Math.random() * 100 < consequence.probability
    );

    set(state => ({
      activeConsequences: [...state.activeConsequences, ...triggeredConsequences],
      consequenceHistory: {
        ...state.consequenceHistory,
        [decisionId]: triggeredConsequences
      }
    }));

    return triggeredConsequences;
  },

  applyConsequences: (consequences: DecisionConsequence[], gameState: GameState) => {
    let newState = { ...gameState };

    consequences.forEach(consequence => {
      // Application des impacts directs
      consequence.impacts.direct.forEach(impact => {
        const actualChange = impact.change + (Math.random() - 0.5) * impact.uncertainty;
        newState = applyIndicatorChange(newState, impact.indicator, actualChange);
      });

      // Vérification et application des effets en cascade
      consequence.impacts.cascading.forEach(cascade => {
        const currentValue = getIndicatorValue(newState, cascade.trigger.indicator);
        const shouldTrigger = evaluateTriggerCondition(
          currentValue, 
          cascade.trigger.threshold, 
          cascade.trigger.operator
        );

        if (shouldTrigger && Math.random() * 100 < cascade.probability) {
          cascade.effects.forEach(effect => {
            const actualChange = effect.change + (Math.random() - 0.5) * effect.uncertainty;
            newState = applyIndicatorChange(newState, effect.indicator, actualChange);
          });
        }
      });
    });

    return newState;
  },

  calculateCascadingEffects: (gameState: GameState) => {
    // Analyse des effets de second ordre basés sur l'état actuel
    const cascadingEffects: IndicatorImpact[] = [];

    // Exemple: si le chômage est élevé, impact sur la popularité
    if (gameState.indicators.economy.unemployment > 10) {
      cascadingEffects.push({
        indicator: 'popularity.working_class',
        change: -5,
        uncertainty: 2
      });
    }

    // Si l'agitation sociale est élevée, impact sur l'économie
    if (gameState.indicators.social.unrest > 60) {
      cascadingEffects.push({
        indicator: 'economy.businessConfidence',
        change: -8,
        uncertainty: 3
      });
    }

    return cascadingEffects;
  },

  predictConsequences: (decisionId: string, context: any) => {
    const patterns = REALISTIC_CONSEQUENCE_PATTERNS[decisionId] || [];
    
    return {
      likely: patterns.filter(p => p.probability >= 70),
      possible: patterns.filter(p => p.probability >= 30 && p.probability < 70),
      risks: patterns.filter(p => p.type === 'crisis_emergence' || p.impacts.direct.some(i => i.change < 0))
    };
  },

  adaptConsequenceProbabilities: (historicalOutcomes: any[]) => {
    // Machine learning simple pour ajuster les probabilités
    // basé sur les résultats historiques
  }
}));

// Fonctions utilitaires
function adjustProbabilityByContext(baseProbability: number, context: any): number {
  let adjusted = baseProbability;
  
  // Ajustements basés sur le contexte politique
  if (context.politicalCapital < 50) adjusted *= 1.2; // Plus de résistance
  if (context.mediaAttention > 70) adjusted *= 1.3; // Plus de scrutin
  if (context.crisisMode) adjusted *= 1.5; // Réactions amplifiées
  
  return Math.min(100, adjusted);
}

function adjustImpactsByContext(impacts: any, context: any) {
  // Ajustement des impacts selon le contexte
  return impacts;
}

function applyIndicatorChange(gameState: GameState, indicatorPath: string, change: number): GameState {
  const newState = { ...gameState };
  const pathParts = indicatorPath.split('.');
  
  // Navigation dans l'objet pour appliquer le changement
  let target: any = newState;
  for (let i = 0; i < pathParts.length - 1; i++) {
    target = target[pathParts[i]];
  }
  
  const finalKey = pathParts[pathParts.length - 1];
  if (typeof target[finalKey] === 'number') {
    target[finalKey] = Math.max(0, Math.min(100, target[finalKey] + change));
  }
  
  return newState;
}

function getIndicatorValue(gameState: GameState, indicatorPath: string): number {
  const pathParts = indicatorPath.split('.');
  let value: any = gameState;
  
  for (const part of pathParts) {
    value = value[part];
    if (value === undefined) return 0;
  }
  
  return typeof value === 'number' ? value : 0;
}

function evaluateTriggerCondition(value: number, threshold: number, operator: string): boolean {
  switch (operator) {
    case 'greater': return value > threshold;
    case 'less': return value < threshold;
    case 'equal': return Math.abs(value - threshold) < 1;
    default: return false;
  }
}

interface ActorAction {
  type: string;
  intensity: number;
  duration: number;
}

interface MediaStrategy {
  focus: string;
  tone: string;
}

interface ImpactCondition {
  type: string;
  value: any;
}

interface CrisisScenario {
  id: string;
  triggers: any[];
}

interface OpportunityWindow {
  id: string;
  conditions: any[];
}