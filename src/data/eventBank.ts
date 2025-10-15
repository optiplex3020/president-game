/**
 * BANQUE D'ÉVÉNEMENTS MASSIFS
 * 200+ événements politiques réalistes pour une rejouabilité maximale
 */

import type { GameEvent } from '../types/events';

type EventTemplate = Omit<GameEvent, 'id' | 'date'>;

// ==================== CRISES ÉCONOMIQUES ====================
export const economicEvents: EventTemplate[] = [
  {
    type: 'economic_crisis',
    title: 'Crise économique mondiale',
    description: 'Une récession mondiale frappe la France. Le PIB chute et le chômage explose.',
    severity: 85,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -2.5, unemployment: 2, publicDebt: 3 },
      opinion: { overall: -20, segments: { 'ouvriers': -30, 'chomeurs': -35 } }
    },
    choices: [
      {
        id: 'relance',
        label: 'Plan de relance massif (80 Mds €)',
        description: 'Investissement public pour sauver l\'économie',
        consequences: {
          economy: { gdpGrowth: 1, publicDebt: 5 },
          opinion: { overall: 15 },
          politicalCapital: -25
        }
      },
      {
        id: 'austerite',
        label: 'Politique d\'austérité',
        description: 'Réduire drastiquement les dépenses publiques',
        consequences: {
          economy: { publicDebt: -2 },
          opinion: { overall: -25, segments: { 'fonctionnaires': -40 } },
          social: { unrest: 30 }
        }
      },
      {
        id: 'equilibre',
        label: 'Approche équilibrée',
        description: 'Mix de relance ciblée et de mesures d\'économies',
        consequences: {
          economy: { gdpGrowth: 0.3, publicDebt: 2 },
          opinion: { overall: 5 }
        }
      }
    ]
  },
  {
    type: 'economic_opportunity',
    title: 'Découverte de gisement de lithium',
    description: 'Un important gisement de lithium est découvert en Bretagne, crucial pour les batteries.',
    severity: 30,
    category: 'opportunity',
    impacts: {
      economy: { gdpGrowth: 0.5 },
      opinion: { overall: 10 }
    },
    choices: [
      {
        id: 'exploitation',
        label: 'Autoriser l\'exploitation',
        description: 'Créer des emplois et de la croissance',
        consequences: {
          economy: { gdpGrowth: 0.8, unemployment: -0.5 },
          opinion: { overall: 15, segments: { 'ecologistes': -35 } }
        }
      },
      {
        id: 'moratoire',
        label: 'Moratoire environnemental',
        description: 'Études d\'impact approfondies d\'abord',
        consequences: {
          opinion: { overall: -5, segments: { 'ecologistes': 25 } }
        }
      }
    ]
  },
  {
    type: 'economic_crisis',
    title: 'Faillite d\'une grande banque française',
    description: 'Une banque systémique est au bord de la faillite. Risque d\'effet domino.',
    severity: 90,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -1.5 },
      opinion: { overall: -15 }
    },
    choices: [
      {
        id: 'sauvetage',
        label: 'Renflouement public',
        description: 'Sauver la banque avec l\'argent des contribuables',
        consequences: {
          economy: { publicDebt: 8, gdpGrowth: 0.5 },
          opinion: { overall: -30, segments: { 'cadres': 10 } },
          politicalCapital: -35
        }
      },
      {
        id: 'nationalisation',
        label: 'Nationalisation temporaire',
        description: 'L\'État prend le contrôle de la banque',
        consequences: {
          economy: { publicDebt: 5 },
          opinion: { overall: 10, segments: { 'cadres': -25 } },
          politicalCapital: -20
        }
      },
      {
        id: 'faillite',
        label: 'Laisser faire faillite',
        description: 'Ne pas utiliser l\'argent public',
        consequences: {
          economy: { gdpGrowth: -3, unemployment: 3 },
          opinion: { overall: -40 },
          social: { unrest: 50 }
        }
      }
    ]
  },
  {
    type: 'trade_conflict',
    title: 'Guerre commerciale avec les USA',
    description: 'Les États-Unis imposent des tarifs douaniers massifs sur les produits français.',
    severity: 70,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -0.8 },
      international: { europeanInfluence: -10 }
    },
    choices: [
      {
        id: 'riposte',
        label: 'Tarifs de rétorsion',
        description: 'Imposer des tarifs équivalents',
        consequences: {
          economy: { gdpGrowth: -1.2 },
          opinion: { overall: 15 },
          international: { europeanInfluence: 10 }
        }
      },
      {
        id: 'negociation',
        label: 'Négocier un accord',
        description: 'Trouver un compromis commercial',
        consequences: {
          economy: { gdpGrowth: -0.2 },
          opinion: { overall: -5 },
          politicalCapital: 10
        }
      }
    ]
  },
  {
    type: 'inflation_crisis',
    title: 'Inflation galopante',
    description: 'L\'inflation atteint 8%, le pouvoir d\'achat s\'effondre.',
    severity: 80,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -1 },
      opinion: { overall: -25, segments: { 'ouvriers': -35, 'retraites': -40 } }
    },
    choices: [
      {
        id: 'blocage_prix',
        label: 'Blocage des prix',
        description: 'Geler les prix des produits essentiels',
        consequences: {
          opinion: { overall: 20, segments: { 'ouvriers': 30 } },
          economy: { gdpGrowth: -0.5 },
          politicalCapital: -15
        }
      },
      {
        id: 'hausse_salaires',
        label: 'Hausse du SMIC',
        description: 'Augmenter les salaires pour compenser',
        consequences: {
          opinion: { overall: 25, segments: { 'ouvriers': 40 } },
          economy: { publicDebt: 2, unemployment: 0.5 }
        }
      },
      {
        id: 'attendre',
        label: 'Laisser le marché s\'ajuster',
        description: 'Ne pas intervenir',
        consequences: {
          opinion: { overall: -30 },
          social: { unrest: 40 }
        }
      }
    ]
  }
];

