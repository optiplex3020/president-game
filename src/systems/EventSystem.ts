/**
 * SYSTÈME D'ÉVÉNEMENTS DYNAMIQUES ET CONSÉQUENCES
 * 
 * Génère et gère des événements politiques réalistes :
 * - Événements procéduraux basés sur le contexte
 * - Chaînes de conséquences complexes
 * - Réactions en temps réel des acteurs
 * - Narratifs médiatiques dynamiques
 */

import { create } from 'zustand';
import type { GameState, GameEvent, EventOption, ActorReaction } from './GameCore';

export interface EventSystemState {
  // Événements actifs et en attente
  activeEvents: GameEvent[];
  pendingEvents: GameEvent[];
  eventQueue: ScheduledEvent[];
  
  // Templates d'événements pour génération procédurale
  eventTemplates: EventTemplate[];
  
  // Chaînes de conséquences
  consequenceChains: ConsequenceChain[];
  
  // Contexte pour génération d'événements
  context: EventContext;
  
  // Narratifs en cours
  narratives: MediaNarrative[];
}

export interface EventTemplate {
  id: string;
  type: 'crisis' | 'opportunity' | 'routine' | 'scandal' | 'external';
  category: string;
  
  // Conditions de déclenchement
  triggers: {
    indicators?: Record<string, { min?: number; max?: number }>;
    dateRange?: { start: Date; end: Date };
    seasonality?: number[]; // Mois favorables
    precedingEvents?: string[];
    probability?: number;
  };
  
  // Template de génération
  template: {
    titleTemplates: string[];
    descriptionTemplates: string[];
    optionTemplates: EventOptionTemplate[];
    stakeholderTemplates: string[];
  };
  
  // Paramètres de difficulté
  difficulty: {
    base: number; // 0-100
    scalingFactors: string[]; // Indicateurs qui modifient la difficulté
    timeConstraint?: number; // Heures pour répondre
  };
  
  // Méta-données
  frequency: number; // Combien de fois peut se déclencher par an
  exclusivity?: string[]; // Incompatible avec d'autres événements
  prerequisites?: string[]; // Événements/conditions requis
}

export interface EventOptionTemplate {
  id: string;
  type: 'diplomatic' | 'authoritarian' | 'economic' | 'social' | 'populist';
  titleTemplate: string;
  descriptionTemplate: string;
  
  // Coûts dynamiques
  costFormula: {
    politicalCapital?: string;
    budget?: string;
    time?: string;
    requirements?: Record<string, string>;
  };
  
  // Formules de conséquences
  consequenceFormulas: {
    immediate?: ConsequenceFormula[];
    shortTerm?: ConsequenceFormula[];
    mediumTerm?: ConsequenceFormula[];
    longTerm?: ConsequenceFormula[];
  };
  
  // Réactions des acteurs
  actorReactionFormulas: Record<string, ActorReactionFormula>;
}

export interface ConsequenceFormula {
  target: string; // Indicateur ciblé
  formula: string; // Expression mathématique
  conditions?: string; // Conditions d'application
  probability?: number; // Probabilité d'occurrence
  description: string; // Description narrative
}

export interface ActorReactionFormula {
  supportFormula: string; // Calcul du niveau de soutien
  actionProbability: Record<string, string>; // Probabilités d'actions
  statementTemplates: string[]; // Templates de déclarations
}

export interface ScheduledEvent {
  eventId: string;
  scheduledDate: Date;
  parameters: Record<string, any>; // Paramètres spécifiques à l'instance
  priority: number; // 1-10, priorité d'exécution
}

export interface ConsequenceChain {
  id: string;
  name: string;
  description: string;
  
  // Déclencheur initial
  trigger: {
    eventId: string;
    optionId: string;
    conditions?: Record<string, any>;
  };
  
  // Séquence d'événements
  sequence: ChainEvent[];
  
  // État de la chaîne
  status: 'inactive' | 'active' | 'completed' | 'interrupted';
  currentStep: number;
  startDate?: Date;
}

export interface ChainEvent {
  delay: number; // Jours après l'événement précédent
  eventId: string;
  parameters?: Record<string, any>;
  conditions?: Record<string, any>; // Conditions pour déclencher
  probability?: number; // Probabilité de déclenchement
}

export interface EventContext {
  // Contexte temporel
  seasonality: number; // 0-11 (mois)
  mandatePhase: string;
  daysInOffice: number;
  
