import { randomName } from './nameGenerator';
import { generateBackground, generatePreferredRoles, generateSpecialEffects } from './ministerGenerator';
import type { PotentialMinister } from '../types/cabinet';

const BACKGROUNDS = [
  "Ancien professeur d'université",
  'Cadre du secteur privé',
  'Haut fonctionnaire',
  'Entrepreneur',
  'Avocat',
  'Médecin',
  'Syndicaliste',
  'Élu local',
  "Diplômé de l'ENA",
  'Militant politique de longue date'
];

export interface CandidateGenerationOptions {
  primeMinister?: boolean;
  ideology?: Record<string, number>;
  competenceThreshold?: number;
}

export function generateCandidates(
  presidentParty: string,
  parties: Record<string, number>,
  options: CandidateGenerationOptions = {}
): PotentialMinister[] {
  const {
    primeMinister = false,
    ideology = { liberal: 50, autoritaire: 50, ecolo: 50, social: 50, souverainiste: 50 },
    competenceThreshold
  } = options;
  const threshold = competenceThreshold ?? (primeMinister ? 60 : 40);
  const candidates: PotentialMinister[] = [];

  Object.entries(parties).forEach(([party, seats]) => {
    const baseCount = Math.ceil(seats / 20);
    const numCandidates = Math.min(Math.max(baseCount, 3), 15);

    for (let i = 0; i < numCandidates; i++) {
      const baseCompetence = Math.floor(Math.random() * 30) + (primeMinister ? 60 : 50);
      const competence = Math.min(baseCompetence + (seats > 150 ? 10 : 0), 100);
      if (competence < threshold) continue;

      const loyaltyBase = party === presidentParty ? 60 : 40;
      const loyalty = Math.min(loyaltyBase + Math.floor(Math.random() * 40), 100);

      const backgroundList = generateBackground();
      if (backgroundList.length === 0) backgroundList.push(BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]);
      const mainBackground = backgroundList[0];

      const specialEffects: Record<string, number> = generateSpecialEffects();
      if (mainBackground.includes('professeur')) specialEffects.education = 15;
      else if (mainBackground.includes('avocat')) specialEffects.justice = 15;
      else if (mainBackground.includes('Médecin') || mainBackground.includes('médecin')) specialEffects.sante = 15;

      candidates.push({
        id: `${party}-${i}`,
        name: randomName(),
        party,
        popularity: 30 + Math.random() * 40,
        competence,
        ideology: {
          liberal: ideology.liberal + (Math.random() * 20 - 10),
          autoritaire: ideology.autoritaire + (Math.random() * 20 - 10),
          ecolo: ideology.ecolo + (Math.random() * 20 - 10),
          social: ideology.social + (Math.random() * 20 - 10),
          souverainiste: ideology.souverainiste + (Math.random() * 20 - 10)
        },
        personality: {
          loyalty,
          ambition: Math.random() * 100,
          charisma: Math.random() * 100,
          stubbornness: Math.random() * 100
        },
        background: backgroundList,
        preferredRoles: generatePreferredRoles(),
        specialEffects
      });
    }
  });

  return shuffleArray(candidates);
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
