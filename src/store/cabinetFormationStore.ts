import { create } from 'zustand';
import type { PotentialMinister } from '../types/cabinet';
import { CABINET_ROLES } from '../data/cabinetRoles';

const FIRST_NAMES = [
  "Jean", "Marie", "Pierre", "Sophie", "Thomas", "Claire", "Michel", "Anne",
  "François", "Caroline", "Laurent", "Isabelle", "Philippe", "Nathalie", 
  "Nicolas", "Sylvie", "Bernard", "Catherine", "Éric", "Christine"
];

const LAST_NAMES = [
  "Martin", "Bernard", "Dubois", "Robert", "Laurent", "Lefebvre", "Moreau",
  "Simon", "Michel", "Garcia", "Durand", "Thomas", "Petit", "Roux", "Lambert"
];

const BACKGROUNDS = [
  "Ancien professeur d'université",
  "Cadre du secteur privé",
  "Haut fonctionnaire",
  "Entrepreneur",
  "Avocat",
  "Médecin",
  "Syndicaliste",
  "Élu local",
  "Diplômé de l'ENA",
  "Militant politique de longue date"
];

const PERSONALITY_TRAITS = {
  AMBITIEUX: "Ambitieux",
  LOYAL: "Loyal",
  DIPLOMATE: "Diplomate",
  IDEALISTE: "Idéaliste",
  PRAGMATIQUE: "Pragmatique",
  CHARISMATIQUE: "Charismatique",
  AUTORITAIRE: "Autoritaire",
  CONCILIANT: "Conciliant",
  REFORMATEUR: "Réformateur",
  CONSERVATEUR: "Conservateur"
};

interface CabinetFormationState {
  /** Mapping of role id to selected candidate */
  selectedMinisters: Record<string, PotentialMinister>;
  /** Map of candidate id to all roles they hold */
  ministerRoles: Record<string, string[]>;
  availableCandidates: PotentialMinister[];
  maxPartyMinistersAllowed: Record<string, number>;
  presidentParty: string;
  initializeFormation: (presidentParty: string, parliamentSeats: Record<string, number>) => void;
  appointMinister: (role: string, candidate: PotentialMinister) => Promise<{ risks: string[] }>;
}

export const useCabinetFormationStore = create<CabinetFormationState>((set, get) => ({
  selectedMinisters: {},
  ministerRoles: {},
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
    
    // Générer les candidats initiaux
    const initialCandidates = generateInitialCandidates(presidentParty, parliamentSeats);
    
    set({
      presidentParty,
      maxPartyMinistersAllowed: partyAllocations,
      availableCandidates: initialCandidates, // Ajout des candidats à l'état
      ministerRoles: {},
      selectedMinisters: {}
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
}));

// Fonction helper pour générer les candidats
function generateInitialCandidates(presidentParty: string, partyDistribution: Record<string, number>) {
  const candidates: MinisterCandidate[] = [];
  
  Object.entries(partyDistribution).forEach(([party, seats]) => {
    // Plus de candidats pour les grands partis, moins pour les petits
    const baseCount = Math.ceil(seats / 20);
    const numCandidates = Math.min(Math.max(baseCount, 3), 15); // Min 3, Max 15 candidats par parti
    
    for (let i = 0; i < numCandidates; i++) {
      // Génération du nom
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      
      // Compétence variable selon la taille du parti
      const competenceBonus = seats > 150 ? 10 : 0; // Bonus pour les grands partis
      const baseCompetence = Math.floor(Math.random() * 30) + 50;
      const competence = Math.min(baseCompetence + competenceBonus, 100);
      
      // Loyauté plus élevée envers son propre parti
      const loyaltyBase = party === presidentParty ? 60 : 40;
      const loyalty = Math.min(loyaltyBase + Math.floor(Math.random() * 40), 100);
      
      // Sélection aléatoire de 2 à 3 traits de personnalité
      const traits = Object.values(PERSONALITY_TRAITS);
      const selectedTraits = shuffleArray(traits).slice(0, 2 + Math.floor(Math.random() * 2));
      
      // Background aléatoire mais cohérent
      const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      
      // Effets spéciaux basés sur le background
      const specialEffects: Record<string, number> = {};
      if (background.includes("professeur")) {
        specialEffects.education = 15;
      } else if (background.includes("avocat")) {
        specialEffects.justice = 15;
      } else if (background.includes("médecin")) {
        specialEffects.sante = 15;
      }
      
      candidates.push({
        id: `${party}-${i}`,
        name: `${firstName} ${lastName}`,
        party,
        competence,
        personality: {
          loyalty,
          ambition: Math.floor(Math.random() * 100),
          charisma: Math.floor(Math.random() * 100),
          stubbornness: Math.floor(Math.random() * 100)
        },
        traits: selectedTraits,
        background,
        specialEffects
      });
    }
  });
  
  return shuffleArray(candidates);
}

// Fonction utilitaire pour mélanger un tableau
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}