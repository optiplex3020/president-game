import { create } from 'zustand';
import type {
  Deputy,
  Law,
  VotingResults,
  VoteType,
  ParliamentaryGroup,
  PartyId,
  NegotiationOffer,
  Amendment,
  ParliamentaryDebate,
  MotionOfNoCconfidence
} from '../types/parliament';
import { generateAllDeputies, getDeputiesByParty } from '../data/deputyGenerator';

interface ParliamentEngineState {
  // Données
  deputies: Deputy[];
  parliamentaryGroups: Record<PartyId, ParliamentaryGroup>;
  currentLaws: Law[];
  pendingNegotiations: NegotiationOffer[];

  // Actions
  initializeParliament: () => void;
  proposeLaw: (law: Law) => void;
  simulateVote: (lawId: string) => Promise<VotingResults>;
  calculateDeputyVoteProbability: (deputy: Deputy, law: Law) => {
    pour: number;
    contre: number;
    abstention: number;
  };
  negotiateWithDeputy: (deputyId: string, offer: NegotiationOffer) => Promise<boolean>;
  influenceDeputy: (deputyId: string, influence: {
    relationshipChange: number;
    message: string;
  }) => void;
  proposeAmendment: (lawId: string, amendment: Amendment) => void;
  conductDebate: (lawId: string) => Promise<ParliamentaryDebate>;
  triggerMotionOfNoConfidence: (motion: MotionOfNoCconfidence) => Promise<boolean>;

  // Requêtes
  getDeputy: (id: string) => Deputy | undefined;
  getDeputiesByParty: (party: PartyId) => Deputy[];
  getLaw: (id: string) => Law | undefined;
  getParliamentaryMajority: () => number; // Nombre de voix de la majorité
}

// Fonction: Calcule la distance idéologique entre un député et une loi
function calculateIdeologicalDistance(
  deputyIdeology: Deputy['ideology'],
  lawIdeology: Law['ideology']
): number {
  const differences = [
    Math.abs(deputyIdeology.economicLeft - lawIdeology.economicLeft),
    Math.abs(deputyIdeology.social - lawIdeology.social),
    Math.abs(deputyIdeology.european - lawIdeology.european),
    Math.abs(deputyIdeology.environmental - lawIdeology.environmental),
    Math.abs(deputyIdeology.authoritarian - lawIdeology.authoritarian)
  ];

  // Distance euclidienne normalisée
  const distance = Math.sqrt(
    differences.reduce((sum, diff) => sum + diff * diff, 0)
  );

  return distance / 100; // Normaliser entre 0 et ~3
}

// Fonction: Détermine la consigne de vote du parti
function getPartyVoteInstruction(
  party: PartyId,
  law: Law,
  governmentParties: PartyId[]
): VoteType {
  const isGovernmentParty = governmentParties.includes(party);
  const isGovernmentLaw = law.proposedBy === 'gouvernement';

  // Les partis au gouvernement soutiennent leurs propres lois
  if (isGovernmentParty && isGovernmentLaw) {
    return 'pour';
  }

  // Calcul basé sur l'idéologie
  const partyIdeology = PARTY_IDEOLOGIES_MAP[party];
  const distance = calculateIdeologicalDistance(
    { ...partyIdeology, economicLeft: partyIdeology.economicLeft } as Deputy['ideology'],
    law.ideology
  );

  if (distance < 0.5) return 'pour';
  if (distance < 1.0) return 'abstention';
  return 'contre';
}

