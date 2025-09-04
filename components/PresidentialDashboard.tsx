import React, { useState, useEffect, useMemo } from 'react';
import { useGameState } from '../src/store/gameState';
import { useGameCore } from '../src/systems/GameCore';
import '../src/styles/PresidentialDashboard.css';

interface DashboardEvent {
  id: string;
  title: string;
  type: 'meeting' | 'speech' | 'crisis' | 'travel' | 'ceremony' | 'decision';
  time: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  participants?: string[];
  duration: number;
  briefing?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  impact: 'positive' | 'neutral' | 'negative';
  category: 'politics' | 'economy' | 'social' | 'international';
  time: string;
  summary: string;
}

export const PresidentialDashboard: React.FC = () => {
  const { gameState } = useGameState();
  const gameCore = useGameCore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'decisions' | 'intelligence'>('overview');
  const [newsFilter, setNewsFilter] = useState<'all' | 'politics' | 'economy' | 'social' | 'international'>('all');

  // Mise à jour du temps en continu
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(timer);
  }, []);

  // Événements du jour (simulés)
  const todayEvents: DashboardEvent[] = [
    {
      id: 'evt_1',
      title: 'Conseil des ministres',
      type: 'meeting',
      time: '10:00',
      location: 'Salon Murat',
      priority: 'high',
      participants: ['Premier ministre', 'Ministres'],
      duration: 120,
      briefing: 'Ordre du jour : réforme des retraites, budget 2025, situation internationale',
      status: 'scheduled'
    },
    {
      id: 'evt_2',
      title: 'Entretien avec Angela Merkel',
      type: 'meeting',
      time: '14:30',
      location: 'Bureau présidentiel',
      priority: 'high',
      participants: ['Chancelière allemande', 'Ministre des Affaires étrangères'],
      duration: 45,
      briefing: 'Discussion sur la politique européenne et la défense commune',
      status: 'scheduled'
    },
    {
      id: 'evt_3',
      title: 'Point presse quotidien',
      type: 'speech',
      time: '18:00',
      location: 'Salon des Fêtes',
      priority: 'medium',
      duration: 30,
      briefing: 'Réponses aux questions sur les dernières décisions gouvernementales',
      status: 'scheduled'
    },
    {
      id: 'evt_4',
      title: 'ALERTE: Manifestations nationales',
      type: 'crisis',
      time: '16:45',
      location: 'Centre de crise',
      priority: 'critical',
      participants: ['Ministre de l\'Intérieur', 'Préfets', 'Forces de l\'ordre'],
      duration: 60,
      briefing: 'Coordination de la réponse aux manifestations contre la réforme des retraites',
      status: 'ongoing'
    }
  ];

  // Actualités récentes (simulées)
  const recentNews: NewsItem[] = [
    {
      id: 'news_1',
      title: 'Grèves dans les transports : perturbations majeures attendues',
      source: 'Le Figaro',
      impact: 'negative',
      category: 'social',
      time: '08:30',
      summary: 'Les syndicats RATP et SNCF appellent à une grève générale suite aux annonces gouvernementales.'
    },
    {
      id: 'news_2',
      title: 'Croissance française : révision à la hausse par l\'INSEE',
      source: 'Les Échos',
      impact: 'positive',
      category: 'economy',
      time: '09:15',
      summary: 'L\'institut national des statistiques révise ses prévisions de croissance de 1,1% à 1,4%.'
    },
    {
      id: 'news_3',
      title: 'Sommet européen : la France isole sur la question migratoire',
      source: 'Libération',
      impact: 'negative',
      category: 'international',
      time: '07:45',
      summary: 'Les positions françaises sur l\'immigration ne trouvent pas d\'écho chez nos partenaires européens.'
    }
  ];

  const filteredNews = newsFilter === 'all' 
    ? recentNews 
    : recentNews.filter(news => news.category === newsFilter);

  // Indicateurs clés
  const keyIndicators = [
    {
      label: 'Popularité',
      value: gameCore.indicators.popularity.overall,
      trend: gameCore.indicators.popularity.trend,
      color: 'primary',
      format: 'percentage'
    },
    {
      label: 'Capital politique',
      value: gameCore.mechanics.politicalCapital,
      trend: 2,
      color: 'success',
      format: 'points'
    },
    {
      label: 'PIB (croissance)',
      value: gameCore.indicators.economy.gdpGrowth,
      trend: 0.3,
      color: 'info',
      format: 'percentage'
    },
    {
      label: 'Chômage',
      value: gameCore.indicators.economy.unemployment,
      trend: -0.2,
      color: 'warning',
      format: 'percentage'
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="presidential-dashboard">
      {/* En-tête présidentiel */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="presidential-seal">
            <div className="seal-placeholder">RF</div>
          </div>
          <div className="header-info">
            <h1>Bureau du Président</h1>
            <p className="current-time">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </p>
            <p className="mandate-info">
              Jour {gameCore.dayInMandate} du mandat • Phase : {gameCore.mandate.phase}
            </p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="quick-stats">
            {keyIndicators.map((indicator, index) => (
              <div key={index} className={`quick-stat ${indicator.color}`}>
                <div className="stat-value">
                  {indicator.value}
                  {indicator.format === 'percentage' && '%'}
                  {indicator.format === 'points' && 'pts'}
                </div>
                <div className="stat-label">{indicator.label}</div>
                <div className={`stat-trend ${indicator.trend >= 0 ? 'positive' : 'negative'}`}>
                  {indicator.trend >= 0 ? '↗' : '↘'} {Math.abs(indicator.trend)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="emergency-button">
            <button className="crisis-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Centre de crise
            </button>
          </div>
        </div>
      </header>

      {/* Navigation par onglets */}
      <nav className="dashboard-nav">
        <div className="nav-tabs">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: '🏛️' },
            { id: 'agenda', label: 'Agenda présidentiel', icon: '📅' },
            { id: 'decisions', label: 'Décisions en attente', icon: '⚖️' },
            { id: 'intelligence', label: 'Renseignement', icon: '🕵️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-layout">
            {/* Événements urgents */}
            <section className="urgent-events">
              <h2>Événements prioritaires</h2>
              <div className="events-list">
                {todayEvents
                  .filter(event => event.priority === 'critical' || event.priority === 'high')
                  .map(event => (
                    <div key={event.id} className={`event-card ${event.priority} ${event.status}`}>
                      <div className="event-header">
                        <div className="event-time">{event.time}</div>
                        <div className={`event-status ${event.status}`}>
                          {event.status === 'ongoing' && '🔴 En cours'}
                          {event.status === 'scheduled' && '⏰ Planifié'}
                          {event.status === 'completed' && '✅ Terminé'}
                        </div>
                      </div>
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-location">📍 {event.location}</div>
                      {event.participants && (
                        <div className="event-participants">
                          👥 {event.participants.join(', ')}
                        </div>
                      )}
                      {event.briefing && (
                        <div className="event-briefing">
                          <strong>Brief :</strong> {event.briefing}
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </section>

            {/* Actualités et médias */}
            <section className="news-intelligence">
              <div className="section-header">
                <h2>Veille médiatique</h2>
                <div className="news-filters">
                  {['all', 'politics', 'economy', 'social', 'international'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setNewsFilter(filter as any)}
                      className={`filter-btn ${newsFilter === filter ? 'active' : ''}`}
                    >
                      {filter === 'all' ? 'Tout' : 
                       filter === 'politics' ? 'Politique' :
                       filter === 'economy' ? 'Économie' :
                       filter === 'social' ? 'Social' : 'International'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="news-grid">
                {filteredNews.map(news => (
                  <article key={news.id} className={`news-card ${news.impact}`}>
                    <div className="news-header">
                      <div className="news-source">{news.source}</div>
                      <div className="news-time">{news.time}</div>
                      <div className={`news-impact ${news.impact}`}>
                        {news.impact === 'positive' && '📈'}
                        {news.impact === 'negative' && '📉'}
                        {news.impact === 'neutral' && '📊'}
                      </div>
                    </div>
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-summary">{news.summary}</p>
                    <div className="news-actions">
                      <button className="btn-secondary">Analyser l'impact</button>
                      <button className="btn-primary">Préparer réponse</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Tableau de bord indicateurs */}
            <section className="indicators-dashboard">
              <h2>Tableaux de bord</h2>
              <div className="indicators-grid">
                <div className="indicator-group">
                  <h3>Opinion publique</h3>
                  <div className="indicator-chart">
                    <div className="chart-placeholder">
                      <div className="chart-bar" style={{ width: `${gameCore.indicators.popularity.overall}%` }}>
                        {gameCore.indicators.popularity.overall}%
                      </div>
                    </div>
                    <div className="indicator-details">
                      <div className="detail-item">
                        <span>Jeunes (18-34)</span>
                        <span>{gameCore.indicators.popularity.byDemographic.young_adults}%</span>
                      </div>
                      <div className="detail-item">
                        <span>Seniors (65+)</span>
                        <span>{gameCore.indicators.popularity.byDemographic.seniors}%</span>
                      </div>
                      <div className="detail-item">
                        <span>Classes populaires</span>
                        <span>{gameCore.indicators.popularity.byDemographic.working_class}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="indicator-group">
                  <h3>Économie</h3>
                  <div className="economic-metrics">
                    <div className="metric">
                      <span className="metric-label">PIB</span>
                      <span className="metric-value positive">+{gameCore.indicators.economy.gdpGrowth}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Chômage</span>
                      <span className="metric-value negative">{gameCore.indicators.economy.unemployment}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Inflation</span>
                      <span className="metric-value">{gameCore.indicators.economy.inflation}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Déficit</span>
                      <span className="metric-value negative">{(gameCore.indicators.economy.budget.balance / 1000).toFixed(1)}Md€</span>
                    </div>
                  </div>
                </div>

                <div className="indicator-group">
                  <h3>Situation sociale</h3>
                  <div className="social-indicators">
                    <div className="social-item">
                      <span>Agitation sociale</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill danger" 
                          style={{ width: `${gameCore.indicators.social.unrest}%` }}
                        ></div>
                      </div>
                      <span>{gameCore.indicators.social.unrest}/100</span>
                    </div>
                    <div className="social-item">
                      <span>Système de santé</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill success" 
                          style={{ width: `${gameCore.indicators.social.healthSystem}%` }}
                        ></div>
                      </div>
                      <span>{gameCore.indicators.social.healthSystem}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="agenda-layout">
            <div className="agenda-sidebar">
              <div className="calendar-widget">
                <h3>Calendrier présidentiel</h3>
                {/* Calendrier simplifié */}
                <div className="mini-calendar">
                  <div className="calendar-header">
                    <button className="calendar-nav">‹</button>
                    <span className="calendar-month">
                      {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="calendar-nav">›</button>
                  </div>
                  <div className="calendar-grid">
                    {/* Simulation d'un calendrier */}
                    {Array.from({ length: 30 }, (_, i) => (
                      <div key={i} className={`calendar-day ${i === selectedDate.getDate() - 1 ? 'selected' : ''}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="upcoming-events">
                <h3>Prochains événements</h3>
                <div className="events-timeline">
                  {todayEvents.map(event => (
                    <div key={event.id} className="timeline-event">
                      <div className="event-time">{event.time}</div>
                      <div className="event-info">
                        <div className="event-title">{event.title}</div>
                        <div className="event-location">{event.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="agenda-main">
              <div className="agenda-header">
                <h2>Agenda du {formatDate(selectedDate)}</h2>
                <button className="btn-primary">Ajouter un événement</button>
              </div>
              
              <div className="daily-schedule">
                {todayEvents.map(event => (
                  <div key={event.id} className={`schedule-event ${event.type} ${event.priority}`}>
                    <div className="event-timeline">
                      <div className="event-marker"></div>
                      <div className="event-time">{event.time}</div>
                      <div className="event-duration">{event.duration}min</div>
                    </div>
                    <div className="event-details">
                      <h4 className="event-title">{event.title}</h4>
                      <div className="event-meta">
                        <span className="event-location">📍 {event.location}</span>
                        {event.participants && (
                          <span className="event-participants">👥 {event.participants.join(', ')}</span>
                        )}
                      </div>
                      {event.briefing && (
                        <div className="event-briefing">
                          <strong>Briefing :</strong> {event.briefing}
                        </div>
                      )}
                      <div className="event-actions">
                        <button className="btn-secondary">Modifier</button>
                        <button className="btn-secondary">Brief complet</button>
                        {event.status === 'scheduled' && (
                          <button className="btn-primary">Démarrer</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="decisions-layout">
            <h2>Décisions en attente</h2>
            <div className="decisions-grid">
              <div className="decision-card urgent">
                <div className="decision-header">
                  <div className="decision-priority">🔴 URGENT</div>
                  <div className="decision-deadline">Échéance : 48h</div>
                </div>
                <h3>Position sur la grève des transports</h3>
                <p>Les syndicats demandent une rencontre d'urgence. Votre réponse déterminera l'ampleur de la mobilisation.</p>
                <div className="decision-options">
                  <button className="btn-success">Accepter le dialogue</button>
                  <button className="btn-danger">Maintenir la position</button>
                  <button className="btn-secondary">Reporter la décision</button>
                </div>
              </div>

              <div className="decision-card important">
                <div className="decision-header">
                  <div className="decision-priority">🟡 IMPORTANT</div>
                  <div className="decision-deadline">Échéance : 1 semaine</div>
                </div>
                <h3>Budget européen 2025</h3>
                <p>La France doit prendre position sur la nouvelle répartition du budget européen.</p>
                <div className="decision-options">
                  <button className="btn-primary">Soutenir la proposition</button>
                  <button className="btn-warning">Négocier des amendements</button>
                  <button className="btn-secondary">S'abstenir</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'intelligence' && (
          <div className="intelligence-layout">
            <h2>Renseignement et analyse</h2>
            <div className="intelligence-grid">
              <div className="intel-section">
                <h3>🔍 Surveillance de l'opinion</h3>
                <div className="intel-items">
                  <div className="intel-item">
                    <span className="intel-indicator warning">⚠️</span>
                    <div className="intel-content">
                      <strong>Montée des tensions sociales</strong>
                      <p>Augmentation de 15% des recherches "grève générale" sur les réseaux sociaux</p>
                    </div>
                  </div>
                  <div className="intel-item">
                    <span className="intel-indicator info">📊</span>
                    <div className="intel-content">
                      <strong>Sondages d'opinion</strong>
                      <p>Légère remontée dans les intentions de vote (+2 points cette semaine)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="intel-section">
                <h3>🌍 Veille internationale</h3>
                <div className="intel-items">
                  <div className="intel-item">
                    <span className="intel-indicator danger">🚨</span>
                    <div className="intel-content">
                      <strong>Tensions commerciales USA-UE</strong>
                      <p>Nouvelles sanctions commerciales américaines prévues, impact sur nos exportations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};