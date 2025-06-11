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
  // ... autres propriétés
}