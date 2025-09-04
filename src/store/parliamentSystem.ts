import { create } from 'zustand';

import type { PoliticalParty } from '../types/party';

export type Law = {
  id: string;
  title: string;
  description: string;
  type: 'economic' | 'social' | 'security' | 'environmental';
  effects: Record<string, number>;
  requiredMajority: number;
  votingPeriod: number;
  status: 'pending' | 'voting' | 'passed' | 'rejected';
};

interface ParliamentState {
  parties: PoliticalParty[];
  currentLaw: Law | null;
  coalitionSupport: number;
  totalSeats: number;
  proposeLaw: (law: Omit<Law, 'id' | 'status'>) => void;
  negotiateSupport: (partyId: string) => void;
  updatePartySupport: (partyId: string, change: number) => void;
  updateCoalitionSupport: () => void;
  startVote: () => void;
  processVoteResults: () => void;
}

export const useParliamentStore = create<ParliamentState>((set, get) => ({
  parties: [
    {
      id: 'majorite',
      name: 'Majorité Présidentielle',
      description: 'Coalition gouvernementale',
      initialStats: { playerStats: {}, foreignRelations: {}, presidentProfile: {} },
      seatsInParliament: 250,
      formerPresidents: 0,
      formerPrimeMinisters: 0,
      seats: 250,
      ideology: { liberal: 20, autoritaire: 0, ecolo: 30, social: 30, souverainiste: 0 },
      support: 100,
      inCoalition: true
    },
  ],
  currentLaw: null,
  coalitionSupport: 0,
  totalSeats: 577,

  proposeLaw: (law) => {
    set({
      currentLaw: {
        ...law,
        id: Math.random().toString(36).slice(2),
        status: 'pending'
      }
    });
  },

  negotiateSupport: (partyId) => {
    const party = get().parties.find(p => p.id === partyId);
    if (!party) return;

    set(state => ({
      parties: state.parties.map(p =>
        p.id === partyId
          ? { ...p, inCoalition: !p.inCoalition }
          : p
      )
    }));
    
    get().updateCoalitionSupport();
  },

  updatePartySupport: (partyId, change) => {
    set(state => ({
      parties: state.parties.map(p =>
        p.id === partyId
          ? { ...p, support: Math.max(0, Math.min(100, (p.support || 0) + change)) }
          : p
      )
    }));
  },

  updateCoalitionSupport: () => {
    const parties = get().parties;
    const support = parties
      .filter(p => p.inCoalition)
      .reduce((sum, p) => sum + (p.seats || 0), 0);
    set({ coalitionSupport: support });
  },

  startVote: () => {
    // Implementation placeholder
  },

  processVoteResults: () => {
    // Implementation placeholder
  }
}));