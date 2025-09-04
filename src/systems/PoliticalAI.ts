/**
 * INTELLIGENCE ARTIFICIELLE POLITIQUE AVANCÉE
 * 
 * Système d'IA sophistiqué simulant le comportement des acteurs politiques français :
 * - Opposition parlementaire et extra-parlementaire
 * - Médias avec leurs lignes éditoriales
 * - Syndicats et groupes de pression
 * - Opinion publique et réseaux sociaux
 */

import { create } from 'zustand';
import type { GameState, PoliticalActor, MediaOutlet } from './GameCore';

// IA de l'opposition politique
export interface OppositionAI {
  // Stratégies principales
  strategy: OppositionStrategy;
  tactics: OppositionTactic[];
  
  // État cognitif
  perception: PerceptionState;
  planning: StrategicPlanning;
  
  // Capacités d'action
  resources: PoliticalResources;
  networks: PoliticalNetwork[];
  
  // Apprentissage et adaptation
  memory: PoliticalMemory;
  learningRate: number;
}

export type OppositionStrategy = 
  | 'systematic_opposition' // Opposition systématique
  | 'constructive_criticism' // Critique constructive
  | 'opportunistic_strikes' // Coups opportunistes
  | 'coalition_building' // Construction d'alliances
  | 'popular_mobilization' // Mobilisation populaire
  | 'institutional_warfare'; // Guerre institutionnelle

export interface OppositionTactic {
  id: string;
  type: TacticType;
  target: TacticTarget;
  timing: TacticTiming;
  resources: number; // Coût en ressources
  effectiveness: number; // Efficacité estimée
  risks: TacticRisk[];
}

export type TacticType = 
  | 'parliamentary_question' | 'amendment_storm' | 'filibuster'
  | 'media_campaign' | 'investigation_demand' | 'motion_censure'
  | 'street_protest' | 'petition_campaign' | 'legal_challenge'
  | 'coalition_proposal' | 'expert_testimony' | 'scandal_revelation';

export interface PerceptionState {
  // Évaluation du gouvernement
  governmentStrength: number; // 0-100
  vulnerabilities: string[];
  opportunities: string[];
  
  // Analyse de l'opinion publique
  publicMood: PublicMoodAssessment;
  electoralProspects: ElectoralCalculation;
  
  // Évaluation des alliés/rivaux
  allyStrength: Record<string, number>;
  rivalThreats: Record<string, number>;
}

export interface StrategicPlanning {
  // Objectifs à court/moyen/long terme
  shortTermGoals: PoliticalGoal[];
  mediumTermGoals: PoliticalGoal[];
  longTermGoals: PoliticalGoal[];
  
  // Plans d'action
  activeCampaigns: Campaign[];
  plannedOperations: PlannedOperation[];
  
  // Calculs stratégiques
  powerBalance: PowerBalanceAnalysis;
  timing: TimingAnalysis;
}

export interface PoliticalGoal {
  id: string;
  description: string;
  priority: number; // 1-10
  progress: number; // 0-100
  deadline?: Date;
  dependencies: string[];
}

export interface Campaign {
  id: string;
  theme: string;
  targets: string[]; // Cibles (ministres, politiques, etc.)
  channels: string[]; // Médias, réseaux sociaux, etc.
  duration: number; // En jours
  budget: number;
  expectedImpact: ImpactProjection;
}

// IA des médias
export interface MediaAI {
  // Ligne éditoriale et biais
  editorialLine: EditorialOrientation;
  bias: MediaBias;
  
  // Stratégie de couverture
  coverageStrategy: CoverageStrategy;
  investigationPriorities: InvestigationPriority[];
  
  // Algorithmes de sélection des sujets
  newsValue: NewsValueAlgorithm;
  agendaSetting: AgendaSettingMechanism;
  
  // Interactions avec les sources
  sourceNetwork: SourceNetwork;
  leakChannels: LeakChannel[];
}

