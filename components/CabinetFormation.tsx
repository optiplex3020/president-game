import { useState, useMemo } from 'react';
import { CABINET_ROLES } from '../src/data/cabinetRoles';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import type { PotentialMinister } from '../src/types/cabinet';
import '../src/styles/CabinetFormation.css';

interface CabinetFormationProps {
  onComplete: () => void;
}

export const CabinetFormation: React.FC<CabinetFormationProps> = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showRisks, setShowRisks] = useState(false);
  const [currentRisks, setCurrentRisks] = useState<string[]>([]);
  const {
    availableCandidates,
    selectedMinisters,
    ministerRoles,
    maxPartyMinistersAllowed,
    appointMinister
  } = useCabinetFormationStore();
  
  // Debug logs
  console.log('CabinetFormation render:', {
    availableCandidates: availableCandidates.length,
    selectedRole,
    maxPartyMinistersAllowed
  });

  // Filtrer les candidats disponibles pour le rôle sélectionné
  const filteredCandidates = useMemo(() => {
    if (!selectedRole) return [];
    
    const filtered = availableCandidates.filter(candidate => {
      const partyCount = Object.entries(ministerRoles).reduce((acc, [minId, roles]) => {
        const m = selectedMinisters[minId];
        if (m && m.party === candidate.party) {
          acc += roles.length;
        }
        return acc;
      }, 0);
      const maxAllowed = maxPartyMinistersAllowed[candidate.party] || 0;
      const canAppoint = partyCount < maxAllowed;
      
      console.log(`Filter check - ${candidate.name} (${candidate.party}): count=${partyCount}, max=${maxAllowed}, allowed=${canAppoint}`);
      
      return canAppoint;
    });
    
    console.log(`Filtered ${availableCandidates.length} -> ${filtered.length} candidates for role ${selectedRole}`);
    return filtered;
  }, [selectedRole, availableCandidates, selectedMinisters, ministerRoles, maxPartyMinistersAllowed]);

  const handleCandidateSelect = async (candidate: PotentialMinister) => {
    if (!selectedRole) return;

    try {
      const { risks } = await appointMinister(selectedRole, candidate);

      if (risks.length > 0) {
        setCurrentRisks(risks);
        setShowRisks(true);
      } else {
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Erreur lors de la nomination:', error);
    }
  };

  const handleConfirmRiskyAppointment = () => {
    setShowRisks(false);
    setSelectedRole(null);
    setCurrentRisks([]);
  };

  const rolesToDisplay = CABINET_ROLES.filter(
    r => !(r.id === 'premier-ministre' && selectedMinisters['premier-ministre'])
  );
  
  console.log('Cabinet roles to display:', rolesToDisplay.length);

  return (
    <div className="cabinet-formation">
      <h2>Formation du Gouvernement</h2>

      <div className="roles-section">
        <h3>Postes ministériels</h3>
        <div className="role-grid">
          {rolesToDisplay.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`role-button ${selectedRole === role.id ? 'selected' : ''}`}
            >
              <span className="role-title">{role.title}</span>
              {selectedMinisters[role.id] && (
                <span className="role-assigned">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedRole && (
        <div className="candidates-section">
          <h3>Candidats disponibles pour {CABINET_ROLES.find(r => r.id === selectedRole)?.title}</h3>
          <p className="debug-info">
            Total candidats: {availableCandidates.length} | Filtrés: {filteredCandidates.length}
          </p>
          {filteredCandidates.length > 0 ? (
            <div className="candidates-grid">
              {filteredCandidates.map(candidate => (
                <button
                  key={candidate.id}
                  onClick={() => handleCandidateSelect(candidate)}
                  className="candidate-card"
                >
                  <h4>{candidate.name}</h4>
                  <p className="party-tag">{candidate.party}</p>
                  <div className="candidate-stats">
                    <div className="stat">
                      <span>Compétence</span>
                      <div className="stat-bar">
                        <div
                          className="stat-fill"
                          style={{width: `${candidate.competence}%`}}
                        />
                      </div>
                    </div>
                    <div className="stat">
                      <span>Loyauté</span>
                      <div className="stat-bar">
                        <div
                          className="stat-fill"
                          style={{width: `${candidate.personality.loyalty}%`}}
                        />
                      </div>
                    </div>
                    <div className="stat">
                      <span>Réputation</span>
                      <div className="stat-bar">
                        <div
                          className="stat-fill"
                          style={{width: `${candidate.reputation}%`}}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="candidate-traits">
                    {candidate.personality.stubbornness > 70 && (
                      <span className="trait warning">Clivant</span>
                    )}
                    {candidate.personality.ambition > 80 && (
                      <span className="trait warning">Ambitieux</span>
                    )}
                    <span className="trait">{candidate.experience} ans d'expérience</span>
                    {candidate.traits && candidate.traits.map(trait => (
                      <span key={trait} className="trait">{trait}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="no-candidates">Aucun candidat disponible pour ce poste</p>
          )}
        </div>
      )}

      {showRisks && (
        <div className="modal-overlay">
          <div className="risks-modal">
            <h3>Risques potentiels</h3>
            <ul>
              {currentRisks.map((risk, index) => (
                <li key={index} className="risk-item">{risk}</li>
              ))}
            </ul>
            <div className="modal-actions">
              <button 
                onClick={() => setShowRisks(false)}
                className="btn-cancel"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmRiskyAppointment}
                className="btn-confirm"
              >
                Confirmer malgré les risques
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};