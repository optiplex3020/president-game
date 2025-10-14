import type { PotentialMinister } from '../types/cabinet';
import type { PartyId } from '../types/parliament';
import type {
  Motivation,
  PersonalityTrait,
  PoliticalCharacter,
  RelationType,
  Relationship
} from '../types/characters';

export interface CandidateRelationship {
  targetId: string;
  type: RelationType;
  sentiment: number;
  strength: number;
  summary: string;
}

export interface CandidateMediaOutlook {
  outlet: string;
  tone: 'positive' | 'neutral' | 'negative';
  headline: string;
  rationale: string;
}

export interface PrimeMinisterCandidateData {
  id: string;
  firstName: string;
  lastName: string;
  partyId: PartyId;
  age: number;
  gender: 'M' | 'F';
  currentRole: string;
  biography: string;
  specialties: string[];
  politicalCapital: number;
  publicProfile: number;
  mediaRelations: number;
  networkStrength: number;
  riskFactors: string[];
  assets: string[];
  mediaOutlook: CandidateMediaOutlook[];
  relationships: CandidateRelationship[];
  motivations: { type: Motivation; intensity: number }[];
  traits: PersonalityTrait[];
  potentialMinister: PotentialMinister;
}

const defaultIdeology = {
  liberal: 50,
  autoritaire: 50,
  ecolo: 50,
  social: 50,
  souverainiste: 50
};

const defaultPersonality = {
  loyalty: 60,
  ambition: 60,
  charisma: 60,
  stubbornness: 40
};

function buildPotentialMinister(data: Partial<PotentialMinister> & { id: string; name: string; party: string }): PotentialMinister {
  return {
    id: data.id,
    name: data.name,
    party: data.party,
    competence: data.competence ?? 70,
    popularity: data.popularity ?? 55,
    ideology: data.ideology ?? { ...defaultIdeology },
    personality: data.personality ?? { ...defaultPersonality },
    experience: data.experience ?? 10,
    reputation: data.reputation ?? 60,
    background: data.background ?? [],
    preferredRoles: data.preferredRoles ?? ['prime_minister'],
    specialEffects: data.specialEffects ?? {},
    traits: data.traits ?? ['pragmatique', 'loyal']
  };
}

