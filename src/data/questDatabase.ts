/**
 * QUEST DATABASE
 * Base de données des quêtes et objectifs du jeu
 */

import type { Quest } from '../systems/QuestEngine';

// ==================== QUÊTES TUTORIEL ====================
export const tutorialQuests: Quest[] = [
  {
    id: 'quest_tutorial_welcome',
    title: 'Bienvenue à l\'Élysée',
    description: 'Découvrez les bases de la présidence française et formez votre premier gouvernement.',
    category: 'tutorial',
    difficulty: 'easy',
    status: 'available',
    progress: 0,
    priority: 100,
    icon: '🏛️',
    objectives: [
      {
        id: 'obj_view_dashboard',
        description: 'Explorer le tableau de bord présidentiel',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_read_briefing',
        description: 'Lire le briefing du jour 1',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 10,
        description: '+10 Capital politique'
      }
    ],
    unlocks: ['quest_tutorial_first_law']
  },

  {
    id: 'quest_tutorial_first_law',
    title: 'Votre première loi',
    description: 'Proposez et faites voter votre première loi à l\'Assemblée nationale.',
    category: 'tutorial',
    difficulty: 'easy',
    status: 'locked',
    progress: 0,
    priority: 99,
    icon: '⚖️',
    prerequisites: ['quest_tutorial_welcome'],
    objectives: [
      {
        id: 'obj_propose_law',
        description: 'Proposer une loi au Parlement',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_law_passed',
        description: 'Faire adopter la loi',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 25,
        description: '+25 Capital politique'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Législateur débutant'
      }
    ],
    unlocks: ['quest_tutorial_first_negotiation']
  },

  {
    id: 'quest_tutorial_first_negotiation',
    title: 'L\'art de la négociation',
    description: 'Négociez avec un député pour obtenir son soutien sur un vote important.',
    category: 'tutorial',
    difficulty: 'medium',
    status: 'locked',
    progress: 0,
    priority: 98,
    icon: '🤝',
    prerequisites: ['quest_tutorial_first_law'],
    objectives: [
      {
        id: 'obj_negotiate_deputy',
        description: 'Négocier avec un député',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_successful_negotiation',
        description: 'Conclure une négociation avec succès',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 20,
        description: '+20 Capital politique'
      },
      {
        type: 'unlock',
        value: 1,
        description: 'Déblocage: Négociations avancées'
      }
    ]
  }
];

// ==================== QUÊTES PRINCIPALES ====================
export const mainQuests: Quest[] = [
  {
    id: 'quest_main_100_days',
    title: 'Les 100 premiers jours',
    description: 'Marquez votre empreinte lors des 100 premiers jours de votre mandat. Votre popularité doit rester au-dessus de 40%.',
    category: 'main',
    difficulty: 'medium',
    status: 'available',
    progress: 0,
    priority: 90,
    icon: '📅',
    timeLimit: 100,
    objectives: [
      {
        id: 'obj_survive_100_days',
        description: 'Atteindre le jour 100 de mandat',
        currentValue: 0,
        targetValue: 100,
        completed: false
      },
      {
        id: 'obj_maintain_popularity',
        description: 'Maintenir popularité ≥ 40%',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_pass_3_laws',
        description: 'Faire adopter au moins 3 lois',
        currentValue: 0,
        targetValue: 3,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 50,
        description: '+50 Capital politique'
      },
      {
        type: 'reputation',
        value: 10,
        description: '+10 Réputation globale'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Le Réformateur précoce'
      }
    ],
    failConditions: [
      {
        type: 'stat',
        description: 'Popularité tombe sous 30%',
        value: 30
      }
    ]
  },

  {
    id: 'quest_main_first_year',
    title: 'Un an au pouvoir',
    description: 'Consolidez votre mandat et prouvez votre capacité à gouverner sur la durée.',
    category: 'main',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    priority: 85,
    icon: '🏆',
    timeLimit: 365,
    objectives: [
      {
        id: 'obj_reach_year_1',
        description: 'Atteindre 1 an de mandat',
        currentValue: 0,
        targetValue: 365,
        completed: false
      },
      {
        id: 'obj_economic_growth',
        description: 'Croissance économique positive',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_10_laws_passed',
        description: 'Faire adopter 10 lois',
        currentValue: 0,
        targetValue: 10,
        completed: false
      },
      {
        id: 'obj_no_major_crisis',
        description: 'Ne pas avoir de crise majeure non résolue',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 100,
        description: '+100 Capital politique'
      },
      {
        type: 'reputation',
        value: 20,
        description: '+20 Réputation globale'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Un an de présidence'
      }
    ],
    unlocks: ['quest_main_midterm']
  }
];

// ==================== QUÊTES LÉGISLATIVES ====================
export const legislativeQuests: Quest[] = [
  {
    id: 'quest_legislative_prolific',
    title: 'Législateur prolifique',
    description: 'Faites adopter 5 lois en moins de 6 mois.',
    category: 'legislative',
    difficulty: 'medium',
    status: 'available',
    progress: 0,
    priority: 70,
    icon: '📜',
    timeLimit: 180,
    objectives: [
      {
        id: 'obj_pass_5_laws',
        description: 'Faire adopter 5 lois',
        currentValue: 0,
        targetValue: 5,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 40,
        description: '+40 Capital politique'
      },
      {
        type: 'reputation',
        value: 5,
        description: '+5 Réputation législative'
      }
    ]
  },

  {
    id: 'quest_legislative_major_reform',
    title: 'Grande réforme',
    description: 'Faites adopter une réforme majeure avec au moins 60% de votes favorables.',
    category: 'legislative',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    priority: 75,
    icon: '⚡',
    objectives: [
      {
        id: 'obj_major_law_passed',
        description: 'Faire adopter une loi majeure',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_strong_majority',
        description: 'Obtenir ≥60% de votes favorables',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 60,
        description: '+60 Capital politique'
      },
      {
        type: 'reputation',
        value: 15,
        description: '+15 Réputation législative'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Grand Réformateur'
      }
    ]
  }
];

