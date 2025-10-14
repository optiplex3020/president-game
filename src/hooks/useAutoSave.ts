import { useEffect, useRef, useState } from 'react';
import { useMasterGameEngine } from '../systems/MasterGameEngine';
import { useGameState } from '../store/gameState';
import { useCabinetFormationStore } from '../store/cabinetFormationStore';

/**
 * Hook pour l'auto-sauvegarde toutes les 5 minutes
 */
export const useAutoSave = (enabled: boolean = true) => {
  const [lastSaveTime, setLastSaveTime] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const intervalRef = useRef<number | null>(null);

  const masterEngine = useMasterGameEngine();
  const gameState = useGameState();
  const cabinetState = useCabinetFormationStore();

  const performAutoSave = () => {
    try {
      setSaveStatus('saving');

      const timestamp = Date.now();
      const autoSaveId = 'president-game-autosave';

      const saveData = {
        timestamp,
        version: '1.0',
        isAutoSave: true,
        // MasterGameEngine state
        dayInMandate: masterEngine.dayInMandate,
        currentDate: masterEngine.currentDate,
        timeScale: masterEngine.timeScale,
        // GameState
        playerInfo: gameState.playerInfo,
        party: gameState.party,
        playerStats: gameState.playerStats,
        foreignRelations: gameState.foreignRelations,
        systemicCrises: gameState.systemicCrises,
        presidentProfile: gameState.presidentProfile,
        socialFeed: gameState.socialFeed,
        // CabinetState
        selectedMinisters: cabinetState.selectedMinisters,
        ministerRoles: cabinetState.ministerRoles,
        // Metadata
        playerName: gameState.playerInfo?.firstName + ' ' + gameState.playerInfo?.lastName || 'Président',
        popularity: gameState.playerStats.popularity || 50
      };

      localStorage.setItem(autoSaveId, JSON.stringify(saveData));

      setLastSaveTime(timestamp);
      setSaveStatus('saved');

      console.log('✅ Auto-save effectué à', new Date(timestamp).toLocaleTimeString('fr-FR'));

      // Revenir à idle après 3 secondes
      setTimeout(() => setSaveStatus('idle'), 3000);

    } catch (error) {
      console.error('❌ Erreur lors de l\'auto-save:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Auto-save toutes les 5 minutes (300000ms)
    intervalRef.current = setInterval(() => {
      performAutoSave();
    }, 300000); // 5 minutes

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, masterEngine, gameState, cabinetState]);

  // Auto-save au déchargement de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      performAutoSave();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [masterEngine, gameState, cabinetState]);

  return {
    lastSaveTime,
    saveStatus,
    performManualSave: performAutoSave
  };
};