export interface EditorialOrientation {
  political: number; // -100 (gauche) à +100 (droite)
  economic: number; // -100 (étatiste) à +100 (libéral)
  social: number; // -100 (conservateur) à +100 (progressiste)
  
  // Priorités thématiques
  priorities: {
    politics: number;
    economy: number;
    society: number;
    international: number;
    culture: number;
  };
}

export interface NewsValueAlgorithm {
  // Critères de sélection des nouvelles
  proximity: number; // Proximité avec le public
  prominence: number; // Importance des personnalités
  timeliness: number; // Actualité
  impact: number; // Impact sur la société
  conflict: number; // Potentiel de conflit
  unusualness: number; // Caractère inhabituel
  emotion: number; // Charge émotionnelle
}

// Modèles comportementaux spécialisés
export const FRENCH_OPPOSITION_MODELS: Record<string, OppositionAI> = {
  // Gauche radicale - Style Mélenchon/LFI
  radical_left: {
    strategy: 'systematic_opposition',
    tactics: [
      {
        id: 'populist_rhetoric',
        type: 'media_campaign',
        target: { type: 'government_policy', specifics: ['economic', 'social'] },
        timing: { phase: 'immediate', duration: 14 },
        resources: 30,
        effectiveness: 75,
        risks: [{ type: 'credibility_loss', probability: 0.2 }]
      },
      {
        id: 'assembly_obstruction',
        type: 'filibuster',
        target: { type: 'legislation', specifics: ['controversial_bills'] },
        timing: { phase: 'parliamentary', duration: 7 },
        resources: 60,
        effectiveness: 85,
        risks: [{ type: 'public_annoyance', probability: 0.4 }]
      }
    ],
    perception: {
      governmentStrength: 40,
      vulnerabilities: ['social_policies', 'worker_rights', 'inequality'],
      opportunities: ['economic_crisis', 'social_unrest'],
      publicMood: { anger: 60, hope: 30, fear: 70 },
      electoralProspects: { nextElection: -5, midTerm: 12 },
      allyStrength: { 'greens': 40, 'communists': 60 },
      rivalThreats: { 'far_right': 80, 'center': 45 }
    },
    planning: {
      shortTermGoals: [
        {
          id: 'block_pension_reform',
          description: 'Empêcher la réforme des retraites',
          priority: 10,
          progress: 25,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          dependencies: ['union_alliance', 'public_support']
        }
      ],
      mediumTermGoals: [
        {
          id: 'build_left_coalition',
          description: 'Construire une coalition de gauche unie',
          priority: 8,
          progress: 15,
          dependencies: ['ideological_alignment', 'leadership_agreement']
        }
      ],
      longTermGoals: [
        {
          id: 'presidential_campaign',
          description: 'Préparer la campagne présidentielle',
          priority: 9,
          progress: 5,
          dependencies: ['party_unity', 'program_development']
        }
      ],
      activeCampaigns: [
        {
          id: 'anti_austerity',
          theme: 'Contre l\'austérité néolibérale',
          targets: ['finance_minister', 'economic_policies'],
          channels: ['social_media', 'rallies', 'interviews'],
          duration: 30,
          budget: 150000,
          expectedImpact: { popularity: -8, mobilization: 15 }
        }
      ],
      plannedOperations: [],
      powerBalance: { parliamentary: 0.15, popular: 0.25, media: 0.30 },
      timing: { currentPhase: 'mobilization', nextWindow: 'budget_debate' }
    },
    resources: {
      financial: 2500000, // Budget annuel
      human: 120, // Équipe
      media: 60, // Accès médiatique
      grassroots: 85 // Base militante
    },
    networks: [
      {
        id: 'union_alliance',
        type: 'labor',
        strength: 70,
        reliability: 85,
        reach: ['public_sector', 'transport', 'education']
      },
      {
        id: 'student_movements',
        type: 'social',
        strength: 45,
        reliability: 60,
        reach: ['universities', 'youth']
      }
    ],
    memory: {
      successfulTactics: ['street_mobilization', 'media_appearances'],
      failedTactics: ['institutional_cooperation'],
      governmentWeaknesses: ['unemployment', 'inequality', 'europe'],
      publicSentiments: { 'anti_establishment': 0.7, 'social_justice': 0.8 }
    },
    learningRate: 0.15
  },

  // Droite républicaine - Style LR
  center_right: {
    strategy: 'constructive_criticism',
    tactics: [
      {
        id: 'policy_expertise',
        type: 'expert_testimony',
        target: { type: 'policy_area', specifics: ['economy', 'security'] },
        timing: { phase: 'committee', duration: 10 },
        resources: 40,
        effectiveness: 65,
        risks: [{ type: 'technocratic_image', probability: 0.3 }]
      },
      {
        id: 'amendment_proposals',
        type: 'amendment_storm',
        target: { type: 'legislation', specifics: ['all_bills'] },
        timing: { phase: 'parliamentary', duration: 5 },
        resources: 50,
        effectiveness: 70,
        risks: [{ type: 'obstruction_image', probability: 0.25 }]
      }
    ],
    perception: {
      governmentStrength: 55,
      vulnerabilities: ['fiscal_policy', 'security', 'immigration'],
      opportunities: ['economic_expertise', 'governance_experience'],
      publicMood: { anger: 45, hope: 40, fear: 55 },
      electoralProspects: { nextElection: 3, midTerm: -2 },
      allyStrength: { 'centrists': 30, 'moderates': 50 },
      rivalThreats: { 'far_right': 95, 'center': 60 }
    },
    planning: {
      shortTermGoals: [
        {
          id: 'credible_alternative',
          description: 'Être une alternative crédible',
          priority: 9,
          progress: 45,
          dependencies: ['policy_proposals', 'leadership_stability']
        }
      ],
      mediumTermGoals: [
        {
          id: 'reclaim_right',
          description: 'Reconquérir l\'électorat de droite',
          priority: 10,
          progress: 30,
          dependencies: ['differentiation_far_right', 'renewal_program']
        }
      ],
      longTermGoals: [
        {
          id: 'return_to_power',
          description: 'Retour au pouvoir en 2027',
          priority: 10,
          progress: 20,
          dependencies: ['party_renewal', 'coalition_building']
        }
      ],
      activeCampaigns: [
        {
          id: 'responsible_opposition',
          theme: 'Opposition responsable et constructive',
          targets: ['government_excesses', 'policy_improvements'],
          channels: ['parliament', 'traditional_media', 'think_tanks'],
          duration: 60,
          budget: 300000,
          expectedImpact: { credibility: 12, differentiation: 8 }
        }
      ],
      plannedOperations: [],
      powerBalance: { parliamentary: 0.25, popular: 0.20, media: 0.35 },
      timing: { currentPhase: 'preparation', nextWindow: 'economic_measures' }
    },
    resources: {
      financial: 8000000,
      human: 300,
      media: 75,
      grassroots: 55
    },
    networks: [
      {
        id: 'business_networks',
        type: 'economic',
        strength: 80,
        reliability: 70,
        reach: ['employers', 'chambers_commerce', 'business_leaders']
      },
      {
        id: 'local_elected',
        type: 'institutional',
        strength: 90,
        reliability: 85,
        reach: ['mayors', 'regional_councils', 'departments']
      }
    ],
    memory: {
      successfulTactics: ['institutional_work', 'policy_expertise'],
      failedTactics: ['populist_rhetoric', 'radical_positions'],
      governmentWeaknesses: ['economic_management', 'security_issues'],
      publicSentiments: { 'governance_experience': 0.6, 'renewal_need': 0.7 }
    },
    learningRate: 0.12
  }
};

