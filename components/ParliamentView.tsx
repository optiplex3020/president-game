import React from 'react';
import { useParliamentSystem } from '../src/store/parliamentSystem';
import '../src/styles/ParliamentView.css';

export const ParliamentView: React.FC = () => {
  const { parties, currentLaw, coalitionSupport } = useParliamentSystem();

  return (
    <div className="parliament-view">
      <div className="parliament-header">
        <h2>Assemblée Nationale</h2>
        <div className="coalition-support">
          Support de la coalition: {coalitionSupport.toFixed(1)}%
        </div>
      </div>

      <div className="parliament-parties">
        {parties.map(party => (
          <div 
            key={party.id}
            className={`party-card ${party.inCoalition ? 'in-coalition' : ''}`}
          >
            <h3 className="party-name">{party.name}</h3>
            <div className="party-stats">
              <div className="party-seats">
                {party.seats} sièges
              </div>
              <div className="party-support">
                Support: {party.support}%
              </div>
            </div>
            <div className="party-ideology">
              <div className="ideology-bar">
                <span>Économie</span>
                <div className="bar">
                  <div 
                    className="fill"
                    style={{ left: `${(party.ideology.economic + 100) / 2}%` }}
                  />
                </div>
              </div>
              <div className="ideology-bar">
                <span>Social</span>
                <div className="bar">
                  <div 
                    className="fill"
                    style={{ left: `${(party.ideology.social + 100) / 2}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentLaw && (
        <div className="current-law">
          <h3>{currentLaw.title}</h3>
          <p>{currentLaw.description}</p>
          <div className="law-status">
            Statut: {currentLaw.status}
          </div>
        </div>
      )}
    </div>
  );
};