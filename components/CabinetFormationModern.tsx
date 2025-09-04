import { useState, useMemo } from 'react';
import { CABINET_ROLES } from '../src/data/cabinetRoles';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import type { PotentialMinister } from '../src/types/cabinet';
import '../src/styles/CabinetFormationModern.css';

interface CabinetFormationProps {
  onComplete: () => void;
}

export const CabinetFormationModern: React.FC<CabinetFormationProps> = ({ onComplete }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAppointment, setPendingAppointment] = useState<{
    candidate: PotentialMinister;
    role: string;
    risks: string[];
  } | null>(null);

  const {
    availableCandidates,
    selectedMinisters,
    ministerRoles,
    maxPartyMinistersAllowed,
    appointMinister
  } = useCabinetFormationStore();

  // Filtrer et trier les candidats
  const filteredCandidates = useMemo(() => {
    if (!selectedRole) return [];
    
    return availableCandidates
      .filter(candidate => {
        const partyCount = Object.entries(ministerRoles).reduce((acc, [minId, roles]) => {
          const m = selectedMinisters[minId];
          if (m && m.party === candidate.party) {
            acc += roles.length;
          }
          return acc;
        }, 0);
        return partyCount < (maxPartyMinistersAllowed[candidate.party] || 10); // Fallback généreux
      })
      .sort((a, b) => {
        // Tri par pertinence : compétence puis loyauté
        const rolePreference = (c: PotentialMinister) => 
          c.preferredRoles?.includes(selectedRole) ? 20 : 0;
        
        const scoreA = a.competence + a.personality.loyalty + rolePreference(a);
        const scoreB = b.competence + b.personality.loyalty + rolePreference(b);
        
        return scoreB - scoreA;
      });
  }, [selectedRole, availableCandidates, selectedMinisters, ministerRoles, maxPartyMinistersAllowed]);

  const handleCandidateSelect = async (candidate: PotentialMinister) => {
    if (!selectedRole) return;

    try {
      const { risks } = await appointMinister(selectedRole, candidate);
      
      if (risks.length > 0) {
        setPendingAppointment({ candidate, role: selectedRole, risks });
        setShowConfirmModal(true);
      } else {
        setSelectedRole(null);
      }
    } catch (error) {
      console.error('Erreur lors de la nomination:', error);
    }
  };

  const handleConfirmAppointment = () => {
    setShowConfirmModal(false);
    setPendingAppointment(null);
    setSelectedRole(null);
  };

  const selectedRoleInfo = CABINET_ROLES.find(r => r.id === selectedRole);
  const appointedMinisters = Object.keys(selectedMinisters).length;
  const totalRoles = CABINET_ROLES.length;
  const progress = (appointedMinisters / totalRoles) * 100;

  return (
    <div className="cabinet-formation-modern">
      {/* Header avec progression */}
      <div className="page-header">
        <div className="container">
          <h1 className="text-display-1">Formation du Gouvernement</h1>
          <p className="text-body-lg" style={{marginTop: '1rem', opacity: 0.9}}>
            Constituez votre équipe ministérielle pour diriger la France
          </p>
          
          {/* Barre de progression */}
          <div className="progress-container" style={{marginTop: '2rem'}}>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${progress}%`}}
              />
            </div>
            <p className="text-caption" style={{color: 'white', marginTop: '0.5rem'}}>
              {appointedMinisters} sur {totalRoles} postes pourvus
            </p>
          </div>
        </div>
      </div>

      <div className="container" style={{paddingTop: '2rem', paddingBottom: '4rem'}}>
        <div className="grid-layout">
          {/* Panel des rôles */}
          <div className="roles-panel">
            <h2 className="text-heading-1" style={{marginBottom: '1.5rem'}}>
              Postes ministériels
            </h2>
            
            <div className="roles-grid">
              {CABINET_ROLES
                .sort((a, b) => b.importance - a.importance)
                .map(role => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`role-card ${selectedRole === role.id ? 'selected' : ''} ${
                      selectedMinisters[role.id] ? 'filled' : ''
                    }`}
                  >
                    <div className="role-header">
                      <h3 className="role-title">{role.title}</h3>
                      {selectedMinisters[role.id] && (
                        <div className="appointed-indicator">
                          <span className="checkmark">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="role-info">
                      <span className="importance-badge">
                        Importance: {role.importance}/100
                      </span>
                      <span className="competence-required">
                        Min. {role.requiredCompetence}% compétence
                      </span>
                    </div>
                    
                    {selectedMinisters[role.id] && (
                      <div className="appointed-minister">
                        <strong>{selectedMinisters[role.id].name}</strong>
                        <span className="party-tag">
                          {selectedMinisters[role.id].party}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Panel des candidats */}
          <div className="candidates-panel">
            {selectedRole ? (
              <>
                <div className="panel-header">
                  <h2 className="text-heading-1">
                    Candidats - {selectedRoleInfo?.title}
                  </h2>
                  <p className="text-caption">
                    {filteredCandidates.length} candidat{filteredCandidates.length !== 1 ? 's' : ''} disponible{filteredCandidates.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {filteredCandidates.length > 0 ? (
                  <div className="candidates-grid">
                    {filteredCandidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        onClick={() => handleCandidateSelect(candidate)}
                        className="candidate-card"
                        style={{animationDelay: `${index * 50}ms`}}
                      >
                        <div className="candidate-header">
                          <div>
                            <h3 className="candidate-name">{candidate.name}</h3>
                            <span className="party-badge">{candidate.party}</span>
                          </div>
                          
                          {candidate.preferredRoles?.includes(selectedRole) && (
                            <div className="preferred-indicator">
                              <span title="Rôle préféré">⭐</span>
                            </div>
                          )}
                        </div>

                        <div className="candidate-stats">
                          <div className="stat-row">
                            <span className="stat-label">Compétence</span>
                            <div className="stat-bar">
                              <div 
                                className="stat-fill competence"
                                style={{width: `${candidate.competence}%`}}
                              />
                              <span className="stat-value">{candidate.competence}%</span>
                            </div>
                          </div>

                          <div className="stat-row">
                            <span className="stat-label">Loyauté</span>
                            <div className="stat-bar">
                              <div 
                                className="stat-fill loyalty"
                                style={{width: `${candidate.personality.loyalty}%`}}
                              />
                              <span className="stat-value">{candidate.personality.loyalty}%</span>
                            </div>
                          </div>

                          <div className="stat-row">
                            <span className="stat-label">Popularité</span>
                            <div className="stat-bar">
                              <div 
                                className="stat-fill popularity"
                                style={{width: `${candidate.popularity}%`}}
                              />
                              <span className="stat-value">{Math.round(candidate.popularity)}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="candidate-background">
                          <p className="background-text">
                            {candidate.background[0]} • {candidate.experience} ans d'expérience
                          </p>
                        </div>

                        <div className="candidate-traits">
                          {candidate.traits?.slice(0, 3).map(trait => (
                            <span key={trait} className="trait-badge">
                              {trait}
                            </span>
                          ))}
                        </div>

                        {/* Warnings */}
                        {candidate.personality.stubbornness > 70 && (
                          <div className="warning-indicator">
                            ⚠️ Personnalité difficile
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-candidates">
                    <div className="empty-state">
                      <div className="empty-icon">🏛️</div>
                      <h3>Aucun candidat disponible</h3>
                      <p>
                        Tous les candidats éligibles de ce parti ont déjà été nommés 
                        ou ne répondent pas aux critères requis.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-role-selected">
                <div className="empty-state">
                  <div className="empty-icon">👈</div>
                  <h3>Sélectionnez un poste ministériel</h3>
                  <p>
                    Choisissez un ministère dans la liste de gauche pour voir 
                    les candidats disponibles.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="actions-bar">
          <div className="actions-content">
            <div className="progress-info">
              <span className="text-caption">
                Progression: {appointedMinisters}/{totalRoles} postes
              </span>
            </div>
            
            <div className="action-buttons">
              {appointedMinisters >= Math.ceil(totalRoles * 0.6) && (
                <button 
                  onClick={onComplete}
                  className="btn btn-primary btn-lg"
                >
                  Valider le gouvernement
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation des risques */}
      {showConfirmModal && pendingAppointment && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Nomination à risque</h3>
            </div>
            
            <div className="modal-body">
              <p>
                La nomination de <strong>{pendingAppointment.candidate.name}</strong> au poste de{' '}
                <strong>{selectedRoleInfo?.title}</strong> présente des risques :
              </p>
              
              <ul className="risk-list">
                {pendingAppointment.risks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
              
              <p>Voulez-vous confirmer cette nomination ?</p>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmAppointment}
                className="btn btn-warning"
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