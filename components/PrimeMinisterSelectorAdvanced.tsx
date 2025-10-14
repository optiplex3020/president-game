// @ts-nocheck
import React, { useMemo, useState } from 'react';
import type { PotentialMinister } from '../src/types/cabinet';
import {
  PRIME_MINISTER_CANDIDATES,
  type PrimeMinisterCandidateData,
  type CandidateMediaOutlook
} from '../src/data/primeMinisterCandidates';
import { useMasterGame } from '../src/context/MasterGameContext';
import type { PartyId } from '../src/types/parliament';
import '../src/styles/PrimeMinisterAdvanced.css';

interface PrimeMinisterSelectorProps {
  presidentParty: string;
  onSelect: (minister: PotentialMinister) => void;
}

type SortKey = 'competence' | 'loyalty' | 'experience' | 'popularity';
type ExperienceFilter = 'all' | 'high' | 'medium' | 'low';
type ViewMode = 'grid' | 'detailed';

function normalizePartyId(value: string): PartyId | undefined {
  const normalized = value.toLowerCase();
  const known: PartyId[] = [
    'renaissance',
    'rn',
    'lfi',
    'lr',
    'ps',
    'ecologistes',
    'horizons',
    'modem',
    'pcf',
    'liot',
    'udi',
    'divers_gauche',
    'divers_droite',
    'independant'
  ];
  return known.find(id => id === normalized);
}

