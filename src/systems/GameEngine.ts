import { create } from 'zustand';
import type { GameState, GameEvent, Decision, DecisionConsequence, Effects } from '../types/game';
import { clampDayInMandate, DEFAULT_START_DATE, DAYS_PER_MANDATE } from '../config/time';

// Simple générateur local d'événements dynamiques pour éviter les dépendances cassées
function generateDynamicEvent(ctx: {
  popularity: number;
  economicState: { growth: number; unemployment: number; inflation: number };
  socialUnrest: number;
  phase: 'honeymoon' | 'governing' | 'midterm' | 'campaign';
  dayInMandate: number;
}): GameEvent {
  const severity: GameEvent['severity'] = ctx.socialUnrest > 60 || ctx.economicState.unemployment > 9 ? 'major' : 'moderate';
  const id = `auto_evt_${Date.now()}`;
  return {
    id,
    title: severity === 'major' ? 'Tension sociale accrue' : 'Fluctuation politique',
    description:
      severity === 'major'
        ? "Des mouvements sociaux émergent dans plusieurs grandes villes. Des décisions rapides sont attendues."
        : "Des signaux mitigés apparaissent dans l'opinion publique et l'économie.",
    category: severity === 'major' ? 'social' : 'domestic',
    severity,
    triggerDate: new Date(),
    requiresDecision: true,
    timeLimit: 48,
    options: [
      {
        id: 'appease',
        label: 'Apaiser et dialoguer',
        description: "Ouvrir une concertation immédiate avec les parties prenantes",
        consequences: { popularity: 2, socialStability: 8, politicalCapital: -5 },
        consequence: "La situation se détend partiellement après des annonces d'écoute et de méthode.",
        immediateEffects: ['Rencontre avec les partenaires sociaux']
      },
      {
        id: 'firmness',
        label: 'Affirmer la fermeté',
        description: "Rassurer sur la stabilité et maintenir le cap",
        consequences: { popularity: -2, socialStability: -5, politicalCapital: 5 },
        consequence: 'Un message d’autorité est bien reçu par certains, mais crispe la contestation.'
      }
    ]
  };
}

interface GameEngineState {
  // État du jeu
  gameState: GameState;
  currentEvents: GameEvent[];
  pendingDecisions: Decision[];
  
  // Actions du moteur
  advanceTime: (hours?: number) => Promise<void>;
  makeDecision: (decisionId: string, choiceId: string) => Promise<DecisionConsequence>;
  processEvent: (eventId: string, response?: any) => Promise<void>;
  triggerEvent: (event: GameEvent) => void;
  
  // Mécaniques de jeu
  updateIndicators: (changes: Partial<GameState['indicators']>) => void;
  addPoliticalCapital: (amount: number, reason: string) => void;
  spendPoliticalCapital: (amount: number, reason: string) => boolean;
}

// État initial du jeu
const initialGameState: GameState = {
  currentDate: DEFAULT_START_DATE,
  dayInMandate: 1,
  mandate: {
    phase: 'honeymoon' as const,
    timeRemaining: DAYS_PER_MANDATE - 1,
    totalDays: DAYS_PER_MANDATE
  },
  indicators: {
    popularity: {
      overall: 42,
      trend: 0,
      byDemographic: {
        young_adults: 38,
        middle_aged: 45,
        seniors: 48,
        working_class: 35,
        middle_class: 47,
        upper_class: 52
      }
    },
    economy: {
      gdpGrowth: 1.2,
      unemployment: 7.4,
      inflation: 2.8,
      budget: {
        balance: -158000000000, // -158 milliards
        debt: 2800000000000 // 2800 milliards
      }
    },
    social: {
      unrest: 25,
      healthSystem: 72,
      education: 68,
      security: 75
    },
    international: {
      diplomaticRelations: {
        usa: 65,
        germany: 78,
        uk: 58,
        china: 45,
        russia: 32
      },
      europeanInfluence: 72
    }
  },
  politicalCapital: 100, // Capital politique initial
  coalitionStability: 85,
  mediaAttention: 'high' as const
};