  // Contexte politique
  popularityTrend: number;
  oppositionStrength: number;
  mediaAttention: number;
  crisisLevel: number;
  
  // Contexte économique
  economicCycle: string;
  unemploymentTrend: number;
  inflationLevel: number;
  
  // Contexte social
  socialTension: number;
  strikeActivity: number;
  publicMood: string;
  
  // Contexte international
  europeanStability: number;
  globalTensions: number;
  tradeEnvironment: number;
  
  // Historique récent
  recentDecisions: string[];
  activeNarratives: string[];
  pendingPromises: string[];
}

export interface MediaNarrative {
  id: string;
  theme: string;
  intensity: number; // 0-100
  sentiment: number; // -100 à +100
  duration: number; // Jours restants
  
  outlets: string[]; // IDs des médias qui portent le narratif
  keyPhrases: string[];
  evolutionPattern: 'growing' | 'stable' | 'declining';
  
  // Impact sur les événements
  eventModifiers: {
    probability: number; // Modificateur de probabilité
    difficulty: number; // Modificateur de difficulté
    options: string[]; // Options rendues disponibles/indisponibles
  };
}

// Événements prédéfinis ultra-réalistes
export const REALISTIC_EVENTS: EventTemplate[] = [
  {
    id: 'pension_reform_protests',
    type: 'crisis',
    category: 'social_policy',
    
    triggers: {
      indicators: {
        'social.unrest': { min: 25 },
        'actors.unions.strength': { min: 40 }
      },
      seasonality: [9, 10, 11, 1, 2, 3], // Rentrée et hiver
      probability: 0.3
    },
    
    template: {
      titleTemplates: [
        'Manifestations contre la réforme des retraites',
        'Grève générale : {strikers} millions de manifestants',
        'Blocages dans les transports et services publics'
      ],
      descriptionTemplates: [
        'Les syndicats appellent à une mobilisation massive contre votre projet de réforme des retraites. {unions} syndicats menacent de paralyser le pays si vous ne reculez pas sur {controversial_measures}.',
        'La contestation s\'amplifie : {strike_days} jours de grève prévus dans les transports, l\'éducation et les hôpitaux. L\'opinion publique se divise ({opposition_rate}% d\'opposition selon les sondages).'
      ],
      optionTemplates: [
        {
          id: 'negotiate_unions',
          type: 'diplomatic',
          titleTemplate: 'Négocier avec les syndicats',
          descriptionTemplate: 'Ouvrir des discussions pour trouver un compromis acceptable',
          costFormula: {
            politicalCapital: '15 + unrest_level * 0.3',
            time: '7 + negotiation_rounds * 2'
          },
          consequenceFormulas: {
            immediate: [
              {
                target: 'social.unrest',
                formula: '-10 - negotiation_skill * 0.2',
                probability: 0.8,
                description: 'Les manifestations s\'apaisent temporairement'
              }
            ],
            shortTerm: [
              {
                target: 'indicators.popularity.overall',
                formula: 'compromise_quality * 0.15 - 5',
                description: 'Impact sur la popularité selon la qualité du compromis'
              }
            ]
          },
          actorReactionFormulas: {
            'unions': {
              supportFormula: '30 + compromise_quality * 0.4',
              actionProbability: {
                'end_strikes': '0.6 + compromise_quality * 0.01'
              },
              statementTemplates: [
                'Nous saluons l\'ouverture du dialogue',
                'C\'est un premier pas, mais insuffisant'
              ]
            }
          }
        },
        {
          id: 'force_through',
          type: 'authoritarian',
          titleTemplate: 'Utiliser le 49.3',
          descriptionTemplate: 'Faire passer la réforme en force, sans vote parlementaire',
          costFormula: {
            politicalCapital: '25 + opposition_strength * 0.5'
          },
          consequenceFormulas: {
            immediate: [
              {
                target: 'social.unrest',
                formula: '+15 + current_unrest * 0.3',
                probability: 0.95,
                description: 'Les manifestations s\'intensifient violemment'
              }
            ],
            mediumTerm: [
              {
                target: 'actors.parties.opposition.relationship',
                formula: '-20 - current_relationship * 0.1',
                description: 'Relations dégradées avec l\'opposition'
              }
            ]
          },
          actorReactionFormulas: {
            'opposition_parties': {
              supportFormula: '-40 - democratic_legitimacy * 0.2',
              actionProbability: {
                'motion_censure': '0.8',
                'media_campaign': '0.95'
              },
              statementTemplates: [
                'Un déni de démocratie inacceptable',
                'Nous déposerons une motion de censure'
              ]
            }
          }
        },
        {
          id: 'postpone_reform',
          type: 'social',
          titleTemplate: 'Reporter la réforme',
          descriptionTemplate: 'Suspendre temporairement le projet pour apaiser les tensions',
          costFormula: {
            politicalCapital: '20',
            budget: 'reform_savings * -0.5' // Perte des économies prévues
          },
          consequenceFormulas: {
            immediate: [
              {
                target: 'social.unrest',
                formula: '-25',
                probability: 0.9,
                description: 'Apaisement immédiat des tensions'
              }
            ],
            longTerm: [
              {
                target: 'mechanics.mandateObjectives.pension_reform.status',
                formula: '"failed"',
                description: 'Objectif de réforme des retraites compromis'
              }
            ]
          },
          actorReactionFormulas: {
            'business_groups': {
              supportFormula: '-15 - economic_pressures * 0.2',
              statementTemplates: [
                'Une décision regrettable pour les finances publiques',
                'Il faudra bien réformer un jour'
              ]
            }
          }
        }
      ],
      stakeholderTemplates: [
        'unions', 'opposition_parties', 'business_groups', 'media_outlets'
      ]
    },
    
    difficulty: {
      base: 75,
      scalingFactors: ['social.unrest', 'actors.unions.strength'],
      timeConstraint: 72 // 3 jours pour réagir
    },
    
    frequency: 2, // Max 2 fois par an
    prerequisites: ['pension_reform_announced']
  },

  {
    id: 'economic_crisis_response',
    type: 'crisis',
    category: 'economic',
    
    triggers: {
      indicators: {
        'economy.gdpGrowth': { max: -0.5 },
        'economy.unemployment': { min: 8.5 }
      },
      probability: 0.4
    },
    
    template: {
      titleTemplates: [
        'Récession économique : {gdp_decline}% de décroissance',
        'Crise économique : {job_losses} emplois menacés',
        'Les marchés s\'affolent : CAC 40 en chute de {market_drop}%'
      ],
      descriptionTemplates: [
        'L\'économie française entre en récession avec {gdp_decline}% de décroissance ce trimestre. Les entreprises annoncent {job_losses} suppressions d\'emplois et les marchés chutent de {market_drop}%.',
        'La crise s\'aggrave : {sectors_affected} secteurs en difficulté, le chômage menace d\'atteindre {unemployment_projection}%. Les partenaires européens s\'inquiètent de la contagion.'
      ],
      optionTemplates: [
        {
          id: 'stimulus_package',
          type: 'economic',
          titleTemplate: 'Plan de relance {stimulus_amount} milliards €',
          descriptionTemplate: 'Lancer un plan de relance massif pour soutenir l\'économie',
          costFormula: {
            budget: '50 + crisis_severity * 2',
            politicalCapital: '10'
          },
          consequenceFormulas: {
            shortTerm: [
              {
                target: 'economy.gdpGrowth',
                formula: '+0.8 + stimulus_multiplier * 0.3',
                probability: 0.7,
                description: 'Relance de la croissance économique'
              }
            ],
            mediumTerm: [
              {
                target: 'publicFinances.debt.gdpRatio',
                formula: '+3 + stimulus_amount * 0.05',
                description: 'Augmentation de la dette publique'
              }
            ]
          },
          actorReactionFormulas: {
            'business_groups': {
              supportFormula: '40 + stimulus_business_focus * 0.3',
              statementTemplates: [
                'Une réponse nécessaire et bienvenue',
                'Il faut soutenir nos entreprises'
              ]
            }
          }
        },
        {
          id: 'austerity_measures',
          type: 'economic',
          titleTemplate: 'Mesures d\'austérité budgétaire',
          descriptionTemplate: 'Réduire les dépenses publiques pour rassurer les marchés',
          costFormula: {
            politicalCapital: '30 + social_spending_cuts * 0.5'
          },
          consequenceFormulas: {
            immediate: [
              {
                target: 'actors.markets.bondYield',
                formula: '-0.3 - market_confidence * 0.01',
                description: 'Baisse des taux d\'intérêt'
              }
            ],
            shortTerm: [
              {
                target: 'social.unrest',
                formula: '+20 + spending_cuts * 0.4',
                description: 'Mécontentement social'
              }
            ]
          },
          actorReactionFormulas: {
            'unions': {
              supportFormula: '-50 - public_sector_cuts * 0.3',
              actionProbability: {
                'organize_protests': '0.8'
              },
              statementTemplates: [
                'L\'austérité n\'est pas la solution',
                'Vous sacrifiez les services publics'
              ]
            }
          }
        }
      ],
      stakeholderTemplates: [
        'business_groups', 'unions', 'markets', 'european_partners'
      ]
    },
    
    difficulty: {
      base: 85,
      scalingFactors: ['economy.crisis_severity', 'publicFinances.debt.gdpRatio']
    },
    
    frequency: 1
  },

  {
    id: 'terrorist_attack',
    type: 'crisis',
    category: 'security',
    
    triggers: {
      indicators: {
        'social.security_threat': { min: 30 }
      },
      probability: 0.1, // Faible mais possible
      seasonality: [7, 8, 11, 12] // Périodes à risque
    },
    
    template: {
      titleTemplates: [
        'Attentat terroriste : {casualties} victimes',
        'Attaque à {location} : le pays sous le choc',
        'Terrorisme : état d\'urgence décrété ?'
      ],
      descriptionTemplates: [
        'Un attentat terroriste a fait {casualties} victimes à {location}. L\'émotion nationale est immense et l\'opposition demande des comptes sur les failles sécuritaires.',
        'L\'attaque revendiquée par {terrorist_group} relance le débat sur la sécurité. Les services de renseignement sont mis en cause.'
      ],
      optionTemplates: [
        {
          id: 'state_of_emergency',
          type: 'authoritarian',
          titleTemplate: 'Déclarer l\'état d\'urgence',
          descriptionTemplate: 'Renforcer les pouvoirs policiers et limiter les libertés',
          costFormula: {
            politicalCapital: '15'
          },
          consequenceFormulas: {
            immediate: [
              {
                target: 'indicators.popularity.overall',
                formula: '+8 + national_unity * 0.2',
                probability: 0.8,
                description: 'Soutien populaire dans l\'émotion'
              }
            ],
            longTerm: [
              {
                target: 'social.democratic_freedoms',
                formula: '-10 - emergency_duration * 0.5',
                description: 'Érosion des libertés démocratiques'
              }
            ]
          },
          actorReactionFormulas: {
            'civil_liberties_groups': {
              supportFormula: '-60 - emergency_powers * 0.3',
              actionProbability: {
                'legal_challenges': '0.9'
              },
              statementTemplates: [
                'L\'état d\'urgence permanent menace nos libertés',
                'La sécurité ne justifie pas tout'
              ]
            }
          }
        }
      ],
      stakeholderTemplates: [
        'security_services', 'opposition_parties', 'civil_liberties_groups', 'media'
      ]
    },
    
    difficulty: {
      base: 90,
      scalingFactors: ['attack_severity', 'previous_attacks']
    },
    
    frequency: 0.5 // Max 1 tous les 2 ans
  }
];