const PARTY_IDEOLOGIES_MAP: Record<PartyId, any> = {
  renaissance: { economicLeft: 15, social: 40, european: 80, environmental: 60, authoritarian: 20 },
  rn: { economicLeft: -10, social: -60, european: -80, environmental: 20, authoritarian: 70 },
  lfi: { economicLeft: -80, social: 70, european: -40, environmental: 75, authoritarian: -30 },
  lr: { economicLeft: 60, social: -40, european: 40, environmental: 30, authoritarian: 50 },
  ps: { economicLeft: -50, social: 60, european: 70, environmental: 65, authoritarian: -10 },
  ecologistes: { economicLeft: -40, social: 65, european: 75, environmental: 95, authoritarian: -20 },
  horizons: { economicLeft: 25, social: 35, european: 75, environmental: 55, authoritarian: 15 },
  modem: { economicLeft: 10, social: 45, european: 85, environmental: 60, authoritarian: 10 },
  pcf: { economicLeft: -90, social: 60, european: -30, environmental: 70, authoritarian: -40 },
  liot: { economicLeft: -20, social: 30, european: 50, environmental: 55, authoritarian: -15 },
  udi: { economicLeft: 40, social: 20, european: 65, environmental: 45, authoritarian: 25 },
  divers_gauche: { economicLeft: -60, social: 55, european: 60, environmental: 60, authoritarian: -20 },
  divers_droite: { economicLeft: 50, social: -30, european: 45, environmental: 35, authoritarian: 40 },
  independant: { economicLeft: 0, social: 0, european: 50, environmental: 50, authoritarian: 0 }
};