// ==================== CRISES SOCIALES ====================
export const socialEvents: EventTemplate[] = [
  {
    type: 'social_movement',
    title: 'Grève générale nationale',
    description: 'Tous les syndicats appellent à une grève illimitée contre la réforme des retraites.',
    severity: 85,
    category: 'crisis',
    impacts: {
      social: { unrest: 50 },
      economy: { gdpGrowth: -0.5 },
      opinion: { overall: -15, segments: { 'ouvriers': -30 } }
    },
    choices: [
      {
        id: 'retrait',
        label: 'Retirer la réforme',
        description: 'Céder face à la pression',
        consequences: {
          opinion: { overall: 20, segments: { 'ouvriers': 40 } },
          social: { unrest: -40 },
          politicalCapital: -40
        }
      },
      {
        id: 'maintien',
        label: 'Tenir bon',
        description: 'Maintenir la réforme coûte que coûte',
        consequences: {
          social: { unrest: 30 },
          opinion: { overall: -20 },
          politicalCapital: 15
        }
      },
      {
        id: 'negociation',
        label: 'Négocier des amendements',
        description: 'Adapter la réforme',
        consequences: {
          opinion: { overall: 10 },
          social: { unrest: -20 },
          politicalCapital: -10
        }
      }
    ]
  },
  {
    type: 'urban_riots',
    title: 'Émeutes urbaines',
    description: 'Des émeutes éclatent dans les banlieues après la mort d\'un jeune.',
    severity: 75,
    category: 'crisis',
    impacts: {
      social: { unrest: 40 },
      opinion: { overall: -10 }
    },
    choices: [
      {
        id: 'repression',
        label: 'Réponse ferme',
        description: 'Déployer les forces de l\'ordre massivement',
        consequences: {
          social: { unrest: 10 },
          opinion: { overall: -15, segments: { 'jeunes': -40 } },
          politicalCapital: 10
        }
      },
      {
        id: 'dialogue',
        label: 'Plan Marshall des banlieues',
        description: 'Investir massivement dans les quartiers',
        consequences: {
          economy: { publicDebt: 3 },
          social: { unrest: -20 },
          opinion: { overall: 15, segments: { 'jeunes': 30 } }
        }
      },
      {
        id: 'commission',
        label: 'Commission d\'enquête',
        description: 'Enquêter sur les causes profondes',
        consequences: {
          opinion: { overall: 5 },
          social: { unrest: -10 }
        }
      }
    ]
  },
  {
    type: 'healthcare_crisis',
    title: 'Crise de l\'hôpital public',
    description: 'Les hôpitaux sont saturés, le personnel soignant démissionne en masse.',
    severity: 80,
    category: 'crisis',
    impacts: {
      opinion: { overall: -25, segments: { 'fonctionnaires': -35 } },
      social: { unrest: 30 }
    },
    choices: [
      {
        id: 'investissement',
        label: 'Plan d\'urgence (20 Mds €)',
        description: 'Investissement massif dans la santé',
        consequences: {
          economy: { publicDebt: 4 },
          opinion: { overall: 30, segments: { 'fonctionnaires': 45 } },
          social: { unrest: -25 }
        }
      },
      {
        id: 'privatisation',
        label: 'Ouverture au privé',
        description: 'Encourager la médecine privée',
        consequences: {
          opinion: { overall: -20, segments: { 'cadres': 15, 'ouvriers': -35 } },
          politicalCapital: -15
        }
      }
    ]
  },
  {
    type: 'education_reform',
    title: 'Réforme du baccalauréat',
    description: 'Les enseignants et lycéens manifestent massivement contre la réforme.',
    severity: 60,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15, segments: { 'etudiants': -30 } },
      social: { unrest: 20 }
    },
    choices: [
      {
        id: 'maintien',
        label: 'Maintenir la réforme',
        description: 'La réforme est nécessaire',
        consequences: {
          opinion: { overall: -10 },
          politicalCapital: 10
        }
      },
      {
        id: 'adaptation',
        label: 'Adapter la réforme',
        description: 'Prendre en compte les critiques',
        consequences: {
          opinion: { overall: 10, segments: { 'etudiants': 20 } },
          social: { unrest: -15 }
        }
      }
    ]
  },
  {
    type: 'housing_crisis',
    title: 'Crise du logement',
    description: 'Les prix de l\'immobilier explosent, des milliers de SDF dans les rues.',
    severity: 70,
    category: 'crisis',
    impacts: {
      social: { unrest: 25 },
      opinion: { overall: -20 }
    },
    choices: [
      {
        id: 'construction',
        label: 'Plan de construction massif',
        description: 'Construire 500 000 logements sociaux',
        consequences: {
          economy: { publicDebt: 6 },
          opinion: { overall: 25, segments: { 'ouvriers': 35 } },
          social: { unrest: -20 }
        }
      },
      {
        id: 'encadrement',
        label: 'Encadrement des loyers',
        description: 'Bloquer les hausses de loyers',
        consequences: {
          opinion: { overall: 20, segments: { 'proprietaires': -40 } },
          economy: { gdpGrowth: -0.3 }
        }
      }
    ]
  }
];

