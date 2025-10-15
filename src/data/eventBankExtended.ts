/**
 * BANQUE D'ÉVÉNEMENTS ÉTENDUE (Partie 2)
 * Événements environnementaux, technologiques, culturels, etc.
 */

import type { GameEvent } from '../types/events';

type EventTemplate = Omit<GameEvent, 'id' | 'date'>;

// ==================== ÉVÉNEMENTS ENVIRONNEMENTAUX ====================
export const environmentalEvents: EventTemplate[] = [
  {
    type: 'natural_disaster',
    title: 'Canicule extrême',
    description: 'Une vague de chaleur historique frappe la France. Records de température battus.',
    severity: 70,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -0.5 },
      opinion: { overall: -10 }
    },
    choices: [
      {
        id: 'urgence',
        label: 'Plan canicule d\'urgence',
        description: 'Mobiliser tous les moyens',
        consequences: {
          economy: { publicDebt: 1 },
          opinion: { overall: 20 }
        }
      },
      {
        id: 'climat',
        label: 'Accélérer transition écologique',
        description: 'En faire un électrochoc climatique',
        consequences: {
          economy: { publicDebt: 3, gdpGrowth: -0.3 },
          opinion: { overall: 15, segments: { 'ecologistes': 40 } },
          politicalCapital: -10
        }
      }
    ]
  },
  {
    type: 'flood_disaster',
    title: 'Inondations catastrophiques',
    description: 'Des pluies diluviennes provoquent des inondations majeures.',
    severity: 85,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -0.8 },
      opinion: { overall: 0 }
    },
    choices: [
      {
        id: 'aide_maximale',
        label: 'Aide exceptionnelle',
        description: 'Indemnisation totale des sinistrés',
        consequences: {
          economy: { publicDebt: 5 },
          opinion: { overall: 30 },
          politicalCapital: 15
        }
      },
      {
        id: 'aide_standard',
        label: 'Aide standard',
        description: 'Dispositif d\'urgence habituel',
        consequences: {
          economy: { publicDebt: 2 },
          opinion: { overall: 5 }
        }
      }
    ]
  },
  {
    type: 'pollution_crisis',
    title: 'Pic de pollution historique',
    description: 'Paris suffoque sous un nuage de pollution. Circulation alternée obligatoire.',
    severity: 60,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15, segments: { 'urbains': -25 } }
    },
    choices: [
      {
        id: 'restriction',
        label: 'Restrictions draconiennes',
        description: 'Limiter drastiquement la circulation',
        consequences: {
          opinion: { overall: 10, segments: { 'automobilistes': -30 } },
          economy: { gdpGrowth: -0.2 }
        }
      },
      {
        id: 'transports',
        label: 'Gratuité des transports',
        description: 'Inciter aux transports en commun',
        consequences: {
          economy: { publicDebt: 1 },
          opinion: { overall: 20 }
        }
      }
    ]
  },
  {
    type: 'nuclear_incident',
    title: 'Incident nucléaire',
    description: 'Un incident technique dans une centrale nucléaire française.',
    severity: 88,
    category: 'crisis',
    impacts: {
      opinion: { overall: -30 },
      social: { unrest: 45 }
    },
    choices: [
      {
        id: 'transparence',
        label: 'Transparence totale',
        description: 'Communication complète et honnête',
        consequences: {
          opinion: { overall: 15 },
          social: { unrest: -20 },
          politicalCapital: 10
        }
      },
      {
        id: 'fermeture',
        label: 'Fermeture de la centrale',
        description: 'Décision radicale',
        consequences: {
          economy: { gdpGrowth: -0.8 },
          opinion: { overall: 20, segments: { 'ecologistes': 45 } },
          social: { unrest: -30 }
        }
      }
    ]
  },
  {
    type: 'biodiversity_crisis',
    title: 'Effondrement de la biodiversité',
    description: 'Un rapport alarmant révèle l\'extinction massive d\'espèces en France.',
    severity: 65,
    category: 'crisis',
    impacts: {
      opinion: { overall: -10, segments: { 'ecologistes': -35 } }
    },
    choices: [
      {
        id: 'protection',
        label: 'Plan de protection massif',
        description: 'Créer de nouvelles réserves naturelles',
        consequences: {
          economy: { publicDebt: 3 },
          opinion: { overall: 20, segments: { 'ecologistes': 45, 'agriculteurs': -25 } }
        }
      },
      {
        id: 'minimal',
        label: 'Mesures ciblées',
        description: 'Actions prioritaires uniquement',
        consequences: {
          opinion: { overall: 5 }
        }
      }
    ]
  }
];

