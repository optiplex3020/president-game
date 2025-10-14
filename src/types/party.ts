import type { PartyId } from './parliament';

export type PoliticalParty = {
  id: string;
  parliamentaryId?: PartyId;
  name: string;
  description: string;
  initialStats: {
    playerStats: Partial<Record<string, number>>;
    foreignRelations: Partial<Record<string, number>>;
    presidentProfile: Partial<Record<string, number>>;
  };
  seatsInParliament: number;
  formerPresidents: number;
  formerPrimeMinisters: number;
  ideology?: {
    liberal: number;
    autoritaire: number;
    ecolo: number;
    social: number;
    souverainiste: number;
  };
  ideologyVector?: {
    economicLeft: number;
    social: number;
    european: number;
    environmental: number;
    authoritarian: number;
  };
  seats?: number;
  support?: number;
  inCoalition?: boolean;
};
