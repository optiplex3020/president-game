export type GameInitStep = 'personal' | 'party' | 'prime-minister' | 'cabinet' | 'confirmation';

export interface PoliticalParty {
  id: string;
  name: string;
  color: string;
  seats: number;
}

export type { PotentialMinister } from './cabinet';
