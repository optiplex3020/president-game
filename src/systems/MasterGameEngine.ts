/**
 * MASTER GAME ENGINE
 * Moteur de jeu ultra-complet qui intègre tous les sous-systèmes
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useParliamentEngine } from './ParliamentEngine';
import { useOpinionEngine } from './OpinionEngine';
import { useCharacterEngine } from './CharacterEngine';
import { useMediaEngine } from './MediaEngine';
import { useGameEngine as useBasicGameEngine } from './GameEngine';
import { clampDayInMandate, DEFAULT_START_DATE, ONE_HOUR_MS } from '../config/time';
import { useCalendarEngine } from './CalendarEngine';
import { useMilestoneEngine } from './MilestoneEngine';

interface MasterGameState {
  // État global
  initialized: boolean;
  startDate: Date;
  currentDate: Date;
  dayInMandate: number;
  timeScale: number; // Vitesse du jeu (1 = normal, 2 = rapide, etc.)

  // Managers de sous-systèmes
  parliament: ReturnType<typeof useParliamentEngine>;
  opinion: ReturnType<typeof useOpinionEngine>;
  characters: ReturnType<typeof useCharacterEngine>;
  media: ReturnType<typeof useMediaEngine>;
  basic: ReturnType<typeof useBasicGameEngine>;
  calendar: ReturnType<typeof useCalendarEngine>;
  milestones: ReturnType<typeof useMilestoneEngine>;

  // Actions globales
  initializeGame: () => void;
  advanceTime: (hours: number) => void;
  advanceDays: (days: number) => void;
  advanceTo: (targetDate: Date) => void;
  setStartDate: (startDate: Date) => void;
  processGameTick: () => void; // Appelé régulièrement pour simuler le jeu
  saveGame: () => string;
  loadGame: (saveData: string) => void;

  // Statistiques globales
  getGlobalStats: () => {
    popularity: number;
    politicalCapital: number;
    economicHealth: number;
    socialStability: number;
    internationalStanding: number;
  };
}

export const useMasterGameEngine = create<MasterGameState>()(
  persist(
    (set, get) => ({
      initialized: false,
      startDate: DEFAULT_START_DATE,
      currentDate: DEFAULT_START_DATE,
      dayInMandate: 1,
      timeScale: 1,
      parliament: null as any,
      opinion: null as any,
      characters: null as any,
      media: null as any,
      basic: null as any,
      calendar: null as any,
      milestones: null as any,

  initializeGame: () => {
    console.log('🎮 Initialisation du jeu ultra-réaliste...');

    const state = get();

    // Initialiser tous les sous-systèmes
    const parliament = useParliamentEngine.getState();
    const opinion = useOpinionEngine.getState();
    const characters = useCharacterEngine.getState();
    const media = useMediaEngine.getState();
    const basic = useBasicGameEngine.getState();
    const startDate = state.startDate ?? DEFAULT_START_DATE;
    const calendarEngine = useCalendarEngine.getState();
    const milestoneEngine = useMilestoneEngine.getState();

    parliament.initializeParliament();
    opinion.initializeOpinion();
    characters.initializeCharacters();
    media.initializeMedia();
    calendarEngine.initializeCalendar(startDate);
    milestoneEngine.initializeMilestones(startDate);

    console.log('✅ Parlement initialisé: 577 députés générés');
    console.log('✅ Opinion publique initialisée: 22 segments démographiques');
    console.log('✅ Personnages initialisés: personnalités politiques créées');
    console.log('✅ Médias initialisés: 8 médias français majeurs');

    set({
      initialized: true,
      startDate,
      parliament,
      opinion,
      characters,
      media,
      basic,
      calendar: calendarEngine,
      milestones: milestoneEngine,
      currentDate: startDate,
      dayInMandate: 1
    });

    console.log('🚀 Jeu prêt ! Bon mandat, Monsieur/Madame le Président !');
  },

  advanceTime: (hours: number) => {
    const state = get();

    if (!state.initialized) {
      console.error('Le jeu n\'est pas initialisé !');
      return;
    }

    // Avancer le temps dans tous les sous-systèmes
    const parliament = useParliamentEngine.getState();
    const opinion = useOpinionEngine.getState();
    const media = useMediaEngine.getState();
    const basic = useBasicGameEngine.getState();

    const calendar = useCalendarEngine.getState();

    // 1. Simuler l'opinion publique
    opinion.simulateOpinionChange(hours);

    // 2. Cycle médiatique
    media.simulateMediaCycle(hours);

    // 3. Actions des personnages (IA)
    const characters = useCharacterEngine.getState();
    for (const characterId of Object.keys(characters.characters)) {
      const action = characters.simulateCharacterAI(characterId);
      if (action) {
        characters.performAction(action);
      }
    }

    // 4. Moteur de jeu de base
    basic.advanceTime(hours);

    // Mettre à jour la date
    const newDate = new Date(state.currentDate.getTime() + hours * ONE_HOUR_MS);
    const startDate = state.startDate ?? DEFAULT_START_DATE;
    const dayInMandate = clampDayInMandate(startDate, newDate);

    const crossedEvents = calendar.getEventsBetween(state.currentDate, newDate);
    if (crossedEvents.length) {
      console.log(`🗓️ ${crossedEvents.length} événement(s) dans l'intervalle ${state.currentDate.toISOString()} -> ${newDate.toISOString()}`);
    }

    set({
      currentDate: newDate,
      dayInMandate
    });
  },

  advanceDays: (days: number) => {
    if (!Number.isFinite(days) || days <= 0) return;
    get().advanceTime(days * 24);
  },

  advanceTo: (targetDate: Date) => {
    if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) return;
    const state = get();
    const deltaMs = targetDate.getTime() - state.currentDate.getTime();
    if (deltaMs <= 0) return;
    get().advanceTime(deltaMs / ONE_HOUR_MS);
  },

  setStartDate: (startDate: Date) => {
    if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) return;

    // Recalibrer la date courante et le jour de mandat
    const calendar = useCalendarEngine.getState();
    const milestones = useMilestoneEngine.getState();
    calendar.initializeCalendar(startDate);
    milestones.initializeMilestones(startDate);

    set(state => {
      const currentDate = startDate;
      const dayInMandate = clampDayInMandate(startDate, currentDate);
      return {
        ...state,
        startDate,
        currentDate,
        dayInMandate
      };
    });
  },

  processGameTick: () => {
    // Appelé régulièrement (ex: toutes les secondes) pour des mises à jour continues
    const state = get();

    if (!state.initialized) return;

    // Ici on peut ajouter des processus qui tournent en continu
    // Par exemple: vérifier si des événements doivent se déclencher

    const opinion = useOpinionEngine.getState();
    opinion.updatePublicMood();
  },

  saveGame: () => {
    const state = get();

    const saveData = {
      startDate: state.startDate,
      currentDate: state.currentDate,
      dayInMandate: state.dayInMandate,
      parliament: useParliamentEngine.getState(),
      opinion: useOpinionEngine.getState(),
      characters: useCharacterEngine.getState(),
      media: useMediaEngine.getState(),
      basic: useBasicGameEngine.getState()
    };

    return JSON.stringify(saveData);
  },

  loadGame: (saveData: string) => {
    try {
      const data = JSON.parse(saveData);
      const startDateValue = data.startDate ? new Date(data.startDate) : DEFAULT_START_DATE;
      const currentDateValue = data.currentDate ? new Date(data.currentDate) : startDateValue;

      // Restaurer l'état de chaque sous-système
      // (nécessite d'implémenter des méthodes de restauration dans chaque store)

      set({
        initialized: true,
        startDate: startDateValue,
        currentDate: currentDateValue,
        dayInMandate: data.dayInMandate ?? clampDayInMandate(startDateValue, currentDateValue)
      });

      console.log('✅ Partie chargée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la partie:', error);
    }
  },

  getGlobalStats: () => {
    const opinion = useOpinionEngine.getState();
    const basic = useBasicGameEngine.getState();

    return {
      popularity: opinion.calculateOverallApproval(),
      politicalCapital: basic.gameState.politicalCapital,
      economicHealth: basic.gameState.indicators.economy.gdpGrowth * 10 + 50,
      socialStability: 100 - basic.gameState.indicators.social.unrest,
      internationalStanding: basic.gameState.indicators.international.europeanInfluence
    };
  }
}),
    {
      name: 'president-game-master',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        initialized: state.initialized,
        startDate: state.startDate,
        currentDate: state.currentDate,
        dayInMandate: state.dayInMandate,
        timeScale: state.timeScale
      })
    }
  )
);
