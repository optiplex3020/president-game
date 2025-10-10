// Système économique profond avec secteurs

export type EconomicSector =
  | 'agriculture' | 'industrie' | 'services' | 'technologie' | 'energie'
  | 'construction' | 'tourisme' | 'finance' | 'transport' | 'sante'
  | 'education' | 'commerce' | 'immobilier' | 'culture' | 'defense';

export interface Sector {
  id: EconomicSector;
  name: string;
  gdpContribution: number; // % du PIB
  employment: number; // Nombre d'emplois
  growth: number; // % croissance annuelle
  productivity: number; // 0-100
  competitiveness: number; // 0-100
  exports: number; // Milliards €
  imports: number; // Milliards €
  averageSalary: number; // € annuel
  unrest: number; // 0-100: niveau de conflictualité sociale
}

export interface EconomicIndicators {
  gdp: { value: number; growth: number };
  unemployment: { rate: number; total: number };
  inflation: number;
  wages: { median: number; growth: number };
  purchasing_power: number; // 0-100
  inequality: { gini: number; top10Share: number };
  publicDebt: { amount: number; gdpRatio: number };
  deficit: { amount: number; gdpRatio: number };
  trade: { balance: number; exports: number; imports: number };
  confidence: { business: number; consumer: number; investor: number };
}

export interface Company {
  id: string;
  name: string;
  sector: EconomicSector;
  size: 'small' | 'medium' | 'large' | 'cac40';
  ceo: { name: string; influence: number };
  revenue: number;
  employees: number;
  politicalInfluence: number; // 0-100
}
