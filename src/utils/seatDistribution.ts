import { PRESET_PARTIES } from '../store/gameState';

export function getSeatDistribution(): Record<string, number> {
  return PRESET_PARTIES.reduce((acc, party) => {
    acc[party.id] = party.seatsInParliament;
    return acc;
  }, {} as Record<string, number>);
}
