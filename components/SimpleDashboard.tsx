import React, { useState } from 'react';
import { InteractiveGameSystem } from './InteractiveGameSystem';
import '../src/styles/PresidentialDashboard.css';

export const SimpleDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview');

  const handleEventDecision = (decisionId: string, optionId: string) => {
    console.log(`Décision prise pour l'événement ${decisionId}: option ${optionId}`);
  };

  return (
    <div className="presidential-dashboard">
      {/* En-tête simple */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="presidential-seal">
            <div className="seal-placeholder">RF</div>
          </div>
          <div className="header-info">
            <h1>Bureau du Président</h1>
            <p className="current-time">
              Simulation Présidentielle Active
            </p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="emergency-button">
            <button 
              className="crisis-btn"
              onClick={() => setActiveTab('events')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Gérer les Événements
            </button>
          </div>
        </div>
      </header>

      {/* Navigation simplifiée */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <span className="tab-icon">🏛️</span>
            <span className="tab-label">Vue d'ensemble</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
          >
            <span className="tab-icon">⚡</span>
            <span className="tab-label">Événements & Décisions</span>
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {activeTab === 'events' && (
          <InteractiveGameSystem onDecision={handleEventDecision} />
        )}

        {activeTab === 'overview' && (
          <div className="overview-layout">
            <section className="welcome-section">
              <h2>Bienvenue dans la Simulation Présidentielle</h2>
              <div className="intro-card">
                <h3>🎮 Comment jouer</h3>
                <ul>
                  <li><strong>Événements :</strong> Cliquez sur l'onglet "Événements & Décisions" pour voir les situations politiques</li>
                  <li><strong>Décisions :</strong> Chaque choix a des conséquences sur votre popularité et le pays</li>
                  <li><strong>Temps :</strong> Utilisez les boutons pour avancer dans le temps et voir de nouveaux événements</li>
                  <li><strong>Capital politique :</strong> Gérez vos ressources pour prendre les bonnes décisions</li>
                </ul>
                
                <div className="quick-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveTab('events')}
                  >
                    Commencer à Gouverner
                  </button>
                </div>
              </div>
            </section>

            <section className="game-info">
              <h3>🏛️ Simulation Réaliste</h3>
              <div className="info-grid">
                <div className="info-card">
                  <h4>Grèves & Manifestations</h4>
                  <p>Négociez avec les syndicats ou maintenez votre position</p>
                </div>
                <div className="info-card">
                  <h4>Relations Européennes</h4>
                  <p>Positionnez la France dans les négociations internationales</p>
                </div>
                <div className="info-card">
                  <h4>Crises Économiques</h4>
                  <p>Gérez l'inflation, le chômage et la croissance</p>
                </div>
                <div className="info-card">
                  <h4>Opinion Publique</h4>
                  <p>Vos décisions impactent votre popularité en temps réel</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};