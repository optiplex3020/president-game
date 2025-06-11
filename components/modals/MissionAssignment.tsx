import React, { useState } from 'react';
import { useCabinetStore } from '../../src/store/cabinetStore';
import type { MinisterMission } from '../../src/types/cabinet';

interface MissionAssignmentModalProps {
  ministerId: string;
  onClose: () => void;
}

export const MissionAssignmentModal: React.FC<MissionAssignmentModalProps> = ({ ministerId, onClose }) => {
  const { missions, assignMission } = useCabinetStore();
  const [selectedMission, setSelectedMission] = useState<string>('');

  const handleAssign = () => {
    if (selectedMission) {
      assignMission(ministerId, selectedMission);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Assigner une mission</h2>
        <div className="missions-list">
          {missions.map(mission => (
            <div 
              key={mission.id} 
              className={`mission-card ${selectedMission === mission.id ? 'selected' : ''}`}
              onClick={() => setSelectedMission(mission.id)}
            >
              <h3>{mission.title}</h3>
              <p>{mission.description}</p>
              <div className="mission-details">
                <span>Durée: {mission.duration} jours</span>
                <span>Difficulté: {mission.difficulty}/5</span>
              </div>
              <div className="mission-effects">
                <h4>Effets en cas de succès:</h4>
                {Object.entries(mission.effects.success).map(([key, value]) => (
                  <span key={key}>{key}: {value > 0 ? '+' : ''}{value}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button 
            onClick={handleAssign}
            disabled={!selectedMission}
            className="btn-assign"
          >
            Assigner
          </button>
          <button onClick={onClose} className="btn-cancel">Annuler</button>
        </div>
      </div>
    </div>
  );
};