export const FRENCH_MEDIA_MODELS: Record<string, MediaAI> = {
  // Médias de droite - Style Figaro/Europe 1
  conservative_media: {
    editorialLine: {
      political: 65, // Centre-droit
      economic: 75, // Libéral économique
      social: -30, // Plutôt conservateur
      priorities: {
        politics: 85,
        economy: 80,
        society: 60,
        international: 70,
        culture: 40
      }
    },
    bias: {
      confirmationBias: 0.7,
      selectionBias: 0.6,
      framingBias: 0.8,
      sourceCredibility: { government: 0.4, opposition: 0.7, business: 0.9 }
    },
    coverageStrategy: {
      government: 'critical_scrutiny',
      opposition: 'sympathetic_platform',
      scandals: 'investigative_depth',
      economy: 'business_perspective'
    },
    investigationPriorities: [
      {
        id: 'government_spending',
        theme: 'Gabegies publiques',
        resources: 40,
        timeline: 90,
        expectedImpact: 'medium'
      },
      {
        id: 'immigration_issues',
        theme: 'Problèmes d\'immigration',
        resources: 60,
        timeline: 180,
        expectedImpact: 'high'
      }
    ],
    newsValue: {
      proximity: 0.8,
      prominence: 0.9,
      timeliness: 0.7,
      impact: 0.8,
      conflict: 0.9,
      unusualness: 0.5,
      emotion: 0.6
    },
    agendaSetting: {
      priorityThemes: ['economic_freedom', 'security', 'institutional_order'],
      framingStrategy: 'expertise_authority',
      narrativeConsistency: 0.85
    },
    sourceNetwork: {
      government: { access: 0.6, reliability: 0.4 },
      opposition: { access: 0.9, reliability: 0.8 },
      experts: { access: 0.8, reliability: 0.9 },
      business: { access: 0.95, reliability: 0.7 }
    },
    leakChannels: [
      { source: 'opposition_staff', reliability: 0.7 },
      { source: 'business_leaders', reliability: 0.8 },
      { source: 'ministry_advisors', reliability: 0.6 }
    ]
  },

  // Médias de gauche - Style Libération/Mediapart
  progressive_media: {
    editorialLine: {
      political: -70, // Gauche
      economic: -60, // Critique du capitalisme
      social: 80, // Progressiste
      priorities: {
        politics: 90,
        economy: 70,
        society: 95,
        international: 75,
        culture: 80
      }
    },
    bias: {
      confirmationBias: 0.8,
      selectionBias: 0.7,
      framingBias: 0.9,
      sourceCredibility: { government: 0.3, opposition: 0.8, unions: 0.9 }
    },
    coverageStrategy: {
      government: 'systematic_critique',
      opposition: 'coalition_focus',
      scandals: 'power_accountability',
      economy: 'social_impact'
    },
    investigationPriorities: [
      {
        id: 'social_inequalities',
        theme: 'Creusement des inégalités',
        resources: 50,
        timeline: 120,
        expectedImpact: 'high'
      },
      {
        id: 'corporate_influence',
        theme: 'Influence du patronat',
        resources: 70,
        timeline: 200,
        expectedImpact: 'medium'
      }
    ],
    newsValue: {
      proximity: 0.9,
      prominence: 0.6,
      timeliness: 0.8,
      impact: 0.95,
      conflict: 0.8,
      unusualness: 0.7,
      emotion: 0.9
    },
    agendaSetting: {
      priorityThemes: ['social_justice', 'environment', 'democracy'],
      framingStrategy: 'grassroots_voice',
      narrativeConsistency: 0.90
    },
    sourceNetwork: {
      government: { access: 0.4, reliability: 0.3 },
      opposition: { access: 0.9, reliability: 0.8 },
      unions: { access: 0.95, reliability: 0.9 },
      civil_society: { access: 0.9, reliability: 0.8 }
    },
    leakChannels: [
      { source: 'union_leaders', reliability: 0.9 },
      { source: 'civil_servants', reliability: 0.7 },
      { source: 'whistleblowers', reliability: 0.8 }
    ]
  }
};