export const PRIME_MINISTER_CANDIDATES: PrimeMinisterCandidateData[] = [
  {
    id: 'pm_1',
    firstName: 'Élisabeth',
    lastName: 'Borne',
    partyId: 'renaissance',
    age: 62,
    gender: 'F',
    currentRole: 'Ancienne Première ministre',
    biography:
      'Ancienne haute fonctionnaire, elle a dirigé plusieurs ministères clés avant de prendre la tête du gouvernement en 2022. Gestionnaire rigoureuse et loyale au président.',
    specialties: ['Transport', 'Écologie', 'Fonction publique'],
    politicalCapital: 78,
    publicProfile: 68,
    mediaRelations: 72,
    networkStrength: 85,
    riskFactors: ['Image technocratique', 'Faible charisme perçu'],
    assets: ['Maîtrise des dossiers complexes', 'Loyauté éprouvée', 'Connaissance fine de l’État'],
    mediaOutlook: [
      {
        outlet: 'Le Monde',
        tone: 'positive',
        headline: 'Retour de la technicité à Matignon',
        rationale: 'Garantie de stabilité et de rigueur gouvernementale.'
      },
      {
        outlet: 'Mediapart',
        tone: 'negative',
        headline: 'Un choix de continuité contesté',
        rationale: 'Crainte d’un manque d’écoute sociale et politique.'
      }
    ],
    relationships: [
      {
        targetId: 'elysee_president',
        type: 'ally',
        sentiment: 65,
        strength: 80,
        summary: 'Compréhension mutuelle et fidélité politique.'
      },
      {
        targetId: 'opposition_leader_rn',
        type: 'rival',
        sentiment: -60,
        strength: 70,
        summary: 'Opposition frontale aux réformes sociales.'
      },
      {
        targetId: 'assembly_center_right',
        type: 'ally',
        sentiment: 30,
        strength: 45,
        summary: 'Peut négocier avec la droite modérée sur certains textes.'
      }
    ],
    motivations: [
      { type: 'nation', intensity: 85 },
      { type: 'stabilite', intensity: 75 },
      { type: 'reconnaissance', intensity: 60 }
    ],
    traits: ['technocrate', 'loyal', 'pragmatique', 'discret'],
    potentialMinister: buildPotentialMinister({
      id: 'pm_1',
      name: 'Élisabeth Borne',
      party: 'renaissance',
      competence: 88,
      popularity: 64,
      ideology: {
        liberal: 55,
        autoritaire: 45,
        ecolo: 65,
        social: 52,
        souverainiste: 35
      },
      personality: {
        loyalty: 85,
        ambition: 70,
        charisma: 45,
        stubbornness: 55
      },
      experience: 25,
      reputation: 82,
      background: ['Ancienne préfète', 'Ministre du Travail', 'Ministre des Transports'],
      preferredRoles: ['prime_minister', 'ecology'],
      specialEffects: {
        stability: 4,
        administration_effectiveness: 3
      },
      traits: ['technocrate', 'loyal', 'pragmatique']
    })
  },
  {
    id: 'pm_2',
    firstName: 'Bruno',
    lastName: 'Le Maire',
    partyId: 'renaissance',
    age: 54,
    gender: 'M',
    currentRole: "Ministre de l'Économie",
    biography:
      'Pilier économique du gouvernement depuis 2017, il a négocié de nombreux dossiers européens et dispose d’un réseau international dense.',
    specialties: ['Économie', 'Europe', 'Commerce international'],
    politicalCapital: 92,
    publicProfile: 86,
    mediaRelations: 84,
    networkStrength: 90,
    riskFactors: ['Ambition personnelle forte', 'Peut éclipser le président'],
    assets: ['Expertise économique', 'Crédibilité internationale', 'Solide réseau politique'],
    mediaOutlook: [
      {
        outlet: 'Les Échos',
        tone: 'positive',
        headline: 'Le garant de la crédibilité économique',
        rationale: 'Assure la continuité du cap réformateur et pro-business.'
      },
      {
        outlet: 'Libération',
        tone: 'negative',
        headline: 'Le très libéral Le Maire à Matignon',
        rationale: 'Crainte d’un virage trop pro-entreprises au détriment du social.'
      }
    ],
    relationships: [
      {
        targetId: 'elysee_president',
        type: 'ally',
        sentiment: 55,
        strength: 70,
        summary: 'Relation de confiance mais teintée d’ambition.'
      },
      {
        targetId: 'assembly_center_right',
        type: 'ally',
        sentiment: 45,
        strength: 60,
        summary: 'Apprécié par la droite modérée pour sa ligne économique.'
      },
      {
        targetId: 'business_lobby',
        type: 'ally',
        sentiment: 70,
        strength: 85,
        summary: 'Soutenu par les milieux économiques et financiers.'
      }
    ],
    motivations: [
      { type: 'pouvoir', intensity: 80 },
      { type: 'nation', intensity: 75 },
      { type: 'heritage', intensity: 65 }
    ],
    traits: ['ambitieux', 'charismatique', 'pragmatique', 'calculateur'],
    potentialMinister: buildPotentialMinister({
      id: 'pm_2',
      name: 'Bruno Le Maire',
      party: 'renaissance',
      competence: 91,
      popularity: 72,
      ideology: {
        liberal: 75,
        autoritaire: 50,
        ecolo: 55,
        social: 45,
        souverainiste: 30
      },
      personality: {
        loyalty: 78,
        ambition: 92,
        charisma: 82,
        stubbornness: 60
      },
      experience: 22,
      reputation: 88,
      background: ['Ancien ministre des Affaires européennes', "Ancien ministre de l'Agriculture"],
      preferredRoles: ['prime_minister', 'economy'],
      specialEffects: {
        economy: 5,
        international_trust: 4
      },
      traits: ['visionnaire', 'technocrate', 'charismatique']
    })
  },
  {
    id: 'pm_3',
    firstName: 'Gérald',
    lastName: 'Darmanin',
    partyId: 'renaissance',
    age: 41,
    gender: 'M',
    currentRole: "Ministre de l'Intérieur",
    biography:
      'À l’Intérieur depuis 2020, il a géré des crises sécuritaires majeures et incarne la droite de la majorité présidentielle.',
    specialties: ['Sécurité', 'Collectivités territoriales', 'Immigration'],
    politicalCapital: 84,
    publicProfile: 82,
    mediaRelations: 79,
    networkStrength: 88,
    riskFactors: ['Style clivant', 'Controverses judiciaires passées'],
    assets: ['Loyauté indéfectible', 'Connaissance du terrain', 'Capacité à durcir la ligne'],
    mediaOutlook: [
      {
        outlet: 'BFM TV',
        tone: 'neutral',
        headline: 'Le sécuritaire Darmanin en favoris',
        rationale: 'Capable de parler aux électeurs de droite et de contrôler l’ordre public.'
      },
      {
        outlet: 'Mediapart',
        tone: 'negative',
        headline: 'Un ministre sous feu judiciaire pour Matignon',
        rationale: 'Controverses susceptibles de ressurgir et d’entacher le mandat.'
      }
    ],
    relationships: [
      {
        targetId: 'elysee_president',
        type: 'ally',
        sentiment: 60,
        strength: 75,
        summary: 'Soutien sans faille mais ambition propre.'
      },
      {
        targetId: 'security_unions',
        type: 'ally',
        sentiment: 65,
        strength: 80,
        summary: 'Apprécié des syndicats policiers pour sa fermeté.'
      },
      {
        targetId: 'opposition_leader_rn',
        type: 'rival',
        sentiment: -45,
        strength: 60,
        summary: 'Concurrence sur le terrain sécuritaire.'
      }
    ],
    motivations: [
      { type: 'pouvoir', intensity: 75 },
      { type: 'parti', intensity: 70 },
      { type: 'justice', intensity: 55 }
    ],
    traits: ['loyal', 'opportuniste', 'pragmatique', 'conflictuel'],
    potentialMinister: buildPotentialMinister({
      id: 'pm_3',
      name: 'Gérald Darmanin',
      party: 'renaissance',
      competence: 86,
      popularity: 60,
      ideology: {
        liberal: 45,
        autoritaire: 75,
        ecolo: 35,
        social: 40,
        souverainiste: 40
      },
      personality: {
        loyalty: 91,
        ambition: 85,
        charisma: 70,
        stubbornness: 68
      },
      experience: 16,
      reputation: 70,
      background: ['Ancien maire de Tourcoing', "Ministre de l'Action et des Comptes publics"],
      preferredRoles: ['prime_minister', 'interior'],
      specialEffects: {
        security: 5,
        right_wing_dialogue: 3
      },
      traits: ['conflictuel', 'loyal', 'strategique']
    })
  },
  {
    id: 'pm_4',
    firstName: 'Catherine',
    lastName: 'Vautrin',
    partyId: 'lr',
    age: 63,
    gender: 'F',
    currentRole: 'Ministre du Travail, de la Santé et des Solidarités',
    biography:
      'Figure respectée de la droite territoriale, elle a fait ses preuves à Reims et dans différents gouvernements chiraquiens.',
    specialties: ['Cohésion sociale', 'Ruralité', 'Collectivités locales'],
    politicalCapital: 72,
    publicProfile: 65,
    mediaRelations: 68,
    networkStrength: 81,
    riskFactors: ['Acceptation limitée dans la majorité', 'Image moins moderne'],
    assets: ['Pont avec la droite', 'Solide ancrage local', 'Expérience sociale'],
    mediaOutlook: [
      {
        outlet: 'France 2',
        tone: 'positive',
        headline: 'Un signal d’ouverture à droite',
        rationale: 'Facilite les compromis parlementaires avec LR.'
      },
      {
        outlet: 'Valeurs Actuelles',
        tone: 'neutral',
        headline: 'Une compatibilité à éprouver',
        rationale: 'Suspend son jugement à la ligne politique annoncée.'
      }
    ],
    relationships: [
      {
        targetId: 'lr_group',
        type: 'ally',
        sentiment: 60,
        strength: 70,
        summary: 'Respectée au sein des élus LR modérés.'
      },
      {
        targetId: 'elysee_president',
        type: 'ally',
        sentiment: 40,
        strength: 55,
        summary: 'Symbolise l’ouverture mais nécessite un pacte clair.'
      },
      {
        targetId: 'opposition_leader_rn',
        type: 'enemy',
        sentiment: -65,
        strength: 55,
        summary: 'Opposition idéologique frontale avec le RN.'
      }
    ],
    motivations: [
      { type: 'stabilite', intensity: 80 },
      { type: 'parti', intensity: 70 },
      { type: 'nation', intensity: 65 }
    ],
    traits: ['pragmatique', 'mediateur', 'integre', 'discret'],
    potentialMinister: buildPotentialMinister({
      id: 'pm_4',
      name: 'Catherine Vautrin',
      party: 'lr',
      competence: 84,
      popularity: 58,
      ideology: {
        liberal: 60,
        autoritaire: 55,
        ecolo: 40,
        social: 50,
        souverainiste: 45
      },
      personality: {
        loyalty: 67,
        ambition: 65,
        charisma: 55,
        stubbornness: 50
      },
      experience: 24,
      reputation: 75,
      background: ['Ancienne ministre déléguée', 'Présidente du Grand Reims'],
      preferredRoles: ['prime_minister', 'cohesion_territories'],
      specialEffects: {
        parliament_dialogue: 4,
        rural_support: 3
      },
      traits: ['mediateur', 'pragmatique', 'ambitieux']
    })
  },
  {
    id: 'pm_5',
    firstName: 'Sébastien',
    lastName: 'Lecornu',
    partyId: 'renaissance',
    age: 37,
    gender: 'M',
    currentRole: 'Ministre des Armées',
    biography:
      'Fidèle parmi les fidèles, il a géré l’Outre-mer puis les Armées, avec un accent sur la modernisation et la diplomatie de défense.',
    specialties: ['Défense', 'Outre-mer', 'Territoires'],
    politicalCapital: 76,
    publicProfile: 71,
    mediaRelations: 74,
    networkStrength: 83,
    riskFactors: ['Jeunesse', 'Expérience limitée à Matignon'],
    assets: ['Loyauté absolue', 'Vision stratégique', 'Modernité'],
    mediaOutlook: [
      {
        outlet: 'Le Figaro',
        tone: 'positive',
        headline: 'La génération Macron au pouvoir',
        rationale: 'Capable d’incarner un renouveau et une fermeté stratégique.'
      },
      {
        outlet: 'Marianne',
        tone: 'negative',
        headline: 'Un proche du président sans contre-pouvoir',
        rationale: 'Crainte d’un pouvoir trop vertical et verrouillé.'
      }
    ],
    relationships: [
      {
        targetId: 'elysee_president',
        type: 'ally',
        sentiment: 75,
        strength: 85,
        summary: 'Fidélité totale et confiance stratégique.'
      },
      {
        targetId: 'defense_industry',
        type: 'ally',
        sentiment: 55,
        strength: 65,
        summary: 'Relais privilégié auprès des industriels de défense.'
      },
      {
        targetId: 'opposition_leader_rn',
        type: 'rival',
        sentiment: -40,
        strength: 50,
        summary: 'Critiqué pour sa ligne pro-européenne en défense.'
      }
    ],
    motivations: [
      { type: 'nation', intensity: 80 },
      { type: 'pouvoir', intensity: 65 },
      { type: 'heritage', intensity: 55 }
    ],
    traits: ['loyal', 'pragmatique', 'visionnaire', 'ambitieux'],
    potentialMinister: buildPotentialMinister({
      id: 'pm_5',
      name: 'Sébastien Lecornu',
      party: 'renaissance',
      competence: 79,
      popularity: 58,
      ideology: {
        liberal: 52,
        autoritaire: 60,
        ecolo: 45,
        social: 48,
        souverainiste: 42
      },
      personality: {
        loyalty: 94,
        ambition: 78,
        charisma: 68,
        stubbornness: 55
      },
      experience: 15,
      reputation: 68,
      background: ['Ancien président de département', 'Ministre des Outre-mer'],
      preferredRoles: ['prime_minister', 'defense'],
      specialEffects: {
        cohesion: 3,
        defense_readiness: 5
      },
      traits: ['strategique', 'loyal', 'visionnaire']
    })
  },
  {
    id: 'pm_6',
    firstName: 'Valérie',
    lastName: 'Pécresse',
    partyId: 'lr',
    age: 56,
    gender: 'F',
    currentRole: "Présidente de la Région Île-de-France",
    biography:
      'Ancienne ministre et présidente de région, elle apporte une expérience exécutive solide et une stature nationale reconnue.',
    specialties: ['Budget', 'Enseignement supérieur', 'Grandes régions'],
    politicalCapital: 81,
    publicProfile: 83,
    mediaRelations: 76,
    networkStrength: 79,
    riskFactors: ['Ambitions présidentielles persistantes', 'Relation complexe avec la majorité'],
    assets: ['Expérience exécutive', 'Compétence budgétaire', 'Crédibilité droite modérée'],
    mediaOutlook: [
      {
        outlet: 'TF1',
        tone: 'positive',
        headline: 'Un pari sur l’union des droites modérées',
        rationale: 'Peut élargir la majorité en attirant des élus LR.'
      },
      {
        outlet: 'Le Parisien',
        tone: 'neutral',
        headline: 'Une présidente de région à Matignon ?',
        rationale: 'Interrogations sur la cohabitation interne que cela suppose.'
      }
    ],
    relationships: [
      {
        targetId: 'lr_group',
        type: 'ally',
        sentiment: 55,
        strength: 65,
        summary: 'Peut ramener une partie des députés LR au vote favorable.'
      },
      {
        targetId: 'elysee_president',
        type: 'rival',
        sentiment: -20,
        strength: 50,
        summary: 'Confiance limitée, négociations permanentes.'
      },
      {
        targetId: 'business_lobby',
        type: 'ally',
        sentiment: 50,
        strength: 60,
        summary: 'Appréciée des milieux économiques franciliens.'
      }
    ],
    motivations: [
      { type: 'pouvoir', intensity: 85 },
      { type: 'heritage', intensity: 70 },
      { type: 'nation', intensity: 60 }
    ],
    traits: ['visionnaire', 'ambitieux', 'charismatique', 'pragmatique'],
    potentialMinister: buildPotentialMinister({
      id: 'pm_6',
      name: 'Valérie Pécresse',
      party: 'lr',
      competence: 87,
      popularity: 70,
      ideology: {
        liberal: 70,
        autoritaire: 55,
        ecolo: 50,
        social: 48,
        souverainiste: 45
      },
      personality: {
        loyalty: 58,
        ambition: 94,
        charisma: 79,
        stubbornness: 65
      },
      experience: 20,
      reputation: 82,
      background: ['Ancienne ministre du Budget', 'Ancienne ministre de l’Enseignement supérieur'],
      preferredRoles: ['prime_minister', 'budget'],
      specialEffects: {
        fiscal_discipline: 5,
        majority_extension: 3
      },
      traits: ['technocrate', 'visionnaire', 'strategique']
    })
  }
];