// ==================== ÉVÉNEMENTS TECHNOLOGIQUES ====================
export const techEvents: EventTemplate[] = [
  {
    type: 'ai_breakthrough',
    title: 'Percée française dans l\'IA',
    description: 'Une startup française développe une IA révolutionnaire.',
    severity: 35,
    category: 'opportunity',
    impacts: {
      economy: { gdpGrowth: 0.5 },
      opinion: { overall: 15 }
    },
    choices: [
      {
        id: 'soutien',
        label: 'Soutien massif',
        description: 'Investir dans l\'IA française',
        consequences: {
          economy: { publicDebt: 2, gdpGrowth: 1 },
          opinion: { overall: 20 }
        }
      },
      {
        id: 'regulation',
        label: 'Réguler l\'IA',
        description: 'Encadrer les usages',
        consequences: {
          opinion: { overall: 10 },
          economy: { gdpGrowth: 0.2 }
        }
      }
    ]
  },
  {
    type: 'cyber_attack',
    title: 'Cyberattaque massive',
    description: 'Les systèmes informatiques de l\'État sont piratés.',
    severity: 80,
    category: 'crisis',
    impacts: {
      opinion: { overall: -20 },
      politicalCapital: -25
    },
    choices: [
      {
        id: 'transparence',
        label: 'Reconnaître publiquement',
        description: 'Informer les citoyens',
        consequences: {
          opinion: { overall: 5 },
          politicalCapital: -10
        }
      },
      {
        id: 'secret',
        label: 'Gérer discrètement',
        description: 'Éviter la panique',
        consequences: {
          opinion: { overall: -15 },
          politicalCapital: 5
        }
      },
      {
        id: 'riposte',
        label: 'Riposte cyber',
        description: 'Contre-attaque informatique',
        consequences: {
          international: { europeanInfluence: -10 },
          opinion: { overall: 10 },
          politicalCapital: 10
        }
      }
    ]
  },
  {
    type: 'tech_giant_conflict',
    title: 'Conflit avec les GAFAM',
    description: 'Les géants tech menacent de quitter la France face à la taxation.',
    severity: 65,
    category: 'crisis',
    impacts: {
      economy: { gdpGrowth: -0.5 },
      opinion: { overall: -10 }
    },
    choices: [
      {
        id: 'fermete',
        label: 'Maintenir la taxe',
        description: 'Ne pas céder au chantage',
        consequences: {
          economy: { gdpGrowth: -0.8 },
          opinion: { overall: 20 },
          politicalCapital: 15
        }
      },
      {
        id: 'negociation',
        label: 'Négocier',
        description: 'Trouver un compromis',
        consequences: {
          opinion: { overall: -5 },
          economy: { gdpGrowth: 0.2 }
        }
      }
    ]
  },
  {
    type: 'space_achievement',
    title: 'Succès spatial français',
    description: 'Ariane 6 réussit son lancement. La France leader du spatial européen.',
    severity: 30,
    category: 'opportunity',
    impacts: {
      opinion: { overall: 20 },
      international: { europeanInfluence: 15 }
    },
    choices: [
      {
        id: 'investir',
        label: 'Programme spatial ambitieux',
        description: 'Doubler les investissements',
        consequences: {
          economy: { publicDebt: 5 },
          opinion: { overall: 15 },
          international: { europeanInfluence: 20 }
        }
      },
      {
        id: 'maintenir',
        label: 'Maintenir l\'effort',
        description: 'Continuer sur la lancée',
        consequences: {
          opinion: { overall: 5 }
        }
      }
    ]
  },
  {
    type: 'data_scandal',
    title: 'Scandale de données personnelles',
    description: 'Des millions de données de citoyens français ont fuité.',
    severity: 75,
    category: 'crisis',
    impacts: {
      opinion: { overall: -25 },
      politicalCapital: -20
    },
    choices: [
      {
        id: 'protection',
        label: 'Loi sur la protection des données',
        description: 'Régulation stricte',
        consequences: {
          opinion: { overall: 25 },
          economy: { gdpGrowth: -0.2 },
          politicalCapital: -10
        }
      },
      {
        id: 'enquete',
        label: 'Enquête approfondie',
        description: 'Identifier les responsables',
        consequences: {
          opinion: { overall: 15 },
          politicalCapital: -5
        }
      }
    ]
  }
];