// Store du système d'événements
export const useEventSystem = create<EventSystemState & {
  // Actions principales
  generateEvent: (context: EventContext) => GameEvent | null;
  processEvent: (eventId: string, optionId: string) => void;
  scheduleEvent: (eventId: string, delay: number, parameters?: any) => void;
  
  // Système de conséquences
  applyConsequences: (consequences: ConsequenceFormula[], context: any) => void;
  checkConsequenceChains: () => void;
  
  // Gestion des narratifs
  updateNarratives: () => void;
  generateMediaReaction: (event: GameEvent, option: EventOption) => string[];
  
  // Système d'IA
  calculateActorReactions: (event: GameEvent, option: EventOption) => Record<string, ActorReaction>;
  predictEventOutcomes: (event: GameEvent) => Record<string, number>;
}>((set, get) => ({
  activeEvents: [],
  pendingEvents: [],
  eventQueue: [],
  eventTemplates: REALISTIC_EVENTS,
  consequenceChains: [],
  context: {
    seasonality: new Date().getMonth(),
    mandatePhase: 'honeymoon',
    daysInOffice: 1,
    popularityTrend: 0,
    oppositionStrength: 45,
    mediaAttention: 50,
    crisisLevel: 20,
    economicCycle: 'recovery',
    unemploymentTrend: 0,
    inflationLevel: 2.1,
    socialTension: 30,
    strikeActivity: 2,
    publicMood: 'cautious_optimism',
    europeanStability: 75,
    globalTensions: 40,
    tradeEnvironment: 65,
    recentDecisions: [],
    activeNarratives: [],
    pendingPromises: []
  },
  narratives: [],

  generateEvent: (context: EventContext) => {
    const templates = get().eventTemplates;
    const viableTemplates = templates.filter(template => {
      // Vérifie les conditions de déclenchement
      if (template.triggers.indicators) {
        for (const [indicator, range] of Object.entries(template.triggers.indicators)) {
          // Ici on ferait la vérification avec les indicateurs réels
          // Pour l'exemple, on simplifie
        }
      }
      
      if (template.triggers.seasonality) {
        if (!template.triggers.seasonality.includes(context.seasonality)) {
          return false;
        }
      }
      
      if (template.triggers.probability) {
        if (Math.random() > template.triggers.probability) {
          return false;
        }
      }
      
      return true;
    });

    if (viableTemplates.length === 0) return null;

    // Sélectionne un template aléatoire pondéré par la probabilité
    const selectedTemplate = viableTemplates[Math.floor(Math.random() * viableTemplates.length)];
    
    // Génère l'événement à partir du template
    return generateEventFromTemplate(selectedTemplate, context);
  },

  processEvent: (eventId, optionId) => {
    const event = get().activeEvents.find(e => e.id === eventId);
    const option = event?.options.find(o => o.id === optionId);
    
    if (!event || !option) return;

    // Applique les conséquences
    if (option.consequences) {
      Object.entries(option.consequences).forEach(([timeframe, consequences]) => {
        const delay = getDelayForTimeframe(timeframe);
        setTimeout(() => {
          get().applyConsequences(consequences as ConsequenceFormula[], { event, option });
        }, delay);
      });
    }

    // Calcule les réactions des acteurs
    const reactions = get().calculateActorReactions(event, option);
    
    // Génère les réactions médiatiques
    const mediaReactions = get().generateMediaReaction(event, option);
    
    // Met à jour les narratifs
    get().updateNarratives();
    
    // Vérifie les chaînes de conséquences
    get().checkConsequenceChains();

    // Retire l'événement des événements actifs
    set(state => ({
      activeEvents: state.activeEvents.filter(e => e.id !== eventId)
    }));
  },

  scheduleEvent: (eventId, delay, parameters = {}) => {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + delay);

    set(state => ({
      eventQueue: [...state.eventQueue, {
        eventId,
        scheduledDate,
        parameters,
        priority: 5 // Priorité par défaut
      }]
    }));
  },

  applyConsequences: (consequences, context) => {
    consequences.forEach(consequence => {
      if (Math.random() <= (consequence.probability || 1)) {
        // Évalue la formule mathématique
        const value = evaluateFormula(consequence.formula, context);
        
        // Applique le changement à l'indicateur ciblé
        // Ici on ferait l'update du store principal avec la valeur calculée
        console.log(`Applying consequence: ${consequence.target} = ${value}`);
      }
    });
  },

  checkConsequenceChains: () => {
    const chains = get().consequenceChains.filter(chain => chain.status === 'active');
    
    chains.forEach(chain => {
      const currentEvent = chain.sequence[chain.currentStep];
      if (currentEvent && shouldTriggerChainEvent(currentEvent)) {
        get().scheduleEvent(currentEvent.eventId, currentEvent.delay, currentEvent.parameters);
        
        // Avance dans la chaîne
        set(state => ({
          consequenceChains: state.consequenceChains.map(c => 
            c.id === chain.id 
              ? { ...c, currentStep: c.currentStep + 1 }
              : c
          )
        }));
      }
    });
  },

  updateNarratives: () => {
    set(state => ({
      narratives: state.narratives.map(narrative => ({
        ...narrative,
        duration: Math.max(0, narrative.duration - 1),
        intensity: narrative.evolutionPattern === 'declining' 
          ? Math.max(0, narrative.intensity - 5)
          : narrative.intensity
      })).filter(n => n.duration > 0)
    }));
  },

  generateMediaReaction: (event, option) => {
    // Génère des réactions médiatiques réalistes basées sur l'événement et l'option choisie
    const reactions: string[] = [];
    
    // Logic complexe pour générer des réactions selon le type de média, 
    // leur ligne éditoriale, etc.
    
    return reactions;
  },

  calculateActorReactions: (event, option) => {
    const reactions: Record<string, ActorReaction> = {};
    
    // Pour chaque stakeholder de l'événement
    event.stakeholders.forEach(actorId => {
      const reactionFormula = option.actorReactionFormulas?.[actorId];
      if (reactionFormula) {
        // Calcule la réaction basée sur la formule
        const support = evaluateFormula(reactionFormula.supportFormula, { event, option });
        
        reactions[actorId] = {
          type: support > 0 ? 'support' : 'oppose',
          intensity: Math.abs(support),
          relationshipChange: support * 0.1,
          publicStatement: selectRandomTemplate(reactionFormula.statementTemplates),
          actions: [] // Calcule les actions basées sur les probabilités
        };
      }
    });
    
    return reactions;
  },

  predictEventOutcomes: (event) => {
    const outcomes: Record<string, number> = {};
    
    event.options.forEach(option => {
      // Calcule la probabilité de succès de chaque option
      const baseSuccess = option.successRate || 50;
      const riskPenalty = (option.riskFactors?.length || 0) * 10;
      outcomes[option.id] = Math.max(0, baseSuccess - riskPenalty);
    });
    
    return outcomes;
  }
}));