export const useParliamentEngine = create<ParliamentEngineState>((set, get) => ({
  deputies: [],
  parliamentaryGroups: {} as Record<PartyId, ParliamentaryGroup>,
  currentLaws: [],
  pendingNegotiations: [],

  initializeParliament: () => {
    const deputies = generateAllDeputies();

    // Créer les groupes parlementaires
    const groups: Record<PartyId, ParliamentaryGroup> = {} as any;

    const partyIds = [...new Set(deputies.map(d => d.party))];

    for (const partyId of partyIds) {
      const partyDeputies = deputies.filter(d => d.party === partyId);
      const mostInfluential = [...partyDeputies].sort((a, b) => b.influence - a.influence)[0];

      groups[partyId] = {
        id: partyId,
        name: partyId,
        president: mostInfluential,
        members: partyDeputies,
        seats: partyDeputies.length,
        discipline: partyDeputies.reduce((sum, d) => sum + d.discipline, 0) / partyDeputies.length,
        unity: Math.random() * 30 + 60, // 60-90
        ideology: PARTY_IDEOLOGIES_MAP[partyId],
        coalitionWith: [],
        oppositionTo: [],
        strategy: partyId === 'renaissance' ? 'soutien' : 'opposition'
      };
    }

    set({ deputies, parliamentaryGroups: groups });
  },

  proposeLaw: (law: Law) => {
    set(state => ({
      currentLaws: [...state.currentLaws, law]
    }));
  },

  calculateDeputyVoteProbability: (deputy: Deputy, law: Law) => {
    const state = get();

    // 1. Consigne du parti
    const governmentParties: PartyId[] = ['renaissance', 'horizons', 'modem']; // À adapter dynamiquement
    const partyInstruction = getPartyVoteInstruction(deputy.party, law, governmentParties);

    // 2. Distance idéologique personnelle
    const ideologicalDistance = calculateIdeologicalDistance(deputy.ideology, law.ideology);

    // 3. Facteurs de base
    let pourProba = 0;
    let contreProba = 0;
    let abstentionProba = 0;

    // Application de la discipline de parti
    const disciplineFactor = deputy.discipline / 100;

    if (partyInstruction === 'pour') {
      pourProba = 60 + disciplineFactor * 30;
      contreProba = 10 - disciplineFactor * 5;
      abstentionProba = 30 - disciplineFactor * 25;
    } else if (partyInstruction === 'contre') {
      contreProba = 60 + disciplineFactor * 30;
      pourProba = 10 - disciplineFactor * 5;
      abstentionProba = 30 - disciplineFactor * 25;
    } else {
      abstentionProba = 50 + disciplineFactor * 20;
      pourProba = 25 - disciplineFactor * 10;
      contreProba = 25 - disciplineFactor * 10;
    }

    // 4. Ajustement selon conviction personnelle
    if (deputy.traits.includes('ideologue')) {
      // Suit davantage sa conviction que le parti
      if (ideologicalDistance < 0.5) {
        pourProba += 20;
        contreProba -= 10;
      } else if (ideologicalDistance > 1.5) {
        contreProba += 20;
        pourProba -= 10;
      }
    }

    // 5. Traits spécifiques
    if (deputy.traits.includes('rebelle')) {
      // Tendance à voter contre le parti
      if (partyInstruction === 'pour') {
        contreProba += 15;
        pourProba -= 10;
      } else if (partyInstruction === 'contre') {
        pourProba += 15;
        contreProba -= 10;
      }
    }

    if (deputy.traits.includes('pragmatique')) {
      // Cherche le compromis
      abstentionProba += 10;
    }

    if (deputy.traits.includes('populiste')) {
      // Suit l'opinion publique (simulation)
      const publicOpinion = Math.random() > 0.5 ? 'pour' : 'contre';
      if (publicOpinion === 'pour') {
        pourProba += 10;
      } else {
        contreProba += 10;
      }
    }

    // 6. Relation avec le gouvernement
    const relationFactor = deputy.relationWithGovernment / 100;
    if (law.proposedBy === 'gouvernement') {
      pourProba += relationFactor * 15;
      contreProba -= relationFactor * 15;
    }

    // 7. Expertise
    if (deputy.expertises.includes(law.category)) {
      // Les experts sont plus tranchés
      if (ideologicalDistance < 0.7) {
        pourProba += 15;
        abstentionProba -= 10;
      } else {
        contreProba += 15;
        abstentionProba -= 10;
      }
    }

    // 8. Négociations en cours
    const negotiation = state.pendingNegotiations.find(
      n => n.targetDeputy.id === deputy.id && n.demand.lawId === law.id
    );

    if (negotiation && negotiation.status === 'accepted') {
      if (negotiation.demand.vote === 'pour') {
        pourProba += 40;
        contreProba -= 20;
        abstentionProba -= 20;
      } else if (negotiation.demand.vote === 'contre') {
        contreProba += 40;
        pourProba -= 20;
        abstentionProba -= 20;
      } else {
        abstentionProba += 40;
        pourProba -= 20;
        contreProba -= 20;
      }
    }

    // Normalisation pour que la somme = 100
    const total = pourProba + contreProba + abstentionProba;
    pourProba = (pourProba / total) * 100;
    contreProba = (contreProba / total) * 100;
    abstentionProba = (abstentionProba / total) * 100;

    return {
      pour: Math.max(0, Math.min(100, pourProba)),
      contre: Math.max(0, Math.min(100, contreProba)),
      abstention: Math.max(0, Math.min(100, abstentionProba))
    };
  },

  simulateVote: async (lawId: string) => {
    const state = get();
    const law = state.currentLaws.find(l => l.id === lawId);

    if (!law) {
      throw new Error('Loi introuvable');
    }

    const results: VotingResults = {
      pour: 0,
      contre: 0,
      abstention: 0,
      absent: 0,
      passed: false,
      votesByParty: {} as any,
      rebels: [],
      pivotalVotes: []
    };

    // Initialiser les compteurs par parti
    for (const partyId of Object.keys(state.parliamentaryGroups) as PartyId[]) {
      results.votesByParty[partyId] = {
        pour: 0,
        contre: 0,
        abstention: 0,
        absent: 0
      };
    }

    const governmentParties: PartyId[] = ['renaissance', 'horizons', 'modem'];

    // Simuler le vote de chaque député
    for (const deputy of state.deputies) {
      // 5% de chances d'absence
      if (Math.random() < 0.05) {
        results.absent++;
        results.votesByParty[deputy.party].absent++;
        continue;
      }

      const probabilities = get().calculateDeputyVoteProbability(deputy, law);

      // Tirage aléatoire selon les probabilités
      const roll = Math.random() * 100;
      let vote: VoteType;

      if (roll < probabilities.pour) {
        vote = 'pour';
        results.pour++;
        results.votesByParty[deputy.party].pour++;
      } else if (roll < probabilities.pour + probabilities.contre) {
        vote = 'contre';
        results.contre++;
        results.votesByParty[deputy.party].contre++;
      } else {
        vote = 'abstention';
        results.abstention++;
        results.votesByParty[deputy.party].abstention++;
      }

      // Détecter les rebelles
      const partyInstruction = getPartyVoteInstruction(deputy.party, law, governmentParties);
      if (vote !== partyInstruction && deputy.discipline > 60) {
        results.rebels.push(deputy);
      }

      // Enregistrer le vote dans l'historique
      const updatedDeputy = { ...deputy };
      updatedDeputy.votingHistory.push({
        lawId: law.id,
        vote,
        date: new Date(),
        wentAgainstParty: vote !== partyInstruction
      });

      // Mettre à jour le député
      set(state => ({
        deputies: state.deputies.map(d => d.id === deputy.id ? updatedDeputy : d)
      }));
    }

    // Déterminer si la loi passe
    const requiredVotes = law.requiredMajority === 'simple'
      ? 289
      : law.requiredMajority === 'absolue'
        ? 289
        : 345; // qualifiée

    results.passed = results.pour >= requiredVotes;

    // Identifier les votes pivots (ceux qui ont fait basculer le résultat)
    if (results.passed && results.pour - requiredVotes < 10) {
      // Les 10 derniers votes "pour" étaient cruciaux
      const pourVoters = state.deputies.filter(d => {
        const lastVote = d.votingHistory[d.votingHistory.length - 1];
        return lastVote && lastVote.lawId === lawId && lastVote.vote === 'pour';
      });
      results.pivotalVotes = pourVoters.slice(0, 10);
    }

    // Mettre à jour la loi avec les résultats
    set(state => ({
      currentLaws: state.currentLaws.map(l =>
        l.id === lawId
          ? {
            ...l,
            votingResults: results,
            votingDate: new Date(),
            stage: results.passed ? 'senat' : 'rejete'
          }
          : l
      )
    }));

    return results;
  },

  negotiateWithDeputy: async (deputyId: string, offer: NegotiationOffer) => {
    const state = get();
    const deputy = state.deputies.find(d => d.id === deputyId);

    if (!deputy) {
      throw new Error('Député introuvable');
    }

    // Calcul de la probabilité d'acceptation
    let acceptanceProbability = 50;

    // Facteur 1: Valeur de l'offre
    acceptanceProbability += offer.offer.value / 2;

    // Facteur 2: Ambition du député
    if (offer.offer.type === 'poste' || offer.offer.type === 'commission') {
      acceptanceProbability += deputy.ambition / 2;
    }

    // Facteur 3: Intégrité (résistance à la corruption)
    if (offer.offer.type === 'faveur') {
      acceptanceProbability -= deputy.integrity / 2;
    }

    // Facteur 4: Relation avec le gouvernement
    acceptanceProbability += deputy.relationWithGovernment / 2;

    // Facteur 5: Distance idéologique avec ce qu'on lui demande
    const law = state.currentLaws.find(l => l.id === offer.demand.lawId);
    if (law) {
      const distance = calculateIdeologicalDistance(deputy.ideology, law.ideology);
      acceptanceProbability -= distance * 20;
    }

    // Facteur 6: Loyauté au parti
    if (deputy.loyaltyToParty > 70) {
      acceptanceProbability -= 20;
    }

    // Limiter entre 5% et 95%
    acceptanceProbability = Math.max(5, Math.min(95, acceptanceProbability));

    // Tirage aléatoire
    const accepted = Math.random() * 100 < acceptanceProbability;

    // Mettre à jour la négociation
    const updatedOffer = {
      ...offer,
      status: accepted ? 'accepted' as const : 'rejected' as const,
      acceptanceProbability
    };

    set(state => ({
      pendingNegotiations: [...state.pendingNegotiations, updatedOffer]
    }));

    // Si accepté, modifier la relation avec le gouvernement
    if (accepted) {
      get().influenceDeputy(deputyId, {
        relationshipChange: 10,
        message: `Négociation réussie: ${offer.offer.description}`
      });
    }

    return accepted;
  },

  influenceDeputy: (deputyId: string, influence: { relationshipChange: number; message: string }) => {
    set(state => ({
      deputies: state.deputies.map(d =>
        d.id === deputyId
          ? {
            ...d,
            relationWithGovernment: Math.max(-100, Math.min(100,
              d.relationWithGovernment + influence.relationshipChange
            ))
          }
          : d
      )
    }));
  },

  proposeAmendment: (lawId: string, amendment: Amendment) => {
    set(state => ({
      currentLaws: state.currentLaws.map(l =>
        l.id === lawId
          ? { ...l, amendments: [...l.amendments, amendment] }
          : l
      )
    }));
  },

  conductDebate: async (lawId: string) => {
    const state = get();
    const law = state.currentLaws.find(l => l.id === lawId);

    if (!law) {
      throw new Error('Loi introuvable');
    }

    // Sélectionner des orateurs représentatifs
    const speakers: ParliamentaryDebate['speakers'] = [];

    // Prendre les plus influents de chaque groupe
    for (const group of Object.values(state.parliamentaryGroups)) {
      const speaker = [...group.members]
        .sort((a, b) => b.influence - a.influence)[0];

      if (speaker) {
        const governmentParties: PartyId[] = ['renaissance', 'horizons', 'modem'];
        const position = getPartyVoteInstruction(speaker.party, law, governmentParties);

        speakers.push({
          deputy: speaker,
          duration: Math.random() * 10 + 5, // 5-15 minutes
          position: position === 'abstention' ? 'ambigu' : position,
          impact: speaker.influence / 10, // 0-10
          transcript: `Discours de ${speaker.firstName} ${speaker.lastName} (${speaker.party}) sur ${law.title}`
        });
      }
    }

    const debate: ParliamentaryDebate = {
      lawId,
      date: new Date(),
      speakers,
      opinShift: speakers.reduce((sum, s) => sum + (s.position === 'pour' ? s.impact : -s.impact), 0) / 10,
      deputiesConvinced: [] // Simulation simplifiée
    };

    return debate;
  },

  triggerMotionOfNoConfidence: async (motion: MotionOfNoCconfidence) => {
    // Simuler le vote sur la motion de censure
    const state = get();

    let votesPour = 0;
    for (const deputy of state.deputies) {
      // Les partis initiateurs votent pour
      if (motion.initiatedBy.includes(deputy.party)) {
        votesPour++;
      }
      // Autres députés: probabilité basée sur relation avec le gouvernement
      else if (deputy.relationWithGovernment < -30 && Math.random() > 0.5) {
        votesPour++;
      }
    }

    const governmentFell = votesPour >= motion.requiredVotes;

    return governmentFell;
  },

  // Requêtes
  getDeputy: (id: string) => {
    return get().deputies.find(d => d.id === id);
  },

  getDeputiesByParty: (party: PartyId) => {
    return get().deputies.filter(d => d.party === party);
  },

  getLaw: (id: string) => {
    return get().currentLaws.find(l => l.id === id);
  },

  getParliamentaryMajority: () => {
    const state = get();
    const governmentParties: PartyId[] = ['renaissance', 'horizons', 'modem'];

    return state.deputies.filter(d => governmentParties.includes(d.party)).length;
  }
}));
