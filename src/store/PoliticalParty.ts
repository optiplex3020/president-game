export interface PoliticalParty {
  id: string;
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
}