// Fonctions utilitaires
function generateEventFromTemplate(template: EventTemplate, context: EventContext): GameEvent {
  return {
    id: `${template.id}_${Date.now()}`,
    type: template.type as any,
    title: fillTemplate(selectRandomTemplate(template.template.titleTemplates), context),
    description: fillTemplate(selectRandomTemplate(template.template.descriptionTemplates), context),
    triggers: [],
    probability: template.triggers.probability || 100,
    urgency: 'immediate',
    options: template.template.optionTemplates.map(optTemplate => ({
      id: optTemplate.id,
      title: fillTemplate(optTemplate.titleTemplate, context),
      description: fillTemplate(optTemplate.descriptionTemplate, context),
      requirements: evaluateRequirements(optTemplate.costFormula, context),
      consequences: {
        immediate: evaluateConsequenceSet(optTemplate.consequenceFormulas.immediate || [], context),
        shortTerm: evaluateConsequenceSet(optTemplate.consequenceFormulas.shortTerm || [], context),
        mediumTerm: evaluateConsequenceSet(optTemplate.consequenceFormulas.mediumTerm || [], context),
        longTerm: evaluateConsequenceSet(optTemplate.consequenceFormulas.longTerm || [], context)
      },
      reactions: {},
      successRate: 70, // Valeur par défaut
      riskFactors: []
    })),
    stakeholders: template.template.stakeholderTemplates,
    domains: ['economy'], // Simplifié pour l'exemple
    deadline: template.difficulty.timeConstraint 
      ? new Date(Date.now() + template.difficulty.timeConstraint * 60 * 60 * 1000)
      : undefined
  };
}

