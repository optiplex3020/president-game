import React, { useState, useMemo } from 'react';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import type { PotentialMinister } from '../src/types/cabinet';
import '../src/styles/CabinetFormationSimplified.css';

interface CabinetFormationProps {
  onComplete: () => void;
}

export const CabinetFormationSimplified: React.FC<CabinetFormationProps> = ({ onComplete }) => {
  const { 
    availableCandidates, 
    selectedMinisters, 
    appointMinister
  } = useCabinetFormationStore();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  // Rôles ministériels essentiels
  const ministerialRoles = [
    {
      id: 'interior',
      title: 'Ministre de l\'Intérieur',
      description: 'Sécurité publique, collectivités territoriales, immigration',
      priority: 'essential',
      requiredSkills: ['Sécurité', 'Administration'],
    },
    {
      id: 'economy',
      title: 'Ministre de l\'Économie',
      description: 'Politique économique, industrie, commerce',
      priority: 'essential',
      requiredSkills: ['Économie', 'Finance'],
    },
    {
      id: 'foreign_affairs',
      title: 'Ministre des Affaires étrangères',
      description: 'Diplomatie, relations internationales',
      priority: 'essential',
      requiredSkills: ['Diplomatie', 'International'],
    },
    {
      id: 'justice',
      title: 'Garde des Sceaux',
      description: 'Justice, droits de l\'homme',
      priority: 'essential',
      requiredSkills: ['Droit', 'Justice'],
    },
    {
      id: 'defense',
      title: 'Ministre des Armées',
      description: 'Défense nationale, opérations militaires',
      priority: 'essential',
      requiredSkills: ['Défense', 'Stratégie'],
    },
    {
      id: 'education',
      title: 'Ministre de l\'Éducation',
      description: 'Système éducatif, recherche',
      priority: 'important',
      requiredSkills: ['Éducation', 'Jeunesse'],
    },
    {
      id: 'health',
      title: 'Ministre de la Santé',
      description: 'Système de santé, sécurité sanitaire',
      priority: 'important',
      requiredSkills: ['Santé', 'Social'],
    },
    {
      id: 'ecology',
      title: 'Ministre de la Transition écologique',
      description: 'Environnement, énergie, transport durable',
      priority: 'important',
      requiredSkills: ['Environnement', 'Énergie'],
    }
  ];

  // Candidats filtrés pour le rôle sélectionné
  const filteredCandidates = useMemo(() => {
    if (!selectedRole) return [];
    
    let filtered = availableCandidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.background.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });

    // Trier par compétence
    filtered.sort((a, b) => b.competence - a.competence);

    return filtered;
  }, [availableCandidates, selectedRole, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const currentCandidates = filteredCandidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  const handleNominate = async (candidate: PotentialMinister) => {
    if (selectedRole) {
      try {
        await appointMinister(selectedRole, candidate);
        setSelectedRole(null); // Retour à la vue d'ensemble
        setCurrentPage(1);
        setSearchTerm('');
      } catch (error) {
        console.error('Erreur lors de la nomination:', error);
      }
    }
  };

  // Statistiques de completion
  const completionStats = {
    total: ministerialRoles.length,
    filled: Object.keys(selectedMinisters).length,
    completion: (Object.keys(selectedMinisters).length / ministerialRoles.length) * 100
  };

  return (
    <div className="cabinet-formation-simplified">
      <div className="formation-header">
        <h1>Formation du Gouvernement</h1>
        <div className="progress-info">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionStats.completion}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {completionStats.filled}/{completionStats.total} postes pourvus ({Math.round(completionStats.completion)}%)
          </span>
        </div>
      </div>

      {!selectedRole ? (
        /* Vue d'ensemble du gouvernement */
        <div className="government-overview">
          <div className="roles-grid">
            {ministerialRoles.map(role => {
              const minister = selectedMinisters[role.id];
              const isSelected = minister !== undefined;

              return (
                <div 
                  key={role.id} 
                  className={`role-card ${role.priority} ${isSelected ? 'filled' : 'vacant'}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="role-header">
                    <div className={`priority-badge ${role.priority}`}>
                      {role.priority === 'essential' ? '🔴 Essentiel' : '🟡 Important'}
                    </div>
                  </div>

                  <h3 className="role-title">{role.title}</h3>
                  <p className="role-description">{role.description}</p>

                  {isSelected ? (
                    <div className="assigned-minister">
                      <div className="minister-info">
                        <strong>{minister.name}</strong>
                        <span>{minister.party} • Compétence: {minister.competence}</span>
                      </div>
                      <button className="change-btn">Changer</button>
                    </div>
                  ) : (
                    <div className="vacant-position">
                      <span>Cliquer pour nommer</span>
                      <div className="required-skills">
                        {role.requiredSkills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {completionStats.completion === 100 && (
            <div className="completion-section">
              <h3>🎉 Gouvernement complet !</h3>
              <button className="btn-complete" onClick={onComplete}>
                Démarrer le mandat
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Vue de sélection des candidats */
        <div className="candidate-selection">
          <div className="selection-header">
            <button 
              className="back-btn"
              onClick={() => setSelectedRole(null)}
            >
              ← Retour au gouvernement
            </button>
            
            <div className="role-info">
              <h2>{ministerialRoles.find(r => r.id === selectedRole)?.title}</h2>
              <p>{ministerialRoles.find(r => r.id === selectedRole)?.description}</p>
            </div>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Rechercher un candidat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="results-count">
              {filteredCandidates.length} candidat{filteredCandidates.length > 1 ? 's' : ''} trouvé{filteredCandidates.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="candidates-grid">
            {currentCandidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-header">
                  <div className="candidate-avatar">
                    {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="candidate-info">
                    <h4>{candidate.name}</h4>
                    <p>{candidate.currentRole || 'Candidat'}</p>
                    <span className="party-tag">{candidate.party}</span>
                  </div>
                </div>

                <div className="candidate-stats">
                  <div className="stat">
                    <span>Compétence</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill" 
                        style={{ width: `${candidate.competence}%` }}
                      ></div>
                    </div>
                    <span>{candidate.competence}</span>
                  </div>
                  <div className="stat">
                    <span>Loyauté</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill loyalty" 
                        style={{ width: `${candidate.personality.loyalty}%` }}
                      ></div>
                    </div>
                    <span>{candidate.personality.loyalty}</span>
                  </div>
                </div>

                <div className="candidate-specialties">
                  {candidate.background.specialties.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="specialty-chip">{specialty}</span>
                  ))}
                </div>

                <button 
                  className="nominate-btn"
                  onClick={() => handleNominate(candidate)}
                >
                  Nommer ministre
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Précédent
              </button>
              <span className="page-info">
                Page {currentPage} sur {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};