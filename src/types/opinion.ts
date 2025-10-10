// Types pour le système d'opinion publique multi-couches

export type DemographicSegment =
  | 'jeunes_18_24'
  | 'jeunes_25_34'
  | 'adultes_35_49'
  | 'seniors_50_64'
  | 'retraites_65_plus'
  | 'ouvriers'
  | 'employes'
  | 'cadres'
  | 'professions_liberales'
  | 'artisans_commercants'
  | 'agriculteurs'
  | 'chomeurs'
  | 'etudiants'
  | 'retraites'
  | 'urbains'
  | 'periurbains'
  | 'ruraux'
  | 'ile_de_france'
  | 'grandes_villes'
  | 'villes_moyennes'
  | 'petites_villes'
  | 'campagne';

export type PoliticalOpinion = {
  // Confiance envers le Président
  trustInPresident: number; // 0-100

  // Satisfaction sur différents domaines
  satisfactionEconomy: number; // 0-100
  satisfactionSecurity: number; // 0-100
  satisfactionHealth: number; // 0-100
  satisfactionEducation: number; // 0-100
  satisfactionEnvironment: number; // 0-100
  satisfactionSocial: number; // 0-100

  // Intention de vote pour le prochain cycle (si élections)
  voteIntention?: string; // Party ID

  // Priorités politiques
  priorities: {
    category: string; // ex: "pouvoir_achat", "securite", "climat"
    importance: number; // 0-100
  }[];

  // Émotions dominantes
  dominantEmotions: ('colere' | 'espoir' | 'peur' | 'indifference' | 'optimisme' | 'resignation')[];

  // Exposition médiatique
  mediaExposure: {
    traditional: number; // TV, radio, presse
    social: number; // Réseaux sociaux
    independant: number; // Médias alternatifs
  };
};

export interface DemographicGroup {
  id: DemographicSegment;
  name: string;
  description: string;

  // Taille de la population
  population: number; // En millions
  percentage: number; // % de la population totale

  // Opinion actuelle
  opinion: PoliticalOpinion;

  // Caractéristiques du groupe
  characteristics: {
    volatility: number; // 0-100: à quel point l'opinion change vite
    politicalEngagement: number; // 0-100: intérêt pour la politique
    trustInMedia: number; // 0-100
    trustInInstitutions: number; // 0-100
    influenceability: number; // 0-100: sensibilité à la propagande
  };

  // Connexions avec d'autres groupes (influence sociale)
  connections: {
    segmentId: DemographicSegment;
    influence: number; // 0-100: force de l'influence
  }[];

  // Tendances historiques
  trendHistory: {
    date: Date;
    trustInPresident: number;
  }[];
}

export interface OpinionPoll {
  id: string;
  date: Date;
  pollster: string; // Institut de sondage

  // Méthodologie
  sampleSize: number;
  marginOfError: number;
  confidence: number; // 95, 99, etc.

  // Résultats
  results: {
    trustInPresident: number;
    approvalRating: number;
    disapprovalRating: number;
    noOpinion: number;
  };

  // Détail par segment
  byDemographic: Record<DemographicSegment, Partial<PoliticalOpinion>>;

  // Questions spécifiques
  specificQuestions?: {
    question: string;
    results: Record<string, number>; // Réponse -> %
  }[];

  // Crédibilité du sondage
  credibility: number; // 0-100
  mediaReach: number; // Combien de personnes l'ont vu
}

export interface SocialMediaTrend {
  id: string;
  date: Date;
  platform: 'twitter' | 'facebook' | 'tiktok' | 'instagram' | 'youtube';

  // Sujet tendance
  topic: string;
  hashtags: string[];

  // Sentiment général
  sentiment: {
    positive: number; // 0-100
    negative: number;
    neutral: number;
  };

  // Volume
  mentions: number;
  reach: number; // Nombre de personnes touchées

  // Origine
  originatedFrom: DemographicSegment[];

  // Propagation
  viralityScore: number; // 0-100: vitesse de propagation
  peakReach: number;

  // Impact sur l'opinion
  opinionImpact: {
    segment: DemographicSegment;
    trustChange: number; // Delta de confiance
  }[];
}