// ==================== ÉVÉNEMENTS CULTURELS ====================
export const culturalEvents: EventTemplate[] = [
  {
    type: 'cultural_victory',
    title: 'Palme d\'Or française',
    description: 'Un film français remporte la Palme d\'Or à Cannes.',
    severity: 20,
    category: 'opportunity',
    impacts: {
      opinion: { overall: 10 }
    },
    choices: []
  },
  {
    type: 'olympic_games',
    title: 'Préparatifs JO Paris 2024',
    description: 'Polémique sur le budget et l\'organisation des Jeux Olympiques.',
    severity: 60,
    category: 'crisis',
    impacts: {
      economy: { publicDebt: 8 },
      opinion: { overall: -15 }
    },
    choices: [
      {
        id: 'maintien',
        label: 'Maintenir le budget',
        description: 'Des JO d\'excellence',
        consequences: {
          economy: { publicDebt: 5 },
          opinion: { overall: -10 },
          international: { europeanInfluence: 15 }
        }
      },
      {
        id: 'reduction',
        label: 'Réduire les coûts',
        description: 'JO plus sobres',
        consequences: {
          opinion: { overall: 10 },
          international: { europeanInfluence: -10 }
        }
      }
    ]
  },
  {
    type: 'heritage_fire',
    title: 'Incendie d\'un monument historique',
    description: 'Un monument emblématique français prend feu.',
    severity: 70,
    category: 'crisis',
    impacts: {
      opinion: { overall: -20 }
    },
    choices: [
      {
        id: 'reconstruction',
        label: 'Reconstruction à l\'identique',
        description: 'Respecter l\'histoire',
        consequences: {
          economy: { publicDebt: 3 },
          opinion: { overall: 30 }
        }
      },
      {
        id: 'moderne',
        label: 'Reconstruction moderne',
        description: 'Architecture contemporaine',
        consequences: {
          economy: { publicDebt: 2 },
          opinion: { overall: -10, segments: { 'jeunes': 20 } }
        }
      }
    ]
  },
  {
    type: 'museum_opening',
    title: 'Ouverture d\'un grand musée',
    description: 'Inauguration d\'un musée national d\'envergure.',
    severity: 25,
    category: 'opportunity',
    impacts: {
      opinion: { overall: 15 },
      economy: { gdpGrowth: 0.1 }
    },
    choices: []
  },
  {
    type: 'language_protection',
    title: 'Débat sur la langue française',
    description: 'Polémique sur l\'usage de l\'anglais et la protection du français.',
    severity: 45,
    category: 'crisis',
    impacts: {
      opinion: { overall: -10 }
    },
    choices: [
      {
        id: 'protection',
        label: 'Loi de protection renforcée',
        description: 'Quotas de français obligatoires',
        consequences: {
          opinion: { overall: 15, segments: { 'jeunes': -20 } },
          economy: { gdpGrowth: -0.1 }
        }
      },
      {
        id: 'pragmatisme',
        label: 'Approche pragmatique',
        description: 'Promouvoir sans contraindre',
        consequences: {
          opinion: { overall: 5 }
        }
      }
    ]
  }
];

