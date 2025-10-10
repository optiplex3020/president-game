import { create } from 'zustand';
import type {
  DemographicGroup,
  DemographicSegment,
  OpinionSimulationState,
  OpinionEvent,
  OpinionPoll,
  SocialMediaTrend,
  PublicMood,
  PoliticalOpinion,
  MediaArticle,
  OpinionPropagation
} from '../types/opinion';

interface OpinionEngineState extends OpinionSimulationState {
  // Actions
  initializeOpinion: () => void;
  simulateOpinionChange: (hoursElapsed: number) => void;
  triggerOpinionEvent: (event: OpinionEvent) => void;
  conductPoll: (pollster: string) => OpinionPoll;
  generateSocialTrend: (topic: string, originSegment: DemographicSegment) => SocialMediaTrend;
  publishMediaArticle: (article: MediaArticle) => void;
  calculateOverallApproval: () => number;
  getSegmentOpinion: (segment: DemographicSegment) => DemographicGroup;
  propagateOpinion: () => void;
  updatePublicMood: () => void;
}

// Données initiales des segments démographiques
const DEMOGRAPHIC_SEGMENTS: Record<DemographicSegment, Omit<DemographicGroup, 'opinion' | 'trendHistory'>> = {
  jeunes_18_24: {
    id: 'jeunes_18_24',
    name: 'Jeunes 18-24 ans',
    description: 'Jeunes adultes en études ou début de carrière',
    population: 4.8,
    percentage: 7.2,
    characteristics: {
      volatility: 75,
      politicalEngagement: 45,
      trustInMedia: 35,
      trustInInstitutions: 40,
      influenceability: 70
    },
    connections: [
      { segmentId: 'jeunes_25_34', influence: 60 },
      { segmentId: 'etudiants', influence: 80 },
      { segmentId: 'urbains', influence: 50 }
    ]
  },
  jeunes_25_34: {
    id: 'jeunes_25_34',
    name: 'Jeunes actifs 25-34 ans',
    description: 'Jeunes professionnels en début de carrière',
    population: 8.2,
    percentage: 12.3,
    characteristics: {
      volatility: 65,
      politicalEngagement: 55,
      trustInMedia: 40,
      trustInInstitutions: 45,
      influenceability: 60
    },
    connections: [
      { segmentId: 'jeunes_18_24', influence: 40 },
      { segmentId: 'adultes_35_49', influence: 50 },
      { segmentId: 'cadres', influence: 55 }
    ]
  },
  adultes_35_49: {
    id: 'adultes_35_49',
    name: 'Adultes 35-49 ans',
    description: 'Actifs en milieu de carrière',
    population: 12.5,
    percentage: 18.7,
    characteristics: {
      volatility: 50,
      politicalEngagement: 65,
      trustInMedia: 50,
      trustInInstitutions: 55,
      influenceability: 45
    },
    connections: [
      { segmentId: 'jeunes_25_34', influence: 35 },
      { segmentId: 'seniors_50_64', influence: 40 },
      { segmentId: 'employes', influence: 60 }
    ]
  },
  seniors_50_64: {
    id: 'seniors_50_64',
    name: 'Seniors 50-64 ans',
    description: 'Actifs expérimentés proche de la retraite',
    population: 13.1,
    percentage: 19.6,
    characteristics: {
      volatility: 35,
      politicalEngagement: 75,
      trustInMedia: 60,
      trustInInstitutions: 65,
      influenceability: 35
    },
    connections: [
      { segmentId: 'adultes_35_49', influence: 30 },
      { segmentId: 'retraites_65_plus', influence: 55 },
      { segmentId: 'professions_liberales', influence: 45 }
    ]
  },
  retraites_65_plus: {
    id: 'retraites_65_plus',
    name: 'Retraités 65+',
    description: 'Retraités',
    population: 14.2,
    percentage: 21.3,
    characteristics: {
      volatility: 25,
      politicalEngagement: 85,
      trustInMedia: 70,
      trustInInstitutions: 70,
      influenceability: 30
    },
    connections: [
      { segmentId: 'seniors_50_64', influence: 40 },
      { segmentId: 'retraites', influence: 90 }
    ]
  },
  ouvriers: {
    id: 'ouvriers',
    name: 'Ouvriers',
    description: 'Travailleurs manuels du secteur industriel',
    population: 5.8,
    percentage: 8.7,
    characteristics: {
      volatility: 60,
      politicalEngagement: 55,
      trustInMedia: 35,
      trustInInstitutions: 40,
      influenceability: 65
    },
    connections: [
      { segmentId: 'employes', influence: 50 },
      { segmentId: 'ruraux', influence: 45 },
      { segmentId: 'periurbains', influence: 55 }
    ]
  },
  employes: {
    id: 'employes',
    name: 'Employés',
    description: 'Employés de bureau, services',
    population: 12.4,
    percentage: 18.6,
    characteristics: {
      volatility: 55,
      politicalEngagement: 50,
      trustInMedia: 45,
      trustInInstitutions: 50,
      influenceability: 55
    },
    connections: [
      { segmentId: 'ouvriers', influence: 40 },
      { segmentId: 'cadres', influence: 45 },
      { segmentId: 'urbains', influence: 50 }
    ]
  },
  cadres: {
    id: 'cadres',
    name: 'Cadres',
    description: 'Cadres et professions intellectuelles',
    population: 6.9,
    percentage: 10.4,
    characteristics: {
      volatility: 45,
      politicalEngagement: 70,
      trustInMedia: 60,
      trustInInstitutions: 65,
      influenceability: 40
    },
    connections: [
      { segmentId: 'employes', influence: 35 },
      { segmentId: 'professions_liberales', influence: 60 },
      { segmentId: 'urbains', influence: 65 }
    ]
  },
  professions_liberales: {
    id: 'professions_liberales',
    name: 'Professions libérales',
    description: 'Médecins, avocats, consultants indépendants',
    population: 2.1,
    percentage: 3.1,
    characteristics: {
      volatility: 40,
      politicalEngagement: 75,
      trustInMedia: 65,
      trustInInstitutions: 70,
      influenceability: 35
    },
    connections: [
      { segmentId: 'cadres', influence: 50 },
      { segmentId: 'artisans_commercants', influence: 45 }
    ]
  },
  artisans_commercants: {
    id: 'artisans_commercants',
    name: 'Artisans et commerçants',
    description: 'Petits entrepreneurs, commerçants',
    population: 3.2,
    percentage: 4.8,
    characteristics: {
      volatility: 50,
      politicalEngagement: 65,
      trustInMedia: 45,
      trustInInstitutions: 50,
      influenceability: 50
    },
    connections: [
      { segmentId: 'professions_liberales', influence: 40 },
      { segmentId: 'employes', influence: 45 },
      { segmentId: 'periurbains', influence: 50 }
    ]
  },
  agriculteurs: {
    id: 'agriculteurs',
    name: 'Agriculteurs',
    description: 'Exploitants agricoles',
    population: 0.8,
    percentage: 1.2,
    characteristics: {
      volatility: 45,
      politicalEngagement: 70,
      trustInMedia: 40,
      trustInInstitutions: 55,
      influenceability: 40
    },
    connections: [
      { segmentId: 'ruraux', influence: 80 },
      { segmentId: 'artisans_commercants', influence: 35 }
    ]
  },
  chomeurs: {
    id: 'chomeurs',
    name: 'Chômeurs',
    description: 'Personnes en recherche d\'emploi',
    population: 2.5,
    percentage: 3.7,
    characteristics: {
      volatility: 80,
      politicalEngagement: 45,
      trustInMedia: 30,
      trustInInstitutions: 25,
      influenceability: 75
    },
    connections: [
      { segmentId: 'ouvriers', influence: 60 },
      { segmentId: 'employes', influence: 55 }
    ]
  },
  etudiants: {
    id: 'etudiants',
    name: 'Étudiants',
    description: 'Étudiants en enseignement supérieur',
    population: 2.7,
    percentage: 4.0,
    characteristics: {
      volatility: 75,
      politicalEngagement: 50,
      trustInMedia: 40,
      trustInInstitutions: 45,
      influenceability: 70
    },
    connections: [
      { segmentId: 'jeunes_18_24', influence: 85 },
      { segmentId: 'jeunes_25_34', influence: 50 },
      { segmentId: 'urbains', influence: 60 }
    ]
  },
  retraites: {
    id: 'retraites',
    name: 'Retraités',
    description: 'Personnes à la retraite',
    population: 14.5,
    percentage: 21.7,
    characteristics: {
      volatility: 25,
      politicalEngagement: 85,
      trustInMedia: 70,
      trustInInstitutions: 70,
      influenceability: 30
    },
    connections: [
      { segmentId: 'retraites_65_plus', influence: 90 },
      { segmentId: 'seniors_50_64', influence: 45 }
    ]
  },
  urbains: {
    id: 'urbains',
    name: 'Urbains',
    description: 'Habitants des grandes villes',
    population: 22.0,
    percentage: 33.0,
    characteristics: {
      volatility: 60,
      politicalEngagement: 60,
      trustInMedia: 50,
      trustInInstitutions: 55,
      influenceability: 55
    },
    connections: [
      { segmentId: 'periurbains', influence: 40 },
      { segmentId: 'cadres', influence: 50 },
      { segmentId: 'employes', influence: 45 }
    ]
  },
  periurbains: {
    id: 'periurbains',
    name: 'Périurbains',
    description: 'Habitants des zones périurbaines',
    population: 18.5,
    percentage: 27.7,
    characteristics: {
      volatility: 55,
      politicalEngagement: 55,
      trustInMedia: 45,
      trustInInstitutions: 50,
      influenceability: 60
    },
    connections: [
      { segmentId: 'urbains', influence: 35 },
      { segmentId: 'ruraux', influence: 40 },
      { segmentId: 'employes', influence: 50 }
    ]
  },
  ruraux: {
    id: 'ruraux',
    name: 'Ruraux',
    description: 'Habitants des zones rurales',
    population: 9.5,
    percentage: 14.2,
    characteristics: {
      volatility: 45,
      politicalEngagement: 65,
      trustInMedia: 40,
      trustInInstitutions: 55,
      influenceability: 50
    },
    connections: [
      { segmentId: 'periurbains', influence: 35 },
      { segmentId: 'agriculteurs', influence: 60 },
      { segmentId: 'ouvriers', influence: 45 }
    ]
  },
  ile_de_france: {
    id: 'ile_de_france',
    name: 'Île-de-France',
    description: 'Habitants de la région parisienne',
    population: 12.2,
    percentage: 18.3,
    characteristics: {
      volatility: 60,
      politicalEngagement: 65,
      trustInMedia: 55,
      trustInInstitutions: 60,
      influenceability: 55
    },
    connections: [
      { segmentId: 'urbains', influence: 70 },
      { segmentId: 'cadres', influence: 60 }
    ]
  },
  grandes_villes: {
    id: 'grandes_villes',
    name: 'Grandes villes',
    description: 'Habitants des métropoles régionales',
    population: 15.3,
    percentage: 22.9,
    characteristics: {
      volatility: 60,
      politicalEngagement: 60,
      trustInMedia: 50,
      trustInInstitutions: 55,
      influenceability: 55
    },
    connections: [
      { segmentId: 'urbains', influence: 75 },
      { segmentId: 'ile_de_france', influence: 40 }
    ]
  },
  villes_moyennes: {
    id: 'villes_moyennes',
    name: 'Villes moyennes',
    description: 'Habitants des villes moyennes',
    population: 12.8,
    percentage: 19.2,
    characteristics: {
      volatility: 55,
      politicalEngagement: 55,
      trustInMedia: 45,
      trustInInstitutions: 50,
      influenceability: 60
    },
    connections: [
      { segmentId: 'periurbains', influence: 55 },
      { segmentId: 'employes', influence: 50 }
    ]
  },
  petites_villes: {
    id: 'petites_villes',
    name: 'Petites villes',
    description: 'Habitants des petites villes',
    population: 8.7,
    percentage: 13.0,
    characteristics: {
      volatility: 50,
      politicalEngagement: 60,
      trustInMedia: 45,
      trustInInstitutions: 52,
      influenceability: 58
    },
    connections: [
      { segmentId: 'villes_moyennes', influence: 45 },
      { segmentId: 'ruraux', influence: 50 }
    ]
  },
  campagne: {
    id: 'campagne',
    name: 'Campagne',
    description: 'Habitants de la campagne profonde',
    population: 7.5,
    percentage: 11.2,
    characteristics: {
      volatility: 40,
      politicalEngagement: 65,
      trustInMedia: 40,
      trustInInstitutions: 55,
      influenceability: 45
    },
    connections: [
      { segmentId: 'ruraux', influence: 80 },
      { segmentId: 'agriculteurs', influence: 65 }
    ]
  }
};