export const useGameEngine = create<GameEngineState>((set, get) => ({
  gameState: initialGameState,
  currentEvents: [],
  pendingDecisions: [],

  // Avancer le temps et déclencher des événements
  advanceTime: async (hours = 1) => {
    const { gameState, currentEvents } = get();
    const newDate = new Date(gameState.currentDate);
    newDate.setHours(newDate.getHours() + hours);
    
    const newDayInMandate = clampDayInMandate(DEFAULT_START_DATE, newDate);

    // Déterminer la phase du mandat
    let phase: 'honeymoon' | 'governing' | 'midterm' | 'campaign' = 'honeymoon';
    if (newDayInMandate > 100) phase = 'governing';
    if (newDayInMandate > 800) phase = 'midterm';
    if (newDayInMandate > 1500) phase = 'campaign';

    // Générer des événements aléatoires
    const shouldGenerateEvent = Math.random() < (hours * 0.1); // 10% par heure
    let newEvents = [...currentEvents];
    
    if (shouldGenerateEvent) {
      const newEvent = generateDynamicEvent({
        popularity: gameState.indicators.popularity.overall,
        economicState: {
          growth: gameState.indicators.economy.gdpGrowth,
          unemployment: gameState.indicators.economy.unemployment,
          inflation: gameState.indicators.economy.inflation
        },
        socialUnrest: gameState.indicators.social.unrest,
        phase,
        dayInMandate: newDayInMandate
      });
      newEvents.push(newEvent);
    }

    // Mise à jour naturelle des indicateurs (évolution passive)
    const naturalChanges = {
      popularity: {
        ...gameState.indicators.popularity,
        overall: Math.max(10, Math.min(90, 
          gameState.indicators.popularity.overall + (Math.random() - 0.5) * 0.5
        ))
      },
      economy: {
        ...gameState.indicators.economy,
        gdpGrowth: Math.max(-3, Math.min(5,
          gameState.indicators.economy.gdpGrowth + (Math.random() - 0.5) * 0.1
        )),
        unemployment: Math.max(3, Math.min(15,
          gameState.indicators.economy.unemployment + (Math.random() - 0.5) * 0.1
        ))
      }
    };

    set({
      gameState: {
        ...gameState,
        currentDate: newDate,
        dayInMandate: newDayInMandate,
        mandate: {
          ...gameState.mandate,
          phase,
          timeRemaining: Math.max(0, gameState.mandate.totalDays - newDayInMandate)
        },
        indicators: {
          ...gameState.indicators,
          ...naturalChanges
        }
      },
      currentEvents: newEvents
    });
  },

  // Prendre une décision et calculer les conséquences
  makeDecision: async (decisionId: string, choiceId: string) => {
    const { gameState, pendingDecisions } = get();
    const decision = pendingDecisions.find(d => d.id === decisionId);
    
    if (!decision) {
      throw new Error('Décision non trouvée');
    }

    const choice = decision.options.find(o => o.id === choiceId);
    if (!choice) {
      throw new Error('Option de décision non trouvée');
    }

    // Calculer les conséquences
    const oldStyleDelayed = (choice.delayedEffects || []).filter(
      (d: any): d is { type: string; value: number; delay: number } => d && typeof d === 'object' && 'type' in d
    );

    const consequence: DecisionConsequence = {
      decisionId,
      choiceId,
      effects: {
        popularity: choice.consequences?.popularity || 0,
        politicalCapital: choice.consequences?.politicalCapital || 0,
        economicImpact: choice.consequences?.economicImpact || 0,
        socialStability: choice.consequences?.socialStability || 0
      },
      description: choice.consequence || '',
      immediateEffects: choice.immediateEffects || [],
      delayedEffects: oldStyleDelayed
    };

    // Appliquer les effets standard (compatibilité)
    const newIndicators = { ...gameState.indicators } as GameState['indicators'];
    
    if (consequence.effects.popularity) {
      newIndicators.popularity = {
        ...newIndicators.popularity,
        overall: Math.max(5, Math.min(95, 
          newIndicators.popularity.overall + consequence.effects.popularity
        ))
      };
    }

    if (consequence.effects.socialStability) {
      newIndicators.social = {
        ...newIndicators.social,
        unrest: Math.max(0, Math.min(100,
          newIndicators.social.unrest - consequence.effects.socialStability
        ))
      };
    }

    // Appliquer effets riches sur indicateurs et autres domaines
    let richEffectsApplied: Effects | undefined;

    // 1) Résolution d'outcomes probabilistes si présents
    if (choice.outcomes && choice.outcomes.length > 0) {
      const roll = Math.random();
      let acc = 0;
      let picked = choice.outcomes[choice.outcomes.length - 1];
      for (const o of choice.outcomes) {
        acc += Math.max(0, Math.min(1, o.chance));
        if (roll <= acc) { picked = o; break; }
      }
      applyEffectsToState(newIndicators, picked.effects);
      richEffectsApplied = picked.effects;
      if (picked.description) {
        consequence.description = [consequence.description, picked.description].filter(Boolean).join(' ');
      }
    }

    // 2) Effets détaillés directs
    if (choice.effects) {
      applyEffectsToState(newIndicators, choice.effects);
      richEffectsApplied = { ...(richEffectsApplied || {}), ...choice.effects };
    }

    // Mettre à jour le capital politique (standard + effets riches)
    const politicalDelta = (consequence.effects.politicalCapital || 0) + (richEffectsApplied?.politicalCapitalDelta || 0);
    const newPoliticalCapital = Math.max(0, Math.min(200, gameState.politicalCapital + politicalDelta));

    // Retirer la décision des décisions en attente
    const updatedDecisions = pendingDecisions.filter(d => d.id !== decisionId);

    set({
      gameState: {
        ...gameState,
        indicators: newIndicators,
        politicalCapital: newPoliticalCapital,
        mediaAttention: richEffectsApplied?.mediaAttention || gameState.mediaAttention,
        coalitionStability: Math.max(0, Math.min(100,
          (gameState.coalitionStability || 0) + (richEffectsApplied?.coalitionStability || 0)
        ))
      },
      pendingDecisions: updatedDecisions
    });

    // Programmer les effets retardés (anciens et nouveaux formats)
    if ((choice.delayedEffects && choice.delayedEffects.length) || (consequence.delayedEffects && consequence.delayedEffects.length)) {
      const delayed: any[] = ([] as any[])
        .concat(choice.delayedEffects || [])
        .concat(consequence.delayedEffects || []);
      delayed.forEach(item => {
        if ('afterHours' in item) {
          setTimeout(() => {
            const currentState = get().gameState;
            const delayedIndicators = { ...currentState.indicators } as GameState['indicators'];
            applyEffectsToState(delayedIndicators, item.effects);
            set({ gameState: { ...currentState, indicators: delayedIndicators } });
          }, (item.afterHours || 0) * 1000); // échelle de temps compacte (1h = 1s)
        } else {
          setTimeout(() => {
            const currentState = get().gameState;
            const delayedIndicators = { ...currentState.indicators } as GameState['indicators'];
            if (item.type === 'popularity') {
              delayedIndicators.popularity.overall = Math.max(5, Math.min(95,
                delayedIndicators.popularity.overall + (item.value || 0)
              ));
            }
            if (item.type === 'social_unrest') {
              delayedIndicators.social.unrest = Math.max(0, Math.min(100,
                delayedIndicators.social.unrest + (item.value || 0)
              ));
            }
            set({ gameState: { ...currentState, indicators: delayedIndicators } });
          }, (item.delay || 0) * 1000);
        }
      });
    }

    return consequence;
  },

  // Traiter un événement
  processEvent: async (eventId: string, response?: any) => {
    const { currentEvents, gameState } = get();
    const event = currentEvents.find(e => e.id === eventId);
    
    if (!event) return;

    // Si l'événement nécessite une décision, créer une décision en attente
    if (event.requiresDecision) {
      const decision: Decision = {
        id: `decision_${eventId}`,
        title: event.title,
        description: event.description,
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
        priority: event.severity === 'critical' ? 'urgent' : 'normal',
        category: event.category,
        options: event.options || [
          {
            id: 'accept',
            label: 'Accepter',
            description: 'Accepter la proposition',
            consequences: { popularity: 2, politicalCapital: -5 }
          },
          {
            id: 'reject',
            label: 'Rejeter',
            description: 'Rejeter la proposition',
            consequences: { popularity: -3, politicalCapital: 10 }
          }
        ]
      };

      set({
        pendingDecisions: [...get().pendingDecisions, decision]
      });
    }

    // Appliquer les effets immédiats de l'événement
    if (event.immediateEffects) {
      const newIndicators = { ...gameState.indicators };
      
      event.immediateEffects.forEach(effect => {
        switch (effect.type) {
          case 'popularity':
            newIndicators.popularity.overall = Math.max(5, Math.min(95,
              newIndicators.popularity.overall + effect.value
            ));
            break;
          case 'social_unrest':
            newIndicators.social.unrest = Math.max(0, Math.min(100,
              newIndicators.social.unrest + effect.value
            ));
            break;
        }
      });

      set({
        gameState: {
          ...gameState,
          indicators: newIndicators
        }
      });
    }

    // Retirer l'événement traité
    set({
      currentEvents: currentEvents.filter(e => e.id !== eventId)
    });
  },

  // Déclencher manuellement un événement
  triggerEvent: (event: GameEvent) => {
    set({
      currentEvents: [...get().currentEvents, event]
    });
  },

  // Mettre à jour les indicateurs
  updateIndicators: (changes) => {
    const { gameState } = get();
    set({
      gameState: {
        ...gameState,
        indicators: {
          ...gameState.indicators,
          ...changes
        }
      }
    });
  },

  // Ajouter du capital politique
  addPoliticalCapital: (amount: number, reason: string) => {
    const { gameState } = get();
    const newAmount = Math.min(200, gameState.politicalCapital + amount);
    
    set({
      gameState: {
        ...gameState,
        politicalCapital: newAmount
      }
    });

    console.log(`+${amount} capital politique: ${reason}`);
  },

  // Dépenser du capital politique
  spendPoliticalCapital: (amount: number, reason: string) => {
    const { gameState } = get();
    
    if (gameState.politicalCapital < amount) {
      return false; // Pas assez de capital
    }

    set({
      gameState: {
        ...gameState,
        politicalCapital: gameState.politicalCapital - amount
      }
    });

    console.log(`-${amount} capital politique: ${reason}`);
    return true;
  }
}));

