export type PartyId =
  | 'renaissance'
  | 'rn'
  | 'lfi'
  | 'lr'
  | 'ps'
  | 'ecologistes'
  | 'horizons'
  | 'modem'
  | 'pcf'
  | 'liot'
  | 'udi'
  | 'divers_gauche'
  | 'divers_droite'
  | 'independant';

export type Region =
  | 'ile_de_france'
  | 'auvergne_rhone_alpes'
  | 'nouvelle_aquitaine'
  | 'occitanie'
  | 'hauts_de_france'
  | 'grand_est'
  | 'provence_alpes_cote_azur'
  | 'pays_de_la_loire'
  | 'bretagne'
  | 'normandie'
  | 'bourgogne_franche_comte'
  | 'centre_val_de_loire'
  | 'corse'
  | 'outre_mer';

export type IdeologicalPosition = {
  economicLeft: number; // -100 (très gauche) à +100 (très droite)
  social: number; // -100 (conservateur) à +100 (progressiste)
  european: number; // -100 (souverainiste) à +100 (pro-européen)
  environmental: number; // 0 (pas prioritaire) à 100 (écologie prioritaire)
  authoritarian: number; // -100 (libertaire) à +100 (autoritaire)
};

export type DeputyTrait =
  | 'fidele' // Suit toujours la ligne du parti
  | 'rebelle' // Vote souvent contre le parti
  | 'pragmatique' // Vote selon ses intérêts et négociations
  | 'ideologue' // Vote selon ses convictions personnelles
  | 'opportuniste' // Cherche à se faire remarquer
  | 'influent' // Peut influencer d'autres députés
  | 'discret' // Peu visible, vote discipliné
  | 'médiatique' // Cherche l'attention des médias
  | 'technicien' // Expert sur certains sujets
  | 'populiste'; // Suit l'opinion publique

export interface Deputy {
  id: string;
  firstName: string;
  lastName: string;
  party: PartyId;
  region: Region;
  circonscription: number;

  // Caractéristiques
  age: number;
  gender: 'M' | 'F';
  profession: string;
  seniority: number; // Nombre de mandats

  // Position idéologique
  ideology: IdeologicalPosition;

  // Traits de personnalité
  traits: DeputyTrait[];
  discipline: number; // 0-100: probabilité de suivre la ligne du parti
  ambition: number; // 0-100: désir de carrière politique
  integrity: number; // 0-100: résistance à la corruption
  popularity: number; // 0-100: popularité dans sa circonscription

  // Relations et influence
  influence: number; // 0-100: poids dans les débats
  relationWithGovernment: number; // -100 à +100
  relationWithPresident: number; // -100 à +100

  // Expertises
  expertises: LawCategory[];

  // Historique
  votingHistory: VoteRecord[];
  scandals: string[];
  achievements: string[];

  // État actuel
  currentCommittees: string[];
  isMinister: boolean;
  isCommissionPresident: boolean;
  loyaltyToParty: number; // 0-100: peut évoluer
}

export type LawCategory =
  | 'economie'
  | 'social'
  | 'environnement'
  | 'securite'
  | 'justice'
  | 'education'
  | 'sante'
  | 'defense'
  | 'affaires_etrangeres'
  | 'institutions'
  | 'culture'
  | 'agriculture'
  | 'logement'
  | 'transport'
  | 'numerique';

export type VoteType = 'pour' | 'contre' | 'abstention' | 'absent';

export interface VoteRecord {
  lawId: string;
  vote: VoteType;
  date: Date;
  wentAgainstParty: boolean;
}

export interface Law {
  id: string;
  title: string;
  description: string;
  category: LawCategory;

  // Caractéristiques idéologiques de la loi
  ideology: IdeologicalPosition;

  // Exigences
  requiredMajority: 'simple' | 'absolue' | 'qualifiee'; // 289, 289, 345 voix
  urgency: 'normale' | 'acceleree' | 'urgente';

  // Contenu
  articles: LawArticle[];
  amendments: Amendment[];

