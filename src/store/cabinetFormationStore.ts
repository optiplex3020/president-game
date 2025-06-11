import { create } from 'zustand';
import type { PotentialMinister } from '../types/cabinet';
import { CABINET_ROLES } from '../data/cabinetRoles';
import { generateCandidates } from '../utils/candidateGenerator';

interface CabinetFormationState {
  selectedMinisters: Record<string, PotentialMinister>;
  availableCandidates: PotentialMinister[];
  maxPartyMinistersAllowed: Record<string, number>;
  presidentParty: string;
  initializeFormation: (presidentParty: string, parliamentSeats: Record<string, number>) => void;
  appointMinister: (role: string, candidate: PotentialMinister) => Promise<{ risks: string[] }>;
}

export const useCabinetFormationStore = create<CabinetFormationState>((set, get) => ({
  selectedMinisters: {},
  availableCandidates: [],
  maxPartyMinistersAllowed: {},
  presidentParty: '',

  initializeFormation: (presidentParty, parliamentSeats) => {
    const maxMinisters = Math.floor(Object.values(parliamentSeats).reduce((sum, seats) => sum + seats, 0) * 0.15);
    const partyAllocations: Record<string, number> = {};
    
    Object.entries(parliamentSeats).forEach(([party, seats]) => {
      const ratio = seats / 577;
      partyAllocations[party] = Math.round(maxMinisters * ratio);
    });
    
    // Générer les candidats initiaux à partir du générateur commun
    const initialCandidates = generateCandidates(presidentParty, parliamentSeats);
    
    set({ 
      presidentParty,
      maxPartyMinistersAllowed: partyAllocations,
      availableCandidates: initialCandidates // Ajout des candidats à l'état
    });
  },

  appointMinister: async (role, candidate) => {
    const state = get();
    const risks: string[] = [];
    
    if (role === 'premier-ministre' && candidate.party !== state.presidentParty) {
      risks.push("Cohabitation : risque d'instabilité gouvernementale");
    }

    const roleData = CABINET_ROLES.find(r => r.id === role);
    if (roleData && candidate.competence < roleData.requiredCompetence) {
      risks.push("Compétences insuffisantes pour ce poste");
    }

    const partyCount = Object.values(state.selectedMinisters)
      .filter(m => m.party === candidate.party).length;
      
    if (partyCount >= state.maxPartyMinistersAllowed[candidate.party]) {
      risks.push("Quota de ministres dépassé pour ce parti");
    }

    set(state => ({
      selectedMinisters: {
        ...state.selectedMinisters,
        [role]: candidate
      }
    }));

    return { risks };
  }
}));
