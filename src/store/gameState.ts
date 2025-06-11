import { create } from 'zustand';
import eventsData from '../../data/events.json';
import type { PotentialMinister, CabinetRole } from '../types/cabinet';
import { CABINET_ROLES } from '../types/cabinet';

export type Option = {
  text: string;
  effects: Record<string, number>;
};

export type GameEvent = {
  id: number;
  description: string;
  image: string;
  options: Option[];
  conditions?: Record<string, { min?: number; max?: number }>;
  probability?: number;
  triggered_by?: number[];
};

export type PoliticalParty = {
  id: string;
  name: string;
  description: string;
  initialStats: {
    playerStats: Partial<Record<string, number>>;
    foreignRelations: Partial<Record<string, number>>;
    presidentProfile: Partial<Record<string, number>>;
  };
  seatsInParliament: number;
  formerPresidents: number;
  formerPrimeMinisters: number;
};

export const PRESET_PARTIES: PoliticalParty[] = [
  {
    id: "renaissance",
    name: "Renaissance",
    description: "Parti centriste et libéral européen",
    initialStats: {
      playerStats: {
        lrem: 80,
        entreprises: 60,
        medias: 55,
        min_economie: 70
      },
      foreignRelations: {
        ue: 80,
        usa: 65
      },
      presidentProfile: {
        liberal: 70,
        ecolo: 50
      }
    },
    seatsInParliament: 96,
    formerPresidents: 1, // Emmanuel Macron
    formerPrimeMinisters: 2 // Édouard Philippe, Jean Castex
  },
  {
    id: "lr",
    name: "Les Républicains",
    description: "Droite traditionnelle conservatrice",
    initialStats: {
      playerStats: {
        lr: 80,
        entreprises: 70,
        stability: 60
      },
      foreignRelations: {
        usa: 60,
        russie: 40
      },
      presidentProfile: {
        autoritaire: 60,
        souverainiste: 50
      }
    },
    seatsInParliament: 47, // Droite Républicaine (DR)
    formerPresidents: 3, // Chirac, Sarkozy, Giscard
    formerPrimeMinisters: 6 // Chirac, Balladur, Juppé, Raffarin, Villepin, Fillon
  },
  {
    id: "rn",
    name: "Rassemblement National",
    description: "Parti nationaliste et souverainiste",
    initialStats: {
      playerStats: {
        rn: 85,
        entreprises: 50,
        securite: 70,
        min_interieur: 65
      },
      foreignRelations: {
        ue: 40,
        usa: 55
      },
      presidentProfile: {
        autoritaire: 75,
        souverainiste: 80
      }
    },
    seatsInParliament: 126,
    formerPresidents: 0,
    formerPrimeMinisters: 0
  },
  {
    id: "lfi",
    name: "La France Insoumise",
    description: "Gauche radicale et populiste",
    initialStats: {
      playerStats: {
        lfi: 80,
        syndicats: 70,
        ecolo: 65,
        min_justice: 60
      },
      foreignRelations: {
        ue: 50,
        usa: 30
      },
      presidentProfile: {
        ecolo: 70,
        autoritaire: 60
      }
    },
    seatsInParliament: 72,
    formerPresidents: 0,
    formerPrimeMinisters: 0
  },
  {
    id: "ps",
    name: "Parti Socialiste",
    description: "Social-démocratie en recomposition",
    initialStats: {
      playerStats: {
        ps: 70,
        syndicats: 60,
        ecolo: 60,
        min_education: 65
      },
      foreignRelations: {
        ue: 70,
        usa: 60
      },
      presidentProfile: {
        liberal: 55,
        ecolo: 65
      }
    },
    seatsInParliament: 66,
    formerPresidents: 2, // Mitterrand, Hollande
    formerPrimeMinisters: 5 // Mauroy, Fabius, Rocard, Jospin, Ayrault
  },
  {
    id: "reconquete",
    name: "Reconquête",
    description: "Droite identitaire et conservatrice",
    initialStats: {
      playerStats: {
        reconquete: 75,
        entreprises: 55,
        securite: 65,
        min_interieur: 60
      },
      foreignRelations: {
        ue: 35,
        usa: 50
      },
      presidentProfile: {
        autoritaire: 70,
        souverainiste: 75
      }
    },
    seatsInParliament: 0,
    formerPresidents: 0,
    formerPrimeMinisters: 0
  },
  {
    id: "eelv",
    name: "Europe Écologie Les Verts",
    description: "Écologie politique et sociale",
    initialStats: {
      playerStats: {
        eelv: 80,
        syndicats: 60,
        ecolo: 85,
        min_ecologie: 75
      },
      foreignRelations: {
        ue: 75,
        usa: 55
      },
      presidentProfile: {
        ecolo: 90,
        liberal: 60
      }
    },
    seatsInParliament: 38, // Écologiste et Social (ÉCO)
    formerPresidents: 0,
    formerPrimeMinisters: 0
  },
  {
    id: "modem",
    name: "Mouvement Démocrate",
    description: "Centre pro-européen et modéré",
    initialStats: {
      playerStats: {
        modem: 70,
        entreprises: 65,
        min_economie: 60
      },
      foreignRelations: {
        ue: 85,
        usa: 65
      },
      presidentProfile: {
        liberal: 65,
        ecolo: 50
      }
    },
    seatsInParliament: 36,
    formerPresidents: 0,
    formerPrimeMinisters: 0
  },
  {
    id: "nfp",
    name: "Nouveau Front Populaire",
    description: "Coalition de gauche unie",
    initialStats: {
      playerStats: {
        nfp: 85,
        syndicats: 75,
        ecolo: 70,
        min_education: 65
      },
      foreignRelations: {
        ue: 60,
        usa: 40
      },
      presidentProfile: {
        ecolo: 75,
        liberal: 55
      }
    },
    seatsInParliament: 72, // correspond aux sièges de LFI-NFP (fusion)
    formerPresidents: 0, // coalition récente
    formerPrimeMinisters: 0
  },
  {
    id: "lapres",
    name: "L'Après",
    description: "Mouvement écosocialiste post-LFI",
    initialStats: {
      playerStats: {
        lapres: 65,
        syndicats: 60,
        ecolo: 80,
        min_justice: 55
      },
      foreignRelations: {
        ue: 65,
        usa: 45
      },
      presidentProfile: {
        ecolo: 85,
        liberal: 50
      }
    },
    seatsInParliament: 0,
    formerPresidents: 0,
    formerPrimeMinisters: 0
  }
];


