/**
 * MASTER GAME ENGINE
 * Moteur de jeu ultra-complet qui intègre tous les sous-systèmes
 */

import { create } from 'zustand';
import { useParliamentEngine } from './ParliamentEngine';
import { useOpinionEngine } from './OpinionEngine';
import { useCharacterEngine } from './CharacterEngine';
import { useMediaEngine } from './MediaEngine';
import { useGameEngine as useBasicGameEngine } from './GameEngine';

interface MasterGameState {
  // État global
  initialized: boolean;
  currentDate: Date;
  dayInMandate: number;
  timeScale: number; // Vitesse du jeu (1 = normal, 2 = rapide, etc.)

  // Managers de sous-systèmes
  parliament: typeof useParliamentEngine extends create<infer T> ? T : never;
  opinion: typeof useOpinionEngine extends create<infer T> ? T : never;
  characters: typeof useCharacterEngine extends create<infer T> ? T : never;
  media: typeof useMediaEngine extends create<infer T> ? T : never;
  basic: typeof useBasicGameEngine extends create<infer T> ? T : never;

  // Actions globales
  initializeGame: () => void;
  advanceTime: (hours: number) => void;
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

export const useMasterGameEngine = create<MasterGameState>((set, get) => ({
  initialized: false,
  currentDate: new Date(),
  dayInMandate: 1,
  timeScale: 1,
  parliament: null as any,
  opinion: null as any,
  characters: null as any,
  media: null as any,
  basic: null as any,

  initializeGame: () => {
    console.log('🎮 Initialisation du jeu ultra-réaliste...');

    // Initialiser tous les sous-systèmes
    const parliament = useParliamentEngine.getState();
    const opinion = useOpinionEngine.getState();
    const characters = useCharacterEngine.getState();
    const media = useMediaEngine.getState();
    const basic = useBasicGameEngine.getState();

    parliament.initializeParliament();
    opinion.initializeOpinion();
    characters.initializeCharacters();
    media.initializeMedia();

    console.log('✅ Parlement initialisé: 577 députés générés');
    console.log('✅ Opinion publique initialisée: 22 segments démographiques');
    console.log('✅ Personnages initialisés: personnalités politiques créées');
    console.log('✅ Médias initialisés: 8 médias français majeurs');

    set({
      initialized: true,
      parliament,
      opinion,
      characters,
      media,
      basic,
      currentDate: new Date(),
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
    const newDate = new Date(state.currentDate);
    newDate.setHours(newDate.getHours() + hours);

    const daysPassed = Math.floor(hours / 24);

    set({
      currentDate: newDate,
      dayInMandate: state.dayInMandate + daysPassed
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

      // Restaurer l'état de chaque sous-système
      // (nécessite d'implémenter des méthodes de restauration dans chaque store)

      set({
        initialized: true,
        currentDate: new Date(data.currentDate),
        dayInMandate: data.dayInMandate
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
}));
