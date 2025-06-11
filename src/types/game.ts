export type GameInitStep = 'personal' | 'party' | 'prime-minister' | 'cabinet' | 'confirmation';

export interface PoliticalParty {
  id: string;
  name: string;
  color: string;
  seats: number;
}

export interface PotentialMinister {
  id: string;
  name: string;
  party: string;
  experience: number;
  reputation: number;
  competence: number;
  personality: {
    loyalty: number;
    ambition: number;
    charisma: number;
    stubbornness: number;
  };
}