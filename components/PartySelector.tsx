import { useMemo, useState } from 'react';
import { PRESET_PARTIES } from '../src/store/gameState';
import type { PoliticalParty } from '../src/types/party';
import '../src/styles/PartySelector.css';
import { useMasterGame } from '../src/context/MasterGameContext';
import type { PartyId } from '../src/types/parliament';

interface PartySelectorProps {
  onSelect: (party: PoliticalParty) => void;
}

export const PartySelector: React.FC<PartySelectorProps> = ({ onSelect }) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [customParty, setCustomParty] = useState({
    name: '',
    description: '',
    ideology: {
      liberal: 50,
      autoritaire: 50,
      ecolo: 50,
      social: 50,
      souverainiste: 50
    }
  });

  const { parliament, opinion } = useMasterGame();

  const demographics = useMemo(() => Object.values(opinion?.demographics ?? {}), [opinion?.demographics]);
  const sortedSegments = useMemo(() => demographics.length ? [...demographics].sort((a, b) => b.opinion.trustInPresident - a.opinion.trustInPresident) : [], [demographics]);
  const supportiveSegments = sortedSegments.slice(0, 2);
  const criticalSegments = sortedSegments.slice(-2).reverse();
  const overallApproval = useMemo(() => {
    if (typeof opinion?.calculateOverallApproval !== 'function') return null;
    return Math.round(opinion.calculateOverallApproval());
  }, [opinion, demographics]);

  const handleSubmitCustomParty = (e: React.FormEvent) => {
    e.preventDefault();
    const newParty: PoliticalParty = {
      id: `custom-${Date.now()}`,
      name: customParty.name,
      description: customParty.description,
      initialStats: {
        playerStats: {},
        foreignRelations: {},
        presidentProfile: {
          liberal: customParty.ideology.liberal,
          autoritaire: customParty.ideology.autoritaire,
          ecolo: customParty.ideology.ecolo,
          social: customParty.ideology.social,
          souverainiste: customParty.ideology.souverainiste
        }
      },
      seatsInParliament: 0,
      formerPresidents: 0, // Ajout de cette propriété
      formerPrimeMinisters: 0 // Ajout de cette propriété
    };
    onSelect(newParty);
  };

  return (
    <div className="party-selector">
      <div className="party-selector-header">
        <h1 className="party-selector-title">Choisissez votre formation politique</h1>
        <p className="party-selector-subtitle">
          Votre choix définira votre base électorale et vos relations initiales
        </p>
      </div>
      
      {!isCreatingNew ? (
        <div className="party-grid">
          {PRESET_PARTIES.map(party => {
            const partyId = (party.parliamentaryId ?? party.id) as PartyId;
            const group = parliament?.parliamentaryGroups?.[partyId];
            const seats = group?.seats ?? party.seatsInParliament;
            const share = Math.round((seats / 577) * 1000) / 10;
            const majorityGap = Math.max(0, 289 - seats);
            const majorityLabel = majorityGap === 0
              ? 'Majorité absolue'
              : majorityGap <= 40
                ? 'Majorité relative'
                : 'Minorité';
            const ideologyVector = party.ideologyVector;

            return (
              <button
                key={party.id}
                onClick={() => onSelect(party)}
                className="party-card"
              >
                <div className="party-card-content">
                  <div className="party-header">
                    <h3 className="party-name">{party.name}</h3>
                    <p className="party-description">{party.description}</p>
                  </div>

                  <div className="party-majority">
                    <div className="majority-metrics">
                      <div>
                        <span className="stat-label">Sièges projetés</span>
                        <span className="stat-value">{seats}</span>
                      </div>
                      <div>
                        <span className="stat-label">Part des sièges</span>
                        <span className="stat-value">{share}%</span>
                      </div>
                      <div className={`majority-chip ${majorityGap === 0 ? 'absolute' : majorityGap <= 40 ? 'relative' : 'minority'}`}>
                        {majorityLabel}
                      </div>
                    </div>
                    {majorityGap > 0 && (
                      <div className="majority-gap">Manque {majorityGap} voix pour 289</div>
                    )}
                  </div>

                  <div className="party-lineage">
                    <div className="lineage-item">
                      <span className="stat-icon">👑</span>
                      <div>
                        <span className="stat-value">{party.formerPresidents}</span>
                        <span className="stat-label">Anciens présidents</span>
                      </div>
                    </div>
                    <div className="lineage-item">
                      <span className="stat-icon">🎖️</span>
                      <div>
                        <span className="stat-value">{party.formerPrimeMinisters}</span>
                        <span className="stat-label">Anciens Premiers ministres</span>
                      </div>
                    </div>
                  </div>

                  {ideologyVector && (
                    <div className="party-ideology-vector">
                      {Object.entries(ideologyVector).map(([axis, value]) => (
                        <div key={axis} className="ideology-axis">
                          <span>{axis}</span>
                          <div className="ideology-progress">
                            <div className="ideology-fill" style={{ width: `${(value + 100) / 2}%` }} />
                          </div>
                          <span className="axis-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="party-opinion-preview">
                    <div className="opinion-row">
                      <span className="stat-label">Confiance actuelle</span>
                      <span className="stat-value">{overallApproval !== null ? `${overallApproval}%` : '—'}</span>
                    </div>
                    <div className="segments-group">
                      <span className="segments-label">Segments favorables</span>
                      <div className="segments-pills">
                        {supportiveSegments.filter(Boolean).map(segment => (
                          <span key={segment.id} className="segment-pill positive">{segment.name}</span>
                        ))}
                      </div>
                    </div>
                    <div className="segments-group">
                      <span className="segments-label">À surveiller</span>
                      <div className="segments-pills">
                        {criticalSegments.filter(Boolean).map(segment => (
                          <span key={segment.id} className="segment-pill negative">{segment.name}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          <button
            onClick={() => setIsCreatingNew(true)}
            className="create-party-card"
          >
            <span className="create-icon">+</span>
            <h3 className="create-title">Créer un nouveau parti</h3>
            <p className="create-description">
              Définissez votre propre formation politique
            </p>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitCustomParty} className="create-party-form">
          <div className="form-section">
            <h3 className="form-section-title">Informations générales</h3>
            <input
              type="text"
              placeholder="Nom du parti"
              className="form-input"
              value={customParty.name}
              onChange={e => setCustomParty({...customParty, name: e.target.value})}
              required
            />
            <textarea
              placeholder="Description du parti"
              className="form-textarea"
              value={customParty.description}
              onChange={e => setCustomParty({...customParty, description: e.target.value})}
              required
            />
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Idéologies</h3>
            {Object.entries(customParty.ideology).map(([key, value]) => (
              <div key={key} className="ideology-slider">
                <label className="ideology-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  <span className="ideology-value">{value}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={e => setCustomParty({
                    ...customParty,
                    ideology: {
                      ...customParty.ideology,
                      [key]: parseInt(e.target.value)
                    }
                  })}
                  className="slider"
                />
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="btn-cancel"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-create"
            >
              Créer le parti
            </button>
          </div>
        </form>
      )}
    </div>
  );
};