export const PrimeMinisterSelectorAdvanced: React.FC<PrimeMinisterSelectorProps> = ({
  presidentParty,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceFilter>('all');
  const [sortBy, setSortBy] = useState<SortKey>('competence');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const candidatesPerPage = 6;
  const { parliament, characters } = useMasterGame();

  const candidateById = useMemo(() => {
    const map: Record<string, PrimeMinisterCandidateData> = {};
    PRIME_MINISTER_CANDIDATES.forEach(candidate => {
      map[candidate.id] = candidate;
    });
    return map;
  }, []);

  const presidentPartyId = normalizePartyId(presidentParty) ?? normalizePartyId(presidentParty.split('-')[0]) ?? 'renaissance';

  const partyLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const candidate of PRIME_MINISTER_CANDIDATES) {
      const group = candidate.partyId as PartyId;
      const groupData = parliament.parliamentaryGroups[group];
      labels[candidate.partyId] = groupData?.name
        ? groupData.name.toUpperCase()
        : candidate.partyId.toUpperCase();
    }
    return labels;
  }, [parliament.parliamentaryGroups]);

  const filteredAndSorted = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let list = PRIME_MINISTER_CANDIDATES.filter(candidate => {
      const matchesSearch =
        !term ||
        candidate.firstName.toLowerCase().includes(term) ||
        candidate.lastName.toLowerCase().includes(term) ||
        candidate.specialties.some(s => s.toLowerCase().includes(term)) ||
        candidate.assets.some(a => a.toLowerCase().includes(term));

      const matchesParty =
        selectedParty === 'all' || candidate.partyId === selectedParty;

      const experienceValue = candidate.potentialMinister.experience;
      const matchesExperience =
        selectedExperience === 'all' ||
        (selectedExperience === 'high' && experienceValue >= 20) ||
        (selectedExperience === 'medium' && experienceValue >= 12 && experienceValue < 20) ||
        (selectedExperience === 'low' && experienceValue < 12);

      return matchesSearch && matchesParty && matchesExperience;
    });

    list = [...list].sort((a, b) => {
      const ministerA = a.potentialMinister;
      const ministerB = b.potentialMinister;

      switch (sortBy) {
        case 'competence':
          return ministerB.competence - ministerA.competence;
        case 'loyalty':
          return (ministerB.personality?.loyalty || 0) - (ministerA.personality?.loyalty || 0);
        case 'experience':
          return ministerB.experience - ministerA.experience;
        case 'popularity':
          return (a.publicProfile || 0) - (b.publicProfile || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [searchTerm, selectedParty, selectedExperience, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / candidatesPerPage));
  const currentCandidates = useMemo(
    () =>
      filteredAndSorted.slice(
        (currentPage - 1) * candidatesPerPage,
        currentPage * candidatesPerPage
      ),
    [filteredAndSorted, currentPage]
  );

  const parties = useMemo(() => {
    const unique = Array.from(new Set(PRIME_MINISTER_CANDIDATES.map(c => c.partyId)));
    return unique;
  }, []);

  const experienceLevels: { value: ExperienceFilter; label: string }[] = [
    { value: 'all', label: 'Tous niveaux' },
    { value: 'high', label: 'Poids lourd (20+ ans)' },
    { value: 'medium', label: 'Expérimenté (12-19 ans)' },
    { value: 'low', label: 'Nouvelle génération (<12 ans)' }
  ];

  const selectedCandidate =
    selectedCandidateId && candidateById[selectedCandidateId]
      ? candidateById[selectedCandidateId]
      : null;

  const analyseCoalition = (partyId: PartyId) => {
    const governmentParties: PartyId[] = ['renaissance', 'horizons', 'modem'];
    const group = parliament.parliamentaryGroups[partyId];
    const seats = group?.seats ?? 0;
    return {
      seats,
      majorityGap: Math.max(0, 289 - seats),
      isGovernmentAligned: governmentParties.includes(partyId),
      requiresCoalition: seats < 289
    };
  };

  const renderMediaOutlook = (mediaOutlook: CandidateMediaOutlook[]) => (
    <ul className="media-outlook-list">
      {mediaOutlook.map(item => (
        <li key={`${item.outlet}-${item.headline}`} className={`media-outlook-item ${item.tone}`}>
          <div className="media-outlet">{item.outlet}</div>
          <div className="media-headline">« {item.headline} »</div>
          <div className="media-rationale">{item.rationale}</div>
        </li>
      ))}
    </ul>
  );

  const getRelationshipHighlights = (candidateId: string) => {
    const character = characters.characters[candidateId];
    if (!character) {
      return [];
    }
    const relations = Object.values(character.relationships)
      .filter(rel => rel.strength >= 55 || Math.abs(rel.sentiment) >= 40)
      .map(rel => {
        const target = characters.characters[rel.withCharacterId];
        const name = target ? `${target.firstName} ${target.lastName}` : rel.withCharacterId;
        return {
          id: rel.withCharacterId,
          name,
          sentiment: rel.sentiment,
          strength: rel.strength,
          type: rel.type
        };
      })
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 4);

    return relations;
  };

  const formatPartyLabel = (partyId: string) => partyLabels[partyId] ?? partyId.toUpperCase();

  return (
    <div className="pm-selector-advanced">
      <div className="selection-header">
        <div className="header-content">
          <h2>Sélection du Premier ministre</h2>
          <p className="header-subtitle">
            Comparez vos options selon leurs compétences, leur loyauté et leur impact politique.
          </p>
        </div>
        <div className="selection-stats">
          <div className="stat-item">
            <span className="stat-number">{filteredAndSorted.length}</span>
            <span className="stat-label">Candidats compatibles</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{parties.length}</span>
            <span className="stat-label">Familles politiques</span>
          </div>
        </div>
      </div>

      <div className="advanced-controls">
        <div className="controls-row">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Nom, spécialité ou atout..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="search-clear"
                  aria-label="Effacer la recherche"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="filters-container">
            <select
              value={selectedParty}
              onChange={(e) => {
                setSelectedParty(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="all">Tous les partis</option>
              {parties.map(partyId => (
                <option key={partyId} value={partyId}>
                  {formatPartyLabel(partyId)}
                </option>
              ))}
            </select>

            <select
              value={selectedExperience}
              onChange={(e) => {
                setSelectedExperience(e.target.value as ExperienceFilter);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="filter-select"
            >
              <option value="competence">Tri : Compétence</option>
              <option value="loyalty">Tri : Loyauté</option>
              <option value="experience">Tri : Expérience</option>
              <option value="popularity">Tri : Popularité</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grille
              </button>
              <button
                className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
                onClick={() => setViewMode('detailed')}
              >
                Étendu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`candidates-container ${viewMode}`}>
        <div className="candidates-grid">
          {currentCandidates.map(candidate => {
            const minister = candidate.potentialMinister;
            const isAllied = candidate.partyId === presidentPartyId;
            const coalition = analyseCoalition(candidate.partyId as PartyId);
            const relationships = getRelationshipHighlights(candidate.id);
            const candidateMedia = candidate.mediaOutlook;

            return (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-card-header">
                  <div className="candidate-avatar">
                    {candidate.firstName[0]}
                    {candidate.lastName[0]}
                  </div>
                  <div className="candidate-header-info">
                    <h3>{candidate.firstName} {candidate.lastName}</h3>
                    <span className={`party-badge ${candidate.partyId}`}>
                      {formatPartyLabel(candidate.partyId)}
                    </span>
                    <span className="candidate-role">
                      {candidate.currentRole}
                    </span>
                  </div>
                  {!isAllied && (
                    <span className="cohabitation-flag">
                      Cohabitation potentielle
                    </span>
                  )}
                </div>

                <div className="candidate-metrics">
                  <div className="metric">
                    <span className="metric-label">Compétence</span>
                    <div className="metric-bar">
                      <div
                        className="metric-fill high"
                        style={{ width: `${minister.competence}%` }}
                      />
                    </div>
                    <span className="metric-value">{minister.competence}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Loyauté</span>
                    <div className="metric-bar">
                      <div
                        className="metric-fill loyalty"
                        style={{ width: `${minister.personality?.loyalty ?? 0}%` }}
                      />
                    </div>
                    <span className="metric-value">{minister.personality?.loyalty ?? 0}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Popularité</span>
                    <div className="metric-bar">
                      <div
                        className="metric-fill popularity"
                        style={{ width: `${Math.min(100, Math.max(10, candidate.publicProfile))}%` }}
                      />
                    </div>
                    <span className="metric-value">{Math.round(candidate.publicProfile)}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Expérience</span>
                    <div className="metric-bar">
                      <div
                        className="metric-fill medium"
                        style={{ width: `${Math.min(100, minister.experience * 4)}%` }}
                      />
                    </div>
                    <span className="metric-value">{minister.experience} ans</span>
                  </div>
                </div>

                <div className="candidate-specialties">
                  {candidate.specialties.slice(0, 4).map(spec => (
                    <span key={spec} className="specialty-pill">{spec}</span>
                  ))}
                </div>

                <div className="candidate-summary">
                  <p>{candidate.biography}</p>
                </div>

                <div className="candidate-risks">
                  <strong>Points de vigilance :</strong>
                  <ul>
                    {candidate.riskFactors.slice(0, 2).map(risk => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div className="candidate-coalition">
                  <div className="coalition-line">
                    <span>Sièges du parti</span>
                    <span>{coalition.seats}</span>
                  </div>
                  <div className="coalition-line">
                    <span>Voix manquantes (289)</span>
                    <span>{coalition.majorityGap}</span>
                  </div>
                  {coalition.requiresCoalition && (
                    <div className="coalition-warning">
                      {coalition.isGovernmentAligned
                        ? 'Besoin d’appuis complémentaires pour une majorité absolue.'
                        : 'Nécessite une coalition large pour éviter les motions de censure.'}
                    </div>
                  )}
                </div>

                <div className="candidate-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedCandidateId(candidate.id)}
                  >
                    Analyse complète
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => onSelect(candidate.potentialMinister)}
                  >
                    Nommer
                  </button>
                </div>

                {relationships.length > 0 && (
                  <div className="candidate-relationships">
                    <strong>Influence réseau</strong>
                    <ul>
                      {relationships.map(rel => (
                        <li key={rel.id}>
                          {rel.name} — {rel.sentiment >= 0 ? '+' : ''}
                          {Math.round(rel.sentiment)} (force {Math.round(rel.strength)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="no-candidate-results">
            <h3>Aucun candidat ne correspond à vos critères</h3>
            <p>Assouplissez les filtres ou modifiez vos mots-clés.</p>
          </div>
        )}

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

      {selectedCandidate && (
        <div className="candidate-details-panel">
          <div className="panel-header">
            <h3>Analyse stratégique — {selectedCandidate.firstName} {selectedCandidate.lastName}</h3>
            <button
              onClick={() => setSelectedCandidateId(null)}
              className="close-panel"
              aria-label="Fermer"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="panel-content">
            <div className="candidate-profile">
              <div className="profile-header">
                <div className="candidate-avatar-xl">
                  {selectedCandidate.firstName[0]}
                  {selectedCandidate.lastName[0]}
                </div>
                <div className="profile-info">
                  <h4>{selectedCandidate.firstName} {selectedCandidate.lastName}</h4>
                  <p>{selectedCandidate.currentRole}</p>
                  <p>
                    {selectedCandidate.age} ans • {formatPartyLabel(selectedCandidate.partyId)} •{' '}
                    {selectedCandidate.potentialMinister.experience} ans d’expérience gouvernementale
                  </p>
                </div>
              </div>

              <div className="profile-summary">
                <h5>Résumé</h5>
                <p>{selectedCandidate.biography}</p>
              </div>

              <div className="profile-sections">
                <div className="section">
                  <h5>Atouts clés</h5>
                  <ul className="assets-list">
                    {selectedCandidate.assets.map(asset => (
                      <li key={asset}>{asset}</li>
                    ))}
                  </ul>
                </div>

                <div className="section">
                  <h5>Risques identifiés</h5>
                  <ul className="risks-list">
                    {selectedCandidate.riskFactors.map(risk => (
                      <li key={risk}>{risk}</li>
                    ))}
                  </ul>
                </div>

                <div className="section">
                  <h5>Spécialités</h5>
                  <div className="specialties-grid">
                    {selectedCandidate.specialties.map(spec => (
                      <span key={spec} className="specialty-chip">{spec}</span>
                    ))}
                  </div>
                </div>

                <div className="section">
                  <h5>Projection médiatique</h5>
                  {renderMediaOutlook(selectedCandidate.mediaOutlook)}
                </div>

                <div className="section">
                  <h5>Relations majeures</h5>
                  <ul className="relationships-list">
                    {getRelationshipHighlights(selectedCandidate.id).map(rel => (
                      <li key={rel.id}>
                        <span className="relationship-name">{rel.name}</span>
                        <span className={`relationship-score ${rel.sentiment >= 0 ? 'positive' : 'negative'}`}>
                          {rel.sentiment >= 0 ? '+' : ''}
                          {Math.round(rel.sentiment)} — {rel.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="panel-actions">
                <button
                  className="btn-primary large"
                  onClick={() => {
                    onSelect(selectedCandidate.potentialMinister);
                    setSelectedCandidateId(null);
                  }}
                >
                  Confirmer {selectedCandidate.firstName} {selectedCandidate.lastName} comme Premier ministre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
