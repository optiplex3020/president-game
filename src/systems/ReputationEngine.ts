/**
 * REPUTATION & LEGACY ENGINE
 * Système de réputation présidentielle et d'héritage historique
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ReputationCategory =
  | 'economie' | 'social' | 'international' | 'environnement'
  | 'culture' | 'securite' | 'justice' | 'education';

export interface Accomplishment {
  id: string;
  title: string;
  description: string;
  category: ReputationCategory;
  date: Date;
  impact: number; // 0-100
  publicPerception: 'positive' | 'mixed' | 'negative';
}

export interface Controversy {
  id: string;
  title: string;
  description: string;
  date: Date;
  severity: number; // 0-100
  resolved: boolean;
  resolution?: string;
}

export interface HistoricalJudgment {
  category: ReputationCategory;
  rating: number; // 0-100
  achievements: string[];
  failures: string[];
  signature: string; // L'action emblématique
}

export interface LegacyScore {
  overall: number; // 0-100
  byCategory: Record<ReputationCategory, number>;
  historicalRanking: number; // Position parmi les présidents (1-25)
  title: string; // Ex: "Le Réformateur", "Le Bâtisseur", etc.
}

interface ReputationEngineState {
  // Réalisations et controverses
  accomplishments: Accomplishment[];
  controversies: Controversy[];

  // Réputation en temps réel
  currentReputation: Record<ReputationCategory, number>;

  // Héritage final
  legacy: LegacyScore | null;

  // Actions
  recordAccomplishment: (accomplishment: Omit<Accomplishment, 'id' | 'date'>) => void;
  recordControversy: (controversy: Omit<Controversy, 'id' | 'date' | 'resolved'>) => void;
  resolveControversy: (controversyId: string, resolution: string) => void;
  calculateLegacy: () => LegacyScore;
  getReputationSummary: () => {
    strengths: ReputationCategory[];
    weaknesses: ReputationCategory[];
    balanceScore: number;
  };
}

// Titres présidentiels possibles
const PRESIDENTIAL_TITLES: Record<string, { min: number; title: string }> = {
  legendary: { min: 90, title: 'Le Grand' },
  excellent: { min: 80, title: 'Le Réformateur' },
  good: { min: 70, title: 'Le Bâtisseur' },
  average: { min: 60, title: 'Le Pragmatique' },
  mediocre: { min: 50, title: 'L\'Ordinaire' },
  poor: { min: 40, title: 'Le Controversé' },
  terrible: { min: 0, title: 'L\'Oublié' }
};

export const useReputationEngine = create<ReputationEngineState>()(
  persist(
    (set, get) => ({
      accomplishments: [],
      controversies: [],
      currentReputation: {
        economie: 50,
        social: 50,
        international: 50,
        environnement: 50,
        culture: 50,
        securite: 50,
        justice: 50,
        education: 50
      },
      legacy: null,

      recordAccomplishment: (data) => {
        const accomplishment: Accomplishment = {
          ...data,
          id: `acc_${Date.now()}`,
          date: new Date()
        };

        // Mettre à jour la réputation dans la catégorie
        set(state => ({
          accomplishments: [...state.accomplishments, accomplishment],
          currentReputation: {
            ...state.currentReputation,
            [accomplishment.category]: Math.min(100,
              state.currentReputation[accomplishment.category] + accomplishment.impact / 5
            )
          }
        }));

        console.log(`✨ Réalisation enregistrée: ${accomplishment.title}`);
      },

      recordControversy: (data) => {
        const controversy: Controversy = {
          ...data,
          id: `ctrl_${Date.now()}`,
          date: new Date(),
          resolved: false
        };

        set(state => ({
          controversies: [...state.controversies, controversy]
        }));

        // Impact négatif immédiat sur toutes les catégories
        set(state => {
          const impact = controversy.severity / 10;
          const newReputation = { ...state.currentReputation };

          for (const category in newReputation) {
            newReputation[category as ReputationCategory] = Math.max(0,
              newReputation[category as ReputationCategory] - impact
            );
          }

          return { currentReputation: newReputation };
        });

        console.log(`⚠️ Controverse enregistrée: ${controversy.title}`);
      },

      resolveControversy: (controversyId, resolution) => {
        set(state => ({
          controversies: state.controversies.map(c =>
            c.id === controversyId
              ? { ...c, resolved: true, resolution }
              : c
          )
        }));

        // Récupérer un peu de réputation
        set(state => {
          const newReputation = { ...state.currentReputation };

          for (const category in newReputation) {
            newReputation[category as ReputationCategory] = Math.min(100,
              newReputation[category as ReputationCategory] + 5
            );
          }

          return { currentReputation: newReputation };
        });
      },

      calculateLegacy: () => {
        const state = get();

        // Calculer le score par catégorie
        const byCategory: Record<ReputationCategory, number> = { ...state.currentReputation };

        // Bonus pour accomplissements majeurs
        state.accomplishments.forEach(acc => {
          if (acc.impact >= 80) {
            byCategory[acc.category] = Math.min(100, byCategory[acc.category] + 10);
          }
        });

        // Malus pour controverses non résolues
        state.controversies.forEach(ctrl => {
          if (!ctrl.resolved && ctrl.severity >= 70) {
            for (const category in byCategory) {
              byCategory[category as ReputationCategory] = Math.max(0,
                byCategory[category as ReputationCategory] - ctrl.severity / 10
              );
            }
          }
        });

        // Calculer le score global
        const overall = Math.round(
          Object.values(byCategory).reduce((sum, val) => sum + val, 0) / 8
        );

        // Déterminer le titre
        let title = PRESIDENTIAL_TITLES.terrible.title;
        for (const key in PRESIDENTIAL_TITLES) {
          if (overall >= PRESIDENTIAL_TITLES[key].min) {
            title = PRESIDENTIAL_TITLES[key].title;
            break;
          }
        }

        // Classement historique (simulation)
        const historicalRanking = Math.max(1, Math.min(25,
          Math.round(26 - (overall / 4))
        ));

        const legacy: LegacyScore = {
          overall,
          byCategory,
          historicalRanking,
          title
        };

        set({ legacy });
        return legacy;
      },

      getReputationSummary: () => {
        const state = get();
        const categories = Object.entries(state.currentReputation) as [ReputationCategory, number][];

        // Trier par score
        const sorted = [...categories].sort((a, b) => b[1] - a[1]);

        const strengths = sorted.slice(0, 3).map(([cat]) => cat);
        const weaknesses = sorted.slice(-3).map(([cat]) => cat);

        // Score d'équilibre (variance faible = bon équilibre)
        const avg = Object.values(state.currentReputation).reduce((sum, val) => sum + val, 0) / 8;
        const variance = Object.values(state.currentReputation)
          .reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / 8;
        const balanceScore = Math.max(0, 100 - Math.sqrt(variance));

        return {
          strengths,
          weaknesses,
          balanceScore: Math.round(balanceScore)
        };
      }
    }),
    {
      name: 'president-game-reputation',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accomplishments: state.accomplishments,
        controversies: state.controversies,
        currentReputation: state.currentReputation,
        legacy: state.legacy
      })
    }
  )
);

// Système d'évaluation historique
export const generateHistoricalJudgment = (legacy: LegacyScore): HistoricalJudgment[] => {
  const judgments: HistoricalJudgment[] = [];

  for (const [category, rating] of Object.entries(legacy.byCategory)) {
    const judgment: HistoricalJudgment = {
      category: category as ReputationCategory,
      rating,
      achievements: getAchievementsForCategory(category as ReputationCategory, rating),
      failures: getFailuresForCategory(category as ReputationCategory, rating),
      signature: getSignatureAction(category as ReputationCategory, rating)
    };
    judgments.push(judgment);
  }

  return judgments;
};

function getAchievementsForCategory(category: ReputationCategory, rating: number): string[] {
  if (rating < 50) return [];

  const achievements: Record<ReputationCategory, string[]> = {
    economie: [
      'Redressement de la croissance économique',
      'Réduction du chômage significative',
      'Maîtrise de la dette publique',
      'Attractivité renforcée pour les investissements'
    ],
    social: [
      'Réforme des retraites réussie',
      'Amélioration du système de santé',
      'Réduction des inégalités',
      'Pacification du dialogue social'
    ],
    international: [
      'Renforcement du leadership européen',
      'Diplomatie active et efficace',
      'Restauration de l\'image de la France',
      'Partenariats internationaux stratégiques'
    ],
    environnement: [
      'Transition énergétique accélérée',
      'Réduction des émissions de CO2',
      'Protection de la biodiversité',
      'Leadership climatique mondial'
    ],
    culture: [
      'Rayonnement culturel international',
      'Soutien à la création artistique',
      'Protection du patrimoine',
      'Exception culturelle préservée'
    ],
    securite: [
      'Baisse de la criminalité',
      'Efficacité de la lutte antiterroriste',
      'Cohésion sociale renforcée',
      'Confiance dans les institutions'
    ],
    justice: [
      'Modernisation du système judiciaire',
      'Lutte contre la corruption',
      'Équité sociale renforcée',
      'État de droit consolidé'
    ],
    education: [
      'Réussite de la réforme éducative',
      'Réduction des inégalités scolaires',
      'Amélioration des résultats internationaux',
      'Enseignement supérieur d\'excellence'
    ]
  };

  return achievements[category].slice(0, Math.ceil(rating / 25));
}

function getFailuresForCategory(category: ReputationCategory, rating: number): string[] {
  if (rating >= 50) return [];

  const failures: Record<ReputationCategory, string[]> = {
    economie: [
      'Croissance économique atone',
      'Chômage persistant',
      'Dette publique incontrôlée',
      'Perte de compétitivité'
    ],
    social: [
      'Tensions sociales accrues',
      'Système de santé dégradé',
      'Inégalités croissantes',
      'Mouvements sociaux répétés'
    ],
    international: [
      'Isolement diplomatique',
      'Perte d\'influence en Europe',
      'Image ternie à l\'international',
      'Absence de vision stratégique'
    ],
    environnement: [
      'Objectifs climatiques manqués',
      'Inaction face à l\'urgence',
      'Dégradation environnementale',
      'Retard sur la transition'
    ],
    culture: [
      'Rayonnement culturel affaibli',
      'Désengagement de l\'État',
      'Patrimoine négligé',
      'Exception culturelle menacée'
    ],
    securite: [
      'Insécurité croissante',
      'Défaillances sécuritaires',
      'Fractures sociales',
      'Perte de confiance'
    ],
    justice: [
      'Justice à deux vitesses',
      'Corruption persistante',
      'Inégalités devant la loi',
      'État de droit fragilisé'
    ],
    education: [
      'Système éducatif en crise',
      'Échec scolaire massif',
      'Résultats internationaux en baisse',
      'Désengagement de l\'État'
    ]
  };

  return failures[category].slice(0, Math.ceil((100 - rating) / 25));
}

function getSignatureAction(category: ReputationCategory, rating: number): string {
  if (rating >= 70) {
    const signatures: Record<ReputationCategory, string> = {
      economie: 'Le redressement économique spectaculaire',
      social: 'La grande réforme sociale consensuelle',
      international: 'Le leadership européen renouvelé',
      environnement: 'La transition écologique accélérée',
      culture: 'Le rayonnement culturel retrouvé',
      securite: 'La restauration de l\'ordre public',
      justice: 'La modernisation de la justice',
      education: 'La refondation de l\'école'
    };
    return signatures[category];
  } else {
    return 'Aucune action emblématique';
  }
}
