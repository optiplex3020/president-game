import React, { useState, useEffect } from 'react';
import { useGameEngine } from '../src/systems/GameEngine';
import { InteractiveGameSystem } from './InteractiveGameSystem';
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
  const { gameState, advanceTime, pendingDecisions } = useGameEngine();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'decisions' | 'intelligence' | 'events'>('overview');
  const [newsFilter, setNewsFilter] = useState<'all' | 'politics' | 'economy' | 'social' | 'international'>('all');

  // Mise à jour du temps en continu
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(gameState.currentDate);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.currentDate]);

  // Événements du jour (simulés mais réalistes)
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
      title: 'Entretien avec Ursula von der Leyen',
      type: 'meeting',
      time: '14:30',
      location: 'Bureau présidentiel',
      priority: 'high',
      participants: ['Présidente de la Commission européenne', 'Ministre des Affaires étrangères'],
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

  // Actualités récentes (simulées mais réalistes)
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
      title: 'Sommet européen : la France en position de force',
      source: 'Le Monde',
      impact: 'positive',
      category: 'international',
      time: '07:45',
      summary: 'Les positions françaises trouvent un écho favorable chez nos partenaires européens.'
    },
    {
      id: 'news_4',
      title: 'Sondage : popularité présidentielle en hausse',
      source: 'BFM TV',
      impact: 'positive',
      category: 'politics',
      time: '12:00',
      summary: `Selon notre dernier sondage, votre popularité atteint ${Math.round(gameState.indicators.popularity.overall)}%.`
    }
  ];

  const filteredNews = newsFilter === 'all' 
    ? recentNews 
    : recentNews.filter(news => news.category === newsFilter);

  // Indicateurs clés basés sur le vrai état du jeu
  const keyIndicators = [
    {
      label: 'Popularité',
      value: Math.round(gameState.indicators.popularity.overall),
      trend: gameState.indicators.popularity.trend,
      color: 'primary',
      format: 'percentage'
    },
    {
      label: 'Capital politique',
      value: gameState.politicalCapital,
      trend: 0,
      color: 'success',
      format: 'points'
    },
    {
      label: 'PIB (croissance)',
      value: gameState.indicators.economy.gdpGrowth.toFixed(1),
      trend: 0.1,
      color: 'info',
      format: 'percentage'
    },
    {
      label: 'Chômage',
      value: gameState.indicators.economy.unemployment.toFixed(1),
      trend: -0.1,
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

  const handleEventDecision = (decisionId: string, optionId: string) => {
    console.log(`Décision prise pour l'événement ${decisionId}: option ${optionId}`);
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
              Jour {gameState.dayInMandate} du mandat • Phase : {gameState.mandate.phase}
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
            <button 
              className="crisis-btn"
              onClick={() => {
                alert('Centre de crise activé ! Toutes les ressources gouvernementales sont mobilisées.');
                setActiveTab('events');
              }}
            >
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
            { id: 'events', label: 'Événements politiques', icon: '⚡' },
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
        {activeTab === 'events' && (
          <InteractiveGameSystem onDecision={handleEventDecision} />
        )}

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
                      <button 
                        className="btn-secondary"
                        onClick={() => alert(`Impact analysé: ${news.impact === 'positive' ? 'Favorable' : news.impact === 'negative' ? 'Défavorable' : 'Neutre'} pour votre popularité`)}
                      >
                        Analyser l'impact
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          alert('Équipe de communication mobilisée pour préparer une réponse officielle.');
                          advanceTime(2);
                        }}
                      >
                        Préparer réponse
                      </button>
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
                      <div className="chart-bar" style={{ width: `${gameState.indicators.popularity.overall}%` }}>
                        {Math.round(gameState.indicators.popularity.overall)}%
                      </div>
                    </div>
                    <div className="indicator-details">
                      <div className="detail-item">
                        <span>Jeunes (18-34)</span>
                        <span>{Math.round(gameState.indicators.popularity.byDemographic.young_adults)}%</span>
                      </div>
                      <div className="detail-item">
                        <span>Seniors (65+)</span>
                        <span>{Math.round(gameState.indicators.popularity.byDemographic.seniors)}%</span>
                      </div>
                      <div className="detail-item">
                        <span>Classes populaires</span>
                        <span>{Math.round(gameState.indicators.popularity.byDemographic.working_class)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="indicator-group">
                  <h3>Économie</h3>
                  <div className="economic-metrics">
                    <div className="metric">
                      <span className="metric-label">PIB</span>
                      <span className="metric-value positive">+{gameState.indicators.economy.gdpGrowth.toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Chômage</span>
                      <span className="metric-value negative">{gameState.indicators.economy.unemployment.toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Inflation</span>
                      <span className="metric-value">{gameState.indicators.economy.inflation.toFixed(1)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Déficit</span>
                      <span className="metric-value negative">{(gameState.indicators.economy.budget.balance / 1000000000).toFixed(1)}Md€</span>
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
                          style={{ width: `${gameState.indicators.social.unrest}%` }}
                        ></div>
                      </div>
                      <span>{Math.round(gameState.indicators.social.unrest)}/100</span>
                    </div>
                    <div className="social-item">
                      <span>Système de santé</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill success" 
                          style={{ width: `${gameState.indicators.social.healthSystem}%` }}
                        ></div>
                      </div>
                      <span>{Math.round(gameState.indicators.social.healthSystem)}/100</span>
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
                <div className="mini-calendar">
                  <div className="calendar-header">
                    <button className="calendar-nav">‹</button>
                    <span className="calendar-month">
                      {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="calendar-nav">›</button>
                  </div>
                  <div className="calendar-grid">
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
                        <button 
                          className="btn-secondary"
                          onClick={() => alert('Fonction de modification à venir')}
                        >
                          Modifier
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={() => alert(`Brief complet pour ${event.title} : ${event.briefing}`)}
                        >
                          Brief complet
                        </button>
                        {event.status === 'scheduled' && (
                          <button 
                            className="btn-primary"
                            onClick={() => {
                              alert(`Événement "${event.title}" démarré !`);
                              advanceTime(1);
                            }}
                          >
                            Démarrer
                          </button>
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
            <h2>Décisions en attente ({pendingDecisions.length})</h2>
            {pendingDecisions.length > 0 ? (
              <div className="decisions-grid">
                {pendingDecisions.map(decision => (
                  <div key={decision.id} className={`decision-card ${decision.priority}`}>
                    <div className="decision-header">
                      <div className={`decision-priority ${decision.priority}`}>
                        {decision.priority === 'urgent' && '🔴 URGENT'}
                        {decision.priority === 'normal' && '🟡 IMPORTANT'}
                        {decision.priority === 'low' && '🟢 STANDARD'}
                      </div>
                      <div className="decision-deadline">
                        Échéance : {new Date(decision.deadline).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <h3>{decision.title}</h3>
                    <p>{decision.description}</p>
                    <div className="decision-options">
                      <button 
                        className="btn-primary"
                        onClick={() => setActiveTab('events')}
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-decisions-placeholder">
                <p>Aucune décision urgente en attente</p>
                <p>Profitez de ce moment de calme pour planifier vos prochaines actions.</p>
                <button 
                  className="btn-secondary"
                  onClick={() => advanceTime(1)}
                >
                  Avancer d'une heure
                </button>
              </div>
            )}
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
                      <strong>État de l'opinion publique</strong>
                      <p>Votre popularité est actuellement de {Math.round(gameState.indicators.popularity.overall)}%. Les jeunes adultes vous soutiennent à {Math.round(gameState.indicators.popularity.byDemographic.young_adults)}%.</p>
                    </div>
                  </div>
                  <div className="intel-item">
                    <span className="intel-indicator info">📊</span>
                    <div className="intel-content">
                      <strong>Capital politique</strong>
                      <p>Vous disposez de {gameState.politicalCapital} points de capital politique. Utilisez-les judicieusement pour les grandes décisions.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="intel-section">
                <h3>💰 Situation économique</h3>
                <div className="intel-items">
                  <div className="intel-item">
                    <span className="intel-indicator success">📈</span>
                    <div className="intel-content">
                      <strong>Croissance économique</strong>
                      <p>Le PIB progresse de {gameState.indicators.economy.gdpGrowth.toFixed(1)}% cette année. Le chômage est à {gameState.indicators.economy.unemployment.toFixed(1)}%.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="intel-section">
                <h3>🌍 Veille internationale</h3>
                <div className="intel-items">
                  <div className="intel-item">
                    <span className="intel-indicator neutral">🇪🇺</span>
                    <div className="intel-content">
                      <strong>Relations européennes</strong>
                      <p>Votre influence européenne est à {gameState.indicators.international.europeanInfluence}%. Opportunité de renforcer la position française.</p>
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