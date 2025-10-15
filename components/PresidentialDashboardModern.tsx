/**
 * PRESIDENTIAL DASHBOARD MODERN
 * Interface présidentielle complètement repensée - Design moderne et immersif
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useMasterGameEngine } from '../src/systems/MasterGameEngine';
import { useGameLoopEngine } from '../src/systems/GameLoopEngine';
import { useQuestEngine } from '../src/systems/QuestEngine';
import { useNotificationEngine } from '../src/systems/NotificationEngine';
import { useReputationEngine } from '../src/systems/ReputationEngine';
import { useOpinionEngine } from '../src/systems/OpinionEngine';
import { useParliamentEngine } from '../src/systems/ParliamentEngine';

// Composants
import { NotificationToast } from './NotificationToast';
import { TimeControlPanel } from './TimeControlPanel';
import { QuestPanel, QuestWidgetCompact } from './QuestPanel';
import { ConsequenceTimeline, ConsequenceTimelineCompact } from './ConsequenceTimeline';
import { LegacyPanel } from './LegacyPanel';
import { LawProposalInterface } from './LawProposalInterface';
import { DeputyNegotiationInterface } from './DeputyNegotiationInterface';
import { OpinionManagementInterface } from './OpinionManagementInterface';
import { ActiveEventsPanel } from './ActiveEventsPanel';
import { DailyBriefingModal } from './DailyBriefingModal';
import { EndOfDaySummary } from './EndOfDaySummary';

import '../src/styles/DashboardModern.css';

type ViewMode = 'command-center' | 'parliament' | 'opinion' | 'events' | 'quests' | 'legacy';

export const PresidentialDashboardModern: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('command-center');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showEndOfDay, setShowEndOfDay] = useState(false);

  // Stores
  const { currentDate, dayInMandate, getGlobalStats } = useMasterGameEngine();
  const { totalEventsTriggered, totalConsequencesExecuted } = useGameLoopEngine();
  const { activeQuestIds, totalQuestsCompleted, currentStreak } = useQuestEngine();
  const { unreadCount } = useNotificationEngine();
  const { legacy, currentReputation } = useReputationEngine();
  const opinion = useOpinionEngine();
  const parliament = useParliamentEngine();

  // Stats globales
  const stats = getGlobalStats();
  const overallApproval = opinion.calculateOverallApproval();

  // Calculer le nombre de lois en cours
  const activeLawsCount = useMemo(() => {
    return parliament.laws.filter(l => l.stage !== 'promulguee' && l.stage !== 'rejetee').length;
  }, [parliament.laws]);

  return (
    <div className="dashboard-modern">
      {/* Notifications Toast (toujours visibles) */}
      <NotificationToast />

      {/* Header présidentiel */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="presidential-seal">
            <div className="seal-icon">🇫🇷</div>
            <div className="seal-text">
              <div className="seal-title">Présidence de la République</div>
              <div className="seal-subtitle">Palais de l'Élysée</div>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="mandate-progress-container">
            <div className="mandate-info">
              <span className="mandate-day">Jour {dayInMandate}</span>
              <span className="mandate-separator">/</span>
              <span className="mandate-total">1826</span>
            </div>
            <div className="mandate-progress-bar">
              <div
                className="mandate-progress-fill"
                style={{ width: `${(dayInMandate / 1826) * 100}%` }}
              />
            </div>
            <div className="mandate-date">
              {currentDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="header-stats">
            <div className="header-stat popularity">
              <div className="stat-icon">❤️</div>
              <div className="stat-content">
                <div className="stat-value">{Math.round(overallApproval)}%</div>
                <div className="stat-label">Popularité</div>
              </div>
            </div>
            <div className="header-stat capital">
              <div className="stat-icon">💎</div>
              <div className="stat-content">
                <div className="stat-value">{Math.round(stats.politicalCapital)}</div>
                <div className="stat-label">Capital</div>
              </div>
            </div>
            <div className="header-stat quests">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{activeQuestIds.length}</div>
                <div className="stat-label">Objectifs</div>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="header-stat notifications">
                <div className="stat-icon notification-bell">
                  🔔
                  <span className="notification-badge">{unreadCount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation principale */}
      <nav className="dashboard-nav">
        <button
          className={`nav-item ${viewMode === 'command-center' ? 'active' : ''}`}
          onClick={() => setViewMode('command-center')}
        >
          <span className="nav-icon">🎮</span>
          <span className="nav-label">Centre de Commandement</span>
        </button>
        <button
          className={`nav-item ${viewMode === 'parliament' ? 'active' : ''}`}
          onClick={() => setViewMode('parliament')}
        >
          <span className="nav-icon">⚖️</span>
          <span className="nav-label">Parlement</span>
          {activeLawsCount > 0 && (
            <span className="nav-badge">{activeLawsCount}</span>
          )}
        </button>
        <button
          className={`nav-item ${viewMode === 'opinion' ? 'active' : ''}`}
          onClick={() => setViewMode('opinion')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Opinion Publique</span>
        </button>
        <button
          className={`nav-item ${viewMode === 'events' ? 'active' : ''}`}
          onClick={() => setViewMode('events')}
        >
          <span className="nav-icon">⚡</span>
          <span className="nav-label">Événements</span>
          {totalEventsTriggered > 0 && (
            <span className="nav-badge pulse">{totalEventsTriggered}</span>
          )}
        </button>
        <button
          className={`nav-item ${viewMode === 'quests' ? 'active' : ''}`}
          onClick={() => setViewMode('quests')}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-label">Objectifs</span>
          {activeQuestIds.length > 0 && (
            <span className="nav-badge success">{activeQuestIds.length}</span>
          )}
        </button>
        <button
          className={`nav-item ${viewMode === 'legacy' ? 'active' : ''}`}
          onClick={() => setViewMode('legacy')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Héritage</span>
        </button>
      </nav>

      {/* Layout principal avec sidebar */}
      <div className="dashboard-layout">
        {/* Sidebar gauche (widgets contextuels) */}
        <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>

          {!sidebarCollapsed && (
            <div className="sidebar-content">
              {/* Widget quête active */}
              <div className="sidebar-widget">
                <h3 className="widget-title">
                  <span className="widget-icon">🎯</span>
                  Objectif actif
                </h3>
                <QuestWidgetCompact />
              </div>

              {/* Widget conséquences à venir */}
              <div className="sidebar-widget">
                <h3 className="widget-title">
                  <span className="widget-icon">⏰</span>
                  À venir
                </h3>
                <ConsequenceTimelineCompact />
              </div>

              {/* Widget stats rapides */}
              <div className="sidebar-widget stats-widget">
                <h3 className="widget-title">
                  <span className="widget-icon">📈</span>
                  Indicateurs
                </h3>
                <div className="quick-stats">
                  <div className="quick-stat">
                    <div className="quick-stat-label">Économie</div>
                    <div className="quick-stat-value">
                      {stats.economicHealth > 60 ? '📈' : stats.economicHealth > 40 ? '📊' : '📉'}
                      {Math.round(stats.economicHealth)}
                    </div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-label">Social</div>
                    <div className="quick-stat-value">
                      {stats.socialStability > 60 ? '✅' : stats.socialStability > 40 ? '⚠️' : '🚨'}
                      {Math.round(stats.socialStability)}
                    </div>
                  </div>
                  <div className="quick-stat">
                    <div className="quick-stat-label">International</div>
                    <div className="quick-stat-value">
                      {stats.internationalStanding > 60 ? '🌟' : stats.internationalStanding > 40 ? '⭐' : '☆'}
                      {Math.round(stats.internationalStanding)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget progression */}
              <div className="sidebar-widget progress-widget">
                <h3 className="widget-title">
                  <span className="widget-icon">🏅</span>
                  Progression
                </h3>
                <div className="progress-items">
                  <div className="progress-item">
                    <div className="progress-item-label">Quêtes complétées</div>
                    <div className="progress-item-value">{totalQuestsCompleted}</div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-item-label">Série en cours</div>
                    <div className="progress-item-value">
                      {currentStreak > 0 ? `🔥 ${currentStreak}` : '—'}
                    </div>
                  </div>
                  <div className="progress-item">
                    <div className="progress-item-label">Événements gérés</div>
                    <div className="progress-item-value">{totalEventsTriggered}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Contenu principal */}
        <main className="dashboard-main">
          {/* Contrôles de temps (toujours visibles en haut) */}
          <div className="time-controls-container">
            <TimeControlPanel />
          </div>

          {/* Vue selon le mode */}
          <div className="view-container">
            {viewMode === 'command-center' && <CommandCenterView />}
            {viewMode === 'parliament' && <ParliamentView />}
            {viewMode === 'opinion' && <OpinionView />}
            {viewMode === 'events' && <EventsView />}
            {viewMode === 'quests' && <QuestsView />}
            {viewMode === 'legacy' && <LegacyView />}
          </div>
        </main>
      </div>

      {/* Modals */}
      <DailyBriefingModal
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
      />
      <EndOfDaySummary
        isOpen={showEndOfDay}
        onContinue={() => setShowEndOfDay(false)}
      />
    </div>
  );
};

// ==================== VUES ====================

const CommandCenterView: React.FC = () => {
  const stats = useMasterGameEngine(s => s.getGlobalStats());
  const opinion = useOpinionEngine();

  return (
    <div className="command-center-view">
      <div className="view-header">
        <h1 className="view-title">Centre de Commandement</h1>
        <p className="view-subtitle">Vue d'ensemble de votre présidence</p>
      </div>

      <div className="command-grid">
        {/* Bloc popularité détaillée */}
        <div className="command-block popularity-block">
          <div className="block-header">
            <h3>❤️ Popularité</h3>
            <div className="block-value">{Math.round(opinion.calculateOverallApproval())}%</div>
          </div>
          <div className="block-content">
            <div className="popularity-segments">
              {Object.entries(opinion.segmentOpinions).slice(0, 5).map(([segment, data]) => (
                <div key={segment} className="segment-item">
                  <div className="segment-label">{segment}</div>
                  <div className="segment-bar">
                    <div
                      className="segment-fill"
                      style={{ width: `${data.approval}%` }}
                    />
                  </div>
                  <div className="segment-value">{Math.round(data.approval)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bloc indicateurs économiques */}
        <div className="command-block economy-block">
          <div className="block-header">
            <h3>💰 Économie</h3>
            <div className="block-value">{Math.round(stats.economicHealth)}</div>
          </div>
          <div className="block-content">
            <div className="economy-indicators">
              <div className="indicator">
                <span className="indicator-icon">📈</span>
                <span className="indicator-label">Croissance</span>
                <span className="indicator-value">+1.2%</span>
              </div>
              <div className="indicator">
                <span className="indicator-icon">👔</span>
                <span className="indicator-label">Chômage</span>
                <span className="indicator-value">8.3%</span>
              </div>
              <div className="indicator">
                <span className="indicator-icon">💳</span>
                <span className="indicator-label">Dette</span>
                <span className="indicator-value">97%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline des conséquences */}
        <div className="command-block timeline-block full-width">
          <div className="block-header">
            <h3>⏰ Prochains événements</h3>
          </div>
          <div className="block-content">
            <ConsequenceTimeline />
          </div>
        </div>

        {/* Actions rapides */}
        <div className="command-block actions-block">
          <div className="block-header">
            <h3>⚡ Actions rapides</h3>
          </div>
          <div className="block-content">
            <div className="quick-actions">
              <button className="quick-action-btn primary">
                <span className="btn-icon">📜</span>
                <span className="btn-label">Proposer une loi</span>
              </button>
              <button className="quick-action-btn secondary">
                <span className="btn-icon">🤝</span>
                <span className="btn-label">Négocier</span>
              </button>
              <button className="quick-action-btn secondary">
                <span className="btn-icon">📰</span>
                <span className="btn-label">Communiqué</span>
              </button>
              <button className="quick-action-btn secondary">
                <span className="btn-icon">🌍</span>
                <span className="btn-label">Diplomatie</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParliamentView: React.FC = () => (
  <div className="parliament-view">
    <div className="view-header">
      <h1 className="view-title">⚖️ Assemblée Nationale</h1>
      <p className="view-subtitle">Proposez et négociez vos lois</p>
    </div>
    <div className="view-content-tabs">
      <LawProposalInterface />
    </div>
  </div>
);

const OpinionView: React.FC = () => (
  <div className="opinion-view">
    <div className="view-header">
      <h1 className="view-title">📊 Opinion Publique</h1>
      <p className="view-subtitle">Gérez votre relation avec les citoyens</p>
    </div>
    <div className="view-content">
      <OpinionManagementInterface />
    </div>
  </div>
);

const EventsView: React.FC = () => (
  <div className="events-view">
    <div className="view-header">
      <h1 className="view-title">⚡ Événements Politiques</h1>
      <p className="view-subtitle">Réagissez aux crises et opportunités</p>
    </div>
    <div className="view-content">
      <ActiveEventsPanel />
    </div>
  </div>
);

const QuestsView: React.FC = () => (
  <div className="quests-view">
    <div className="view-header">
      <h1 className="view-title">🎯 Objectifs du Mandat</h1>
      <p className="view-subtitle">Accomplissez vos objectifs pour renforcer votre héritage</p>
    </div>
    <div className="view-content">
      <QuestPanel />
    </div>
  </div>
);

const LegacyView: React.FC = () => (
  <div className="legacy-view">
    <div className="view-header">
      <h1 className="view-title">🏆 Héritage Présidentiel</h1>
      <p className="view-subtitle">Votre marque dans l'histoire de France</p>
    </div>
    <div className="view-content">
      <LegacyPanel />
    </div>
  </div>
);

export default PresidentialDashboardModern;
