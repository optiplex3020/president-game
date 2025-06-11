import { create } from 'zustand';

export type PoliticalParty = {
  id: string;
  name: string;
  seats: number;
  ideology: {
    economic: number;    // -100 (gauche) à 100 (droite)
    social: number;      // -100 (conservateur) à 100 (progressiste)
  };
  support: number;       // 0-100
  inCoalition: boolean;
};

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
  parties: Array<{
    id: string;
    name: string;
    seats: number;
    ideology: {
      economic: number;
      social: number;
    };
    support: number;
    inCoalition: boolean;
  }>;
  currentLaw: Law | null;
  coalitionSupport: number;
  totalSeats: number;
  proposeLaw: (law: Omit<Law, 'id' | 'status'>) => void;
  negotiateSupport: (partyId: string) => void;
  updatePartySupport: (partyId: string, change: number) => void;
  startVote: (lawId: string) => void;
  processVoteResults: () => void;
}

export const useParliamentStore = create<ParliamentState>((set, get) => ({
  parties: [
    {
      id: 'majorite',
      name: 'Majorité Présidentielle',
      seats: 250,
      ideology: { economic: 20, social: 30 },
      support: 100,
      inCoalition: true
    },
    // ... autres partis
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
          ? { ...p, support: Math.max(0, Math.min(100, p.support + change)) }
          : p
      )
    }));
  },

  updateCoalitionSupport: () => {
    const parties = get().parties;
    const support = parties
      .filter(p => p.inCoalition)
      .reduce((sum, p) => sum + p.seats, 0);
    set({ coalitionSupport: support });
  }
}));