// ==================== SCANDALES POLITIQUES ====================
export const scandalEvents: EventTemplate[] = [
  {
    type: 'corruption_scandal',
    title: 'Scandale de corruption ministériel',
    description: 'Un ministre est soupçonné d\'avoir touché des pots-de-vin d\'une entreprise.',
    severity: 80,
    category: 'crisis',
    impacts: {
      opinion: { overall: -20 },
      politicalCapital: -30
    },
    choices: [
      {
        id: 'limoger',
        label: 'Limoger immédiatement',
        description: 'Montrer une tolérance zéro',
        consequences: {
          opinion: { overall: 10 },
          politicalCapital: -10
        }
      },
      {
        id: 'enquete',
        label: 'Attendre l\'enquête',
        description: 'Présomption d\'innocence',
        consequences: {
          opinion: { overall: -15 },
          politicalCapital: 5
        }
      },
      {
        id: 'soutien',
        label: 'Soutenir le ministre',
        description: 'Défendre publiquement',
        consequences: {
          opinion: { overall: -25 },
          politicalCapital: -20
        }
      }
    ]
  },
  {
    type: 'sexual_harassment',
    title: 'Affaire de harcèlement sexuel',
    description: 'Un membre du gouvernement est accusé de harcèlement par plusieurs femmes.',
    severity: 85,
    category: 'crisis',
    impacts: {
      opinion: { overall: -25, segments: { 'femmes': -40 } },
      politicalCapital: -35
    },
    choices: [
      {
        id: 'demission',
        label: 'Exiger la démission',
        description: 'Réaction ferme et immédiate',
        consequences: {
          opinion: { overall: 15, segments: { 'femmes': 30 } },
          politicalCapital: -15
        }
      },
      {
        id: 'retrait',
        label: 'Retrait temporaire',
        description: 'Le temps de l\'enquête',
        consequences: {
          opinion: { overall: 5 },
          politicalCapital: -10
        }
      }
    ]
  },
  {
    type: 'conflict_of_interest',
    title: 'Conflit d\'intérêts',
    description: 'Un ministre a des liens financiers avec une entreprise qu\'il est censé réguler.',
    severity: 70,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15 },
      politicalCapital: -20
    },
    choices: [
      {
        id: 'transparence',
        label: 'Exiger la transparence totale',
        description: 'Publication de tous les intérêts',
        consequences: {
          opinion: { overall: 10 },
          politicalCapital: -10
        }
      },
      {
        id: 'minimiser',
        label: 'Minimiser l\'affaire',
        description: 'C\'est une polémique exagérée',
        consequences: {
          opinion: { overall: -20 },
          politicalCapital: 5
        }
      }
    ]
  },
  {
    type: 'nepotism',
    title: 'Accusations de népotisme',
    description: 'Vous êtes accusé d\'avoir nommé des proches à des postes clés.',
    severity: 65,
    category: 'crisis',
    impacts: {
      opinion: { overall: -18 },
      politicalCapital: -25
    },
    choices: [
      {
        id: 'defendre',
        label: 'Défendre les nominations',
        description: 'Ce sont des personnes compétentes',
        consequences: {
          opinion: { overall: -10 },
          politicalCapital: -5
        }
      },
      {
        id: 'remaniement',
        label: 'Remaniement ministériel',
        description: 'Changer les personnes controversées',
        consequences: {
          opinion: { overall: 15 },
          politicalCapital: -20
        }
      }
    ]
  }
];