// Store principal de l'IA politique
export const usePoliticalAI = create<{
  // État des AIs
  oppositionAIs: Record<string, OppositionAI>;
  mediaAIs: Record<string, MediaAI>;
  
  // Moteur de décision
  processAIDecisions: (gameState: GameState) => AIAction[];
  calculateOppositionResponse: (event: any, actor: string) => OppositionResponse;
  generateMediaCoverage: (event: any, outlet: string) => MediaCoverage;
  
  // Apprentissage et adaptation
  updateAIModels: (feedback: AIFeedback[]) => void;
  adaptToPlayerBehavior: (playerPattern: any) => void;
}>((set, get) => ({
  oppositionAIs: FRENCH_OPPOSITION_MODELS,
  mediaAIs: FRENCH_MEDIA_MODELS,

  processAIDecisions: (gameState: GameState) => {
    const actions: AIAction[] = [];
    
    // Traitement des décisions d'opposition
    Object.entries(get().oppositionAIs).forEach(([actorId, ai]) => {
      const response = get().calculateOppositionResponse(gameState, actorId);
      actions.push({
        actorId,
        type: 'opposition_action',
        action: response.primaryAction,
        intensity: response.intensity,
        duration: response.duration
      });
    });

    // Traitement des couvertures médiatiques
    Object.entries(get().mediaAIs).forEach(([outletId, ai]) => {
      const coverage = get().generateMediaCoverage(gameState, outletId);
      actions.push({
        actorId: outletId,
        type: 'media_coverage',
        action: coverage.angle,
        intensity: coverage.intensity,
        duration: coverage.duration
      });
    });

    return actions;
  },

  calculateOppositionResponse: (event: any, actorId: string) => {
    const ai = get().oppositionAIs[actorId];
    if (!ai) return { primaryAction: 'wait', intensity: 0, duration: 0 };

    // Calcul de la réponse basée sur la stratégie et la perception
    const urgency = assessEventUrgency(event, ai.perception);
    const opportunity = assessEventOpportunity(event, ai.planning);
    
    let primaryAction = selectBestTactic(ai.tactics, event, urgency, opportunity);
    let intensity = calculateActionIntensity(ai.strategy, urgency, ai.resources);
    let duration = calculateActionDuration(primaryAction, ai.planning);

    return {
      primaryAction,
      intensity,
      duration,
      supportingActions: selectSupportingTactics(ai.tactics, primaryAction, ai.resources),
      mediaStrategy: designMediaStrategy(ai, event),
      coalitionOpportunities: identifyCoalitionOpportunities(ai, event)
    };
  },

  generateMediaCoverage: (event: any, outletId: string) => {
    const ai = get().mediaAIs[outletId];
    if (!ai) return { angle: 'neutral', intensity: 50, duration: 1 };

    // Calcul de la valeur informative
    const newsValue = calculateNewsValue(event, ai.newsValue);
    
    // Détermination de l'angle éditorial
    const angle = determineEditorialAngle(event, ai.editorialLine, ai.bias);
    
    // Calcul de l'intensité de la couverture
    const intensity = calculateCoverageIntensity(newsValue, ai.bias, event);
    
    // Durée de la couverture
    const duration = calculateCoverageDuration(event, ai.agendaSetting);

    return {
      angle,
      intensity,
      duration,
      focusAreas: identifyFocusAreas(event, ai.editorialLine),
      sources: selectSources(event, ai.sourceNetwork),
      narrative: constructNarrative(event, ai.agendaSetting, angle)
    };
  },

  updateAIModels: (feedback: AIFeedback[]) => {
    // Mise à jour des modèles basée sur les retours
  },

  adaptToPlayerBehavior: (playerPattern: any) => {
    // Adaptation des stratégies AI au comportement du joueur
  }
}));

