import React from 'react';
import { useGameState } from '../src/store/gameState';
import type { DiplomaticAction } from '../src/types/diplomacy';
import '../src/styles/DiplomacyScreen.css';

const DiplomacyScreen: React.FC = () => {
  const { foreignRelations } = useGameState();

  const diplomaticActions: DiplomaticAction[] = [
    {
      type: 'visit',
      target: 'usa',
      cost: 10,
      timeToComplete: 7,
      successChance: 80,
      effects: { usa: 10, stability: 5 }
    }
    // Ajouter d'autres actions...
  ];

  return (
    <div className="diplomacy-screen">
      <div className="diplomacy-header">
        <h2>Relations Internationales</h2>
      </div>

      <div className="relations-grid">
        {Object.entries(foreignRelations).map(([country, value]) => (
          <div key={country} className="country-card">
            <div className="country-header">
              <span className="country-flag">
                {country === 'usa' && '🇺🇸'}
                {country === 'ue' && '🇪🇺'}
                {country === 'russie' && '🇷🇺'}
                {/* etc... */}
              </span>
              <h3 className="country-name">
                {country.toUpperCase()}
              </h3>
            </div>
            <div className="relations-bar">
              <div 
                className="relations-fill"
                style={{width: `${value}%`}}
              />
              <span className="relations-value">{value}%</span>
            </div>
            <div className="country-actions">
              <button className="btn-visit">Visite officielle</button>
              <button className="btn-treaty">Proposer un traité</button>
            </div>
          </div>
        ))}
      </div>

      <div className="active-missions">
        <h3>Missions diplomatiques en cours</h3>
        {diplomaticActions.map((action, index) => (
          <div key={index} className="mission-card">
            {/* Contenu des missions */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiplomacyScreen;