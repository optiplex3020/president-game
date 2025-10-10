import type { Deputy, PartyId, Region, IdeologicalPosition, DeputyTrait, LawCategory } from '../types/parliament';

const FRENCH_FIRST_NAMES_M = [
  'Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'Alain', 'Bernard', 'Christian', 'François',
  'Jacques', 'Daniel', 'Gérard', 'Claude', 'Yves', 'Marc', 'Laurent', 'Patrick', 'Nicolas',
  'Olivier', 'Stéphane', 'Julien', 'Christophe', 'Sébastien', 'Thierry', 'Vincent', 'David',
  'Éric', 'Bruno', 'Frédéric', 'Didier', 'Pascal', 'Fabrice', 'Guillaume', 'Maxime', 'Thomas',
  'Alexandre', 'Antoine', 'Benjamin', 'Hugo', 'Louis', 'Mathieu', 'Lucas', 'Arthur', 'Raphaël'
];

const FRENCH_FIRST_NAMES_F = [
  'Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Françoise', 'Valérie', 'Christine',
  'Monique', 'Martine', 'Sophie', 'Sandrine', 'Véronique', 'Patricia', 'Dominique', 'Agnès',
  'Céline', 'Aurélie', 'Stéphanie', 'Caroline', 'Laurence', 'Brigitte', 'Anne', 'Laure',
  'Émilie', 'Julie', 'Camille', 'Marine', 'Laura', 'Sarah', 'Manon', 'Clara', 'Léa', 'Emma',
  'Chloé', 'Inès', 'Lucie', 'Alice', 'Pauline', 'Charlotte', 'Anaïs', 'Marion', 'Justine'
];

const FRENCH_LAST_NAMES = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy',
  'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux',
  'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefevre', 'Mercier', 'Dupont', 'Lambert',
  'Bonnet', 'François', 'Martinez', 'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin',
  'Boyer', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin', 'Morin', 'Mathieu', 'Clement',
  'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin', 'Masson', 'Sanchez', 'Gerard',
  'Nguyen', 'Boyer', 'Denis', 'Lemaire', 'Duval', 'Joly', 'Gautier', 'Roger', 'Roche', 'Roy',
  'Noel', 'Meyer', 'Lucas', 'Meunier', 'Jean', 'Perez', 'Marchand', 'Dufour', 'Blanchard', 'Marie'
];

const PROFESSIONS = [
  'Avocat', 'Professeur', 'Médecin', 'Ingénieur', 'Entrepreneur', 'Fonctionnaire',
  'Journaliste', 'Consultant', 'Agriculteur', 'Chef d\'entreprise', 'Cadre', 'Enseignant',
  'Magistrat', 'Pharmacien', 'Architecte', 'Syndicaliste', 'Élu local', 'Directeur',
  'Chercheur', 'Économiste', 'Banquier', 'Assureur', 'Commerçant', 'Artisan'
];

const REGIONS: Region[] = [
  'ile_de_france', 'auvergne_rhone_alpes', 'nouvelle_aquitaine', 'occitanie',
  'hauts_de_france', 'grand_est', 'provence_alpes_cote_azur', 'pays_de_la_loire',
  'bretagne', 'normandie', 'bourgogne_franche_comte', 'centre_val_de_loire',
  'corse', 'outre_mer'
];

const PARTY_IDEOLOGIES: Record<PartyId, IdeologicalPosition> = {
  renaissance: { economicLeft: 15, social: 40, european: 80, environmental: 60, authoritarian: 20 },
  rn: { economicLeft: -10, social: -60, european: -80, environmental: 20, authoritarian: 70 },
  lfi: { economicLeft: -80, social: 70, european: -40, environmental: 75, authoritarian: -30 },
  lr: { economicLeft: 60, social: -40, european: 40, environmental: 30, authoritarian: 50 },
  ps: { economicLeft: -50, social: 60, european: 70, environmental: 65, authoritarian: -10 },
  ecologistes: { economicLeft: -40, social: 65, european: 75, environmental: 95, authoritarian: -20 },
  horizons: { economicLeft: 25, social: 35, european: 75, environmental: 55, authoritarian: 15 },
  modem: { economicLeft: 10, social: 45, european: 85, environmental: 60, authoritarian: 10 },
  pcf: { economicLeft: -90, social: 60, european: -30, environmental: 70, authoritarian: -40 },
  liot: { economicLeft: -20, social: 30, european: 50, environmental: 55, authoritarian: -15 },
  udi: { economicLeft: 40, social: 20, european: 65, environmental: 45, authoritarian: 25 },
  divers_gauche: { economicLeft: -60, social: 55, european: 60, environmental: 60, authoritarian: -20 },
  divers_droite: { economicLeft: 50, social: -30, european: 45, environmental: 35, authoritarian: 40 },
  independant: { economicLeft: 0, social: 0, european: 50, environmental: 50, authoritarian: 0 }
};

const PARTY_SEATS: Record<PartyId, number> = {
  renaissance: 169,
  rn: 88,
  lfi: 75,
  lr: 62,
  ps: 31,
  ecologistes: 28,
  horizons: 26,
  modem: 23,
  liot: 22,
  udi: 18,
  pcf: 12,
  divers_gauche: 13,
  divers_droite: 8,
  independant: 2
};

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addVariation(base: number, variation: number): number {
  return Math.max(-100, Math.min(100, base + randomInt(-variation, variation)));
}