function selectRandomTemplate(templates: string[]): string {
  return templates[Math.floor(Math.random() * templates.length)];
}

function fillTemplate(template: string, context: any): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return context[key] || match;
  });
}

function evaluateFormula(formula: string, context: any): number {
  // Ici on implémenterait un évaluateur d'expressions mathématiques
  // Pour l'exemple, retourne une valeur aléatoire
  return Math.random() * 20 - 10;
}

function evaluateRequirements(costFormula: any, context: any): any {
  // Évalue les formules de coût
  return {};
}

function evaluateConsequenceSet(formulas: ConsequenceFormula[], context: any): any {
  // Évalue les conséquences
  return {};
}

function getDelayForTimeframe(timeframe: string): number {
  switch (timeframe) {
    case 'immediate': return 0;
    case 'shortTerm': return 1000 * 60 * 60 * 24 * 7; // 1 semaine
    case 'mediumTerm': return 1000 * 60 * 60 * 24 * 90; // 3 mois
    case 'longTerm': return 1000 * 60 * 60 * 24 * 365; // 1 an
    default: return 0;
  }
}

function shouldTriggerChainEvent(chainEvent: ChainEvent): boolean {
  // Vérifie les conditions et probabilités
  return Math.random() <= (chainEvent.probability || 1);
}