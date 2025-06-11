import React from 'react';
import { useGameState } from '../src/store/gameState';
import '../src/styles/ProfileTab.css';

const ProfileTab: React.FC = () => {
  const { playerInfo, party } = useGameState();

  if (!playerInfo || !party) return null;

  const age = playerInfo.age;
  const mandate = "2027-2032";
  const daysInOffice = 0; // À implémenter avec le système de date

  return (
    <div className="profile-tab">
      <div className="profile-main">
        <div className="profile-avatar">
          <span>{playerInfo.firstName[0]}{playerInfo.lastName[0]}</span>
        </div>
        
        <div className="profile-info">
          <h1 className="profile-name">
            {playerInfo.firstName} {playerInfo.lastName}
          </h1>
          <div className="profile-details">
            <span className="profile-title">Président de la République</span>
            <span className="profile-separator">•</span>
            <span className="profile-party">{party.name}</span>
          </div>
          <div className="profile-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Âge</span>
              <span className="metadata-value">{age} ans</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Mandat</span>
              <span className="metadata-value">{mandate}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">En fonction depuis</span>
              <span className="metadata-value">{daysInOffice} jours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stats-card">
          <span className="stats-icon">🏛️</span>
          <span className="stats-value">{party.seatsInParliament}</span>
          <span className="stats-label">Députés</span>
        </div>
        <div className="stats-card">
          <span className="stats-icon">📊</span>
          <span className="stats-value">45%</span>
          <span className="stats-label">Popularité</span>
        </div>
        <div className="stats-card">
          <span className="stats-icon">📈</span>
          <span className="stats-value">67%</span>
          <span className="stats-label">Stabilité</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;