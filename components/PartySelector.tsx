import { useState } from 'react';
import { PRESET_PARTIES } from '../src/store/gameState';
import type { PoliticalParty } from '../src/types/party';
import '../src/styles/PartySelector.css';

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
          {PRESET_PARTIES.map(party => (
            <button
              key={party.id}
              onClick={() => onSelect(party)}
              className="party-card"
            >
              <div className="party-card-content">
                <h3 className="party-name">{party.name}</h3>
                <p className="party-description">{party.description}</p>
                <div className="party-stats">
                  <div className="party-stat">
                    <span className="stat-icon">🏛️</span>
                    <span className="stat-value">{party.seatsInParliament}</span>
                    <span className="stat-label">Députés</span>
                  </div>
                  <div className="party-stat">
                    <span className="stat-icon">👑</span>
                    <span className="stat-value">{party.formerPresidents}</span>
                    <span className="stat-label">Anciens Présidents</span>
                  </div>
                  <div className="party-stat">
                    <span className="stat-icon">🎖️</span>
                    <span className="stat-value">{party.formerPrimeMinisters}</span>
                    <span className="stat-label">Anciens Premiers ministres</span>
                  </div>
                  <div className="party-ideologies">
                    {Object.entries(party.initialStats.presidentProfile).map(([key, value]) => (
                      <div key={key} className="ideology-bar">
                        <span className="ideology-label">{key}</span>
                        <div className="ideology-progress">
                          <div 
                            className="ideology-fill"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
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