export interface MediaArticle {
  id: string;
  date: Date;
  title: string;
  source: string;

  // Type de média
  mediaType: 'television' | 'radio' | 'press' | 'online' | 'social';

  // Contenu
  summary: string;
  fullText?: string;

  // Tonalité
  sentiment: 'tres_positif' | 'positif' | 'neutre' | 'negatif' | 'tres_negatif';
  tone: 'factuel' | 'opinion' | 'satirique' | 'polemique' | 'investigation';

  // Sujet principal
  mainTopic: string;
  relatedDecisions?: string[]; // IDs de décisions gouvernementales

  // Portée
  audience: number; // Nombre de lecteurs/téléspectateurs
  targetDemographics: DemographicSegment[];

  // Crédibilité
  sourceCredibility: number; // 0-100
  factCheckScore?: number; // 0-100: véracité

  // Impact
  opinionImpact: {
    segment: DemographicSegment;
    impactStrength: number; // -50 à +50
  }[];
}

export interface OpinionPropagation {
  // Modèle de propagation d'opinion entre groupes sociaux
  source: DemographicSegment;
  target: DemographicSegment;

  // Force de propagation
  strength: number; // 0-100

  // Type de propagation
  mechanism: 'influence_sociale' | 'mimétisme' | 'opposition' | 'indifference';

  // Facteurs modificateurs
  factors: {
    proximityGeographic: number; // 0-100
    proximitySocial: number; // 0-100
    proximityIdeological: number; // 0-100
    mediaAmplification: number; // 0-100
  };
}

export interface PublicMood {
  // Humeur générale de la nation
  id: string;
  date: Date;

  // Indicateurs d'humeur
  generalMood: 'optimiste' | 'pessimiste' | 'inquiet' | 'colère' | 'apaise' | 'indifférent';
  moodScore: number; // -100 (très négatif) à +100 (très positif)

  // Intensité émotionnelle
  emotionalIntensity: number; // 0-100
  polarization: number; // 0-100: degré de division de l'opinion

  // Thèmes dominants dans les conversations
  dominantTopics: {
    topic: string;
    discussionVolume: number; // 0-100
    sentiment: number; // -100 à +100
  }[];

  // Demandes sociales
  socialDemands: {
    demand: string; // ex: "augmentation des salaires"
    intensity: number; // 0-100
    support: number; // % de la population
    mobilizationPotential: number; // 0-100: risque de manifestations
  }[];

  // Confiance dans les institutions
  institutionalTrust: {
    institution: string;
    trust: number; // 0-100
    evolution: number; // Delta par rapport à la période précédente
  }[];
}

export interface OpinionEvent {
  // Événements qui affectent l'opinion publique
  id: string;
  date: Date;
  type: 'decision' | 'scandal' | 'crisis' | 'achievement' | 'external' | 'media';

  // Description
  title: string;
  description: string;

  // Impact immédiat
  immediateImpact: {
    segment: DemographicSegment;
    trustChange: number;
    satisfactionChanges: Partial<Record<keyof PoliticalOpinion, number>>;
  }[];

  // Impact retardé (se manifeste après un délai)
  delayedImpact?: {
    delay: number; // En jours
    effects: OpinionEvent['immediateImpact'];
  };

  // Durée de l'effet
  decayRate: number; // 0-1: vitesse à laquelle l'effet diminue

  // Amplification médiatique
  mediaAmplification: number; // 0-100
}

export interface OpinionSimulationState {
  // État actuel de l'opinion
  demographics: Record<DemographicSegment, DemographicGroup>;

  // Humeur publique générale
  publicMood: PublicMood;

  // Sondages récents
  recentPolls: OpinionPoll[];

  // Tendances réseaux sociaux
  socialTrends: SocialMediaTrend[];

  // Articles médiatiques récents
  recentArticles: MediaArticle[];

  // Événements en cours d'impact
  activeOpinionEvents: OpinionEvent[];

  // Historique de popularité présidentielle
  popularityHistory: {
    date: Date;
    overall: number;
    bySegment: Record<DemographicSegment, number>;
  }[];
}
