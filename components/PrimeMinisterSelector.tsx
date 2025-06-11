import React from 'react';
import type { PotentialMinister } from '../src/types/cabinet';
import { ministerCandidates } from '../src/store/ministerCandidates';

interface Props {
  presidentParty: string;
  onSelect: (minister: PotentialMinister) => void;
}

export const PrimeMinisterSelector: React.FC<Props> = ({ presidentParty, onSelect }) => {
  const candidates = ministerCandidates
    .filter((c: PotentialMinister) => c.competence >= 70)
    .sort((a: PotentialMinister, b: PotentialMinister) => b.competence - a.competence);

  return (
    <div className="prime-minister-selector">
      <h2>Choisissez votre Premier Ministre</h2>
      <p className="selector-info">
        Ce choix est crucial pour la stabilité de votre gouvernement.
      </p>

      <div className="candidates-grid">
        {candidates.map(candidate => (
          <button
            key={candidate.id}
            onClick={() => onSelect(candidate)}
            className={`candidate-card ${candidate.party === presidentParty ? 'same-party' : ''}`}
          >
            <h3>{candidate.name}</h3>
            <p className="candidate-party">{candidate.party}</p>
            <div className="candidate-stats">
              <div className="stat">
                <label>Compétence</label>
                <div className="stat-bar">
                  <div 
                    className="stat-fill"
                    style={{width: `${candidate.competence}%`}}
                  />
                </div>
              </div>
              <div className="stat">
                <label>Loyauté</label>
                <div className="stat-bar">
                  <div 
                    className="stat-fill"
                    style={{width: `${candidate.personality.loyalty}%`}}
                  />
                </div>
              </div>
            </div>
            
            {candidate.party !== presidentParty && (
              <div className="warning">
                Attention : Risque de cohabitation
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};