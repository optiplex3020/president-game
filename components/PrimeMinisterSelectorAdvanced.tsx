// @ts-nocheck
import React, { useState, useMemo } from 'react';
import type { PotentialMinister } from '../src/types/cabinet';
import '../src/styles/PrimeMinisterAdvanced.css';

interface PrimeMinisterSelectorProps {
  presidentParty: string;
  onSelect: (minister: PotentialMinister) => void;
}

export const PrimeMinisterSelectorAdvanced: React.FC<PrimeMinisterSelectorProps> = ({ 
  presidentParty, 
  onSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'competence' | 'loyalty' | 'experience' | 'popularity'>('competence');
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');
  const [selectedCandidate, setSelectedCandidate] = useState<PotentialMinister | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  // Données simulées plus riches
  const allCandidates: PotentialMinister[] = [
    {
      id: 'pm_1',
      name: 'Élisabeth Borne',
      party: 'Renaissance',
      age: 62,
      gender: 'F',
      competence: 88,
      personality: {
        charisma: 72,
        integrity: 91,
        loyalty: 85,
        ambition: 76
      },
      background: {
        profession: 'Haute fonctionnaire',
        education: 'École Polytechnique, Ponts et Chaussées',
        experience: 'Ministre du Travail, Préfète',
        specialties: ['Transport', 'Écologie', 'Fonction publique']
      },
      politicalCapital: 78,
      publicProfile: 68,
      mediaRelations: 72,
      preferredRoles: ['prime_minister', 'ecology'],
      networkStrength: 85,
      riskFactors: ['Technocratique', 'Peu charismatique'],
      assets: ['Compétence technique', 'Loyauté', 'Expérience gouvernementale'],
      biography: 'Ancienne préfète et ingénieure des Ponts, Élisabeth Borne a gravi tous les échelons de la haute administration avant de devenir une figure centrale du gouvernement.',
      currentRole: 'Ancienne Première ministre'
    },
    {
      id: 'pm_2',
      name: 'Bruno Le Maire',
      party: 'Renaissance',
      age: 54,
      gender: 'M',
      competence: 91,
      personality: {
        charisma: 82,
        integrity: 87,
        loyalty: 89,
        ambition: 92
      },
      background: {
        profession: 'Énarque, écrivain',
        education: 'Sciences Po, ENA',
        experience: 'Ministre de l\'Économie, Député',
        specialties: ['Économie', 'Europe', 'Commerce international']
      },
      politicalCapital: 92,
      publicProfile: 86,
      mediaRelations: 84,
      preferredRoles: ['prime_minister', 'economy'],
      networkStrength: 90,
      riskFactors: ['Forte ambition', 'Peut éclipser le président'],
      assets: ['Excellence économique', 'Stature internationale', 'Expérience'],
      biography: 'Figure centrale de la politique économique française depuis 2017, Bruno Le Maire cumule expérience gouvernementale et vision européenne.',
      currentRole: 'Ministre de l\'Économie'
    },
    {
      id: 'pm_3',
      name: 'Gérald Darmanin',
      party: 'Renaissance',
      age: 41,
      gender: 'M',
      competence: 86,
      personality: {
        charisma: 87,
        integrity: 78,
        loyalty: 91,
        ambition: 89
      },
      background: {
        profession: 'Élu local, ministre',
        education: 'Sciences Po Lille',
        experience: 'Ministre de l\'Intérieur, Maire',
        specialties: ['Sécurité', 'Collectivités', 'Immigration']
      },
      politicalCapital: 84,
      publicProfile: 82,
      mediaRelations: 79,
      preferredRoles: ['prime_minister', 'interior'],
      networkStrength: 88,
      riskFactors: ['Controverses personnelles', 'Style clivant'],
      assets: ['Fidélité au président', 'Connaissance du terrain', 'Jeunesse'],
      biography: 'Ministre de l\'Intérieur depuis 2020, Gérald Darmanin incarne la nouvelle génération macroniste avec un profil de droite assumé.',
      currentRole: 'Ministre de l\'Intérieur'
    },
    {
      id: 'pm_4',
      name: 'Catherine Vautrin',
      party: 'LR',
      age: 63,
      gender: 'F',
      competence: 84,
      personality: {
        charisma: 75,
        integrity: 93,
        loyalty: 67,
        ambition: 71
      },
      background: {
        profession: 'Élue locale, ministre',
        education: 'Université de Reims',
        experience: 'Députée, Ministre déléguée',
        specialties: ['Collectivités', 'Cohésion sociale', 'Ruralité']
      },
      politicalCapital: 72,
      publicProfile: 65,
      mediaRelations: 68,
      preferredRoles: ['prime_minister', 'cohesion_territories'],
      networkStrength: 81,
      riskFactors: ['Opposition politique', 'Cohabitation difficile'],
      assets: ['Expérience territoriale', 'Consensus possible', 'Intégrité'],
      biography: 'Figura respectée de la droite républicaine, Catherine Vautrin pourrait incarner une ouverture politique mesurée.',
      currentRole: 'Ministre du Partenariat avec les territoires'
    },
    {
      id: 'pm_5',
      name: 'Sébastien Lecornu',
      party: 'Renaissance',
      age: 37,
      gender: 'M',
      competence: 79,
      personality: {
        charisma: 81,
        integrity: 86,
        loyalty: 94,
        ambition: 78
      },
      background: {
        profession: 'Élu local, ministre',
        education: 'Sciences Po Paris',
        experience: 'Ministre des Armées, Président de région',
        specialties: ['Défense', 'Collectivités', 'Outre-mer']
      },
      politicalCapital: 76,
      publicProfile: 71,
      mediaRelations: 74,
      preferredRoles: ['prime_minister', 'defense'],
      networkStrength: 83,
      riskFactors: ['Jeunesse', 'Expérience limitée à Matignon'],
      assets: ['Loyauté absolue', 'Connaissance territoriale', 'Modernité'],
      biography: 'Fidèle parmi les fidèles, Sébastien Lecornu représente la continuité macroniste avec une expertise défense reconnue.',
      currentRole: 'Ministre des Armées'
    },
    {
      id: 'pm_6',
      name: 'Valérie Pécresse',
      party: 'LR',
      age: 56,
      gender: 'F',
      competence: 87,
      personality: {
        charisma: 79,
        integrity: 89,
        loyalty: 58,
        ambition: 94
      },
      background: {
        profession: 'Énarque, élue',
        education: 'HEC, ENA',
        experience: 'Présidente de région, Ministre',
        specialties: ['Budget', 'Enseignement supérieur', 'Île-de-France']
      },
      politicalCapital: 81,
      publicProfile: 83,
      mediaRelations: 76,
      preferredRoles: ['prime_minister', 'budget'],
      networkStrength: 79,
      riskFactors: ['Ambitions présidentielles', 'Indépendance marquée'],
      assets: ['Compétence budgétaire', 'Expérience exécutive', 'Stature'],
      biography: 'Ancienne candidate à la présidentielle, Valérie Pécresse pourrait incarner une cohabitation constructive.',
      currentRole: 'Présidente Île-de-France'
    }
  ];

  // Filtrage et tri intelligents
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = allCandidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          candidate.background.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesParty = selectedParty === 'all' || candidate.party === selectedParty;
      const matchesExperience = selectedExperience === 'all' || 
        (selectedExperience === 'high' && candidate.competence >= 85) ||
        (selectedExperience === 'medium' && candidate.competence >= 75 && candidate.competence < 85) ||
        (selectedExperience === 'low' && candidate.competence < 75);
      
      return matchesSearch && matchesParty && matchesExperience;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'competence': return b.competence - a.competence;
        case 'loyalty': return b.personality.loyalty - a.personality.loyalty;
        case 'experience': return b.politicalCapital - a.politicalCapital;
        case 'popularity': return b.publicProfile - a.publicProfile;
        default: return 0;
      }
    });

    return filtered;
  }, [allCandidates, searchTerm, selectedParty, selectedExperience, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCandidates.length / candidatesPerPage);
  const currentCandidates = filteredAndSortedCandidates.slice(
    (currentPage - 1) * candidatesPerPage,
    currentPage * candidatesPerPage
  );

  const parties = ['all', 'Renaissance', 'LR', 'PS', 'EELV'];
  const experienceLevels = [
    { value: 'all', label: 'Tous niveaux' },
    { value: 'high', label: 'Très expérimenté (85+)' },
    { value: 'medium', label: 'Expérimenté (75-84)' },
    { value: 'low', label: 'Moins expérimenté (<75)' }
  ];

  return (
    <div className="pm-selector-advanced">
      {/* En-tête avec contexte */}
      <div className="selection-header">
        <div className="header-content">
          <h2>Sélection du Premier Ministre</h2>
          <p className="header-subtitle">
            Choisissez le chef de votre gouvernement. Cette décision influencera profondément votre capacité d'action et les relations avec le Parlement.
          </p>
        </div>
        <div className="selection-stats">
          <div className="stat-item">
            <span className="stat-number">{filteredAndSortedCandidates.length}</span>
            <span className="stat-label">Candidats</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{parties.length - 1}</span>
            <span className="stat-label">Partis</span>
          </div>
        </div>
      </div>

      {/* Barre de contrôles avancée */}
      <div className="advanced-controls">
        <div className="controls-row">
          {/* Recherche intelligente */}
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher par nom ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="search-clear"
                  aria-label="Effacer la recherche"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filtres */}
          <div className="filters-container">
            <select 
              value={selectedParty} 
              onChange={(e) => setSelectedParty(e.target.value)}
              className="filter-select"
            >
              <option value="all">Tous les partis</option>
              {parties.slice(1).map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>

            <select 
              value={selectedExperience} 
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="filter-select"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
            >
              <option value="competence">Trier par compétence</option>
              <option value="loyalty">Trier par loyauté</option>
              <option value="experience">Trier par expérience</option>
              <option value="popularity">Trier par popularité</option>
            </select>
          </div>

          {/* Mode d'affichage */}
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
              title="Vue détaillée"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Zone principale de sélection */}
      <div className="selection-main">
        {/* Liste des candidats */}
        <div className="candidates-section">
          <div className={`candidates-container ${viewMode}`}>
            {currentCandidates.map((candidate) => (
              <div 
                key={candidate.id}
                className={`candidate-card ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                onClick={() => setSelectedCandidate(candidate)}
              >
                {viewMode === 'grid' ? (
                  // Vue grille compacte
                  <>
                    <div className="candidate-header">
                      <div className="candidate-avatar">
                        <div className="avatar-placeholder">
                          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className={`party-badge ${candidate.party.toLowerCase()}`}>
                          {candidate.party}
                        </div>
                      </div>
                      <div className="candidate-basic">
                        <h3 className="candidate-name">{candidate.name}</h3>
                        <p className="candidate-role">{candidate.currentRole}</p>
                        <p className="candidate-age">{candidate.age} ans</p>
                      </div>
                    </div>
                    
                    <div className="candidate-metrics">
                      <div className="metric-item">
                        <span className="metric-label">Compétence</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill competence" 
                            style={{ width: `${candidate.competence}%` }}
                          ></div>
                        </div>
                        <span className="metric-value">{candidate.competence}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Loyauté</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill loyalty" 
                            style={{ width: `${candidate.personality.loyalty}%` }}
                          ></div>
                        </div>
                        <span className="metric-value">{candidate.personality.loyalty}</span>
                      </div>
                    </div>

                    <div className="candidate-specialties">
                      {candidate.background.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="specialty-tag">{specialty}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  // Vue détaillée
                  <div className="candidate-detailed">
                    <div className="candidate-left">
                      <div className="candidate-avatar-large">
                        <div className="avatar-placeholder">
                          {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      </div>
                      <div className={`party-badge-large ${candidate.party.toLowerCase()}`}>
                        {candidate.party}
                      </div>
                    </div>
                    <div className="candidate-content">
                      <div className="candidate-info">
                        <h3 className="candidate-name">{candidate.name}</h3>
                        <p className="candidate-role">{candidate.currentRole}</p>
                        <p className="candidate-education">{candidate.background.education}</p>
                        <p className="candidate-bio">{candidate.biography}</p>
                      </div>
                      <div className="candidate-stats">
                        <div className="stats-grid">
                          <div className="stat-item">
                            <span className="stat-label">Compétence</span>
                            <span className="stat-value">{candidate.competence}/100</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Charisme</span>
                            <span className="stat-value">{candidate.personality.charisma}/100</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Loyauté</span>
                            <span className="stat-value">{candidate.personality.loyalty}/100</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Popularité</span>
                            <span className="stat-value">{candidate.publicProfile}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
              <div className="pagination-info">
                Page {currentPage} sur {totalPages}
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

        {/* Panneau de détails */}
        {selectedCandidate && (
          <div className="candidate-details-panel">
            <div className="panel-header">
              <h3>Analyse détaillée</h3>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="close-panel"
                aria-label="Fermer"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="panel-content">
              <div className="candidate-profile">
                <div className="profile-header">
                  <div className="candidate-avatar-xl">
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h4>{selectedCandidate.name}</h4>
                    <p>{selectedCandidate.currentRole}</p>
                    <p>{selectedCandidate.age} ans • {selectedCandidate.party}</p>
                  </div>
                </div>

                <div className="profile-sections">
                  <div className="section">
                    <h5>Atouts principaux</h5>
                    <ul className="assets-list">
                      {selectedCandidate.assets.map((asset, index) => (
                        <li key={index} className="asset-item">{asset}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="section">
                    <h5>Facteurs de risque</h5>
                    <ul className="risks-list">
                      {selectedCandidate.riskFactors.map((risk, index) => (
                        <li key={index} className="risk-item">{risk}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="section">
                    <h5>Spécialités</h5>
                    <div className="specialties-grid">
                      {selectedCandidate.background.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-chip">{specialty}</span>
                      ))}
                    </div>
                  </div>

                  <div className="section">
                    <h5>Évaluation globale</h5>
                    <div className="evaluation-grid">
                      <div className="eval-item">
                        <span>Impact gouvernemental</span>
                        <div className="eval-bar">
                          <div 
                            className="eval-fill high" 
                            style={{ width: `${selectedCandidate.competence}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="eval-item">
                        <span>Stabilité politique</span>
                        <div className="eval-bar">
                          <div 
                            className="eval-fill medium" 
                            style={{ width: `${selectedCandidate.personality.loyalty}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="eval-item">
                        <span>Communication publique</span>
                        <div className="eval-bar">
                          <div 
                            className="eval-fill low" 
                            style={{ width: `${selectedCandidate.mediaRelations}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onSelect(selectedCandidate)}
                  className="select-candidate-btn"
                >
                  Nommer Premier Ministre
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
