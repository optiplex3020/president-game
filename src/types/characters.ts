// Système de personnages vivants avec personnalité, motivations et relations

export type CharacterRole =
  | 'president'
  | 'prime_minister'
  | 'prime_minister_candidate'
  | 'minister'
  | 'deputy'
  | 'opposition_leader'
  | 'party_leader'
  | 'union_leader'
  | 'business_leader'
  | 'media_figure'
  | 'intellectual'
  | 'regional_leader'
  | 'foreign_leader'
  | 'advisor'
  | 'celebrity';

export type PersonalityTrait =
  | 'ambitieux' // Recherche le pouvoir et la reconnaissance
  | 'loyal' // Fidèle à ses engagements et alliés
  | 'pragmatique' // Flexible, cherche le compromis
  | 'ideologue' // Attaché à ses principes
  | 'charismatique' // Grande influence sociale
  | 'technocrate' // Compétent mais peu charismatique
  | 'opportuniste' // Profite des situations
  | 'integre' // Résiste à la corruption
  | 'corruptible' // Sensible aux avantages
  | 'impulsif' // Réactions émotionnelles
  | 'calculateur' // Planifie à long terme
  | 'populiste' // Suit l'opinion publique
  | 'elitiste' // Méprisant envers le peuple
  | 'mediateur' // Cherche à apaiser les conflits
  | 'conflictuel' // Aime la confrontation
  | 'discret' // Évite les feux de la rampe
  | 'narcissique' // Centré sur lui-même
  | 'empathique' // Sensible aux autres
  | 'visionnaire' // Pense à long terme
  | 'strategique' // Navigue avec finesse politique
  | 'conservateur'; // Résiste au changement

export type Motivation =
  | 'pouvoir' // Accumuler du pouvoir politique
  | 'richesse' // Gains financiers
  | 'reconnaissance' // Renommée et respect
  | 'ideologie' // Défendre ses idées
  | 'nation' // Servir le pays
  | 'parti' // Servir son parti
  | 'famille' // Protéger sa famille
  | 'heritage' // Laisser une trace dans l'histoire
  | 'vengeance' // Se venger d'un affront
  | 'justice' // Rétablir la justice
  | 'stabilite' // Maintenir l'ordre
  | 'changement' // Transformer la société
  | 'survie'; // Simple carrière politique

export interface PersonalityProfile {
  // Traits dominants (3-5 traits)
  traits: PersonalityTrait[];

  // Motivations hiérarchisées
  motivations: {
    type: Motivation;
    intensity: number; // 0-100
  }[];

  // Caractéristiques psychologiques
  psychology: {
    intelligence: number; // 0-100
    emotionalStability: number; // 0-100
    charisma: number; // 0-100
    integrity: number; // 0-100
    ambition: number; // 0-100
    courage: number; // 0-100: prend des risques
    patience: number; // 0-100: planifie à long terme
  };

  // Valeurs morales
  values: {
    honesty: number; // 0-100
    loyalty: number; // 0-100
    compassion: number; // 0-100
    pragmatism: number; // 0-100
  };
}

export type RelationType =
  | 'ally' // Allié politique
  | 'friend' // Ami personnel
  | 'mentor' // Mentor/protégé
  | 'rival' // Rival politique
  | 'enemy' // Ennemi
  | 'neutral' // Neutre
  | 'dependent' // Dépendant (doit des faveurs)
  | 'romantic' // Relation personnelle
  | 'family'; // Lien familial

export interface Relationship {
  withCharacterId: string;

  // Type de relation
  type: RelationType;

  // Force de la relation
  strength: number; // 0-100

  // Sentiment (peut être négatif pour ennemis)
  sentiment: number; // -100 (haine) à +100 (affection)

  // Confiance mutuelle
  trust: number; // 0-100

  // Historique
  history: {
    date: Date;
    event: string; // Description de l'événement
    impactOnRelation: number; // Impact sur la relation
  }[];

  // Dettes et faveurs
  owedFavors: number; // Nombre de faveurs dues
  receivedFavors: number; // Nombre de faveurs reçues

  // Secrets partagés
  sharedSecrets: string[];

  // Visibilité publique de la relation
  publicKnowledge: boolean; // La relation est-elle connue du public?
}

export interface Secret {
  id: string;
  type: 'scandal' | 'affair' | 'corruption' | 'crime' | 'personal' | 'political';
  description: string;
  severity: number; // 0-100: gravité si révélé

  // Qui connaît ce secret
  knownBy: string[]; // Character IDs

  // Risque de révélation
  exposureRisk: number; // 0-100

  // Conséquences si révélé
  consequences: {
    popularityLoss: number;
    politicalCapitalLoss: number;
    legalTrouble: boolean;
    resignationRisk: number; // 0-100
    affectedRelationships: {
      characterId: string;
      sentimentChange: number;
    }[];
  };
}

export interface Agenda {
  // Objectifs à court terme (1-3 mois)
  shortTerm: {
    goal: string;
    priority: number; // 0-100
    progress: number; // 0-100
    deadline?: Date;
  }[];

  // Objectifs à moyen terme (3-12 mois)
  mediumTerm: {
    goal: string;
    priority: number;
    progress: number;
  }[];

  // Objectifs à long terme (1-5 ans)
  longTerm: {
    goal: string;
    priority: number;
    ultimateGoal: boolean; // Objectif ultime du personnage
  }[];

