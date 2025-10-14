import { create } from 'zustand';
import type {
  PoliticalCharacter,
  Relationship,
  CharacterAction,
  CharacterInteraction,
  Secret
} from '../types/characters';
import { PRIME_MINISTER_CANDIDATES, createCharacterFromCandidate } from '../data/primeMinisterCandidates';

interface CharacterEngineState {
  characters: Record<string, PoliticalCharacter>;
  interactions: CharacterInteraction[];
  recentActions: CharacterAction[];

  // Actions
  initializeCharacters: () => void;
  addCharacter: (character: PoliticalCharacter) => void;
  getCharacter: (id: string) => PoliticalCharacter | undefined;
  updateRelationship: (char1Id: string, char2Id: string, changes: Partial<Relationship>) => void;
  simulateInteraction: (participantIds: string[], type: CharacterInteraction['type']) => CharacterInteraction;
  performAction: (action: CharacterAction) => void;
  revealSecret: (secretId: string, revealedById: string) => void;
  simulateCharacterAI: (characterId: string) => CharacterAction | null;
  getRelationship: (char1Id: string, char2Id: string) => Relationship | undefined;
  findAllies: (characterId: string) => PoliticalCharacter[];
  findEnemies: (characterId: string) => PoliticalCharacter[];
}

// Fonction utilitaire pour créer une relation par défaut
function createDefaultRelationship(withCharacterId: string): Relationship {
  return {
    withCharacterId,
    type: 'neutral',
    strength: 50,
    sentiment: 0,
    trust: 50,
    history: [],
    owedFavors: 0,
    receivedFavors: 0,
    sharedSecrets: [],
    publicKnowledge: true
  };
}

function createSupportingCharacter(config: {
  id: string;
  firstName: string;
  lastName: string;
  role: PoliticalCharacter['role'];
  party?: string;
  currentPosition: string;
  biography: string;
  traits: PoliticalCharacter['personality']['traits'];
  motivations: PoliticalCharacter['personality']['motivations'];
  ideology: {
    economic: number;
    social: number;
    europe: number;
    environment: number;
    immigration: number;
  };
}): PoliticalCharacter {
  return {
    id: config.id,
    firstName: config.firstName,
    lastName: config.lastName,
    role: config.role,
    party: config.party,
    currentPosition: config.currentPosition,
    age: 55,
    gender: 'M',
    birthPlace: 'France',
    education: ['ENA'],
    previousPositions: [],
    personality: {
      traits: config.traits,
      motivations: config.motivations,
      psychology: {
        intelligence: 80,
        emotionalStability: 70,
        charisma: 65,
        integrity: 70,
        ambition: 75,
        courage: 65,
        patience: 70
      },
      values: {
        honesty: 65,
        loyalty: 70,
        compassion: 55,
        pragmatism: 70
      }
    },
    relationships: {},
    secrets: [],
    agenda: {
      shortTerm: [
        { goal: 'Influencer les premières décisions', priority: 70, progress: 40 }
      ],
      mediumTerm: [
        { goal: 'Renforcer son camp', priority: 65, progress: 30 }
      ],
      longTerm: [
        { goal: 'Garder une place centrale', priority: 60, ultimateGoal: true }
      ],
      activeStrategies: []
    },
    skills: {
      negotiation: 70,
      rhetoric: 68,
      strategy: 72,
      economics: 65,
      foreign_policy: 60,
      media: 62,
      manipulation: 55
    },
    resources: {
      politicalCapital: 70,
      financialResources: 55,
      mediaConnections: 60,
      businessConnections: 65,
      internationalConnections: 55
    },
    currentState: {
      mood: 'neutral',
      stress: 45,
      energy: 65,
      popularity: 60,
      powerLevel: 70
    },
    politicalViews: {
      economicPolicy: config.ideology.economic,
      socialPolicy: config.ideology.social,
      foreignPolicy: 30,
      europeanIntegration: config.ideology.europe,
      environment: config.ideology.environment,
      immigration: config.ideology.immigration
    },
    biography: config.biography,
    achievements: [
      { date: new Date(2012, 0, 1), description: 'Carrière politique consolidée', publicImpact: 8 }
    ],
    controversies: [],
    behaviorPatterns: {
      decisionMaking: 'consultative',
      conflictResolution: 'diplomatic',
      communicationStyle: 'direct',
      loyaltyPattern: 'pragmatic'
    },
    reactionRules: []
  };
}