// ==================== QUÊTES DE POPULARITÉ ====================
export const popularityQuests: Quest[] = [
  {
    id: 'quest_popularity_beloved',
    title: 'Président aimé',
    description: 'Atteignez et maintenez une popularité de 60% ou plus.',
    category: 'popularity',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    priority: 80,
    icon: '❤️',
    objectives: [
      {
        id: 'obj_reach_60_popularity',
        description: 'Atteindre 60% de popularité',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_maintain_30_days',
        description: 'Maintenir ≥60% pendant 30 jours',
        currentValue: 0,
        targetValue: 30,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 75,
        description: '+75 Capital politique'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Président populaire'
      }
    ]
  },

  {
    id: 'quest_popularity_recovery',
    title: 'Remontée spectaculaire',
    description: 'Remontez votre popularité de 15 points ou plus en moins de 60 jours.',
    category: 'popularity',
    difficulty: 'medium',
    status: 'available',
    progress: 0,
    priority: 65,
    icon: '📈',
    timeLimit: 60,
    objectives: [
      {
        id: 'obj_popularity_increase',
        description: 'Augmenter la popularité de 15 points',
        currentValue: 0,
        targetValue: 15,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 50,
        description: '+50 Capital politique'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Phoenix politique'
      }
    ]
  }
];

// ==================== QUÊTES ÉCONOMIQUES ====================
export const economyQuests: Quest[] = [
  {
    id: 'quest_economy_growth',
    title: 'Relance économique',
    description: 'Faites croître le PIB de 2% ou plus.',
    category: 'economy',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    priority: 75,
    icon: '💰',
    objectives: [
      {
        id: 'obj_gdp_growth',
        description: 'Atteindre 2% de croissance du PIB',
        currentValue: 0,
        targetValue: 2,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 70,
        description: '+70 Capital politique'
      },
      {
        type: 'reputation',
        value: 20,
        description: '+20 Réputation économique'
      }
    ]
  },

  {
    id: 'quest_economy_unemployment',
    title: 'Plein emploi',
    description: 'Faites baisser le chômage sous 7%.',
    category: 'economy',
    difficulty: 'legendary',
    status: 'available',
    progress: 0,
    priority: 85,
    icon: '👔',
    objectives: [
      {
        id: 'obj_unemployment_reduction',
        description: 'Chômage < 7%',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 100,
        description: '+100 Capital politique'
      },
      {
        type: 'reputation',
        value: 30,
        description: '+30 Réputation économique'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Miracle économique'
      }
    ]
  }
];

// ==================== QUÊTES DE CRISE ====================
export const crisisQuests: Quest[] = [
  {
    id: 'quest_crisis_manager',
    title: 'Gestionnaire de crise',
    description: 'Résolvez avec succès une crise majeure sans que votre popularité ne baisse de plus de 10 points.',
    category: 'crisis',
    difficulty: 'hard',
    status: 'available',
    progress: 0,
    priority: 60,
    icon: '🚨',
    objectives: [
      {
        id: 'obj_resolve_crisis',
        description: 'Résoudre une crise majeure',
        currentValue: 0,
        targetValue: 1,
        completed: false
      },
      {
        id: 'obj_limit_popularity_loss',
        description: 'Perte de popularité ≤ 10 points',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 80,
        description: '+80 Capital politique'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Capitaine dans la tempête'
      }
    ]
  }
];

// ==================== QUÊTES CACHÉES ====================
export const hiddenQuests: Quest[] = [
  {
    id: 'quest_hidden_perfect_week',
    title: 'Semaine parfaite',
    description: 'Passez une semaine complète sans aucun événement négatif.',
    category: 'hidden',
    difficulty: 'medium',
    status: 'available',
    progress: 0,
    priority: 50,
    icon: '✨',
    hidden: true,
    objectives: [
      {
        id: 'obj_7_days_no_negative',
        description: '7 jours sans événement négatif',
        currentValue: 0,
        targetValue: 7,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 30,
        description: '+30 Capital politique'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Semaine bénie'
      }
    ]
  },

  {
    id: 'quest_hidden_consensus',
    title: 'Maître du consensus',
    description: 'Faites adopter une loi avec le soutien de 90% des députés.',
    category: 'hidden',
    difficulty: 'legendary',
    status: 'available',
    progress: 0,
    priority: 95,
    icon: '🕊️',
    hidden: true,
    objectives: [
      {
        id: 'obj_90_percent_support',
        description: 'Loi adoptée avec ≥90% de votes favorables',
        currentValue: 0,
        targetValue: 1,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'politicalCapital',
        value: 150,
        description: '+150 Capital politique'
      },
      {
        type: 'reputation',
        value: 50,
        description: '+50 Réputation globale'
      },
      {
        type: 'achievement',
        value: 1,
        description: 'Succès: Rassembleur légendaire'
      }
    ]
  }
];

// Export consolidé
export const allQuests: Quest[] = [
  ...tutorialQuests,
  ...mainQuests,
  ...legislativeQuests,
  ...popularityQuests,
  ...economyQuests,
  ...crisisQuests,
  ...hiddenQuests
];

export default allQuests;
