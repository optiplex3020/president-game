import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PotentialMinister } from '../types/cabinet';
import { CABINET_ROLES } from '../data/cabinetRoles';
import { generateCandidates } from '../utils/candidateGenerator';

interface CabinetFormationState {
  /** Mapping of role id to selected candidate */
  selectedMinisters: Record<string, PotentialMinister>;
  /** Map of candidate id to all roles they hold */
  ministerRoles: Record<string, string[]>;
  availableCandidates: PotentialMinister[];
  maxPartyMinistersAllowed: Record<string, number>;
  presidentParty: string;
  initializeFormation: (presidentParty: string, parliamentSeats: Record<string, number>, primeMinister?: PotentialMinister) => void;
  appointMinister: (role: string, candidate: PotentialMinister) => Promise<{ risks: string[] }>;
}

export const useCabinetFormationStore = create<CabinetFormationState>()(
  persist(
    (set, get) => ({
  selectedMinisters: {},
  ministerRoles: {},
  availableCandidates: [],
  maxPartyMinistersAllowed: {},
  presidentParty: '',

  initializeFormation: (presidentParty, parliamentSeats, primeMinister) => {
    const maxMinisters = Math.floor(Object.values(parliamentSeats).reduce((sum, seats) => sum + seats, 0) * 0.15);
    const partyAllocations: Record<string, number> = {};
    
    Object.entries(parliamentSeats).forEach(([party, seats]) => {
      const ratio = seats / 577;
      partyAllocations[party] = Math.max(Math.round(maxMinisters * ratio), 3); // Minimum 3 par parti
    });
    
    // Générer les candidats initiaux à partir du générateur commun
    const initialCandidates = generateCandidates(presidentParty, parliamentSeats);
    
    const selectedMinisters: Record<string, PotentialMinister> = {};
    const ministerRoles: Record<string, string[]> = {};

    let available = initialCandidates;

    if (primeMinister) {
      selectedMinisters['premier-ministre'] = primeMinister;
      ministerRoles[primeMinister.id] = ['premier-ministre'];
      available = initialCandidates.filter(c => c.id !== primeMinister.id);
    }

    set({
      presidentParty,
      maxPartyMinistersAllowed: partyAllocations,
      availableCandidates: available,
      ministerRoles,
      selectedMinisters
    });
  },

  appointMinister: async (role, candidate) => {
    const state = get();
    const risks: string[] = [];

    // ⚠️ VÉRIFICATION MULTI-ASSIGNATION
    const existingRoles = state.ministerRoles[candidate.id] || [];
    if (existingRoles.length > 0) {
      const roleNames = existingRoles.map(r =>
        CABINET_ROLES.find(cr => cr.id === r)?.title || r
      ).join(', ');

      const confirmed = window.confirm(
        `⚠️ ATTENTION: ${candidate.name} est déjà nommé(e) à :\n\n${roleNames}\n\n` +
        `Voulez-vous le/la retirer de ce(s) poste(s) pour le/la nommer à "${CABINET_ROLES.find(r => r.id === role)?.title}" ?`
      );

      if (!confirmed) {
        throw new Error("Nomination annulée par l'utilisateur");
      }

      // Retirer de tous les anciens postes
      const newSelectedMinisters = { ...state.selectedMinisters };
      existingRoles.forEach(oldRole => {
        delete newSelectedMinisters[oldRole];
      });

      set({
        selectedMinisters: newSelectedMinisters,
        ministerRoles: {
          ...state.ministerRoles,
          [candidate.id]: []
        }
      });

      risks.push(`⚠️ ${candidate.name} a été retiré(e) de ses précédentes fonctions`);
    }

    if (role === 'premier-ministre' && candidate.party !== state.presidentParty) {
      risks.push("Cohabitation : risque d'instabilité gouvernementale");
    }

    const roleData = CABINET_ROLES.find(r => r.id === role);
    if (roleData && candidate.competence < roleData.requiredCompetence) {
      risks.push("Compétences insuffisantes pour ce poste");
    }

    const partyCount = Object.entries(state.ministerRoles).reduce((acc, [minId, roles]) => {
      const m = state.selectedMinisters[minId];
      if (m && m.party === candidate.party) {
        acc += roles.length;
      }
      return acc;
    }, 0);

    if (partyCount >= state.maxPartyMinistersAllowed[candidate.party]) {
      risks.push("Quota de ministres dépassé pour ce parti");
    }

    set(state => ({
      selectedMinisters: {
        ...state.selectedMinisters,
        [role]: candidate
      },
      ministerRoles: {
        ...state.ministerRoles,
        [candidate.id]: [...(state.ministerRoles[candidate.id] || []), role]
      }
    }));

    return { risks };
  }
}),
    {
      name: 'president-game-cabinet',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
