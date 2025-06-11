import { create } from 'zustand';
import type { Law } from '../types/laws';

type Party = {
  id: string;
  name: string;
  seats: number;
  support: number;
  demands: string[];
  ideology: {
    liberal: number;
    autoritaire: number;
    ecolo: number;
    social: number;
    souverainiste: number;
  };
};

interface ParliamentState {
  parties: Record<string, Party>;
  currentLaw: Law | null;
  coalition: string[];
  
  proposeLaw: (law: Law) => void;
  negotiateSupport: (partyId: string) => void;
  voteOnLaw: () => Promise<boolean>;
  addParty: (party: Party) => void;
  removeParty: (partyId: string) => void;
}

export const useParliamentStore = create<ParliamentState>((set, get) => ({
  parties: {
    'renaissance': {
      id: 'renaissance',
      name: 'Renaissance',
      seats: 96,
      support: 65,
      demands: ['réforme économique', 'transition écologique'],
      ideology: {
        liberal: 70,
        autoritaire: 50,
        ecolo: 60,
        social: 45,
        souverainiste: 40
      }
    },
    'lr': {
      id: 'lr',
      name: 'Les Républicains',
      seats: 47,
      support: 40,
      demands: ['sécurité', 'immigration'],
      ideology: {
        liberal: 60,
        autoritaire: 75,
        ecolo: 30,
        social: 35,
        souverainiste: 70
      }
    }
  },
  currentLaw: null,
  coalition: [],

  proposeLaw: (law: Law) => {
    set({ currentLaw: law });
  },

  negotiateSupport: (partyId: string) => {
    set(state => {
      const party = state.parties[partyId];
      if (!party) return state;

      return {
        parties: {
          ...state.parties,
          [partyId]: {
            ...party,
            support: Math.min(100, party.support + 10)
          }
        }
      };
    });
  },

  voteOnLaw: async () => {
    const state = get();
    if (!state.currentLaw) return false;

    let totalSupport = 0;
    Object.values(state.parties).forEach(party => {
      if (party.support >= 50) {
        totalSupport += party.seats;
      }
    });

    const lawPassed = totalSupport >= state.currentLaw.supportNeeded;

    set({ currentLaw: null });

    return lawPassed;
  },

  addParty: (party: Party) => {
    set(state => ({
      parties: {
        ...state.parties,
        [party.id]: party
      }
    }));
  },

  removeParty: (partyId: string) => {
    set(state => {
      const { [partyId]: removed, ...remainingParties } = state.parties;
      return {
        parties: remainingParties,
        coalition: state.coalition.filter(id => id !== partyId)
      };
    });
  }
}));