// Types et interfaces supplémentaires
interface TacticTarget {
  type: string;
  specifics: string[];
}

interface TacticTiming {
  phase: string;
  duration: number;
}

interface TacticRisk {
  type: string;
  probability: number;
}

interface PublicMoodAssessment {
  anger: number;
  hope: number;
  fear: number;
}

interface ElectoralCalculation {
  nextElection: number;
  midTerm: number;
}

interface ImpactProjection {
  popularity?: number;
  mobilization?: number;
  credibility?: number;
  differentiation?: number;
}

interface PoliticalResources {
  financial: number;
  human: number;
  media: number;
  grassroots: number;
}

interface PoliticalNetwork {
  id: string;
  type: string;
  strength: number;
  reliability: number;
  reach: string[];
}

interface PoliticalMemory {
  successfulTactics: string[];
  failedTactics: string[];
  governmentWeaknesses: string[];
  publicSentiments: Record<string, number>;
}

interface PlannedOperation {
  id: string;
  type: string;
  timing: Date;
}

interface PowerBalanceAnalysis {
  parliamentary: number;
  popular: number;
  media: number;
}

interface TimingAnalysis {
  currentPhase: string;
  nextWindow: string;
}

interface MediaBias {
  confirmationBias: number;
  selectionBias: number;
  framingBias: number;
  sourceCredibility: Record<string, number>;
}

