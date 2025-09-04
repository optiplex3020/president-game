import React, { useState, useMemo, useCallback } from 'react';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import type { PotentialMinister, MinisterRole } from '../src/types/cabinet';
import '../src/styles/CabinetFormationUltra.css';

interface CabinetFormationUltraProps {
  onComplete: () => void;
}

export const CabinetFormationUltra: React.FC<CabinetFormationUltraProps> = ({ onComplete }) => {
  const { 
    availableCandidates, 
    selectedMinisters, 
    ministerRoles, 
    nominateMinister,
    removeMinister
  } = useCabinetFormationStore();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParty, setFilterParty] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterCompetence, setFilterCompetence] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'competence' | 'loyalty' | 'experience'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'detailed' | 'comparison'>('grid');
  const candidatesPerPage = 8;

  // Rôles ministériels avec priorités et descriptions
  const ministerialRoles: Record<string, {
    id: string;
    title: string;
    priority: 'essential' | 'important' | 'secondary';
    description: string;
    requiredSkills: string[];
    category: 'sovereign' | 'economic' | 'social' | 'territorial';
    complexity: number;
  }> = {
    'interior': {
      id: 'interior',
      title: 'Ministre de l\'Intérieur',
      priority: 'essential',
      description: 'Sécurité publique, collectivités territoriales, immigration',
      requiredSkills: ['Sécurité', 'Administration', 'Ordre public'],
      category: 'sovereign',
      complexity: 95
    },
    'economy': {
      id: 'economy',
      title: 'Ministre de l\'Économie',
      priority: 'essential',
      description: 'Politique économique, industrie, commerce',
      requiredSkills: ['Économie', 'Finance', 'Industrie'],
      category: 'economic',
      complexity: 98
    },
    'foreign_affairs': {
      id: 'foreign_affairs',
      title: 'Ministre des Affaires étrangères',
      priority: 'essential',
      description: 'Diplomatie, relations internationales, coopération',
      requiredSkills: ['Diplomatie', 'Relations internationales', 'Europe'],
      category: 'sovereign',
      complexity: 96
    },
    'justice': {
      id: 'justice',
      title: 'Garde des Sceaux',
      priority: 'essential',
      description: 'Justice, droits de l\'homme, réforme pénale',
      requiredSkills: ['Droit', 'Justice', 'Réformes'],
      category: 'sovereign',
      complexity: 92
    },
    'defense': {
      id: 'defense',
      title: 'Ministre des Armées',
      priority: 'essential',
      description: 'Défense nationale, opérations militaires, industrie de défense',
      requiredSkills: ['Défense', 'Stratégie', 'International'],
      category: 'sovereign',
      complexity: 94
    },
    'education': {
      id: 'education',
      title: 'Ministre de l\'Éducation nationale',
      priority: 'important',
      description: 'Système éducatif, recherche, enseignement supérieur',
      requiredSkills: ['Éducation', 'Jeunesse', 'Recherche'],
      category: 'social',
      complexity: 88
    },
    'health': {
      id: 'health',
      title: 'Ministre de la Santé',
      priority: 'important',
      description: 'Système de santé, sécurité sanitaire, politique du handicap',
      requiredSkills: ['Santé', 'Médecine', 'Social'],
      category: 'social',
      complexity: 90
    },
    'ecology': {
      id: 'ecology',
      title: 'Ministre de la Transition écologique',
      priority: 'important',
      description: 'Environnement, énergie, transport durable',
      requiredSkills: ['Environnement', 'Énergie', 'Transport'],
      category: 'economic',
      complexity: 85
    },
    'labor': {
      id: 'labor',
      title: 'Ministre du Travail',
      priority: 'important',
      description: 'Emploi, dialogue social, formation professionnelle',
      requiredSkills: ['Emploi', 'Social', 'Formation'],
      category: 'social',
      complexity: 87
    },
    'budget': {
      id: 'budget',
      title: 'Ministre délégué au Budget',
      priority: 'important',
      description: 'Budget de l\'État, comptes publics, fiscalité',
      requiredSkills: ['Finance', 'Budget', 'Fiscalité'],
      category: 'economic',
      complexity: 91
    },
    'agriculture': {
      id: 'agriculture',
      title: 'Ministre de l\'Agriculture',
      priority: 'secondary',
      description: 'Agriculture, pêche, alimentation, développement rural',
      requiredSkills: ['Agriculture', 'Rural', 'Alimentation'],
      category: 'territorial',
      complexity: 78
    },
    'culture': {
      id: 'culture',
      title: 'Ministre de la Culture',
      priority: 'secondary',
      description: 'Patrimoine, création artistique, médias',
      requiredSkills: ['Culture', 'Arts', 'Patrimoine'],
      category: 'social',
      complexity: 75
    }
  };

  // Filtrage et tri avancés
  const filteredAndSortedCandidates = useMemo(() => {
    if (!selectedRole) return [];
    
    let filtered = availableCandidates.filter(candidate => {
      // Filtre de recherche
      const matchesSearch = searchTerm === '' || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.background.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.background.profession.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre parti
      const matchesParty = filterParty === 'all' || candidate.party === filterParty;

      // Filtre genre
      const matchesGender = filterGender === 'all' || candidate.gender === filterGender;

      // Filtre compétence
      const matchesCompetence = filterCompetence === 'all' || 
        (filterCompetence === 'high' && candidate.competence >= 85) ||
        (filterCompetence === 'medium' && candidate.competence >= 70 && candidate.competence < 85) ||
        (filterCompetence === 'low' && candidate.competence < 70);

      return matchesSearch && matchesParty && matchesGender && matchesCompetence;
    });

    // Tri sophistiqué
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          const roleSkills = ministerialRoles[selectedRole]?.requiredSkills || [];
          const aRelevance = calculateRelevanceScore(a, roleSkills);
          const bRelevance = calculateRelevanceScore(b, roleSkills);
          return bRelevance - aRelevance;
        case 'competence':
          return b.competence - a.competence;
        case 'loyalty':
          return b.personality.loyalty - a.personality.loyalty;
        case 'experience':
          return b.politicalCapital - a.politicalCapital;
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableCandidates, selectedRole, searchTerm, filterParty, filterGender, filterCompetence, sortBy, ministerialRoles]);

  // Calcul du score de pertinence
  const calculateRelevanceScore = (candidate: PotentialMinister, roleSkills: string[]): number => {
    let score = 0;
    
    // Correspondance des spécialités
    roleSkills.forEach(skill => {
      if (candidate.background.specialties.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
        score += 20;
      }
    });

    // Bonus pour les rôles préférés
    if (candidate.preferredRoles?.includes(selectedRole!)) {
      score += 25;
    }

    // Compétence de base
    score += candidate.competence * 0.3;
    
    // Loyauté
    score += candidate.personality.loyalty * 0.2;

    return score;
  };

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCandidates.length / candidatesPerPage);
  const currentCandidates = filteredAndSortedCandidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  // Statistiques du gouvernement
  const governmentStats = useMemo(() => {
    const totalRoles = Object.keys(ministerialRoles).length;
    const filledRoles = Object.keys(selectedMinisters).length;
    
    const parityStats = Object.values(selectedMinisters).reduce((acc, minister) => {
      acc[minister.gender] = (acc[minister.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const partyStats = Object.values(selectedMinisters).reduce((acc, minister) => {
      acc[minister.party] = (acc[minister.party] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgCompetence = Object.values(selectedMinisters).length > 0 
      ? Object.values(selectedMinisters).reduce((sum, m) => sum + m.competence, 0) / Object.values(selectedMinisters).length
      : 0;

    return {
      completion: (filledRoles / totalRoles) * 100,
      totalRoles,
      filledRoles,
      parity: parityStats,
      parties: partyStats,
      avgCompetence: Math.round(avgCompetence)
    };
  }, [selectedMinisters, ministerialRoles]);

  const handleRoleSelect = useCallback((roleId: string) => {
    setSelectedRole(roleId);
    setCurrentPage(1); // Reset pagination
  }, []);

  const handleNominate = useCallback((candidate: PotentialMinister) => {
    if (selectedRole) {
      nominateMinister(selectedRole, candidate);
      setSelectedRole(null); // Retour à la vue d'ensemble
    }
  }, [selectedRole, nominateMinister]);

  return (
    <div className="cabinet-formation-ultra">
      {/* En-tête gouvernemental */}
      <header className="formation-header">
        <div className="header-content">
          <div className="government-title">
            <h1>Formation du Gouvernement</h1>
            <p className="subtitle">Composez votre équipe ministérielle pour diriger la France</p>
          </div>
          
          <div className="formation-progress">
            <div className="progress-circle">
              <div className="progress-ring">
                <svg className="progress-svg" viewBox="0 0 120 120">
                  <circle
                    className="progress-bg"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    className="progress-fill"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${governmentStats.completion * 3.14} ${314 - governmentStats.completion * 3.14}`}
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-value">{Math.round(governmentStats.completion)}%</span>
                  <span className="progress-label">Complet</span>
                </div>
              </div>
            </div>
            
            <div className="formation-stats">
              <div className="stat-item">
                <span className="stat-value">{governmentStats.filledRoles}</span>
                <span className="stat-label">Ministres nommés</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{governmentStats.avgCompetence}</span>
                <span className="stat-label">Compétence moyenne</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{Object.keys(governmentStats.parties).length}</span>
                <span className="stat-label">Partis représentés</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="formation-content">
        {!selectedRole ? (
          /* Vue d'ensemble du gouvernement */
          <div className="government-overview">
            <div className="overview-controls">
              <div className="cabinet-filters">
                <button className="filter-btn active">Tous les postes</button>
                <button className="filter-btn">Postes régaliens</button>
                <button className="filter-btn">Postes économiques</button>
                <button className="filter-btn">Postes sociaux</button>
              </div>
              
              <div className="government-composition">
                <h3>Composition actuelle</h3>
                <div className="composition-charts">
                  <div className="chart-item">
                    <span className="chart-label">Parité</span>
                    <div className="parity-bar">
                      <div 
                        className="parity-section men" 
                        style={{ width: `${(governmentStats.parity.M || 0) / Object.values(selectedMinisters).length * 100}%` }}
                      ></div>
                      <div 
                        className="parity-section women" 
                        style={{ width: `${(governmentStats.parity.F || 0) / Object.values(selectedMinisters).length * 100}%` }}
                      ></div>
                    </div>
                    <div className="parity-labels">
                      <span>H: {governmentStats.parity.M || 0}</span>
                      <span>F: {governmentStats.parity.F || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="roles-grid">
              {Object.values(ministerialRoles).map(role => {
                const minister = selectedMinisters[role.id];
                const isSelected = minister !== undefined;

                return (
                  <div 
                    key={role.id} 
                    className={`role-card ${role.priority} ${isSelected ? 'filled' : 'vacant'} ${role.category}`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className="role-header">
                      <div className="role-priority">
                        {role.priority === 'essential' && <span className="priority-badge critical">🔴 Essentiel</span>}
                        {role.priority === 'important' && <span className="priority-badge high">🟡 Important</span>}
                        {role.priority === 'secondary' && <span className="priority-badge medium">🔵 Secondaire</span>}
                      </div>
                      <div className="role-complexity">
                        <div className="complexity-bar">
                          <div 
                            className="complexity-fill" 
                            style={{ width: `${role.complexity}%` }}
                          ></div>
                        </div>
                        <span className="complexity-value">{role.complexity}%</span>
                      </div>
                    </div>

                    <h3 className="role-title">{role.title}</h3>
                    <p className="role-description">{role.description}</p>

                    {isSelected ? (
                      <div className="assigned-minister">
                        <div className="minister-avatar">
                          <div className="avatar-circle">
                            {minister.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className={`party-indicator ${minister.party.toLowerCase()}`}></div>
                        </div>
                        <div className="minister-info">
                          <strong className="minister-name">{minister.name}</strong>
                          <span className="minister-party">{minister.party}</span>
                          <div className="minister-metrics">
                            <span className="metric">Compétence: {minister.competence}</span>
                            <span className="metric">Loyauté: {minister.personality.loyalty}</span>
                          </div>
                        </div>
                        <button 
                          className="change-minister-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMinister(role.id);
                          }}
                        >
                          Changer
                        </button>
                      </div>
                    ) : (
                      <div className="vacant-position">
                        <div className="vacant-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                          </svg>
                        </div>
                        <span className="vacant-text">Cliquer pour nommer</span>
                        <div className="required-skills">
                          {role.requiredSkills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {governmentStats.completion === 100 && (
              <div className="completion-actions">
                <div className="completion-summary">
                  <h3>🎉 Gouvernement complet !</h3>
                  <p>Votre équipe ministérielle est prête à diriger la France.</p>
                  <div className="final-stats">
                    <div className="final-stat">
                      <strong>Compétence moyenne :</strong> {governmentStats.avgCompetence}/100
                    </div>
                    <div className="final-stat">
                      <strong>Parité :</strong> {governmentStats.parity.F || 0}F / {governmentStats.parity.M || 0}H
                    </div>
                  </div>
                </div>
                <button className="btn-complete-formation" onClick={onComplete}>
                  Démarrer le mandat
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
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
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Retour au gouvernement
              </button>

              <div className="role-context">
                <h2>{ministerialRoles[selectedRole].title}</h2>
                <p>{ministerialRoles[selectedRole].description}</p>
                <div className="required-competencies">
                  <strong>Compétences requises :</strong>
                  {ministerialRoles[selectedRole].requiredSkills.map((skill, index) => (
                    <span key={index} className="competency-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="selection-controls">
              <div className="search-and-filters">
                <div className="advanced-search">
                  <div className="search-input-container">
                    <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Rechercher par nom, spécialité ou expérience..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>

                <div className="filter-grid">
                  <select 
                    value={filterParty} 
                    onChange={(e) => setFilterParty(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tous les partis</option>
                    <option value="Renaissance">Renaissance</option>
                    <option value="LR">Les Républicains</option>
                    <option value="PS">Parti Socialiste</option>
                    <option value="EELV">EELV</option>
                  </select>

                  <select 
                    value={filterGender} 
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tous genres</option>
                    <option value="M">Hommes</option>
                    <option value="F">Femmes</option>
                  </select>

                  <select 
                    value={filterCompetence} 
                    onChange={(e) => setFilterCompetence(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Toutes compétences</option>
                    <option value="high">Très compétent (85+)</option>
                    <option value="medium">Compétent (70-84)</option>
                    <option value="low">En développement (&lt;70)</option>
                  </select>

                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="relevance">Trier par pertinence</option>
                    <option value="competence">Trier par compétence</option>
                    <option value="loyalty">Trier par loyauté</option>
                    <option value="experience">Trier par expérience</option>
                  </select>
                </div>
              </div>

              <div className="view-controls">
                <div className="view-tabs">
                  <button 
                    className={`view-tab ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grille
                  </button>
                  <button 
                    className={`view-tab ${viewMode === 'detailed' ? 'active' : ''}`}
                    onClick={() => setViewMode('detailed')}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    Liste
                  </button>
                  <button 
                    className={`view-tab ${viewMode === 'comparison' ? 'active' : ''}`}
                    onClick={() => setViewMode('comparison')}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Comparaison
                  </button>
                </div>

                <div className="results-info">
                  {filteredAndSortedCandidates.length} candidat{filteredAndSortedCandidates.length > 1 ? 's' : ''} trouvé{filteredAndSortedCandidates.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div className="candidates-display">
              {viewMode === 'grid' && (
                <div className="candidates-grid">
                  {currentCandidates.map(candidate => (
                    <div key={candidate.id} className="candidate-card-compact">
                      <div className="candidate-header">
                        <div className="candidate-avatar-small">
                          <div className="avatar-circle">
                            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className={`party-dot ${candidate.party.toLowerCase()}`}></div>
                        </div>
                        <div className="candidate-basic">
                          <h4 className="candidate-name">{candidate.name}</h4>
                          <p className="candidate-current-role">{candidate.currentRole}</p>
                          <p className="candidate-details">{candidate.age} ans • {candidate.party}</p>
                        </div>
                      </div>

                      <div className="relevance-score">
                        <span className="score-label">Pertinence</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${Math.min(100, calculateRelevanceScore(candidate, ministerialRoles[selectedRole].requiredSkills))}%` }}
                          ></div>
                        </div>
                        <span className="score-value">{Math.round(calculateRelevanceScore(candidate, ministerialRoles[selectedRole].requiredSkills))}</span>
                      </div>

                      <div className="candidate-skills-match">
                        {ministerialRoles[selectedRole].requiredSkills.map((skill, index) => {
                          const hasSkill = candidate.background.specialties.some(s => 
                            s.toLowerCase().includes(skill.toLowerCase())
                          );
                          return (
                            <span 
                              key={index} 
                              className={`skill-match ${hasSkill ? 'matched' : 'missing'}`}
                            >
                              {hasSkill ? '✓' : '○'} {skill}
                            </span>
                          );
                        })}
                      </div>

                      <div className="candidate-metrics-mini">
                        <div className="metric-mini">
                          <span>Compétence</span>
                          <strong>{candidate.competence}</strong>
                        </div>
                        <div className="metric-mini">
                          <span>Loyauté</span>
                          <strong>{candidate.personality.loyalty}</strong>
                        </div>
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
              )}

              {viewMode === 'detailed' && (
                <div className="candidates-list-detailed">
                  {currentCandidates.map(candidate => (
                    <div key={candidate.id} className="candidate-row-detailed">
                      <div className="candidate-left-section">
                        <div className="candidate-avatar-medium">
                          <div className="avatar-circle">
                            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className={`party-indicator-large ${candidate.party.toLowerCase()}`}>
                            {candidate.party}
                          </div>
                        </div>
                        <div className="candidate-identity">
                          <h4 className="candidate-name">{candidate.name}</h4>
                          <p className="candidate-role">{candidate.currentRole}</p>
                          <p className="candidate-education">{candidate.background.education}</p>
                          <p className="candidate-bio-excerpt">{candidate.biography?.substring(0, 120)}...</p>
                        </div>
                      </div>

                      <div className="candidate-middle-section">
                        <div className="skills-analysis">
                          <h5>Correspondance des compétences</h5>
                          <div className="skills-matrix">
                            {ministerialRoles[selectedRole].requiredSkills.map((skill, index) => {
                              const hasSkill = candidate.background.specialties.some(s => 
                                s.toLowerCase().includes(skill.toLowerCase())
                              );
                              return (
                                <div key={index} className={`skill-item ${hasSkill ? 'matched' : 'missing'}`}>
                                  <span className="skill-status">{hasSkill ? '✅' : '❌'}</span>
                                  <span className="skill-name">{skill}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="overall-match">
                            Score de pertinence: <strong>{Math.round(calculateRelevanceScore(candidate, ministerialRoles[selectedRole].requiredSkills))}/100</strong>
                          </div>
                        </div>
                      </div>

                      <div className="candidate-right-section">
                        <div className="performance-indicators">
                          <div className="indicator">
                            <span className="indicator-label">Compétence</span>
                            <div className="indicator-bar">
                              <div 
                                className="indicator-fill competence" 
                                style={{ width: `${candidate.competence}%` }}
                              ></div>
                            </div>
                            <span className="indicator-value">{candidate.competence}</span>
                          </div>
                          <div className="indicator">
                            <span className="indicator-label">Loyauté</span>
                            <div className="indicator-bar">
                              <div 
                                className="indicator-fill loyalty" 
                                style={{ width: `${candidate.personality.loyalty}%` }}
                              ></div>
                            </div>
                            <span className="indicator-value">{candidate.personality.loyalty}</span>
                          </div>
                          <div className="indicator">
                            <span className="indicator-label">Charisme</span>
                            <div className="indicator-bar">
                              <div 
                                className="indicator-fill charisma" 
                                style={{ width: `${candidate.personality.charisma}%` }}
                              ></div>
                            </div>
                            <span className="indicator-value">{candidate.personality.charisma}</span>
                          </div>
                        </div>

                        <button 
                          className="nominate-btn-large"
                          onClick={() => handleNominate(candidate)}
                        >
                          Nommer au poste
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    ← Précédent
                  </button>
                  
                  <div className="pagination-info">
                    <span>Page {currentPage} sur {totalPages}</span>
                    <span className="results-count">
                      Affichage de {(currentPage - 1) * candidatesPerPage + 1} à {Math.min(currentPage * candidatesPerPage, filteredAndSortedCandidates.length)} sur {filteredAndSortedCandidates.length} candidats
                    </span>
                  </div>
                  
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
          </div>
        )}
      </div>
    </div>
  );
};