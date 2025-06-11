import { create } from 'zustand';
import type { Minister, MinisterMission } from '../types/cabinet';

interface CabinetState {
  /** Mapping of role id to the minister holding it */
  ministers: Record<string, Minister>;
  /** Mapping of minister id to all roles they currently hold */
  ministerRoles: Record<string, string[]>;
  availableCandidates: Minister[];
  missions: MinisterMission[];
  assignMission: (roleId: string, missionId: string) => void;
  replaceMinister: (roleId: string, newMinisterId: string) => void;
  updateMissionProgress: (roleId: string, missionId: string) => void;
  evaluateMissionResults: (roleId: string, missionId: string) => void;
}

export const useCabinetStore = create<CabinetState>((set, get) => ({
  ministers: {
    'premier-ministre': {
      id: 'pm1',
      name: 'Gabriel Attal',
      roles: ['premier-ministre'],
      loyalty: 85,
      competence: 75,
      popularity: 65,
      party: 'lrem',
      specialEffects: { stability: 5 },
      status: 'active'
    },
    // ... autres ministres
  },
  ministerRoles: {
    'pm1': ['premier-ministre']
  },

  availableCandidates: [],
  missions: [],

  assignMission: (roleId, missionId) => {
    const minister = get().ministers[roleId];
    const mission = get().missions.find(m => m.id === missionId);
    if (!minister || !mission) return;

    set(state => ({
      ministers: {
        ...state.ministers,
        [roleId]: {
          ...minister,
          missions: [...(minister.missions || []), {
            id: missionId,
            title: mission.title,
            progress: 0,
            deadline: new Date(Date.now() + mission.duration * 24 * 60 * 60 * 1000).toISOString(),
            effects: mission.effects.success
          }]
        }
      }
    }));
  },

  replaceMinister: (roleId, newMinisterId) => {
    const newMinister = get().availableCandidates.find(c => c.id === newMinisterId);
    if (!newMinister) return;

    set(state => {
      const previous = state.ministers[roleId];
      const rolesForNew = state.ministerRoles[newMinister.id] || [];
      const updatedNewRoles = Array.from(new Set([...rolesForNew, roleId]));

      const updatedRoles = { ...state.ministerRoles, [newMinister.id]: updatedNewRoles };

      if (previous) {
        const prevRoles = (state.ministerRoles[previous.id] || []).filter(r => r !== roleId);
        updatedRoles[previous.id] = prevRoles;
      }

      return {
        ministers: {
          ...state.ministers,
          [roleId]: {
            ...newMinister,
            roles: updatedNewRoles,
            status: 'active'
          }
        },
        ministerRoles: updatedRoles,
        availableCandidates: state.availableCandidates.filter(c => c.id !== newMinisterId)
      };
    });
  }
}));