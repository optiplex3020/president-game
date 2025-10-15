import React, { useState, useMemo } from 'react';
import { useMasterGame } from '../src/hooks/useMasterGame';
import type { Deputy, NegotiationOffer, Law } from '../src/types/parliament';
import '../src/styles/DeputyNegotiationInterface.css';

export const DeputyNegotiationInterface: React.FC = () => {
  const { parliament, master } = useMasterGame();

  const [selectedDeputy, setSelectedDeputy] = useState<Deputy | null>(null);
  const [selectedLaw, setSelectedLaw] = useState<Law | null>(null);
  const [offerType, setOfferType] = useState<'poste' | 'amendment' | 'budget_local' | 'commission' | 'faveur'>('poste');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerValue, setOfferValue] = useState(50);
  const [demandedVote, setDemandedVote] = useState<'pour' | 'contre' | 'abstention'>('pour');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParty, setFilterParty] = useState<string>('all');
  const [negotiationResult, setNegotiationResult] = useState<{ success: boolean; message: string } | null>(null);

  // Filtrer les députés
  const filteredDeputies = useMemo(() => {
    let deputies = parliament.deputies || [];

    if (searchTerm) {
      deputies = deputies.filter(d =>
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.party.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterParty !== 'all') {
      deputies = deputies.filter(d => d.party === filterParty);
    }

    // Trier par influence
    return deputies.sort((a, b) => b.influence - a.influence);
  }, [parliament.deputies, searchTerm, filterParty]);

  // Calculer la probabilité d'acceptation
  const acceptanceProbability = useMemo(() => {
    if (!selectedDeputy || !selectedLaw) return 0;

    let probability = 50;

    // Facteur 1: Valeur de l'offre
    probability += offerValue / 2;

    // Facteur 2: Ambition du député
    if (offerType === 'poste' || offerType === 'commission') {
      probability += selectedDeputy.ambition / 2;
    }

    // Facteur 3: Intégrité (résistance à la corruption)
    if (offerType === 'faveur') {
      probability -= selectedDeputy.integrity / 2;
    }

    // Facteur 4: Relation avec le gouvernement
    probability += selectedDeputy.relationWithGovernment / 2;

    // Facteur 5: Distance idéologique
    const distance = calculateIdeologicalDistance(selectedDeputy.ideology, selectedLaw.ideology);
    probability -= distance * 20;

    // Facteur 6: Loyauté au parti
    if (selectedDeputy.loyaltyToParty > 70) {
      probability -= 20;
    }

    return Math.max(5, Math.min(95, Math.round(probability)));
  }, [selectedDeputy, selectedLaw, offerType, offerValue]);

  // Fonction auxiliaire: distance idéologique
  function calculateIdeologicalDistance(
    deputyIdeology: Deputy['ideology'],
    lawIdeology: Law['ideology']
  ): number {
    const differences = [
      Math.abs(deputyIdeology.economicLeft - lawIdeology.economicLeft),
      Math.abs(deputyIdeology.social - lawIdeology.social),
      Math.abs(deputyIdeology.european - lawIdeology.european),
      Math.abs(deputyIdeology.environmental - lawIdeology.environmental),
      Math.abs(deputyIdeology.authoritarian - lawIdeology.authoritarian)
    ];

    const distance = Math.sqrt(
      differences.reduce((sum, diff) => sum + diff * diff, 0)
    );

    return distance / 100;
  }

  const handleNegotiate = async () => {
    if (!selectedDeputy || !selectedLaw) {
      alert('⚠️ Veuillez sélectionner un député et une loi');
      return;
    }

    if (!offerDescription.trim()) {
      alert('⚠️ Veuillez décrire votre offre');
      return;
    }

    const offer: NegotiationOffer = {
      id: `negotiation_${Date.now()}`,
      targetDeputy: selectedDeputy,
      offeredBy: 'president',
      offer: {
        type: offerType,
        description: offerDescription,
        value: offerValue
      },
      demand: {
        vote: demandedVote,
        lawId: selectedLaw.id
      },
      status: 'pending',
      acceptanceProbability: acceptanceProbability
    };

    const accepted = await parliament.negotiateWithDeputy(selectedDeputy.id, offer);

    if (accepted) {
      setNegotiationResult({
        success: true,
        message: `✅ ${selectedDeputy.firstName} ${selectedDeputy.lastName} a accepté votre proposition ! Il/Elle votera "${demandedVote}" pour "${selectedLaw.title}".`
      });

      // Avancer le temps
      master.advanceTime(1);
    } else {
      setNegotiationResult({
        success: false,
        message: `❌ ${selectedDeputy.firstName} ${selectedDeputy.lastName} a refusé votre proposition. Essayez une offre plus attractive ou un autre député.`
      });
    }
  };

  const getRelationshipColor = (value: number) => {
    if (value > 30) return 'positive';
    if (value < -30) return 'negative';
    return 'neutral';
  };

  const getTraitLabel = (trait: string) => {
    const labels: Record<string, string> = {
      'fidele': '🎖️ Fidèle',
      'rebelle': '⚡ Rebelle',
      'pragmatique': '💼 Pragmatique',
      'ideologue': '📚 Idéologue',
      'opportuniste': '🎯 Opportuniste',
      'influent': '👑 Influent',
      'discret': '🤫 Discret',
      'médiatique': '📺 Médiatique',
      'technicien': '🔧 Technicien',
      'populiste': '📢 Populiste'
    };
    return labels[trait] || trait;
  };

  return (
    <div className="deputy-negotiation-interface">
      {negotiationResult && (
        <div className={`negotiation-result ${negotiationResult.success ? 'success' : 'failure'}`}>
          <p>{negotiationResult.message}</p>
          <button onClick={() => setNegotiationResult(null)}>Fermer</button>
        </div>
      )}

      <div className="negotiation-layout">
        {/* Colonne gauche: Liste des députés */}
        <div className="deputies-panel">
          <div className="panel-header">
            <h3>🏛️ Assemblée nationale</h3>
            <p className="panel-subtitle">577 députés</p>
          </div>

          <div className="deputies-filters">
            <input
              type="text"
              placeholder="🔍 Rechercher un député..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            <select
              value={filterParty}
              onChange={(e) => setFilterParty(e.target.value)}
              className="party-filter"
            >
              <option value="all">Tous les partis</option>
              <option value="renaissance">Renaissance</option>
              <option value="rn">RN</option>
              <option value="lfi">LFI</option>
              <option value="lr">LR</option>
              <option value="ps">PS</option>
              <option value="ecologistes">Écologistes</option>
              <option value="horizons">Horizons</option>
              <option value="modem">MoDem</option>
              <option value="pcf">PCF</option>
              <option value="liot">LIOT</option>
              <option value="udi">UDI</option>
            </select>
          </div>

          <div className="deputies-list">
            {filteredDeputies.map(deputy => (
              <div
                key={deputy.id}
                className={`deputy-card ${selectedDeputy?.id === deputy.id ? 'selected' : ''}`}
                onClick={() => setSelectedDeputy(deputy)}
              >
                <div className="deputy-header">
                  <div className="deputy-name">
                    <strong>{deputy.firstName} {deputy.lastName}</strong>
                    <span className="deputy-party">{deputy.party.toUpperCase()}</span>
                  </div>
                  <div className="deputy-influence">
                    Influence: <strong>{deputy.influence}</strong>
                  </div>
                </div>

                <div className="deputy-stats-mini">
                  <span className={`relation ${getRelationshipColor(deputy.relationWithGovernment)}`}>
                    Relation: {deputy.relationWithGovernment > 0 ? '+' : ''}{deputy.relationWithGovernment}
                  </span>
                  <span>Discipline: {deputy.discipline}</span>
                  <span>Loyauté: {deputy.loyaltyToParty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne centrale: Détails du député sélectionné */}
        <div className="deputy-details-panel">
          {selectedDeputy ? (
            <>
              <div className="panel-header">
                <h3>👤 {selectedDeputy.firstName} {selectedDeputy.lastName}</h3>
                <p className="deputy-info">{selectedDeputy.age} ans • {selectedDeputy.profession} • {selectedDeputy.party.toUpperCase()}</p>
              </div>

              <div className="deputy-stats">
                <div className="stat-row">
                  <span>🎖️ Influence</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: `${selectedDeputy.influence}%` }}></div>
                    <span className="stat-value">{selectedDeputy.influence}</span>
                  </div>
                </div>

                <div className="stat-row">
                  <span className={`relation-label ${getRelationshipColor(selectedDeputy.relationWithGovernment)}`}>
                    🤝 Relation avec le gouvernement
                  </span>
                  <div className="stat-bar">
                    <div
                      className={`stat-fill ${getRelationshipColor(selectedDeputy.relationWithGovernment)}`}
                      style={{ width: `${Math.abs(selectedDeputy.relationWithGovernment)}%` }}
                    ></div>
                    <span className="stat-value">
                      {selectedDeputy.relationWithGovernment > 0 ? '+' : ''}{selectedDeputy.relationWithGovernment}
                    </span>
                  </div>
                </div>

                <div className="stat-row">
                  <span>📊 Discipline de parti</span>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: `${selectedDeputy.discipline}%` }}></div>
                    <span className="stat-value">{selectedDeputy.discipline}</span>
                  </div>
                </div>

                <div className="stat-row">
                  <span>🎯 Ambition</span>
                  <div className="stat-bar">
                    <div className="stat-fill ambition" style={{ width: `${selectedDeputy.ambition}%` }}></div>
                    <span className="stat-value">{selectedDeputy.ambition}</span>
                  </div>
                </div>

                <div className="stat-row">
                  <span>💎 Intégrité</span>
                  <div className="stat-bar">
                    <div className="stat-fill integrity" style={{ width: `${selectedDeputy.integrity}%` }}></div>
                    <span className="stat-value">{selectedDeputy.integrity}</span>
                  </div>
                </div>

                <div className="stat-row">
                  <span>❤️ Loyauté au parti</span>
                  <div className="stat-bar">
                    <div className="stat-fill loyalty" style={{ width: `${selectedDeputy.loyaltyToParty}%` }}></div>
                    <span className="stat-value">{selectedDeputy.loyaltyToParty}</span>
                  </div>
                </div>
              </div>

              <div className="deputy-traits">
                <h4>Traits de personnalité</h4>
                <div className="traits-list">
                  {selectedDeputy.traits.map(trait => (
                    <span key={trait} className="trait-badge">{getTraitLabel(trait)}</span>
                  ))}
                </div>
              </div>

              <div className="deputy-ideology">
                <h4>Position idéologique</h4>
                <div className="ideology-mini">
                  <div className="ideology-item">
                    <span>Économie</span>
                    <span className="ideology-value">{selectedDeputy.ideology.economicLeft}</span>
                  </div>
                  <div className="ideology-item">
                    <span>Social</span>
                    <span className="ideology-value">{selectedDeputy.ideology.social}</span>
                  </div>
                  <div className="ideology-item">
                    <span>Europe</span>
                    <span className="ideology-value">{selectedDeputy.ideology.european}</span>
                  </div>
                  <div className="ideology-item">
                    <span>Environnement</span>
                    <span className="ideology-value">{selectedDeputy.ideology.environmental}</span>
                  </div>
                  <div className="ideology-item">
                    <span>Autorité</span>
                    <span className="ideology-value">{selectedDeputy.ideology.authoritarian}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>👈 Sélectionnez un député pour voir ses détails</p>
            </div>
          )}
        </div>

        {/* Colonne droite: Négociation */}
        <div className="negotiation-panel">
          <div className="panel-header">
            <h3>🤝 Négociation</h3>
            <p className="panel-subtitle">Obtenez le soutien d'un député</p>
          </div>

          {selectedDeputy ? (
            <>
              <div className="form-group">
                <label>Loi concernée</label>
                <select
                  value={selectedLaw?.id || ''}
                  onChange={(e) => {
                    const law = parliament.currentLaws.find(l => l.id === e.target.value);
                    setSelectedLaw(law || null);
                  }}
                  className="form-select"
                >
                  <option value="">-- Choisir une loi --</option>
                  {parliament.currentLaws.map(law => (
                    <option key={law.id} value={law.id}>{law.title}</option>
                  ))}
                </select>
              </div>

              {selectedLaw && (
                <>
                  <div className="form-group">
                    <label>Vote demandé</label>
                    <div className="vote-options">
                      <button
                        className={`vote-btn pour ${demandedVote === 'pour' ? 'active' : ''}`}
                        onClick={() => setDemandedVote('pour')}
                      >
                        ✅ Pour
                      </button>
                      <button
                        className={`vote-btn contre ${demandedVote === 'contre' ? 'active' : ''}`}
                        onClick={() => setDemandedVote('contre')}
                      >
                        ❌ Contre
                      </button>
                      <button
                        className={`vote-btn abstention ${demandedVote === 'abstention' ? 'active' : ''}`}
                        onClick={() => setDemandedVote('abstention')}
                      >
                        ⚪ Abstention
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Type d'offre</label>
                    <select
                      value={offerType}
                      onChange={(e) => setOfferType(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="poste">💼 Poste ministériel</option>
                      <option value="commission">🏛️ Présidence de commission</option>
                      <option value="amendment">📝 Accepter un amendement</option>
                      <option value="budget_local">💰 Budget pour la circonscription</option>
                      <option value="faveur">🎁 Faveur personnelle</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description de l'offre</label>
                    <textarea
                      value={offerDescription}
                      onChange={(e) => setOfferDescription(e.target.value)}
                      placeholder="Détaillez ce que vous proposez au député..."
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Valeur de l'offre
                      <span className="value-indicator">{offerValue}</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={offerValue}
                      onChange={(e) => setOfferValue(parseInt(e.target.value))}
                      className="value-slider"
                    />
                    <div className="slider-labels">
                      <span>Symbolique</span>
                      <span>Très attractive</span>
                    </div>
                  </div>

                  <div className="probability-display">
                    <div className="probability-label">Probabilité d'acceptation</div>
                    <div className="probability-bar">
                      <div
                        className={`probability-fill ${
                          acceptanceProbability > 70 ? 'high' :
                          acceptanceProbability > 40 ? 'medium' : 'low'
                        }`}
                        style={{ width: `${acceptanceProbability}%` }}
                      >
                        <span className="probability-value">{acceptanceProbability}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleNegotiate}
                    className="btn-negotiate"
                    disabled={!offerDescription.trim()}
                  >
                    🤝 Proposer la négociation
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>Sélectionnez un député pour commencer la négociation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
