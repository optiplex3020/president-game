// components/StatsPanel.tsx
import React from 'react';
import { useGameState } from '../src/store/gameState';
import '../src/styles/StatsPanel.css';

const StatsPanel: React.FC = () => {
  const {
    playerStats,
    foreignRelations,
    systemicCrises,
    presidentProfile,
  } = useGameState();

  const renderBar = (label: string, value: number) => (
    <div className="stats-bar">
      <div className="stats-bar-header">
        <span className="stats-label">{label.replace(/_/g, ' ')}</span>
        <span className="stats-value">{value}</span>
      </div>
      <div className="stats-bar-container">
        <div
          className={`stats-bar-progress ${
            value > 70 ? 'high' : value < 30 ? 'low' : 'medium'
          }`}
          style={{ width: `${value}%` }}
        >
          <div className="stats-bar-glow" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h2 className="stats-title">Tableau de Bord</h2>
        <div className="stats-badge">En Direct</div>
      </div>

      <div className="stats-sections">
        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h3 className="section-title">Statistiques Présidentielles</h3>
          </div>
          {Object.entries(playerStats).map(([key, val]) => (
            <React.Fragment key={key}>{renderBar(key, val)}</React.Fragment>
          ))}
        </div>

        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">🌍</span>
            <h3 className="section-title">Relations Internationales</h3>
          </div>
          {Object.entries(foreignRelations).map(([key, val]) => (
            <React.Fragment key={key}>{renderBar(key, val)}</React.Fragment>
          ))}
        </div>

        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">⚠️</span>
            <h3 className="section-title">Crises Systémiques</h3>
          </div>
          {Object.entries(systemicCrises).map(([key, val]) => (
            <React.Fragment key={key}>{renderBar(key, val)}</React.Fragment>
          ))}
        </div>

        <div className="stats-section">
          <div className="section-header">
            <span className="section-icon">📊</span>
            <h3 className="section-title">Profil Présidentiel</h3>
          </div>
          {Object.entries(presidentProfile).map(([key, val]) => (
            <React.Fragment key={key}>{renderBar(key, val)}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;