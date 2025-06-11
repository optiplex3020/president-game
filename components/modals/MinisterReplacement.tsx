import React from 'react';
import { useCabinetStore } from '../../src/store/cabinetStore';
import type { Minister } from '../../src/types/cabinet';

interface MinisterReplacementModalProps {
  roleId: string;
  onClose: () => void;
}

export const MinisterReplacementModal: React.FC<MinisterReplacementModalProps> = ({ roleId, onClose }) => {
  const { availableCandidates, replaceMinister } = useCabinetStore();

  const handleReplace = (newMinisterId: string) => {
    replaceMinister(roleId, newMinisterId);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Remplacer le ministre</h2>
        <div className="candidates-list">
          {availableCandidates.map(candidate => (
            <div key={candidate.id} className="candidate-card">
              <div className="candidate-info">
                <h3>{candidate.name}</h3>
                <p>{candidate.party}</p>
              </div>
              <div className="candidate-stats">
                <span>Loyauté: {candidate.loyalty}%</span>
                <span>Compétence: {candidate.competence}%</span>
              </div>
              <button 
                onClick={() => handleReplace(candidate.id)}
                className="btn-select"
              >
                Sélectionner
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-close">Fermer</button>
      </div>
    </div>
  );
};