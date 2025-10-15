export type { DemographicGroup as DemographicSegment, DemographicSegment as DemographicSegmentId } from './opinion';

// Type simplifié pour l'interface
export interface SimplifiedSegment {
  id: string;
  name: string;
  size: number; // Pourcentage de la population
  supportForPresident: number; // 0-100
  volatility?: number; // 0-100
  concerns: string[]; // Liste des préoccupations
}
