import React, { useState, useEffect } from 'react';
import { useMasterGameEngine } from '../src/systems/MasterGameEngine';
import { useGameState } from '../src/store/gameState';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import '../src/styles/SaveGameMenu.css';

interface SaveSlot {
  id: string;
  timestamp: number;
  dayInMandate: number;
  playerName: string;
  party: string;
  popularity: number;
}

export const SaveGameMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const masterEngine = useMasterGameEngine();
  const gameState = useGameState();
  const cabinetState = useCabinetFormationStore();

  // Charger la liste des sauvegardes au montage
  useEffect(() => {
    loadSavesList();
  }, []);

  const loadSavesList = () => {
    const savesList: SaveSlot[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('president-game-save-')) {
        try {
          const saveData = JSON.parse(localStorage.getItem(key) || '{}');
          savesList.push({
            id: key,
            timestamp: saveData.timestamp,
            dayInMandate: saveData.dayInMandate,
            playerName: saveData.playerName || 'Président',
            party: saveData.party || 'Inconnu',
            popularity: saveData.popularity || 50
          });
        } catch (e) {
          console.error('Erreur de lecture de sauvegarde:', e);
        }
      }
    }
    savesList.sort((a, b) => b.timestamp - a.timestamp);
    setSaves(savesList);
  };

  const handleSaveGame = () => {
    const timestamp = Date.now();
    const saveId = `president-game-save-${timestamp}`;

    const saveData = {
      timestamp,
      version: '1.0',
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
      // Metadata pour l'affichage
      playerName: gameState.playerInfo?.firstName + ' ' + gameState.playerInfo?.lastName || 'Président',
      popularity: gameState.playerStats.popularity || 50
    };

    localStorage.setItem(saveId, JSON.stringify(saveData));
    loadSavesList();

    setNotificationMessage('✅ Partie sauvegardée avec succès !');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLoadGame = (saveId: string) => {
    try {
      const saveData = JSON.parse(localStorage.getItem(saveId) || '{}');

      if (!saveData.version) {
        alert('❌ Sauvegarde corrompue ou invalide');
        return;
      }

      // Restaurer les états
      useGameState.setState({
        playerInfo: saveData.playerInfo,
        party: saveData.party,
        playerStats: saveData.playerStats,
        foreignRelations: saveData.foreignRelations,
        systemicCrises: saveData.systemicCrises,
        presidentProfile: saveData.presidentProfile,
        socialFeed: saveData.socialFeed,
        gameStarted: true
      });

      useCabinetFormationStore.setState({
        selectedMinisters: saveData.selectedMinisters,
        ministerRoles: saveData.ministerRoles
      });

      // Note: Pour une vraie restauration complète, il faudrait aussi restaurer
      // les états de ParliamentEngine, OpinionEngine, etc.
      // Pour l'instant, on restaure seulement les données principales

      setNotificationMessage('✅ Partie chargée avec succès !');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        onClose();
      }, 2000);

    } catch (e) {
      console.error('Erreur de chargement:', e);
      alert('❌ Erreur lors du chargement de la partie');
    }
  };

  const handleDeleteSave = (saveId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      localStorage.removeItem(saveId);
      loadSavesList();
      setNotificationMessage('🗑️ Sauvegarde supprimée');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  const handleExportSave = (saveId: string) => {
    const saveData = localStorage.getItem(saveId);
    if (!saveData) return;

    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `president-game-save-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setNotificationMessage('💾 Sauvegarde exportée');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleImportSave = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const saveData = JSON.parse(event.target?.result as string);
          const timestamp = Date.now();
          const saveId = `president-game-save-${timestamp}`;
          saveData.timestamp = timestamp; // Mettre à jour le timestamp
          localStorage.setItem(saveId, JSON.stringify(saveData));
          loadSavesList();

          setNotificationMessage('✅ Sauvegarde importée avec succès !');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        } catch (err) {
          alert('❌ Fichier de sauvegarde invalide');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="save-game-overlay">
      <div className="save-game-menu">
        <div className="save-game-header">
          <h2>💾 Gestion des Sauvegardes</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {showNotification && (
          <div className="save-notification">{notificationMessage}</div>
        )}

        <div className="save-game-actions">
          <button className="btn-primary" onClick={handleSaveGame}>
            💾 Sauvegarder la partie actuelle
          </button>
          <button className="btn-secondary" onClick={handleImportSave}>
            📥 Importer une sauvegarde
          </button>
        </div>

        <div className="saves-list">
          <h3>Sauvegardes disponibles ({saves.length})</h3>
          {saves.length === 0 ? (
            <div className="no-saves">
              <p>Aucune sauvegarde trouvée</p>
              <p className="hint">Cliquez sur "Sauvegarder la partie actuelle" pour créer une sauvegarde</p>
            </div>
          ) : (
            <div className="saves-grid">
              {saves.map((save) => (
                <div key={save.id} className="save-card">
                  <div className="save-card-header">
                    <h4>{save.playerName}</h4>
                    <div className="save-popularity">
                      Popularité: {Math.round(save.popularity)}%
                    </div>
                  </div>
                  <div className="save-card-info">
                    <div className="save-info-item">
                      <span className="label">Parti:</span>
                      <span className="value">{save.party}</span>
                    </div>
                    <div className="save-info-item">
                      <span className="label">Jour du mandat:</span>
                      <span className="value">Jour {save.dayInMandate}</span>
                    </div>
                    <div className="save-info-item">
                      <span className="label">Date:</span>
                      <span className="value">{formatDate(save.timestamp)}</span>
                    </div>
                  </div>
                  <div className="save-card-actions">
                    <button
                      className="btn-load"
                      onClick={() => handleLoadGame(save.id)}
                    >
                      📂 Charger
                    </button>
                    <button
                      className="btn-export"
                      onClick={() => handleExportSave(save.id)}
                    >
                      💾 Exporter
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteSave(save.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
