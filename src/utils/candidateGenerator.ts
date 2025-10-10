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
  console.log('=== GENERATION DES CANDIDATS ===');
  console.log('presidentParty:', presidentParty);
  console.log('parties:', parties);
  console.log('options:', options);
  const {
    primeMinister = false,
    ideology = { liberal: 50, autoritaire: 50, ecolo: 50, social: 50, souverainiste: 50 },
    competenceThreshold
  } = options;
  const threshold = competenceThreshold ?? (primeMinister ? 60 : 30);
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
      const traits: string[] = [];
      
      if (mainBackground.includes('professeur')) {
        specialEffects.education = 15;
        traits.push('Pédagogue');
      }
      else if (mainBackground.includes('avocat')) {
        specialEffects.justice = 15;
        traits.push('Juriste');
      }
      else if (mainBackground.includes('Médecin') || mainBackground.includes('médecin')) {
        specialEffects.sante = 15;
        traits.push('Expert santé');
      }
      
      if (backgroundList.includes('ENA')) traits.push('Technocrate');
      if (backgroundList.includes('Entrepreneur')) traits.push('Gestionnaire');
      if (competence > 80) traits.push('Très compétent');
      if (loyalty > 85) traits.push('Fidèle');

      candidates.push({
        id: `${party}-${i}`,
        name: randomName(),
        party,
        popularity: 30 + Math.random() * 40,
        experience: Math.floor(Math.random() * 30),
        reputation: Math.floor(40 + Math.random() * 60),
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
        specialEffects,
        traits
      });
    }
  });

  console.log(`Candidats générés avant ajout des tests: ${candidates.length}`);
  
  // Ajouter quelques candidats de test s'il n'y en a pas assez
  if (candidates.length < 10) {
    console.log('Ajout des candidats de test car pas assez de candidats générés');
    const testCandidates: PotentialMinister[] = [
      {
        id: 'test-1',
        name: 'Bruno Le Maire',
        party: presidentParty,
        competence: 85,
        popularity: 65,
        experience: 15,
        reputation: 78,
        ideology: { liberal: 70, autoritaire: 30, ecolo: 40, social: 35, souverainiste: 25 },
        personality: { loyalty: 85, ambition: 70, charisma: 75, stubbornness: 60 },
        background: ['Ministre', 'Haut fonctionnaire', 'ENA'],
        preferredRoles: ['economie', 'budget'],
        specialEffects: { budget: 10, entreprises: 5 },
        traits: ['Économiste', 'Technocrate', 'Expérimenté']
      },
      {
        id: 'test-2',
        name: 'Élisabeth Borne',
        party: presidentParty,
        competence: 82,
        popularity: 55,
        experience: 20,
        reputation: 72,
        ideology: { liberal: 60, autoritaire: 40, ecolo: 60, social: 55, souverainiste: 30 },
        personality: { loyalty: 90, ambition: 65, charisma: 60, stubbornness: 75 },
        background: ['Préfète', 'Haut fonctionnaire', 'Ingénieure'],
        preferredRoles: ['transports', 'environnement', 'emploi'],
        specialEffects: { transports: 10, environnement: 8 },
        traits: ['Gestionnaire', 'Technicienne', 'Fidèle']
      },
      {
        id: 'test-3',
        name: 'Gérald Darmanin',
        party: presidentParty,
        competence: 78,
        popularity: 50,
        experience: 12,
        reputation: 68,
        ideology: { liberal: 55, autoritaire: 65, ecolo: 25, social: 40, souverainiste: 45 },
        personality: { loyalty: 80, ambition: 85, charisma: 70, stubbornness: 80 },
        background: ['Maire', 'Député', 'Ministre'],
        preferredRoles: ['interieur', 'budget'],
        specialEffects: { securite: 10, interieur: 8 },
        traits: ['Autoritaire', 'Ambitieux', 'Sécuritaire']
      }
    ];
    
    candidates.push(...testCandidates);
  }
  
  console.log(`Candidats finaux générés: ${candidates.length}`);
  candidates.forEach(c => console.log(`- ${c.name} (${c.party}) - Compétence: ${c.competence}`));
  
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
