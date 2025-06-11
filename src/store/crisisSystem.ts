import { create } from 'zustand';

export type CrisisType = 'economic' | 'social' | 'environmental' | 'diplomatic' | 'security';

export interface Crisis {
  id: string;
  type: CrisisType;
  title: string;
  description: string;
  severity: number;
  escalationRate: number;
  triggers?: {
    stability?: number;
    popularity?: number;
    budget?: number;
  };
  solutions: Array<{
    text: string;
    cost: number;
    effectiveness: number;
    effects: Record<string, number>;
  }>;
}

interface CrisisState {
  activeCrises: Crisis[];
  historicalCrises: Crisis[];
  isHandlingCrisis: boolean;
  handleCrisis: (crisisId: string, solutionIndex: number) => void;
  escalateCrisis: (crisisId: string) => void;
  addCrisis: (crisis: Crisis) => void;
  removeCrisis: (crisisId: string) => void;
  checkForNewCrises: (state: Record<string, number>) => void;
}

export const useCrisisSystem = create<CrisisState>((set, get) => ({
  activeCrises: [],
  historicalCrises: [],
  isHandlingCrisis: false,

  addCrisis: (crisis: Crisis) => {
    set(state => ({
      activeCrises: [...state.activeCrises, crisis]
    }));
  },

  removeCrisis: (crisisId: string) => {
    set(state => {
      const crisis = state.activeCrises.find(c => c.id === crisisId);
      if (!crisis) return state;

      return {
        activeCrises: state.activeCrises.filter(c => c.id !== crisisId),
        historicalCrises: [...state.historicalCrises, crisis]
      };
    });
  },
  
  escalateCrisis: (crisisId: string) => {
    set(state => ({
      activeCrises: state.activeCrises.map(crisis => 
        crisis.id === crisisId 
          ? { ...crisis, severity: Math.min(100, crisis.severity + crisis.escalationRate) }
          : crisis
      )
    }));
  },

  handleCrisis: (crisisId, solutionIndex) => {
    set({ isHandlingCrisis: true });
    const crisis = get().activeCrises.find(c => c.id === crisisId);
    if (!crisis || !crisis.solutions[solutionIndex]) return;

    const solution = crisis.solutions[solutionIndex];
    
    // Appliquer la solution
    set(state => ({
      activeCrises: state.activeCrises.map(c => 
        c.id === crisisId 
          ? { 
              ...c, 
              severity: Math.max(0, c.severity - solution.effectiveness) 
            }
          : c
      )
    }));

    // Si la crise est résolue (sévérité <= 0), la déplacer vers l'historique
    const updatedCrisis = get().activeCrises.find(c => c.id === crisisId);
    if (updatedCrisis && updatedCrisis.severity <= 0) {
      get().removeCrisis(crisisId);
    }
  },

  checkForNewCrises: (state) => {
    // Vérifier les déclencheurs de crise basés sur l'état du jeu
    if (state.stability < 30 || state.popularity < 20) {
      // Ajouter une nouvelle crise sociale
    }
    if (state.budget < -50) {
      // Ajouter une nouvelle crise économique
    }
  }
}));