export const useCharacterEngine = create<CharacterEngineState>((set, get) => ({
  characters: {},
  interactions: [],
  recentActions: [],

  initializeCharacters: () => {
    const supportingCharacters = [
      createSupportingCharacter({
        id: 'elysee_president',
        firstName: 'Emmanuel',
        lastName: 'Macron',
        role: 'president',
        party: 'renaissance',
        currentPosition: 'Président de la République',
        biography: "Chef de l’État, arbitre l’orientation stratégique du quinquennat.",
        traits: ['visionnaire', 'ambitieux', 'pragmatique'],
        motivations: [
          { type: 'heritage', intensity: 85 },
          { type: 'nation', intensity: 80 },
          { type: 'pouvoir', intensity: 70 }
        ],
        ideology: {
          economic: 40,
          social: 20,
          europe: 80,
          environment: 60,
          immigration: 10
        }
      }),
      createSupportingCharacter({
        id: 'opposition_leader_rn',
        firstName: 'Marine',
        lastName: 'Le Pen',
        role: 'opposition_leader',
        party: 'rn',
        currentPosition: 'Présidente du groupe RN',
        biography: "Figure de proue de l’opposition nationaliste.",
        traits: ['charismatique', 'populiste', 'calculateur'],
        motivations: [
          { type: 'pouvoir', intensity: 95 },
          { type: 'ideologie', intensity: 85 },
          { type: 'heritage', intensity: 75 }
        ],
        ideology: {
          economic: -20,
          social: -70,
          europe: -80,
          environment: 20,
          immigration: -85
        }
      }),
      createSupportingCharacter({
        id: 'assembly_center_right',
        firstName: 'Olivier',
        lastName: 'Marleix',
        role: 'party_leader',
        party: 'lr',
        currentPosition: 'Chef de file LR à l’Assemblée',
        biography: 'Porte la voix des députés Les Républicains.',
        traits: ['pragmatique', 'conservateur', 'strategique'],
        motivations: [
          { type: 'parti', intensity: 85 },
          { type: 'stabilite', intensity: 65 },
          { type: 'pouvoir', intensity: 55 }
        ],
        ideology: {
          economic: 55,
          social: -40,
          europe: 35,
          environment: 40,
          immigration: -30
        }
      }),
      createSupportingCharacter({
        id: 'lr_group',
        firstName: 'Aurélien',
        lastName: 'Pradié',
        role: 'party_leader',
        party: 'lr',
        currentPosition: 'Voix influente LR',
        biography: 'Incarnation de la frange modérée et sociale de LR.',
        traits: ['ambitieux', 'pragmatique', 'loyal'],
        motivations: [
          { type: 'parti', intensity: 70 },
          { type: 'nation', intensity: 60 },
          { type: 'heritage', intensity: 55 }
        ],
        ideology: {
          economic: 45,
          social: -20,
          europe: 40,
          environment: 45,
          immigration: -25
        }
      }),
      createSupportingCharacter({
        id: 'business_lobby',
        firstName: 'Geoffroy',
        lastName: 'Roux de Bézieux',
        role: 'business_leader',
        currentPosition: 'Président d’organisation patronale',
        biography: 'Influence majeure auprès des milieux économiques.',
        traits: ['pragmatique', 'visionnaire', 'strategique'],
        motivations: [
          { type: 'richesse', intensity: 80 },
          { type: 'pouvoir', intensity: 65 },
          { type: 'parti', intensity: 45 }
        ],
        ideology: {
          economic: 70,
          social: -10,
          europe: 65,
          environment: 35,
          immigration: -10
        }
      }),
      createSupportingCharacter({
        id: 'security_unions',
        firstName: 'Yves',
        lastName: 'Lefebvre',
        role: 'union_leader',
        currentPosition: 'Secrétaire général syndicat police majoritaire',
        biography: 'Interlocuteur incontournable des forces de l’ordre.',
        traits: ['conflictuel', 'loyal', 'pragmatique'],
        motivations: [
          { type: 'justice', intensity: 75 },
          { type: 'stabilite', intensity: 70 },
          { type: 'parti', intensity: 50 }
        ],
        ideology: {
          economic: 10,
          social: -40,
          europe: 10,
          environment: 20,
          immigration: -50
        }
      }),
      createSupportingCharacter({
        id: 'defense_industry',
        firstName: 'Éric',
        lastName: 'Trappier',
        role: 'business_leader',
        currentPosition: 'PDG industrie défense',
        biography: 'Intervient sur les enjeux militaires et industriels.',
        traits: ['strategique', 'pragmatique', 'ambitieux'],
        motivations: [
          { type: 'richesse', intensity: 75 },
          { type: 'nation', intensity: 60 },
          { type: 'heritage', intensity: 55 }
        ],
        ideology: {
          economic: 65,
          social: -15,
          europe: 55,
          environment: 30,
          immigration: -20
        }
      })
    ];

    const candidateCharacters = PRIME_MINISTER_CANDIDATES.map(createCharacterFromCandidate);

    const characters: Record<string, PoliticalCharacter> = {};

    supportingCharacters.forEach(character => {
      characters[character.id] = character;
    });

    candidateCharacters.forEach(candidate => {
      characters[candidate.id] = {
        ...candidate,
        relationships: {
          ...candidate.relationships,
          ...Object.fromEntries(
            Object.keys(characters).map(id => [
              id,
              candidate.relationships[id] ?? createDefaultRelationship(id)
            ])
          )
        }
      };
    });

    Object.values(characters).forEach(character => {
      Object.keys(characters).forEach(otherId => {
        if (character.id === otherId) return;

        if (!character.relationships[otherId]) {
          character.relationships[otherId] = createDefaultRelationship(otherId);
        }
      });
    });

    candidateCharacters.forEach(candidate => {
      Object.entries(candidate.relationships).forEach(([targetId, relation]) => {
        const target = characters[targetId];
        if (!target) return;

        target.relationships[candidate.id] = {
          ...target.relationships[candidate.id],
          withCharacterId: candidate.id,
          type: relation.type,
          strength: Math.min(90, Math.max(30, relation.strength)),
          sentiment: Math.max(-90, Math.min(90, relation.sentiment)),
          trust: Math.max(10, Math.min(90, relation.sentiment + 50)),
          history: target.relationships[candidate.id]?.history ?? [],
          owedFavors: target.relationships[candidate.id]?.owedFavors ?? 0,
          receivedFavors: target.relationships[candidate.id]?.receivedFavors ?? 0,
          sharedSecrets: target.relationships[candidate.id]?.sharedSecrets ?? [],
          publicKnowledge: true
        };
      });
    });

    set({ characters, interactions: [], recentActions: [] });
  },


  addCharacter: (character: PoliticalCharacter) => {
    set(state => ({
      characters: {
        ...state.characters,
        [character.id]: character
      }
    }));
  },

  getCharacter: (id: string) => {
    return get().characters[id];
  },

  updateRelationship: (char1Id: string, char2Id: string, changes: Partial<Relationship>) => {
    const state = get();
    const char1 = state.characters[char1Id];
    const char2 = state.characters[char2Id];

    if (!char1 || !char2) return;

    // Mettre à jour la relation de char1 vers char2
    const existingRelation = char1.relationships[char2Id] || createDefaultRelationship(char2Id);
    const updatedRelation = { ...existingRelation, ...changes };

    // Enregistrer l'historique
    if (changes.sentiment !== undefined || changes.trust !== undefined) {
      updatedRelation.history.push({
        date: new Date(),
        event: `Relation modifiée: sentiment=${changes.sentiment}, trust=${changes.trust}`,
        impactOnRelation: (changes.sentiment || 0) + (changes.trust || 0)
      });
    }

    set(state => ({
      characters: {
        ...state.characters,
        [char1Id]: {
          ...state.characters[char1Id],
          relationships: {
            ...state.characters[char1Id].relationships,
            [char2Id]: updatedRelation
          }
        }
      }
    }));
  },

  simulateInteraction: (participantIds: string[], type: CharacterInteraction['type']) => {
    const state = get();
    const participants = participantIds.map(id => state.characters[id]).filter(Boolean);

    const interaction: CharacterInteraction = {
      id: `interaction_${Date.now()}`,
      date: new Date(),
      participants: participantIds,
      type,
      context: `Interaction de type ${type} entre ${participants.map(p => p.firstName + ' ' + p.lastName).join(', ')}`,
      private: type === 'negotiation' || type === 'betrayal',
      summary: `Les participants ont échangé sur des sujets ${type === 'negotiation' ? 'de négociation' : 'politiques'}.`,
      outcomes: participants.map(p => ({
        characterId: p.id,
        satisfaction: Math.random() * 100 - 50,
        relationshipChange: Math.random() * 20 - 10,
        resourcesGained: [],
        resourcesLost: [],
        commitments: []
      })),
      consequences: {
        immediate: [`Interaction ${type} enregistrée`],
        delayed: []
      }
    };

    set(state => ({
      interactions: [...state.interactions.slice(-100), interaction]
    }));

    return interaction;
  },

  performAction: (action: CharacterAction) => {
    const state = get();
    const character = state.characters[action.characterId];

    if (!character) return;

    // Appliquer les impacts de l'action
    if (action.impact.onOwnPopularity) {
      character.currentState.popularity += action.impact.onOwnPopularity;
      character.currentState.popularity = Math.max(0, Math.min(100, character.currentState.popularity));
    }

    // Mettre à jour les relations
    if (action.impact.onRelationships) {
      for (const relChange of action.impact.onRelationships) {
        get().updateRelationship(action.characterId, relChange.characterId, {
          sentiment: ((character.relationships[relChange.characterId]?.sentiment || 0) + relChange.change)
        });
      }
    }

    set(state => ({
      characters: {
        ...state.characters,
        [action.characterId]: character
      },
      recentActions: [...state.recentActions.slice(-50), action]
    }));
  },

  revealSecret: (secretId: string, revealedById: string) => {
    const state = get();

    // Trouver le personnage qui possède ce secret
    for (const character of Object.values(state.characters)) {
      const secret = character.secrets.find(s => s.id === secretId);

      if (secret) {
        // Appliquer les conséquences
        character.currentState.popularity -= secret.consequences.popularityLoss;
        character.resources.politicalCapital -= secret.consequences.politicalCapitalLoss;

        // Risque de démission
        if (Math.random() * 100 < secret.consequences.resignationRisk) {
          // Créer un événement de démission
          const resignAction: CharacterAction = {
            characterId: character.id,
            date: new Date(),
            actionType: 'resign',
            description: `${character.firstName} ${character.lastName} démissionne suite à la révélation d'un scandale`,
            parameters: { reason: secret.description },
            success: true,
            impact: {
              onPublicOpinion: -10
            }
          };

          get().performAction(resignAction);
        }

        // Retirer le secret de la liste (il est maintenant public)
        character.secrets = character.secrets.filter(s => s.id !== secretId);

        set(state => ({
          characters: {
            ...state.characters,
            [character.id]: character
          }
        }));

        break;
      }
    }
  },

  simulateCharacterAI: (characterId: string) => {
    const state = get();
    const character = state.characters[characterId];

    if (!character) return null;

    // IA basique: choisir une action selon la personnalité
    const personality = character.personality;

    // Si le personnage est ambitieux et a peu de pouvoir, chercher des alliances
    if (personality.traits.includes('ambitieux') && character.currentState.powerLevel < 60) {
      const potentialAllies = Object.values(state.characters).filter(c =>
        c.id !== characterId &&
        !character.relationships[c.id] &&
        c.currentState.powerLevel > 50
      );

      if (potentialAllies.length > 0) {
        const target = potentialAllies[0];

        const action: CharacterAction = {
          characterId,
          date: new Date(),
          actionType: 'form_alliance',
          targetId: target.id,
          description: `${character.firstName} ${character.lastName} cherche à former une alliance avec ${target.firstName} ${target.lastName}`,
          parameters: {},
          success: Math.random() > 0.5,
          impact: {
            onRelationships: [
              { characterId: target.id, change: 15 }
            ]
          }
        };

        return action;
      }
    }

    // Si le personnage est conflictuel et a un ennemi, l'attaquer
    if (personality.traits.includes('conflictuel')) {
      const enemies = Object.keys(character.relationships).filter(id =>
        character.relationships[id].type === 'enemy'
      );

      if (enemies.length > 0) {
        const targetId = enemies[0];

        const action: CharacterAction = {
          characterId,
          date: new Date(),
          actionType: 'public_statement',
          targetId,
          description: `${character.firstName} ${character.lastName} critique publiquement ${state.characters[targetId]?.firstName} ${state.characters[targetId]?.lastName}`,
          parameters: {},
          success: true,
          impact: {
            onTarget: -5,
            onPublicOpinion: character.currentState.popularity > 50 ? 2 : -2,
            onRelationships: [
              { characterId: targetId, change: -10 }
            ]
          }
        };

        return action;
      }
    }

    return null;
  },

  getRelationship: (char1Id: string, char2Id: string) => {
    const char1 = get().characters[char1Id];
    return char1?.relationships[char2Id];
  },

  findAllies: (characterId: string) => {
    const state = get();
    const character = state.characters[characterId];

    if (!character) return [];

    return Object.keys(character.relationships)
      .filter(id => {
        const rel = character.relationships[id];
        return rel.type === 'ally' || rel.type === 'friend';
      })
      .map(id => state.characters[id])
      .filter(Boolean);
  },

  findEnemies: (characterId: string) => {
    const state = get();
    const character = state.characters[characterId];

    if (!character) return [];

    return Object.keys(character.relationships)
      .filter(id => {
        const rel = character.relationships[id];
        return rel.type === 'enemy' || rel.type === 'rival';
      })
      .map(id => state.characters[id])
      .filter(Boolean);
  }
}));
