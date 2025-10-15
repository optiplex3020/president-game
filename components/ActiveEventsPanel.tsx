import React, { useState } from 'react';
import { useGameLoopEngine } from '../src/systems/GameLoopEngine';
import type { GameEvent } from '../src/types/events';
import '../src/styles/ActiveEventsPanel.css';

export const ActiveEventsPanel: React.FC = () => {
  const { eventHistory, consequenceChains, triggerRandomEvent } = useGameLoopEngine();
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);

  // Récupérer les 5 derniers événements
  const recentEvents = eventHistory.slice(-5).reverse();

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return 'critical';
    if (severity >= 60) return 'high';
    if (severity >= 40) return 'medium';
    return 'low';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crisis': return '🚨';
      case 'opportunity': return '✨';
      case 'routine': return '📋';
      case 'international': return '🌍';
      default: return '📢';
    }
  };

  const handleEventClick = (event: GameEvent) => {
    setSelectedEvent(event);
  };

  const handleChoice = (choiceId: string) => {
    // TODO: Appliquer les conséquences du choix
    console.log(`Choix sélectionné: ${choiceId} pour l'événement ${selectedEvent?.id}`);
    setSelectedEvent(null);
  };

  return (
    <div className="active-events-panel">
      <div className="panel-header">
        <h3>📰 Événements récents</h3>
        <button
          className="trigger-event-btn"
          onClick={() => triggerRandomEvent()}
          title="Déclencher un événement aléatoire (test)"
        >
          🎲 Test
        </button>
      </div>

      <div className="events-list">
        {recentEvents.length === 0 ? (
          <div className="no-events">
            <p>Aucun événement récent</p>
            <p className="hint">Le jeu générera automatiquement des événements au fil du temps</p>
          </div>
        ) : (
          recentEvents.map(event => {
            const chain = consequenceChains.find(c => c.originEventId === event.id);
            const pendingConsequences = chain?.consequences.filter(c => !c.triggered).length || 0;

            return (
              <div
                key={event.id}
                className={`event-card ${getSeverityColor(event.severity)}`}
                onClick={() => handleEventClick(event)}
              >
                <div className="event-header">
                  <span className="event-icon">{getCategoryIcon(event.category)}</span>
                  <div className="event-title">
                    <h4>{event.title}</h4>
                    <span className="event-date">
                      {new Intl.DateTimeFormat('fr-FR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(new Date(event.date))}
                    </span>
                  </div>
                  <span className={`severity-badge ${getSeverityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                </div>

                <p className="event-description">{event.description}</p>

                {pendingConsequences > 0 && (
                  <div className="pending-consequences">
                    ⚡ {pendingConsequences} conséquence{pendingConsequences > 1 ? 's' : ''} en cours
                  </div>
                )}

                {event.choices && event.choices.length > 0 && (
                  <div className="event-has-choices">
                    💡 {event.choices.length} option{event.choices.length > 1 ? 's' : ''} disponible{event.choices.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal de détails d'événement */}
      {selectedEvent && (
        <div className="event-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="modal-icon">{getCategoryIcon(selectedEvent.category)}</span>
                <h2>{selectedEvent.title}</h2>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="event-details">
                <p className="event-full-description">{selectedEvent.description}</p>

                <div className="event-meta">
                  <div className="meta-item">
                    <span className="meta-label">Gravité</span>
                    <span className={`meta-value ${getSeverityColor(selectedEvent.severity)}`}>
                      {selectedEvent.severity} / 100
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Catégorie</span>
                    <span className="meta-value">{selectedEvent.category}</span>
                  </div>
                </div>

                {/* Impacts */}
                {selectedEvent.impacts && (
                  <div className="event-impacts">
                    <h4>📊 Impacts immédiats</h4>
                    <div className="impacts-grid">
                      {selectedEvent.impacts.opinion && (
                        <div className="impact-item">
                          <span className="impact-icon">👥</span>
                          <span className="impact-label">Opinion</span>
                          <span className={`impact-value ${selectedEvent.impacts.opinion.overall < 0 ? 'negative' : 'positive'}`}>
                            {selectedEvent.impacts.opinion.overall > 0 ? '+' : ''}{selectedEvent.impacts.opinion.overall}%
                          </span>
                        </div>
                      )}
                      {selectedEvent.impacts.economy && (
                        <div className="impact-item">
                          <span className="impact-icon">💰</span>
                          <span className="impact-label">Économie</span>
                          <span className="impact-value">Multiple</span>
                        </div>
                      )}
                      {selectedEvent.impacts.social && (
                        <div className="impact-item">
                          <span className="impact-icon">🏛️</span>
                          <span className="impact-label">Social</span>
                          <span className="impact-value">Multiple</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Choix */}
                {selectedEvent.choices && selectedEvent.choices.length > 0 && (
                  <div className="event-choices">
                    <h4>💡 Vos options</h4>
                    <div className="choices-list">
                      {selectedEvent.choices.map((choice, index) => (
                        <div
                          key={choice.id}
                          className="choice-card"
                          onClick={() => handleChoice(choice.id)}
                        >
                          <div className="choice-header">
                            <span className="choice-number">{index + 1}</span>
                            <h5>{choice.label}</h5>
                          </div>
                          <p className="choice-description">{choice.description}</p>

                          {choice.consequences && (
                            <div className="choice-consequences">
                              <strong>Conséquences :</strong>
                              <ul>
                                {choice.consequences.opinion && (
                                  <li>
                                    Opinion: {choice.consequences.opinion.overall > 0 ? '+' : ''}{choice.consequences.opinion.overall}%
                                  </li>
                                )}
                                {choice.consequences.politicalCapital && (
                                  <li>
                                    Capital politique: {choice.consequences.politicalCapital > 0 ? '+' : ''}{choice.consequences.politicalCapital}
                                  </li>
                                )}
                                {choice.consequences.economy && (
                                  <li>Impacts économiques</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