  // Stratégies en cours
  activeStrategies: {
    name: string;
    target: string; // Character ID ou "public"
    approach: 'cooperation' | 'manipulation' | 'confrontation' | 'seduction' | 'intimidation';
    effectiveness: number; // 0-100
  }[];
}

export interface PoliticalCharacter {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;

  // Rôle et position
  role: CharacterRole;
  party?: string;
  currentPosition: string;

  // Informations personnelles
  age: number;
  gender: 'M' | 'F';
  birthPlace: string;
  education: string[];
  previousPositions: string[];

  // Personnalité
  personality: PersonalityProfile;

  // Relations
  relationships: Record<string, Relationship>; // Key = other character ID

  // Secrets
  secrets: Secret[];

  // Agenda personnel
  agenda: Agenda;

  // Compétences
  skills: {
    negotiation: number; // 0-100
    rhetoric: number; // 0-100
    strategy: number; // 0-100
    economics: number; // 0-100
    foreign_policy: number; // 0-100
    media: number; // 0-100: gestion des médias
    manipulation: number; // 0-100
  };

  // Ressources
  resources: {
    politicalCapital: number; // Capital politique personnel
    financialResources: number; // Richesse personnelle
    mediaConnections: number; // Contacts médias
    businessConnections: number; // Contacts entreprises
    internationalConnections: number; // Contacts internationaux
  };

  // État actuel
  currentState: {
    mood: 'very_happy' | 'happy' | 'neutral' | 'unhappy' | 'angry';
    stress: number; // 0-100
    energy: number; // 0-100
    popularity: number; // 0-100: popularité personnelle
    powerLevel: number; // 0-100: pouvoir réel
  };

  // Opinions politiques détaillées
  politicalViews: {
    economicPolicy: number; // -100 (très gauche) à +100 (très droite)
    socialPolicy: number; // -100 (conservateur) à +100 (progressiste)
    foreignPolicy: number; // -100 (isolationniste) à +100 (interventionniste)
    europeanIntegration: number; // -100 (souverainiste) à +100 (fédéraliste)
    environment: number; // 0 (pas prioritaire) à 100 (très prioritaire)
    immigration: number; // -100 (restrictif) à +100 (ouvert)
  };

  // Historique
  biography: string;
  achievements: {
    date: Date;
    description: string;
    publicImpact: number; // Impact sur la popularité
  }[];
  controversies: {
    date: Date;
    description: string;
    severity: number; // 0-100
    recovered: boolean; // A-t-il récupéré de la controverse?
  }[];

  // Comportement
  behaviorPatterns: {
    decisionMaking: 'impulsive' | 'calculated' | 'consultative' | 'delegative';
    conflictResolution: 'aggressive' | 'diplomatic' | 'avoidant' | 'compromising';
    communicationStyle: 'direct' | 'diplomatic' | 'vague' | 'manipulative';
    loyaltyPattern: 'unwavering' | 'pragmatic' | 'opportunistic' | 'treacherous';
  };

  // IA et réactions
  reactionRules: {
    trigger: string; // Type d'événement qui déclenche une réaction
    condition: string; // Conditions pour la réaction
    response: {
      action: string;
      probability: number; // 0-100
    }[];
  }[];
}

export interface CharacterInteraction {
  id: string;
  date: Date;
  participants: string[]; // Character IDs

  // Type d'interaction
  type: 'meeting' | 'negotiation' | 'conflict' | 'collaboration' | 'betrayal' | 'alliance';

  // Contexte
  context: string;
  private: boolean; // Interaction privée ou publique?

  // Dialogue simulé
  summary: string;

  // Résultats
  outcomes: {
    characterId: string;
    satisfaction: number; // -100 à +100
    relationshipChange: number;
    resourcesGained: string[];
    resourcesLost: string[];
    commitments: string[]; // Engagements pris
  }[];

  // Conséquences
  consequences: {
    immediate: string[];
    delayed: {
      description: string;
      triggerDate: Date;
    }[];
  };
}

export interface CharacterAction {
  characterId: string;
  date: Date;

  // Type d'action
  actionType:
  | 'public_statement'
  | 'negotiate'
  | 'threaten'
  | 'support'
  | 'oppose'
  | 'betray'
  | 'form_alliance'
  | 'break_alliance'
  | 'leak_secret'
  | 'spread_rumor'
  | 'offer_deal'
  | 'resign'
  | 'challenge';

  // Cible de l'action
  targetId?: string; // Character ID ou null si action générale

  // Description
  description: string;

  // Paramètres
  parameters: Record<string, any>;

  // Résultat
  success: boolean;
  impact: {
    onTarget?: number; // Impact sur la cible
    onPublicOpinion?: number; // Impact sur l'opinion publique
    onOwnPopularity?: number; // Impact sur sa propre popularité
    onRelationships?: {
      characterId: string;
      change: number;
    }[];
  };
}

export interface CharacterAI {
  // Logique de décision pour un personnage
  characterId: string;

  // Évaluation de la situation
  assessSituation: () => {
    threats: { source: string; severity: number }[];
    opportunities: { description: string; potential: number }[];
    alliesNeeded: boolean;
    resourcesNeeded: string[];
  };

  // Choix d'action
  decideNextAction: () => CharacterAction | null;

  // Réaction à un événement
  reactToEvent: (eventType: string, context: any) => CharacterAction | null;

  // Gestion des relations
  manageRelationships: () => {
    toStrengthen: string[]; // Character IDs
    toWeaken: string[];
    newAlliancesToForm: string[];
  };

  // Planification stratégique
  updateStrategy: () => void;
}