export function createCharacterFromCandidate(candidate: PrimeMinisterCandidateData): PoliticalCharacter {
  const fullName = `${candidate.firstName} ${candidate.lastName}`;
  const toIdeologyScale = (value: number) => Math.max(-100, Math.min(100, Math.round((value - 50) * 2)));

  return {
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    role: 'prime_minister_candidate',
    party: candidate.partyId,
    currentPosition: candidate.currentRole,
    age: candidate.age,
    gender: candidate.gender,
    birthPlace: 'France',
    education: ['ENA', 'Sciences Po'],
    previousPositions: candidate.potentialMinister.background,
    personality: {
      traits: candidate.traits,
      motivations: candidate.motivations,
      psychology: {
        intelligence: Math.min(95, Math.max(50, candidate.potentialMinister.competence)),
        emotionalStability: 70,
        charisma: candidate.potentialMinister.personality.charisma,
        integrity: Math.min(95, Math.max(40, candidate.potentialMinister.reputation)),
        ambition: candidate.potentialMinister.personality.ambition,
        courage: 70,
        patience: 65
      },
      values: {
        honesty: 60,
        loyalty: candidate.potentialMinister.personality.loyalty,
        compassion: 55,
        pragmatism: 70
      }
    },
    relationships: candidate.relationships.reduce<Record<string, Relationship>>((acc, rel) => {
      acc[rel.targetId] = {
        withCharacterId: rel.targetId,
        type: rel.type,
        strength: rel.strength,
        sentiment: rel.sentiment,
        trust: Math.max(10, Math.min(90, rel.sentiment + 50)),
        history: [],
        owedFavors: rel.sentiment > 40 ? 1 : 0,
        receivedFavors: rel.sentiment > 40 ? 0 : 1,
        sharedSecrets: [],
        publicKnowledge: true
      };
      return acc;
    }, {}),
    secrets: [],
    agenda: {
      shortTerm: [
        {
          goal: `Structurer l'équipe du Premier ministre (${fullName})`,
          priority: 80,
          progress: 40
        }
      ],
      mediumTerm: [
        {
          goal: 'Sécuriser une majorité de vote',
          priority: 75,
          progress: 30
        }
      ],
      longTerm: [
        {
          goal: 'Stabiliser le quinquennat',
          priority: 70,
          ultimateGoal: true
        }
      ],
      activeStrategies: []
    },
    skills: {
      negotiation: 70,
      rhetoric: candidate.publicProfile,
      strategy: candidate.networkStrength,
      economics: candidate.specialties.includes('Économie') ? 85 : 65,
      foreign_policy: candidate.specialties.includes('Europe') ? 80 : 60,
      media: candidate.mediaRelations,
      manipulation: 50
    },
    resources: {
      politicalCapital: candidate.politicalCapital,
      financialResources: 60,
      mediaConnections: candidate.mediaRelations,
      businessConnections: candidate.networkStrength,
      internationalConnections: candidate.specialties.includes('Europe') ? 80 : 60
    },
    currentState: {
      mood: 'neutral',
      stress: 55,
      energy: 70,
      popularity: candidate.publicProfile,
      powerLevel: candidate.politicalCapital
    },
    politicalViews: {
      economicPolicy: toIdeologyScale(candidate.potentialMinister.ideology.liberal),
      socialPolicy: toIdeologyScale(candidate.potentialMinister.ideology.social),
      foreignPolicy: 40,
      europeanIntegration: toIdeologyScale(60),
      environment: candidate.potentialMinister.ideology.ecolo,
      immigration: toIdeologyScale(candidate.potentialMinister.ideology.autoritaire)
    },
    biography: candidate.biography,
    achievements: candidate.potentialMinister.background.map((description, index) => ({
      date: new Date(2005 + index, 0, 1),
      description,
      publicImpact: Math.max(5, Math.min(15, 10 - index))
    })),
    controversies: candidate.riskFactors.map((description, index) => ({
      date: new Date(2016 + index, 5, 15),
      description,
      severity: 45 + index * 5,
      recovered: index === 0
    })),
    behaviorPatterns: {
      decisionMaking: 'calculated',
      conflictResolution: 'diplomatic',
      communicationStyle: candidate.potentialMinister.personality.charisma > 70 ? 'diplomatic' : 'direct',
      loyaltyPattern: candidate.potentialMinister.personality.loyalty > 70 ? 'unwavering' : 'pragmatic'
    },
    reactionRules: []
  };
}
