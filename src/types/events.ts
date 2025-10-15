// Types simplifiés pour le système de gameplay loop
export interface GameEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: number;
  category: string;
  date: Date;
  impacts?: {
    opinion?: {
      overall: number;
      segments?: Record<string, number>;
    };
    economy?: {
      gdpGrowth?: number;
      unemployment?: number;
      publicDebt?: number;
    };
    social?: {
      unrest?: number;
    };
    international?: {
      europeanInfluence?: number;
    };
    politicalCapital?: number;
  };
  choices?: {
    id: string;
    label: string;
    description: string;
    consequences?: {
      opinion?: {
        overall: number;
        segments?: Record<string, number>;
      };
      economy?: {
        gdpGrowth?: number;
        unemployment?: number;
        publicDebt?: number;
      };
      social?: {
        unrest?: number;
      };
      international?: {
        europeanInfluence?: number;
      };
      politicalCapital?: number;
    };
  }[];
}