  // Contexte
  proposedBy: 'gouvernement' | 'deputes' | 'senat';
  proposerId?: string; // ID du député si proposition parlementaire

  // Effets attendus
  effects: {
    popularity?: Record<string, number>; // Par segment démographique
    economy?: {
      gdp?: number;
      unemployment?: number;
      publicDebt?: number;
      businessConfidence?: number;
    };
    social?: {
      inequality?: number;
      publicServices?: number;
      socialUnrest?: number;
    };
    environment?: {
      emissions?: number;
      biodiversity?: number;
      energyTransition?: number;
    };
  };

  // Process parlementaire
  stage: 'depot' | 'commission' | 'hemicycle' | 'senat' | 'navette' | 'vote_final' | 'promulgue' | 'rejete';
  commissionReport?: string;
  publicHearings?: string[];

  // Vote
  votingDate?: Date;
  votingResults?: VotingResults;
}

export interface LawArticle {
  id: string;
  number: number;
  title: string;
  content: string;
  controversial: boolean; // Si l'article est particulièrement clivant
}

export interface Amendment {
  id: string;
  articleId: string;
  proposedBy: string; // Deputy ID ou "gouvernement"
  proposedByParty: PartyId;
  description: string;
  ideologicalShift: Partial<IdeologicalPosition>;
  supportLevel: number; // 0-100: niveau de soutien estimé
  status: 'propose' | 'adopte' | 'rejete' | 'retire';
}

export interface VotingResults {
  pour: number;
  contre: number;
  abstention: number;
  absent: number;
  passed: boolean;

  // Détail par parti
  votesByParty: Record<PartyId, {
    pour: number;
    contre: number;
    abstention: number;
    absent: number;
  }>;

  // Députés ayant voté contre leur parti
  rebels: Deputy[];

  // Députés clés qui ont fait basculer le vote
  pivotalVotes: Deputy[];
}

export interface ParliamentaryGroup {
  id: PartyId;
  name: string;
  president: Deputy;
  members: Deputy[];
  seats: number;

  // Cohésion du groupe
  discipline: number; // 0-100: à quel point le groupe vote uni
  unity: number; // 0-100: cohésion interne

  // Positionnement
  ideology: IdeologicalPosition;

  // Relations
  coalitionWith: PartyId[];
  oppositionTo: PartyId[];

  // Stratégie
  strategy: 'soutien' | 'opposition' | 'constructif' | 'neutralite';
}

export interface ParliamentaryCommission {
  id: string;
  name: string;
  category: LawCategory;
  president: Deputy;
  members: Deputy[];

  // Influence de la commission
  influence: number; // 0-100

  // Lois en cours d'examen
  currentLaws: Law[];
}

export interface ParliamentaryDebate {
  lawId: string;
  date: Date;
  speakers: {
    deputy: Deputy;
    duration: number; // minutes
    position: 'pour' | 'contre' | 'ambigu';
    impact: number; // 0-100: impact du discours sur l'opinion
    transcript: string;
  }[];

  // Effets du débat
  opinShift: number; // Changement d'opinion publique
  deputiesConvinced: Deputy[]; // Députés ayant changé d'avis
}

export interface MotionOfNoCconfidence {
  id: string;
  initiatedBy: PartyId[];
  targetMinister: string; // ou "gouvernement"
  date: Date;
  requiredVotes: number; // 289 voix

  // Résultats
  votingResults?: VotingResults;
  governmentFell: boolean;
}

export interface NegotiationOffer {
  id: string;
  targetDeputy: Deputy;
  offeredBy: 'president' | 'prime_minister' | 'minister';

  // Ce qui est offert
  offer: {
    type: 'poste' | 'amendment' | 'budget_local' | 'commission' | 'faveur' | 'menace';
    description: string;
    value: number; // Valeur perçue par le député
  };

  // Demande en échange
  demand: {
    vote: 'pour' | 'contre' | 'abstention';
    lawId: string;
  };

  // Résultat
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  acceptanceProbability: number; // 0-100
}