function generateIdeology(partyId: PartyId): IdeologicalPosition {
  const base = PARTY_IDEOLOGIES[partyId];
  const variation = 15; // Variation individuelle

  return {
    economicLeft: addVariation(base.economicLeft, variation),
    social: addVariation(base.social, variation),
    european: addVariation(base.european, variation),
    environmental: addVariation(base.environmental, variation),
    authoritarian: addVariation(base.authoritarian, variation)
  };
}

function generateTraits(): DeputyTrait[] {
  const allTraits: DeputyTrait[] = [
    'fidele', 'rebelle', 'pragmatique', 'ideologue', 'opportuniste',
    'influent', 'discret', 'médiatique', 'technicien', 'populiste'
  ];

  const numTraits = randomInt(2, 4);
  const traits: DeputyTrait[] = [];

  for (let i = 0; i < numTraits; i++) {
    const trait = randomFromArray(allTraits.filter(t => !traits.includes(t)));
    traits.push(trait);
  }

  return traits;
}

function generateExpertises(): LawCategory[] {
  const allCategories: LawCategory[] = [
    'economie', 'social', 'environnement', 'securite', 'justice',
    'education', 'sante', 'defense', 'affaires_etrangeres', 'institutions',
    'culture', 'agriculture', 'logement', 'transport', 'numerique'
  ];

  const numExpertises = randomInt(1, 3);
  const expertises: LawCategory[] = [];

  for (let i = 0; i < numExpertises; i++) {
    const expertise = randomFromArray(allCategories.filter(c => !expertises.includes(c)));
    expertises.push(expertise);
  }

  return expertises;
}

function calculateDiscipline(traits: DeputyTrait[], partyId: PartyId): number {
  let base = 70;

  if (traits.includes('fidele')) base += 20;
  if (traits.includes('rebelle')) base -= 30;
  if (traits.includes('ideologue')) base -= 10;
  if (traits.includes('pragmatique')) base += 10;
  if (traits.includes('opportuniste')) base -= 15;

  // Certains partis ont plus de discipline
  const disciplineBonus: Record<PartyId, number> = {
    renaissance: 10,
    rn: 15,
    lfi: 5,
    lr: 8,
    ps: 5,
    ecologistes: 0,
    horizons: 10,
    modem: 12,
    pcf: 20,
    liot: -5,
    udi: 5,
    divers_gauche: -10,
    divers_droite: -10,
    independant: -30
  };

  base += disciplineBonus[partyId] || 0;

  return Math.max(10, Math.min(95, base));
}

export function generateDeputy(
  id: string,
  party: PartyId,
  region: Region,
  circonscription: number
): Deputy {
  const gender = Math.random() > 0.5 ? 'M' : 'F';
  const firstName = gender === 'M'
    ? randomFromArray(FRENCH_FIRST_NAMES_M)
    : randomFromArray(FRENCH_FIRST_NAMES_F);
  const lastName = randomFromArray(FRENCH_LAST_NAMES);

  const traits = generateTraits();
  const ideology = generateIdeology(party);
  const discipline = calculateDiscipline(traits, party);

  return {
    id,
    firstName,
    lastName,
    party,
    region,
    circonscription,

    age: randomInt(28, 75),
    gender,
    profession: randomFromArray(PROFESSIONS),
    seniority: randomInt(0, 5),

    ideology,

    traits,
    discipline,
    ambition: randomInt(30, 90),
    integrity: randomInt(40, 95),
    popularity: randomInt(40, 80),

    influence: traits.includes('influent') ? randomInt(70, 95) : randomInt(20, 60),
    relationWithGovernment: randomInt(-30, 30),
    relationWithPresident: randomInt(-30, 30),

    expertises: generateExpertises(),

    votingHistory: [],
    scandals: [],
    achievements: [],

    currentCommittees: [],
    isMinister: false,
    isCommissionPresident: false,
    loyaltyToParty: discipline + randomInt(-10, 10)
  };
}

export function generateAllDeputies(): Deputy[] {
  const deputies: Deputy[] = [];
  let deputyIndex = 1;
  let regionIndex = 0;

  for (const [party, seats] of Object.entries(PARTY_SEATS)) {
    for (let i = 0; i < seats; i++) {
      const region = REGIONS[regionIndex % REGIONS.length];
      const circonscription = Math.floor(deputyIndex / REGIONS.length) + 1;

      const deputy = generateDeputy(
        `deputy_${deputyIndex}`,
        party as PartyId,
        region,
        circonscription
      );

      deputies.push(deputy);
      deputyIndex++;
      regionIndex++;
    }
  }

  return deputies;
}

export function getDeputiesByParty(deputies: Deputy[], party: PartyId): Deputy[] {
  return deputies.filter(d => d.party === party);
}

export function getDeputiesByRegion(deputies: Deputy[], region: Region): Deputy[] {
  return deputies.filter(d => d.region === region);
}

export function getMostInfluentialDeputies(deputies: Deputy[], count: number = 20): Deputy[] {
  return [...deputies]
    .sort((a, b) => b.influence - a.influence)
    .slice(0, count);
}

export function getRebelDeputies(deputies: Deputy[]): Deputy[] {
  return deputies.filter(d => d.traits.includes('rebelle') || d.discipline < 50);
}