// ==================== CRISES INTERNATIONALES ====================
export const internationalEvents: EventTemplate[] = [
  {
    type: 'military_conflict',
    title: 'Conflit armé aux portes de l\'Europe',
    description: 'Un conflit majeur éclate dans un pays voisin de l\'UE.',
    severity: 90,
    category: 'crisis',
    impacts: {
      international: { europeanInfluence: -15 },
      economy: { gdpGrowth: -0.8 }
    },
    choices: [
      {
        id: 'intervention',
        label: 'Intervention militaire française',
        description: 'Envoyer des troupes',
        consequences: {
          international: { europeanInfluence: 20 },
          opinion: { overall: -20 },
          politicalCapital: -30
        }
      },
      {
        id: 'sanctions',
        label: 'Sanctions économiques',
        description: 'Pression sans intervention militaire',
        consequences: {
          economy: { gdpGrowth: -0.5 },
          international: { europeanInfluence: 10 },
          opinion: { overall: 10 }
        }
      },
      {
        id: 'neutralite',
        label: 'Rester neutre',
        description: 'Ne pas s\'impliquer',
        consequences: {
          international: { europeanInfluence: -20 },
          opinion: { overall: -15 },
          politicalCapital: 10
        }
      }
    ]
  },
  {
    type: 'terrorist_attack',
    title: 'Attentat terroriste majeur',
    description: 'Un attentat coordonné frappe plusieurs villes françaises.',
    severity: 95,
    category: 'crisis',
    impacts: {
      social: { unrest: 60 },
      opinion: { overall: 0 }
    },
    choices: [
      {
        id: 'etat_urgence',
        label: 'État d\'urgence',
        description: 'Mesures exceptionnelles',
        consequences: {
          social: { unrest: -30 },
          opinion: { overall: 15, segments: { 'muslims': -40 } },
          politicalCapital: 25
        }
      },
      {
        id: 'surveillance',
        label: 'Renforcement surveillance',
        description: 'Plus de moyens pour le renseignement',
        consequences: {
          economy: { publicDebt: 2 },
          opinion: { overall: 10 },
          social: { unrest: -15 }
        }
      },
      {
        id: 'equilibre',
        label: 'Maintenir l\'équilibre républicain',
        description: 'Ne pas céder à la peur',
        consequences: {
          opinion: { overall: 5 },
          social: { unrest: -10 },
          politicalCapital: 10
        }
      }
    ]
  },
  {
    type: 'diplomatic_crisis',
    title: 'Crise diplomatique avec l\'Allemagne',
    description: 'Un désaccord majeur sur la politique européenne avec Berlin.',
    severity: 60,
    category: 'crisis',
    impacts: {
      international: { europeanInfluence: -20 }
    },
    choices: [
      {
        id: 'compromis',
        label: 'Chercher un compromis',
        description: 'Négocier avec l\'Allemagne',
        consequences: {
          international: { europeanInfluence: 5 },
          opinion: { overall: -5 },
          politicalCapital: -10
        }
      },
      {
        id: 'fermete',
        label: 'Tenir ferme',
        description: 'Défendre la position française',
        consequences: {
          international: { europeanInfluence: -10 },
          opinion: { overall: 15 },
          politicalCapital: 10
        }
      }
    ]
  },
  {
    type: 'climate_summit',
    title: 'Sommet mondial sur le climat',
    description: 'La France accueille un sommet crucial sur le changement climatique.',
    severity: 40,
    category: 'opportunity',
    impacts: {
      international: { europeanInfluence: 10 }
    },
    choices: [
      {
        id: 'ambitieux',
        label: 'Objectifs ambitieux',
        description: 'Proposer des engagements audacieux',
        consequences: {
          international: { europeanInfluence: 20 },
          opinion: { overall: 20, segments: { 'ecologistes': 40, 'agriculteurs': -25 } },
          economy: { gdpGrowth: -0.3 }
        }
      },
      {
        id: 'realiste',
        label: 'Approche réaliste',
        description: 'Objectifs atteignables',
        consequences: {
          international: { europeanInfluence: 10 },
          opinion: { overall: 5 }
        }
      }
    ]
  },
  {
    type: 'refugee_crisis',
    title: 'Crise migratoire',
    description: 'Des milliers de réfugiés arrivent aux frontières françaises.',
    severity: 75,
    category: 'crisis',
    impacts: {
      social: { unrest: 30 },
      opinion: { overall: -15 }
    },
    choices: [
      {
        id: 'accueil',
        label: 'Politique d\'accueil',
        description: 'Accueillir dignement les réfugiés',
        consequences: {
          economy: { publicDebt: 2 },
          opinion: { overall: -10, segments: { 'humanitaires': 35, 'rn': -45 } },
          international: { europeanInfluence: 15 }
        }
      },
      {
        id: 'fermeture',
        label: 'Fermer les frontières',
        description: 'Protection stricte des frontières',
        consequences: {
          opinion: { overall: 10, segments: { 'humanitaires': -40 } },
          international: { europeanInfluence: -15 },
          politicalCapital: 15
        }
      },
      {
        id: 'quotas',
        label: 'Système de quotas',
        description: 'Accueil maîtrisé et réparti',
        consequences: {
          opinion: { overall: 5 },
          international: { europeanInfluence: 5 }
        }
      }
    ]
  }
];

// Combiner tous les événements
export const allEvents: EventTemplate[] = [
  ...economicEvents,
  ...socialEvents,
  ...scandalEvents,
  ...internationalEvents
];

export const getRandomEvent = (): EventTemplate => {
  return allEvents[Math.floor(Math.random() * allEvents.length)];
};

export const getEventsByCategory = (category: string): EventTemplate[] => {
  return allEvents.filter(e => e.category === category);
};

export const getEventsBySeverity = (minSeverity: number, maxSeverity: number): EventTemplate[] => {
  return allEvents.filter(e => e.severity >= minSeverity && e.severity <= maxSeverity);
};