function createInitialOpinion(): PoliticalOpinion {
  return {
    trustInPresident: 45 + Math.random() * 20 - 10, // 35-55
    satisfactionEconomy: 40 + Math.random() * 20 - 10,
    satisfactionSecurity: 50 + Math.random() * 20 - 10,
    satisfactionHealth: 45 + Math.random() * 20 - 10,
    satisfactionEducation: 48 + Math.random() * 20 - 10,
    satisfactionEnvironment: 35 + Math.random() * 20 - 10,
    satisfactionSocial: 42 + Math.random() * 20 - 10,
    priorities: [
      { category: 'pouvoir_achat', importance: 80 },
      { category: 'securite', importance: 65 },
      { category: 'sante', importance: 70 }
    ],
    dominantEmotions: ['inquiet', 'resignation'],
    mediaExposure: {
      traditional: 60,
      social: 40,
      independant: 20
    }
  };
}

export const useOpinionEngine = create<OpinionEngineState>((set, get) => ({
  demographics: {} as Record<DemographicSegment, DemographicGroup>,
  publicMood: {
    id: 'mood_1',
    date: new Date(),
    generalMood: 'pessimiste',
    moodScore: -10,
    emotionalIntensity: 50,
    polarization: 45,
    dominantTopics: [
      { topic: 'pouvoir_achat', discussionVolume: 80, sentiment: -30 },
      { topic: 'climat', discussionVolume: 60, sentiment: -20 }
    ],
    socialDemands: [
      { demand: 'Augmentation des salaires', intensity: 75, support: 65, mobilizationPotential: 60 }
    ],
    institutionalTrust: [
      { institution: 'Assemblée Nationale', trust: 35, evolution: -2 },
      { institution: 'Gouvernement', trust: 40, evolution: -3 },
      { institution: 'Président', trust: 42, evolution: -1 }
    ]
  },
  recentPolls: [],
  socialTrends: [],
  recentArticles: [],
  activeOpinionEvents: [],
  popularityHistory: [],

  initializeOpinion: () => {
    const demographics: Record<DemographicSegment, DemographicGroup> = {} as any;

    for (const [segmentId, segmentData] of Object.entries(DEMOGRAPHIC_SEGMENTS)) {
      demographics[segmentId as DemographicSegment] = {
        ...segmentData,
        opinion: createInitialOpinion(),
        trendHistory: []
      };
    }

    set({ demographics });
  },

  simulateOpinionChange: (hoursElapsed: number) => {
    // Évolution naturelle + propagation entre segments
    const state = get();

    // 1. Appliquer les événements actifs
    for (const event of state.activeOpinionEvents) {
      for (const impact of event.immediateImpact) {
        const segment = state.demographics[impact.segment];
        if (segment) {
          segment.opinion.trustInPresident += impact.trustChange * (hoursElapsed / 24);
          segment.opinion.trustInPresident = Math.max(0, Math.min(100, segment.opinion.trustInPresident));
        }
      }
    }

    // 2. Propagation d'opinion entre segments
    get().propagateOpinion();

    // 3. Évolution naturelle (retour vers la moyenne)
    for (const segment of Object.values(state.demographics)) {
      const volatility = segment.characteristics.volatility / 100;
      const naturalChange = (Math.random() - 0.5) * volatility * hoursElapsed * 0.1;

      segment.opinion.trustInPresident += naturalChange;
      segment.opinion.trustInPresident = Math.max(0, Math.min(100, segment.opinion.trustInPresident));
    }

    // 4. Mettre à jour l'humeur publique
    get().updatePublicMood();

    set({ demographics: state.demographics });
  },

  triggerOpinionEvent: (event: OpinionEvent) => {
    const state = get();

    // Appliquer les impacts immédiats
    for (const impact of event.immediateImpact) {
      const segment = state.demographics[impact.segment];
      if (segment) {
        segment.opinion.trustInPresident += impact.trustChange;
        segment.opinion.trustInPresident = Math.max(0, Math.min(100, segment.opinion.trustInPresident));

        // Appliquer les autres changements de satisfaction
        for (const [key, value] of Object.entries(impact.satisfactionChanges)) {
          if (key in segment.opinion) {
            (segment.opinion as any)[key] += value;
            (segment.opinion as any)[key] = Math.max(0, Math.min(100, (segment.opinion as any)[key]));
          }
        }
      }
    }

    // Ajouter l'événement aux événements actifs
    set({
      demographics: state.demographics,
      activeOpinionEvents: [...state.activeOpinionEvents, event]
    });
  },

  conductPoll: (pollster: string) => {
    const state = get();
    const demographics = Object.values(state.demographics);

    // Calculer la confiance globale
    const totalPopulation = demographics.reduce((sum, d) => sum + d.population, 0);
    const weightedTrust = demographics.reduce((sum, d) =>
      sum + (d.opinion.trustInPresident * d.population), 0
    ) / totalPopulation;

    // Créer le sondage avec marge d'erreur
    const marginOfError = 2 + Math.random() * 2; // 2-4%
    const noise = (Math.random() - 0.5) * marginOfError;

    const poll: OpinionPoll = {
      id: `poll_${Date.now()}`,
      date: new Date(),
      pollster,
      sampleSize: 1000 + Math.floor(Math.random() * 500),
      marginOfError,
      confidence: 95,
      results: {
        trustInPresident: Math.max(0, Math.min(100, weightedTrust + noise)),
        approvalRating: Math.max(0, Math.min(100, weightedTrust + noise)),
        disapprovalRating: Math.max(0, Math.min(100, 100 - weightedTrust - noise)),
        noOpinion: 5 + Math.random() * 5
      },
      byDemographic: {} as any,
      credibility: 70 + Math.random() * 25,
      mediaReach: 100000 + Math.floor(Math.random() * 500000)
    };

    // Détails par segment
    for (const segment of demographics) {
      poll.byDemographic[segment.id] = {
        trustInPresident: Math.max(0, Math.min(100,
          segment.opinion.trustInPresident + (Math.random() - 0.5) * marginOfError
        ))
      };
    }

    set({
      recentPolls: [...state.recentPolls.slice(-10), poll]
    });

    return poll;
  },

  generateSocialTrend: (topic: string, originSegment: DemographicSegment) => {
    const trend: SocialMediaTrend = {
      id: `trend_${Date.now()}`,
      date: new Date(),
      platform: ['twitter', 'facebook', 'tiktok', 'instagram', 'youtube'][Math.floor(Math.random() * 5)] as any,
      topic,
      hashtags: [`#${topic.replace(/ /g, '')}`, '#France', '#Politique'],
      sentiment: {
        positive: 20 + Math.random() * 30,
        negative: 30 + Math.random() * 40,
        neutral: 20 + Math.random() * 20
      },
      mentions: Math.floor(10000 + Math.random() * 90000),
      reach: Math.floor(100000 + Math.random() * 900000),
      originatedFrom: [originSegment],
      viralityScore: 40 + Math.random() * 50,
      peakReach: Math.floor(500000 + Math.random() * 1500000),
      opinionImpact: []
    };

    set(state => ({
      socialTrends: [...state.socialTrends.slice(-20), trend]
    }));

    return trend;
  },

  publishMediaArticle: (article: MediaArticle) => {
    const state = get();

    // Appliquer l'impact de l'article sur les segments ciblés
    for (const impact of article.opinionImpact) {
      const segment = state.demographics[impact.segment];
      if (segment) {
        const impactStrength = impact.impactStrength * (article.sourceCredibility / 100);
        segment.opinion.trustInPresident += impactStrength * 0.1;
        segment.opinion.trustInPresident = Math.max(0, Math.min(100, segment.opinion.trustInPresident));
      }
    }

    set({
      demographics: state.demographics,
      recentArticles: [...state.recentArticles.slice(-50), article]
    });
  },

  calculateOverallApproval: () => {
    const state = get();
    const demographics = Object.values(state.demographics);
    const totalPopulation = demographics.reduce((sum, d) => sum + d.population, 0);

    return demographics.reduce((sum, d) =>
      sum + (d.opinion.trustInPresident * d.population), 0
    ) / totalPopulation;
  },

  getSegmentOpinion: (segment: DemographicSegment) => {
    return get().demographics[segment];
  },

  propagateOpinion: () => {
    const state = get();

    // Propager l'opinion entre segments connectés
    for (const segment of Object.values(state.demographics)) {
      for (const connection of segment.connections) {
        const targetSegment = state.demographics[connection.segmentId];
        if (targetSegment) {
          const influenceStrength = connection.influence / 100;
          const trustDifference = segment.opinion.trustInPresident - targetSegment.opinion.trustInPresident;

          // Convergence partielle
          targetSegment.opinion.trustInPresident += trustDifference * influenceStrength * 0.05;
          targetSegment.opinion.trustInPresident = Math.max(0, Math.min(100, targetSegment.opinion.trustInPresident));
        }
      }
    }

    set({ demographics: state.demographics });
  },

  updatePublicMood: () => {
    const state = get();
    const overallApproval = get().calculateOverallApproval();

    // Calculer le score d'humeur
    const moodScore = (overallApproval - 50) * 2; // -100 à +100

    // Déterminer l'humeur générale
    let generalMood: PublicMood['generalMood'] = 'indifférent';
    if (moodScore > 30) generalMood = 'optimiste';
    else if (moodScore > 10) generalMood = 'apaise';
    else if (moodScore < -30) generalMood = 'colère';
    else if (moodScore < -10) generalMood = 'pessimiste';
    else generalMood = 'inquiet';

    // Calculer la polarisation
    const opinions = Object.values(state.demographics).map(d => d.opinion.trustInPresident);
    const mean = opinions.reduce((sum, o) => sum + o, 0) / opinions.length;
    const variance = opinions.reduce((sum, o) => sum + Math.pow(o - mean, 2), 0) / opinions.length;
    const polarization = Math.min(100, Math.sqrt(variance) * 5);

    set({
      publicMood: {
        ...state.publicMood,
        date: new Date(),
        generalMood,
        moodScore,
        polarization,
        emotionalIntensity: 40 + polarization * 0.6
      }
    });
  }
}));