interface CoverageStrategy {
  government: string;
  opposition: string;
  scandals: string;
  economy: string;
}

interface InvestigationPriority {
  id: string;
  theme: string;
  resources: number;
  timeline: number;
  expectedImpact: string;
}

interface AgendaSettingMechanism {
  priorityThemes: string[];
  framingStrategy: string;
  narrativeConsistency: number;
}

interface SourceNetwork {
  [key: string]: { access: number; reliability: number; };
}

interface LeakChannel {
  source: string;
  reliability: number;
}

interface AIAction {
  actorId: string;
  type: string;
  action: string;
  intensity: number;
  duration: number;
}

interface OppositionResponse {
  primaryAction: string;
  intensity: number;
  duration: number;
  supportingActions?: string[];
  mediaStrategy?: any;
  coalitionOpportunities?: string[];
}

interface MediaCoverage {
  angle: string;
  intensity: number;
  duration: number;
  focusAreas?: string[];
  sources?: string[];
  narrative?: string;
}

interface AIFeedback {
  actorId: string;
  action: string;
  outcome: string;
  effectiveness: number;
}

// Fonctions utilitaires pour l'IA
function assessEventUrgency(event: any, perception: PerceptionState): number {
  return 50; // Placeholder
}

function assessEventOpportunity(event: any, planning: StrategicPlanning): number {
  return 50; // Placeholder
}

function selectBestTactic(tactics: OppositionTactic[], event: any, urgency: number, opportunity: number): string {
  return tactics[0]?.type || 'wait';
}

function calculateActionIntensity(strategy: OppositionStrategy, urgency: number, resources: PoliticalResources): number {
  return Math.min(100, urgency + (resources.grassroots / 2));
}

function calculateActionDuration(action: string, planning: StrategicPlanning): number {
  return 7; // Durée par défaut en jours
}

function selectSupportingTactics(tactics: OppositionTactic[], primaryAction: string, resources: PoliticalResources): string[] {
  return [];
}

function designMediaStrategy(ai: OppositionAI, event: any): any {
  return { channels: ['social_media'], tone: 'critical' };
}

function identifyCoalitionOpportunities(ai: OppositionAI, event: any): string[] {
  return [];
}

function calculateNewsValue(event: any, algorithm: NewsValueAlgorithm): number {
  return 50; // Placeholder
}

function determineEditorialAngle(event: any, line: EditorialOrientation, bias: MediaBias): string {
  return 'neutral';
}

function calculateCoverageIntensity(newsValue: number, bias: MediaBias, event: any): number {
  return newsValue * (1 + bias.confirmationBias);
}

function calculateCoverageDuration(event: any, agenda: AgendaSettingMechanism): number {
  return 3; // Durée par défaut en jours
}

function identifyFocusAreas(event: any, line: EditorialOrientation): string[] {
  return ['politics'];
}

function selectSources(event: any, network: SourceNetwork): string[] {
  return ['government'];
}

function constructNarrative(event: any, agenda: AgendaSettingMechanism, angle: string): string {
  return 'Standard narrative';
}