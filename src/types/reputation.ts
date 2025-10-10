// Système de réputation et héritage présidentiel

export interface PresidentialLegacy {
  // Score global
  overallRating: number; // 0-100

  // Dimensions de l'héritage
  dimensions: {
    politicalLeader: number; // 0-100: Capacité à diriger et réformer
    economicManager: number; // 0-100: Gestion de l'économie
    internationalLeader: number; // 0-100: Influence mondiale
    socialUnifier: number; // 0-100: Capacité à rassembler
    reformer: number; // 0-100: Ampleur des changements
  };

  // Réalisations marquantes
  majorAchievements: {
    title: string;
    description: string;
    impact: number; // 0-100
    date: Date;
    publicApproval: number; // Approbation publique à l'époque
  }[];

  // Échecs notables
  majorFailures: {
    title: string;
    description: string;
    damage: number; // 0-100
    date: Date;
  }[];

  // Moments emblématiques
  iconicMoments: {
    type: 'speech' | 'crisis' | 'reform' | 'scandal' | 'international';
    description: string;
    date: Date;
    memorability: number; // 0-100
  }[];

  // Statistiques du mandat
  mandateStats: {
    lawsPassed: number;
    lawsRejected: number;
    averagePopularity: number;
    finalPopularity: number;
    economicGrowth: number; // Variation du PIB
    unemploymentChange: number; // Variation du chômage
    debtChange: number; // Variation de la dette publique
    crisesHandled: number;
    scandalsExperienced: number;
  };

  // Classement historique
  historicalRanking: {
    rank: number; // Position parmi tous les présidents
    totalPresidents: number;
    comparison: string; // "Meilleur que X%, moins bon que Y%"
  };

  // Citation emblématique
  iconicQuote?: string;

  // Surnom historique
  historicalNickname?: string;
}

export interface ReputationSystem {
  current: PresidentialLegacy;

  // Calculer le score de réputation
  calculateReputation: () => number;

  // Enregistrer un accomplissement
  recordAchievement: (achievement: PresidentialLegacy['majorAchievements'][0]) => void;

  // Enregistrer un échec
  recordFailure: (failure: PresidentialLegacy['majorFailures'][0]) => void;

  // Calculer le classement historique
  calculateHistoricalRanking: () => PresidentialLegacy['historicalRanking'];

  // Générer le bilan de fin de mandat
  generateFinalReport: () => string;
}
