// This file is responsible for generating potential minister candidates based on party representation and ideology.
// It includes a function to generate candidates and a predefined list of minister candidates.
// src/store/ministerCandidates.ts
import type { PotentialMinister } from '../types/cabinet';
import { randomName } from '../utils/nameGenerator';
import { generateBackground, generatePreferredRoles, generateSpecialEffects } from '../utils/ministerGenerator';

export function generateCandidates(parties: Record<string, number>, ideology: Record<string, number>): PotentialMinister[] {
  const candidates: PotentialMinister[] = [];
  
  Object.entries(parties).forEach(([party, seats]) => {
    const numCandidates = Math.floor(seats / 10) + 1;
    
    for (let i = 0; i < numCandidates; i++) {
      const candidate: PotentialMinister = {
        id: `${party}-${i}`,
        name: randomName(),
        party,
        popularity: 30 + Math.random() * 40,
        competence: 40 + Math.random() * 50,
        ideology: {
          liberal: ideology.liberal + (Math.random() * 20 - 10),
          autoritaire: ideology.autoritaire + (Math.random() * 20 - 10),
          ecolo: ideology.ecolo + (Math.random() * 20 - 10),
          social: ideology.social + (Math.random() * 20 - 10),
          souverainiste: ideology.souverainiste + (Math.random() * 20 - 10),
        },
        personality: {
          loyalty: Math.random() * 100,
          ambition: Math.random() * 100,
          charisma: Math.random() * 100,
          stubbornness: Math.random() * 100
        },
        background: generateBackground(),
        preferredRoles: generatePreferredRoles(),
        specialEffects: generateSpecialEffects()
      };
      
      candidates.push(candidate);
    }
  });
  
  return candidates;
}

export const ministerCandidates: PotentialMinister[] = [
  {
    id: "candidate1",
    name: "Jean Martin",
    party: "renaissance",
    competence: 75,
    popularity: 65,
    ideology: {
      liberal: 70,
      autoritaire: 40,
      ecolo: 50,
      social: 45,
      souverainiste: 30
    },
    personality: {
      loyalty: 70,
      ambition: 60,
      charisma: 65,
      stubbornness: 50
    },
    background: ["Ministre de l'Économie"],
    specialEffects: {
      economy: 10,
      business_relations: 5
    }
  },
  {
    id: "candidate2",
    name: "Marie Dubois",
    party: "ps",
    competence: 80,
    popularity: 70,
    ideology: {
      liberal: 55,
      autoritaire: 30,
      ecolo: 65,
      social: 80,
      souverainiste: 40
    },
    personality: {
      loyalty: 75,
      ambition: 55,
      charisma: 70,
      stubbornness: 45
    },
    background: ["Présidente de Région", "Sénatrice"],
    specialEffects: {
      social_affairs: 8,
      regional_support: 7
    }
  }
];