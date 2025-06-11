export interface Minister {
  id: string;
  name: string;
  /**
   * A minister may hold several portfolios simultaneously.
   * Each entry in this array is a role identifier from CABINET_ROLES.
   */
  roles: string[];
  party: string;
  loyalty: number;
  competence: number;
  popularity: number;
  ideology: {
    liberal: number;
    autoritaire: number;
    ecolo: number;
    social: number;
    souverainiste: number;
  };
  personality: {
    loyalty: number;
    ambition: number;
    charisma: number;
    stubbornness: number;
  };
  background: string;
  preferredRoles: string[];
  specialEffects: Record<string, number>;
  missions?: Array<{
    id: string;
    title: string;
    progress: number;
    deadline: string;
    effects: Record<string, number>;
  }>;
  status: 'active' | 'dismissed' | 'resigned';
}

interface MinisterCandidate {
  id: string;
  name: string;
  party: string;
  competence: number;
  personality: {
    loyalty: number;
    ambition: number;
    charisma: number;
    stubbornness: number;
  };
  traits: string[];
  background: string;
  specialEffects: Record<string, number>;
}

export interface MinisterMission {
  id: string;
  title: string;
  description: string;
  duration: number; // en jours
  difficulty: number;
  requirements: {
    competence?: number;
    loyalty?: number;
  };
  effects: {
    success: Record<string, number>;
    failure: Record<string, number>;
  };
}

export type Cabinet = {
  primeMinister: Minister | null;
  ministers: Record<string, Minister>;
  availableCandidates: Minister[];
};

export type CabinetAction = {
  type: 'ADD_MINISTER' | 'REMOVE_MINISTER' | 'CHANGE_ROLE' | 'DISMISS_MINISTER';
  payload: {
    ministerId: string;
    newRole?: string;
  };
};

export interface CabinetState {
  ministers: Record<string, Minister>;
  availableCandidates: Minister[];
  maxPartyMinistersAllowed: Record<string, number>;
  presidentParty: string;
}

export interface PotentialMinister {
  id: string;
  name: string;
  party: string;
  competence: number;
  popularity: number;
  ideology: {
    liberal: number;
    autoritaire: number;
    ecolo: number;
    social: number;
    souverainiste: number;
  };
  personality: {
    loyalty: number;
    ambition: number;
    charisma: number;
    stubbornness: number;
  };
  experience: number;
  reputation: number;
  background: string[];
  preferredRoles?: string[];
  specialEffects: Record<string, number>;
}

export const CABINET_ROLES = {
  PRIME_MINISTER: 'PRIME_MINISTER',
  FOREIGN_AFFAIRS: 'FOREIGN_AFFAIRS',
  ECONOMY: 'ECONOMY',
  INTERIOR: 'INTERIOR',
  JUSTICE: 'JUSTICE',
  DEFENSE: 'DEFENSE',
} as const;

export type CabinetRole = typeof CABINET_ROLES[keyof typeof CABINET_ROLES];

export type RoleEffects = {
  id: CabinetRole;
  effects: Record<string, number>;
};