type PlayerInfo = {
  firstName: string;
  lastName: string;
  age: number;
  previousRole: string;
};

type GameState = {
  // Parties prenantes et indicateurs
  playerStats: Record<string, number>;
  foreignRelations: Record<string, number>;
  systemicCrises: Record<string, number>;
  presidentProfile: Record<string, number>;

  // Événements
  events: GameEvent[];
  currentEvent: GameEvent | null;

  // Fil d'actualité
  socialFeed: string[];

  // Actions
  selectEvent: (evt: GameEvent) => void;
  applyDecision: (eventId: number, optionIndex: number) => void;
  advanceOneDay: () => void;
  goToNextEvent: () => void;
  triggerFollowUps: () => void;

  party: PoliticalParty | null;
  initializeWithParty: (party: PoliticalParty) => void;

  playerInfo: PlayerInfo | null;
  setPlayerInfo: (info: PlayerInfo) => void;

  handleCrisisEffect: (effects: Record<string, number>) => void;
  handleMinisterNomination: (minister: PotentialMinister, role: string) => void;

  gameStarted: boolean;
  initializeGame: () => void;
};

export const useGameState = create<GameState>((set, get) => ({
  // Initialisation des indicateurs
  playerStats: {
    popularity: 50,
    budget: 100,
    stability: 70,
    relations: 60,
    syndicats: 50,
    entreprises: 50,
    ecologistes: 50,
    medias: 50,
    lrem: 50,
    lr: 50,
    rn: 50,
    lfi: 50,
    eelv: 50,
    ps: 50,
    cgt: 50,
    cfdt: 50,
    fo: 50,
    unsa: 50,
    min_economie: 50,
    min_education: 50,
    elysee: 50,
    matignon: 50,
    le_monde: 50,
    france_info: 50,
    cnews: 50,
    mediapart: 50,
    bfmtv: 50,
  },

  foreignRelations: {
    usa: 50,
    russie: 50,
    chine: 50,
    ue: 60,
    otan: 60,
    afrique: 50,
  },

  systemicCrises: {
    hopital: 20,
    climat: 30,
  },

  presidentProfile: {
    liberal: 0,
    autoritaire: 0,
    ecolo: 0,
    social: 0,
    souverainiste: 0,
  },

  events: eventsData as GameEvent[],
  currentEvent: null,
  socialFeed: [],

  selectEvent: (evt) => set({ currentEvent: evt }),

  applyDecision: (eventId, optionIndex) => {
    const event = get().events.find((e) => e.id === eventId);
    const option = event?.options[optionIndex];
    if (!event || !option) return;
    // Appliquer effets directs sur playerStats
    set((state) => {
      const newStats = { ...state.playerStats };
      Object.entries(option.effects).forEach(([key, val]) => {
        if (newStats[key] !== undefined) {
          newStats[key] = Math.max(0, newStats[key] + val);
        }
      });
      return { playerStats: newStats };
    });
    // Ajouter un message au fil social
    set((state) => ({
      socialFeed: [
        ...state.socialFeed,
        `Décision prise: "${option.text}" pour l'événement #${eventId}.`,
      ],
    }));
    // Programmer follow-ups
    get().triggerFollowUps();
  },

  advanceOneDay: () => {
    // Intégré via calendarStore ou ajouté manuellement
    // ici juste appel de next event pour boucler
    get().goToNextEvent();
  },

  goToNextEvent: () => {
    // Suppose currentEventIndex et events triés
    const evts = get().events;
    const idx = evts.findIndex((e) => e.id === get().currentEvent?.id);
    const next = idx >= 0 && idx < evts.length - 1 ? evts[idx + 1] : evts[0];
    set({ currentEvent: next });
  },

  triggerFollowUps: () => {
    // Déclencher les événements dependants retenus dans `triggered_by`
    const historyId = get().currentEvent?.id;
    if (!historyId) return;
    const followUps = get().events.filter(
      (e) => e.triggered_by?.includes(historyId)
    );
    if (followUps.length > 0) {
      set({ currentEvent: followUps[0] });
    }
  },

  party: null,

  initializeWithParty: (party) => {
    set((state) => {
      // Créer des copies profondes pour éviter les mutations
      const newPlayerStats = { ...state.playerStats };
      const newForeignRelations = { ...state.foreignRelations };
      const newPresidentProfile = { ...state.presidentProfile };

      // Fusionner les statistiques en vérifiant les valeurs undefined
      Object.entries(party.initialStats.playerStats).forEach(([key, value]) => {
        if (value !== undefined) {
          newPlayerStats[key] = value;
        }
      });

      Object.entries(party.initialStats.foreignRelations).forEach(([key, value]) => {
        if (value !== undefined) {
          newForeignRelations[key] = value;
        }
      });

      Object.entries(party.initialStats.presidentProfile).forEach(([key, value]) => {
        if (value !== undefined) {
          newPresidentProfile[key] = value;
        }
      });

      return {
        ...state,
        party,
        playerStats: newPlayerStats,
        foreignRelations: newForeignRelations,
        presidentProfile: newPresidentProfile
      };
    });
  },

  playerInfo: null,

  setPlayerInfo: (info) => set({ playerInfo: info }),

  handleCrisisEffect: (effects) => {
    set(state => {
      const newStats = { ...state.playerStats };
      Object.entries(effects).forEach(([key, value]) => {
        if (newStats[key] !== undefined) {
          newStats[key] = Math.max(0, Math.min(100, newStats[key] + value));
        }
      });
      return { playerStats: newStats };
    });
  },

  handleMinisterNomination: (minister, role) => {
    set(state => {
      const newStats = { ...state.playerStats };
      
      // Impact sur la popularité
      newStats.popularity += (minister.popularity - 50) * 0.1 + (minister.reputation - 50) * 0.05;

      // Impact sur la stabilité selon la loyauté
      if (minister.personality?.loyalty) {
        newStats.stability += (minister.personality.loyalty - 50) * 0.1;
      }

      // Expérience du ministre
      if (minister.experience) {
        newStats.stability += minister.experience * 0.02;
      }

      // Effets spéciaux
      Object.entries(minister.specialEffects || {}).forEach(([key, val]) => {
        if (newStats[key] !== undefined) {
          newStats[key] += val;
        }
      });
      
      // Impact spécifique au rôle (simplifié)
      const roleImpact = 0.1 * minister.competence;
      switch (role) {
        case CABINET_ROLES.ECONOMY:
          newStats.budget += roleImpact;
          break;
        case CABINET_ROLES.INTERIOR:
          newStats.stability += roleImpact;
          break;
        // Ajoutez d'autres cas selon vos besoins
      }
      
      return { playerStats: newStats };
    });
  },

  gameStarted: false,
  initializeGame: () => set({ gameStarted: true }),
}));

// Supprimez ou utilisez useCrisisSystem si nécessaire
// const useCrisisSystem = ...