// ==================== ÉVÉNEMENTS SPORTIFS ====================
export const sportsEvents: EventTemplate[] = [
  {
    type: 'world_cup_win',
    title: 'La France remporte la Coupe du Monde',
    description: 'L\'équipe de France championne du monde de football !',
    severity: 15,
    category: 'opportunity',
    impacts: {
      opinion: { overall: 35 }
    },
    choices: [
      {
        id: 'celebration',
        label: 'Célébration nationale',
        description: 'Réception à l\'Élysée',
        consequences: {
          opinion: { overall: 10 },
          politicalCapital: 20
        }
      }
    ]
  },
  {
    type: 'sports_scandal',
    title: 'Scandale de dopage',
    description: 'Des athlètes français impliqués dans un réseau de dopage.',
    severity: 60,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15 }
    },
    choices: [
      {
        id: 'fermete',
        label: 'Sanctions exemplaires',
        description: 'Tolérance zéro',
        consequences: {
          opinion: { overall: 20 }
        }
      },
      {
        id: 'enquete',
        label: 'Enquête approfondie',
        description: 'Démanteler les réseaux',
        consequences: {
          opinion: { overall: 15 }
        }
      }
    ]
  },
  {
    type: 'stadium_project',
    title: 'Projet de grand stade',
    description: 'Controverse sur la construction d\'un méga-stade public.',
    severity: 55,
    category: 'crisis',
    impacts: {
      economy: { publicDebt: 4 },
      opinion: { overall: -10 }
    },
    choices: [
      {
        id: 'public',
        label: 'Financement public',
        description: 'Investissement d\'État',
        consequences: {
          economy: { publicDebt: 6 },
          opinion: { overall: -15, segments: { 'sportifs': 30 } }
        }
      },
      {
        id: 'prive',
        label: 'Partenariat public-privé',
        description: 'Limiter les coûts publics',
        consequences: {
          economy: { publicDebt: 2 },
          opinion: { overall: 5 }
        }
      },
      {
        id: 'annulation',
        label: 'Annuler le projet',
        description: 'Trop coûteux',
        consequences: {
          opinion: { overall: 10, segments: { 'sportifs': -30 } }
        }
      }
    ]
  }
];

// ==================== ÉVÉNEMENTS MÉDIATIQUES ====================
export const mediaEvents: EventTemplate[] = [
  {
    type: 'fake_news_crisis',
    title: 'Crise des fake news',
    description: 'Des désinformations massives circulent sur les réseaux sociaux.',
    severity: 70,
    category: 'crisis',
    impacts: {
      opinion: { overall: -15 },
      social: { unrest: 20 }
    },
    choices: [
      {
        id: 'regulation',
        label: 'Réguler les réseaux sociaux',
        description: 'Loi anti-fake news',
        consequences: {
          opinion: { overall: 15, segments: { 'jeunes': -25 } },
          social: { unrest: -15 }
        }
      },
      {
        id: 'education',
        label: 'Éducation aux médias',
        description: 'Former l\'esprit critique',
        consequences: {
          economy: { publicDebt: 1 },
          opinion: { overall: 20 }
        }
      }
    ]
  },
  {
    type: 'press_freedom',
    title: 'Attaque contre la liberté de la presse',
    description: 'Des journalistes sont menacés pour leurs investigations.',
    severity: 75,
    category: 'crisis',
    impacts: {
      opinion: { overall: -20 },
      international: { europeanInfluence: -15 }
    },
    choices: [
      {
        id: 'protection',
        label: 'Protection des journalistes',
        description: 'Renforcer leur sécurité',
        consequences: {
          opinion: { overall: 25 },
          international: { europeanInfluence: 15 },
          politicalCapital: 10
        }
      },
      {
        id: 'enquete',
        label: 'Enquête sur les menaces',
        description: 'Identifier les responsables',
        consequences: {
          opinion: { overall: 15 },
          politicalCapital: 5
        }
      }
    ]
  },
  {
    type: 'media_concentration',
    title: 'Concentration des médias',
    description: 'Un milliardaire rachète plusieurs grands médias français.',
    severity: 65,
    category: 'crisis',
    impacts: {
      opinion: { overall: -18 }
    },
    choices: [
      {
        id: 'regulation',
        label: 'Réguler la concentration',
        description: 'Limiter le nombre de médias détenus',
        consequences: {
          opinion: { overall: 20 },
          economy: { gdpGrowth: -0.1 }
        }
      },
      {
        id: 'libre_marche',
        label: 'Laisser faire',
        description: 'Liberté d\'entreprendre',
        consequences: {
          opinion: { overall: -15, segments: { 'cadres': 15 } }
        }
      }
    ]
  }
];

// Combiner tous les événements étendus
export const allExtendedEvents: EventTemplate[] = [
  ...environmentalEvents,
  ...techEvents,
  ...culturalEvents,
  ...sportsEvents,
  ...mediaEvents
];

export const getAllEventsWithExtended = (): EventTemplate[] => {
  // allEvents est importé depuis eventBank.ts en haut du fichier
  return [...allExtendedEvents];
};