// Utilitaire: applique des Effects riches dans la structure d'indicateurs
function applyEffectsToState(indicators: GameState['indicators'], effects: Effects) {
  if (!effects) return;
  // Popularité
  if (effects.popularity) {
    if (typeof effects.popularity.overall === 'number') {
      indicators.popularity.overall = clamp(indicators.popularity.overall + effects.popularity.overall, 5, 95);
    }
    if (effects.popularity.byDemographic) {
      for (const [k, v] of Object.entries(effects.popularity.byDemographic)) {
        const key = k as keyof typeof indicators.popularity.byDemographic;
        const curr = indicators.popularity.byDemographic[key];
        indicators.popularity.byDemographic[key] = clamp(curr + (v || 0), 0, 100);
      }
    }
  }

  // Économie
  if (effects.economy) {
    if (typeof effects.economy.gdpGrowth === 'number') indicators.economy.gdpGrowth = clamp(effects.economy.gdpGrowth + indicators.economy.gdpGrowth, -5, 7);
    if (typeof effects.economy.unemployment === 'number') indicators.economy.unemployment = clamp(effects.economy.unemployment + indicators.economy.unemployment, 2, 20);
    if (typeof effects.economy.inflation === 'number') indicators.economy.inflation = clamp(effects.economy.inflation + indicators.economy.inflation, -3, 20);
    if (effects.economy.budget) {
      if (typeof effects.economy.budget.balance === 'number') indicators.economy.budget.balance += effects.economy.budget.balance;
      if (typeof effects.economy.budget.debt === 'number') indicators.economy.budget.debt += effects.economy.budget.debt;
    }
  }

  // Social
  if (effects.social) {
    if (typeof effects.social.unrest === 'number') indicators.social.unrest = clamp(indicators.social.unrest + effects.social.unrest, 0, 100);
    if (typeof effects.social.healthSystem === 'number') indicators.social.healthSystem = clamp(indicators.social.healthSystem + effects.social.healthSystem, 0, 100);
    if (typeof effects.social.education === 'number') indicators.social.education = clamp(indicators.social.education + effects.social.education, 0, 100);
    if (typeof effects.social.security === 'number') indicators.social.security = clamp(indicators.social.security + effects.social.security, 0, 100);
  }

  // International
  if (effects.international) {
    if (effects.international.diplomaticRelations) {
      for (const [country, delta] of Object.entries(effects.international.diplomaticRelations)) {
        const curr = indicators.international.diplomaticRelations[country] || 50;
        indicators.international.diplomaticRelations[country] = clamp(curr + (delta || 0), 0, 100);
      }
    }
    if (typeof effects.international.europeanInfluence === 'number') {
      indicators.international.europeanInfluence = clamp(indicators.international.europeanInfluence + effects.international.europeanInfluence, 0, 100);
    }
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
