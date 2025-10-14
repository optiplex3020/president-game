// Système médiatique complet avec génération d'articles

export type MediaType = 'television' | 'radio' | 'press' | 'online' | 'social';

export type MediaBias =
  | 'extreme_left'
  | 'left'
  | 'center_left'
  | 'center'
  | 'center_right'
  | 'right'
  | 'extreme_right';

export type JournalisticTone =
  | 'factuel'
  | 'investigation'
  | 'opinion'
  | 'satirique'
  | 'polemique'
  | 'sensationnaliste'
  | 'academique';

export interface MediaOutlet {
  id: string;
  name: string;
  type: MediaType;

  // Ligne éditoriale
  editorialLine: {
    bias: MediaBias;
    quality: number; // 0-100: qualité journalistique
    sensationalism: number; // 0-100: tendance au sensationnalisme
    independence: number; // 0-100: indépendance éditoriale
  };

  // Audience
  audience: {
    daily: number; // Audience quotidienne
    weekly: number; // Audience hebdomadaire
    demographics: {
      segment: string; // DemographicSegment
      percentage: number;
    }[];
  };

  // Influence
  influence: {
    political: number; // 0-100: influence sur les politiques
    public: number; // 0-100: influence sur l'opinion publique
    media: number; // 0-100: influence sur d'autres médias
  };

  // Crédibilité
  credibility: {
    overall: number; // 0-100
    factChecking: number; // 0-100: rigueur fact-checking
    reputationScore: number; // 0-100
  };

  // Propriétaire
  owner: {
    name: string;
    type: 'state' | 'private' | 'foundation' | 'cooperative';
    politicalAffiliation?: string;
  };

  // Focus éditorial
  focusAreas: string[]; // "politique", "economie", "culture", etc.

  // Fréquence de publication
  publicationFrequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface Article {
  id: string;
  mediaOutletId: string;
  date: Date;

  // Contenu
  headline: string;
  subheadline?: string;
  content: string;
  wordCount: number;

  // Métadonnées
  author: {
    name: string;
    specialty: string;
    reputation: number; // 0-100
  };

  // Classification
  category: string; // "politique", "economie", etc.
  tags: string[];

  // Tonalité
  tone: JournalisticTone;
  sentiment: {
    overall: 'tres_positif' | 'positif' | 'neutre' | 'negatif' | 'tres_negatif';
    towardsGovernment: number; // -100 à +100
    towardsPresident: number; // -100 à +100
    towardsOpposition: number; // -100 à +100
  };

  // Sujets traités
  mainSubject: string;
  secondarySubjects: string[];
  mentionedCharacters: string[]; // Character IDs
  relatedEvents: string[]; // Event IDs
  relatedDecisions: string[]; // Decision IDs

  // Véracité
  factuality: {
    verifiedFacts: number; // Nombre de faits vérifiés
    unverifiedClaims: number; // Nombre d'affirmations non vérifiées
    falseInfo: number; // Nombre de fausses informations
    factCheckScore: number; // 0-100
  };

  // Impact
  reach: {
    views: number;
    shares: number;
    comments: number;
    viralityScore: number; // 0-100
  };

  // Réactions
  publicReaction: {
    positive: number; // %
    negative: number; // %
    neutral: number; // %
  };

  politicalReactions: {
    characterId: string;
    reactionType: 'support' | 'refute' | 'ignore' | 'attack';
    statement?: string;
  }[];

  // Impact sur l'opinion
  opinionImpact: {
    segment: string; // DemographicSegment
    trustChange: number;
    satisfactionChanges: Record<string, number>;
  }[];
}

export interface ArticleTemplate {
  id: string;
  name: string;
  category: string;

  // Structure de l'article
  structure: {
    headlinePattern: string; // Pattern avec variables
    contentBlocks: {
      type: 'intro' | 'context' | 'quote' | 'analysis' | 'conclusion';
      templates: string[]; // Patterns textuels
    }[];
  };

  // Conditions d'utilisation
  applicableWhen: {
    eventTypes: string[];
    minSeverity?: number;
    requiredContext?: string[];
  };

  // Biais par outlet
  biasModifiers: {
    bias: MediaBias;
    sentimentModifier: number; // -50 à +50
    emphasisAreas: string[]; // Aspects à mettre en avant
  }[];
}

export interface MediaCampaign {
  id: string;
  initiatedBy: string; // Character ID ou "government"
  target: 'positive_coverage' | 'attack_opponent' | 'policy_promotion' | 'scandal_management';

  // Paramètres
  budget: number;
  duration: number; // En jours
  startDate: Date;
  endDate: Date;

  // Canaux utilisés
  mediaChannels: {
    outletId: string;
    investment: number;
    effectiveness: number; // 0-100
  }[];

  // Messages clés
  keyMessages: string[];
  narrative: string;

  // Résultats
  results: {
    articlesPublished: number;
    totalReach: number;
    opinionShift: number; // Delta d'opinion publique
    successScore: number; // 0-100
  };
}

export interface MediaScandal {
  id: string;
  date: Date;

  // Nature du scandale
  type: 'corruption' | 'affair' | 'incompetence' | 'lie' | 'abuse' | 'financial';
  severity: number; // 0-100

  // Personnes impliquées
  involved: {
    characterId: string;
    role: 'primary' | 'secondary' | 'witness';
  }[];

  // Révélation
  revealedBy: string; // MediaOutlet ID
  investigationDuration: number; // Jours d'investigation

  // Développement
  stages: {
    date: Date;
    stage: 'revelation' | 'reaction' | 'investigation' | 'consequences' | 'resolution';
    articles: Article[];
    publicInterest: number; // 0-100
  }[];

  // Conséquences
  consequences: {
    resignations: string[]; // Character IDs
    legalActions: boolean;
    politicalCost: number;
    popularityImpact: Record<string, number>; // Character ID -> impact
  };

  // Durée de vie médiatique
  mediaLifecycle: {
    peakDate: Date;
    declineRate: number; // Vitesse à laquelle le scandale sort de l'actualité
    currentRelevance: number; // 0-100
  };
}

export interface TalkShow {
  id: string;
  name: string;
  mediaOutletId: string;

  // Format
  format: 'interview' | 'debate' | 'panel' | 'analysis';
  duration: number; // minutes

  // Animateur
  host: {
    name: string;
    reputation: number; // 0-100
    style: 'soft' | 'aggressive' | 'neutral' | 'complicit';
    bias: MediaBias;
  };

  // Audience
  averageViewers: number;
  influence: number; // 0-100

  // Émission
  episodes: {
    date: Date;
    guests: {
      characterId: string;
      performance: number; // 0-100: qualité de la prestation
      impactOnPopularity: number;
    }[];
    mainTopic: string;
    controversies: string[]; // Moments polémiques
    viralMoments: string[]; // Extraits qui deviennent viraux
  }[];
}

export interface MediaEcosystem {
  outlets: Record<string, MediaOutlet>;
  articles: Article[];
  campaigns: MediaCampaign[];
  scandals: MediaScandal[];
  talkShows: Record<string, TalkShow>;

  // Dynamiques médiatiques
  currentNarratives: {
    narrative: string;
    strength: number; // 0-100: force du narratif
    supportingOutlets: string[]; // MediaOutlet IDs
    opposingOutlets: string[];
  }[];

  // Agenda médiatique
  mediaAgenda: {
    topic: string;
    priority: number; // 0-100
    coverage: number; // Nombre d'articles
    sentiment: number; // -100 à +100
  }[];
}
