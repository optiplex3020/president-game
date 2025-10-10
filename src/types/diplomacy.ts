export type DiplomaticAction = {
  type: 'visit' | 'treaty' | 'trade' | 'military';
  target: string;
  cost: number;
  timeToComplete: number;
  successChance: number;
  effects: Record<string, number>;
};

// Système diplomatique complet

export type Country =
  | 'usa' | 'uk' | 'germany' | 'italy' | 'spain' | 'china' | 'russia'
  | 'japan' | 'brazil' | 'india' | 'turkey' | 'saudi_arabia' | 'israel'
  | 'ukraine' | 'poland' | 'algeria' | 'morocco' | 'senegal';

export interface DiplomaticRelation {
  country: Country;
  relationship: number; // -100 à +100
  tradeVolume: number; // Milliards €
  militaryAlliance: boolean;
  treaties: string[];
  recentEvents: { date: Date; event: string; impact: number }[];
}

export interface InternationalCrisis {
  id: string;
  type: 'war' | 'trade' | 'diplomatic' | 'humanitarian' | 'terrorism';
  severity: number; // 0-100
  countries: Country[];
  franceInvolvement: number; // 0-100
  options: { id: string; label: string; consequences: any }[];
}