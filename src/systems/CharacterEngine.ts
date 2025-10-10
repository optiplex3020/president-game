import { create } from 'zustand';
import type {
  PoliticalCharacter,
  Relationship,
  CharacterAction,
  CharacterInteraction,
  Secret
} from '../types/characters';

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

export const useCharacterEngine = create<CharacterEngineState>((set, get) => ({
  characters: {},
  interactions: [],
  recentActions: [],

  initializeCharacters: () => {
    // Créer quelques personnages clés
    const characters: Record<string, PoliticalCharacter> = {
      'pm_001': {
        id: 'pm_001',
        firstName: 'Élisabeth',
        lastName: 'Borne',
        role: 'prime_minister',
        party: 'renaissance',
        currentPosition: 'Première ministre',
        age: 62,
        gender: 'F',
        birthPlace: 'Paris',
        education: ['École Polytechnique', 'École nationale des ponts et chaussées'],
        previousPositions: ['Ministre de la Transition écologique', 'Ministre des Transports'],
        personality: {
          traits: ['technocrate', 'loyal', 'pragmatique', 'discret'],
          motivations: [
            { type: 'nation', intensity: 85 },
            { type: 'stabilite', intensity: 75 },
            { type: 'reconnaissance', intensity: 60 }
          ],
          psychology: {
            intelligence: 85,
            emotionalStability: 80,
            charisma: 55,
            integrity: 78,
            ambition: 65,
            courage: 70,
            patience: 85
          },
          values: {
            honesty: 75,
            loyalty: 85,
            compassion: 65,
            pragmatism: 90
          }
        },
        relationships: {},
        secrets: [],
        agenda: {
          shortTerm: [
            { goal: 'Faire passer la réforme des retraites', priority: 95, progress: 60 }
          ],
          mediumTerm: [
            { goal: 'Maintenir la cohésion du gouvernement', priority: 80, progress: 70 }
          ],
          longTerm: [
            { goal: 'Être reconnue comme une PM efficace', priority: 75, ultimateGoal: true }
          ],
          activeStrategies: []
        },
        skills: {
          negotiation: 75,
          rhetoric: 60,
          strategy: 80,
          economics: 70,
          foreign_policy: 55,
          media: 50,
          manipulation: 45
        },
        resources: {
          politicalCapital: 75,
          financialResources: 60,
          mediaConnections: 50,
          businessConnections: 70,
          internationalConnections: 55
        },
        currentState: {
          mood: 'neutral',
          stress: 65,
          energy: 70,
          popularity: 42,
          powerLevel: 75
        },
        politicalViews: {
          economicPolicy: 25,
          socialPolicy: 30,
          foreignPolicy: 40,
          europeanIntegration: 75,
          environment: 65,
          immigration: 10
        },
        biography: 'Haute fonctionnaire et femme politique française, Première ministre depuis 2022.',
        achievements: [],
        controversies: [],
        behaviorPatterns: {
          decisionMaking: 'calculated',
          conflictResolution: 'diplomatic',
          communicationStyle: 'direct',
          loyaltyPattern: 'unwavering'
        },
        reactionRules: []
      },
      'opp_001': {
        id: 'opp_001',
        firstName: 'Marine',
        lastName: 'Le Pen',
        role: 'opposition_leader',
        party: 'rn',
        currentPosition: 'Présidente du groupe RN à l\'Assemblée',
        age: 55,
        gender: 'F',
        birthPlace: 'Neuilly-sur-Seine',
        education: ['Université Paris 2 Panthéon-Assas'],
        previousPositions: ['Députée européenne', 'Présidente du Front National'],
        personality: {
          traits: ['ambitieux', 'populiste', 'charismatique', 'calculateur', 'conflictuel'],
          motivations: [
            { type: 'pouvoir', intensity: 90 },
            { type: 'ideologie', intensity: 85 },
            { type: 'heritage', intensity: 70 }
          ],
          psychology: {
            intelligence: 75,
            emotionalStability: 70,
            charisma: 85,
            integrity: 60,
            ambition: 95,
            courage: 80,
            patience: 75
          },
          values: {
            honesty: 55,
            loyalty: 70,
            compassion: 50,
            pragmatism: 80
          }
        },
        relationships: {},
        secrets: [
          {
            id: 'secret_mlp_1',
            type: 'corruption',
            description: 'Emplois fictifs au Parlement européen',
            severity: 75,
            knownBy: ['media_001', 'justice_001'],
            exposureRisk: 60,
            consequences: {
              popularityLoss: 15,
              politicalCapitalLoss: 25,
              legalTrouble: true,
              resignationRisk: 30,
              affectedRelationships: []
            }
          }
        ],
        agenda: {
          shortTerm: [
            { goal: 'Bloquer la réforme des retraites', priority: 90, progress: 45 }
          ],
          mediumTerm: [
            { goal: 'Gagner les élections européennes', priority: 85, progress: 30 }
          ],
          longTerm: [
            { goal: 'Devenir présidente de la République', priority: 100, ultimateGoal: true }
          ],
          activeStrategies: [
            {
              name: 'Dédiabolisation du parti',
              target: 'public',
              approach: 'seduction',
              effectiveness: 65
            }
          ]
        },
        skills: {
          negotiation: 70,
          rhetoric: 85,
          strategy: 80,
          economics: 60,
          foreign_policy: 65,
          media: 90,
          manipulation: 75
        },
        resources: {
          politicalCapital: 80,
          financialResources: 55,
          mediaConnections: 75,
          businessConnections: 50,
          internationalConnections: 45
        },
        currentState: {
          mood: 'happy',
          stress: 55,
          energy: 80,
          popularity: 58,
          powerLevel: 65
        },
        politicalViews: {
          economicPolicy: -20,
          socialPolicy: -75,
          foreignPolicy: -60,
          europeanIntegration: -85,
          environment: 30,
          immigration: -90
        },
        biography: 'Femme politique française, figure de l\'extrême droite, candidate à l\'élection présidentielle.',
        achievements: [],
        controversies: [],
        behaviorPatterns: {
          decisionMaking: 'calculated',
          conflictResolution: 'aggressive',
          communicationStyle: 'direct',
          loyaltyPattern: 'pragmatic'
        },
        reactionRules: []
      }
    };

    set({ characters });
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
