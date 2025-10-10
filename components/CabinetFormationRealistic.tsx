import React, { useState } from 'react';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import { CABINET_ROLES } from '../src/data/cabinetRoles';
import '../src/styles/CabinetFormationRealistic.css';

interface CabinetFormationRealisticProps {
  onComplete: () => void;
}

export const CabinetFormationRealistic: React.FC<CabinetFormationRealisticProps> = ({ onComplete }) => {
  const { 
    availableCandidates, 
    selectedMinisters, 
    appointMinister,
    presidentParty
  } = useCabinetFormationStore();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Catégorisation des postes par importance
  const essentialRoles = CABINET_ROLES.filter(role => role.importance >= 80);
  const importantRoles = CABINET_ROLES.filter(role => role.importance >= 60 && role.importance < 80);
  const standardRoles = CABINET_ROLES.filter(role => role.importance < 60);

  const handleNominate = async (candidate: any) => {
    if (selectedRole) {
      try {
        const result = await appointMinister(selectedRole, candidate);
        if (result.risks.length > 0) {
          const confirmNomination = window.confirm(
            `Risques détectés :\n${result.risks.join('\n')}\n\nConfirmer la nomination ?`
          );
          if (!confirmNomination) {
            return;
          }
        }
        setSelectedRole(null);
      } catch (error) {
        console.error('Erreur nomination:', error);
        alert(`Erreur: ${error}`);
      }
    }
  };

  const filteredCandidates = availableCandidates?.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCompetenceColor = (competence: number) => {
    if (competence >= 80) return '#22c55e';
    if (competence >= 60) return '#f59e0b';
    if (competence >= 40) return '#ef4444';
    return '#6b7280';
  };

  const getRoleStatus = (roleId: string) => {
    return selectedMinisters[roleId] ? 'filled' : 'vacant';
  };

  const getFilledRolesCount = () => Object.keys(selectedMinisters).length;
  const getTotalRolesCount = () => CABINET_ROLES.length;

  const canComplete = () => {
    // Au minimum, tous les postes essentiels doivent être remplis
    const essentialFilled = essentialRoles.every(role => selectedMinisters[role.id]);
    const totalFilled = getFilledRolesCount();
    return essentialFilled && totalFilled >= 12; // Minimum 12 ministres pour un gouvernement complet
  };

  const RoleCategory: React.FC<{ 
    title: string; 
    roles: typeof CABINET_ROLES; 
    priority: 'essential' | 'important' | 'standard' 
  }> = ({ title, roles, priority }) => (
    <div className={`role-category ${priority}`}>
      <h3 className="category-title">{title}</h3>
      <div className="roles-grid">
        {roles.map(role => {
          const minister = selectedMinisters[role.id];
          const status = getRoleStatus(role.id);
          
          return (
            <div 
              key={role.id} 
              className={`role-card ${status} ${priority}`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="role-header">
                <div className={`priority-indicator ${priority}`} />
                <h4 className="role-title">{role.title}</h4>
                <span className="competence-required">
                  Compétence requise: {role.requiredCompetence}
                </span>
              </div>
              
              {minister ? (
                <div className="assigned-minister">
                  <div className="minister-info">
                    <strong>{minister.name}</strong>
                    <span>{minister.party}</span>
                    <div className="minister-stats">
                      <span>Compétence: {minister.competence}</span>
                      <span>Loyauté: {minister.personality?.loyalty || 'N/A'}</span>
                    </div>
                  </div>
                  <button className="change-btn" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRole(role.id);
                  }}>
                    Changer
                  </button>
                </div>
              ) : (
                <div className="vacant-slot">
                  <span>Poste vacant</span>
                  <div className="role-effects">
                    Effets: {Object.entries(role.effects).map(([key, value]) => 
                      `${key} +${value}`
                    ).join(', ')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="cabinet-formation-realistic">
      {!selectedRole ? (
        <>
          {/* En-tête avec progression */}
          <div className="formation-header">
            <h1>Formation du Gouvernement</h1>
            <div className="progress-section">
              <div className="progress-stats">
                <span className="progress-text">
                  {getFilledRolesCount()}/{getTotalRolesCount()} postes pourvus
                </span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(getFilledRolesCount() / getTotalRolesCount()) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="formation-status">
                {canComplete() ? (
                  <span className="status-complete">✓ Gouvernement prêt</span>
                ) : (
                  <span className="status-incomplete">
                    ⚠ Postes essentiels manquants
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Catégories de postes */}
          <div className="government-structure">
            <RoleCategory 
              title="Postes Essentiels" 
              roles={essentialRoles} 
              priority="essential" 
            />
            
            <RoleCategory 
              title="Postes Importants" 
              roles={importantRoles} 
              priority="important" 
            />
            
            <RoleCategory 
              title="Autres Postes" 
              roles={standardRoles} 
              priority="standard" 
            />
          </div>

          {/* Section de finalisation */}
          {canComplete() && (
            <div className="completion-section">
              <h3>Gouvernement Complet</h3>
              <p>Vous avez nommé suffisamment de ministres pour former un gouvernement stable.</p>
              <button className="btn-complete" onClick={onComplete}>
                Finaliser la Formation du Gouvernement
              </button>
            </div>
          )}
        </>
      ) : (
        // Sélection des candidats
        <div className="candidate-selection">
          <div className="selection-header">
            <button onClick={() => setSelectedRole(null)} className="back-btn">
              ← Retour au gouvernement
            </button>
            <div className="role-info">
              <h2>
                {CABINET_ROLES.find(r => r.id === selectedRole)?.title}
              </h2>
              <p>
                Compétence requise: {CABINET_ROLES.find(r => r.id === selectedRole)?.requiredCompetence}
              </p>
            </div>
          </div>

          {/* Recherche */}
          <div className="search-section">
            <input
              type="text"
              placeholder="Rechercher un candidat par nom ou parti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="results-count">
              {filteredCandidates.length} candidat(s) trouvé(s)
            </span>
          </div>

          {/* Liste des candidats */}
          <div className="candidates-grid">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => {
                const roleRequirement = CABINET_ROLES.find(r => r.id === selectedRole)?.requiredCompetence || 50;
                const isQualified = candidate.competence >= roleRequirement;
                const isFromPresidentParty = candidate.party === presidentParty;
                
                return (
                  <div key={candidate.id} className={`candidate-card ${!isQualified ? 'unqualified' : ''}`}>
                    <div className="candidate-header">
                      <div 
                        className="candidate-avatar"
                        style={{ backgroundColor: getCompetenceColor(candidate.competence) }}
                      >
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="candidate-info">
                        <h4>{candidate.name}</h4>
                        <div className="party-info">
                          <span className={`party-tag ${isFromPresidentParty ? 'same-party' : 'other-party'}`}>
                            {candidate.party}
                          </span>
                          {isFromPresidentParty && <span className="loyalty-indicator">Parti présidentiel</span>}
                        </div>
                      </div>
                    </div>

                    <div className="candidate-stats">
                      <div className="stat">
                        <span>Compétence</span>
                        <div className="stat-bar">
                          <div 
                            className="stat-fill"
                            style={{ 
                              width: `${candidate.competence}%`,
                              backgroundColor: getCompetenceColor(candidate.competence)
                            }}
                          />
                        </div>
                        <span>{candidate.competence}</span>
                      </div>

                      <div className="stat">
                        <span>Loyauté</span>
                        <div className="stat-bar">
                          <div 
                            className="stat-fill loyalty"
                            style={{ width: `${candidate.personality?.loyalty || 0}%` }}
                          />
                        </div>
                        <span>{candidate.personality?.loyalty || 0}</span>
                      </div>

                      <div className="stat">
                        <span>Popularité</span>
                        <div className="stat-bar">
                          <div 
                            className="stat-fill popularity"
                            style={{ width: `${candidate.popularity || 0}%` }}
                          />
                        </div>
                        <span>{Math.round(candidate.popularity || 0)}</span>
                      </div>
                    </div>

                    {candidate.traits && candidate.traits.length > 0 && (
                      <div className="candidate-traits">
                        {candidate.traits.slice(0, 3).map(trait => (
                          <span key={trait} className="trait-tag">{trait}</span>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={() => handleNominate(candidate)}
                      className={`nominate-btn ${!isQualified ? 'risky' : 'qualified'}`}
                    >
                      {isQualified ? 'Nommer' : 'Nommer (Risqué)'}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="no-candidates">
                <p>Aucun candidat trouvé</p>
                <p>Essayez de modifier votre recherche</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};