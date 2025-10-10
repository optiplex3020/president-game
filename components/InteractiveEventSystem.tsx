import React, { useState } from 'react';
import '../src/styles/InteractiveEventSystem.css';

interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'crisis' | 'opportunity' | 'decision' | 'meeting';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadline?: string;
  options: EventOption[];
  consequences?: string[];
  stakeholders?: string[];
}

interface EventOption {
  id: string;
  title: string;
  description: string;
  consequences: {
    positive: string[];
    negative: string[];
    uncertain: string[];
  };
  requirements?: {
    politicalCapital?: number;
    popularity?: number;
    budget?: number;
  };
  impact: {
    popularity: number;
    economy: number;
    stability: number;
    international: number;
  };
}

interface InteractiveEventSystemProps {
  onDecision: (eventId: string, optionId: string) => void;
}

export const InteractiveEventSystem: React.FC<InteractiveEventSystemProps> = ({ onDecision }) => {
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Événements de jeu réalistes
  const gameEvents: GameEvent[] = [
    {
      id: 'transport_strike',
      title: 'Grève générale des transports',
      description: 'Les syndicats de la RATP et SNCF appellent à une grève générale suite à vos annonces sur la réforme des retraites. Les perturbations s\'annoncent majeures.',
      type: 'crisis',
      urgency: 'critical',
      deadline: '48h',
      stakeholders: ['Syndicats', 'Usagers', 'Opposition', 'Médias'],
      options: [
        {
          id: 'negotiate',
          title: 'Négocier avec les syndicats',
          description: 'Organiser une rencontre d\'urgence avec les dirigeants syndicaux pour trouver un compromis.',
          consequences: {
            positive: ['Apaisement possible', 'Image de dialogue', 'Solution durable'],
            negative: ['Signe de faiblesse', 'Concessions coûteuses', 'Précédent dangereux'],
            uncertain: ['Succès des négociations incertain']
          },
          requirements: {
            politicalCapital: 20
          },
          impact: {
            popularity: -5,
            economy: -2,
            stability: 10,
            international: 0
          }
        },
        {
          id: 'maintain_position',
          title: 'Maintenir la position',
          description: 'Refuser tout recul et assumer les conséquences de la grève.',
          consequences: {
            positive: ['Fermeté affichée', 'Réforme préservée', 'Respect des engagements'],
            negative: ['Chaos des transports', 'Colère populaire', 'Économie perturbée'],
            uncertain: ['Durée de la mobilisation']
          },
          impact: {
            popularity: -15,
            economy: -10,
            stability: -20,
            international: 5
          }
        },
        {
          id: 'service_minimum',
          title: 'Imposer un service minimum',
          description: 'Utiliser les prérogatives légales pour garantir un service minimum dans les transports.',
          consequences: {
            positive: ['Transports partiellement maintenus', 'Autorité affirmée'],
            negative: ['Escalade du conflit', 'Opposition des syndicats', 'Risques juridiques'],
            uncertain: ['Efficacité du dispositif']
          },
          requirements: {
            politicalCapital: 30
          },
          impact: {
            popularity: -8,
            economy: -5,
            stability: -10,
            international: 2
          }
        }
      ]
    },
    {
      id: 'economic_opportunity',
      title: 'Investissement technologique majeur',
      description: 'Une grande entreprise américaine propose d\'investir 5 milliards d\'euros en France pour créer un centre de recherche européen.',
      type: 'opportunity',
      urgency: 'medium',
      deadline: '2 semaines',
      stakeholders: ['Entreprises tech', 'Régions', 'Europe', 'Écologistes'],
      options: [
        {
          id: 'accept_full',
          title: 'Accepter sans conditions',
          description: 'Donner un accord de principe immédiat avec toutes les facilités demandées.',
          consequences: {
            positive: ['15000 emplois créés', 'Hub technologique', 'Rayonnement international'],
            negative: ['Dépendance technologique', 'Concessions fiscales', 'Critiques écologiques'],
            uncertain: ['Pérennité de l\'investissement']
          },
          impact: {
            popularity: 12,
            economy: 20,
            stability: 5,
            international: 15
          }
        },
        {
          id: 'negotiate_terms',
          title: 'Négocier les conditions',
          description: 'Accepter le principe mais négocier les contreparties environnementales et fiscales.',
          consequences: {
            positive: ['Investissement durable', 'Respect environnemental', 'Fiscalité préservée'],
            negative: ['Risque de retrait', 'Délais allongés', 'Compromis complexes'],
            uncertain: ['Acceptation par l\'investisseur']
          },
          requirements: {
            politicalCapital: 15
          },
          impact: {
            popularity: 8,
            economy: 15,
            stability: 8,
            international: 10
          }
        },
        {
          id: 'decline_politely',
          title: 'Décliner poliment',
          description: 'Refuser l\'investissement pour privilégier la souveraineté technologique européenne.',
          consequences: {
            positive: ['Indépendance préservée', 'Soutien souverainiste', 'Alternative européenne'],
            negative: ['Emplois perdus', 'Manque à gagner', 'Image anti-business'],
            uncertain: ['Réaction des partenaires européens']
          },
          impact: {
            popularity: -5,
            economy: -8,
            stability: 2,
            international: -10
          }
        }
      ]
    },
    {
      id: 'international_summit',
      title: 'Sommet européen extraordinaire',
      description: 'L\'Allemagne propose un sommet d\'urgence sur la crise migratoire. Votre position sera déterminante pour l\'avenir de l\'Europe.',
      type: 'meeting',
      urgency: 'high',
      deadline: '1 semaine',
      stakeholders: ['UE', 'Allemagne', 'Italie', 'Opinion publique'],
      options: [
        {
          id: 'support_germany',
          title: 'Soutenir la position allemande',
          description: 'S\'aligner sur Berlin pour une politique migratoire européenne commune.',
          consequences: {
            positive: ['Unité européenne', 'Partenariat franco-allemand', 'Solutions communes'],
            negative: ['Opposition nationale', 'Perte de souveraineté', 'Critiques populistes'],
            uncertain: ['Efficacité des mesures européennes']
          },
          impact: {
            popularity: -10,
            economy: 2,
            stability: -5,
            international: 15
          }
        },
        {
          id: 'french_position',
          title: 'Défendre une position française',
          description: 'Proposer une alternative française privilégiant les contrôles aux frontières.',
          consequences: {
            positive: ['Souveraineté affirmée', 'Soutien populaire', 'Leadership européen'],
            negative: ['Tensions avec Berlin', 'Isolement possible', 'Blocage européen'],
            uncertain: ['Ralliment d\'autres pays']
          },
          requirements: {
            politicalCapital: 25
          },
          impact: {
            popularity: 15,
            economy: -3,
            stability: 10,
            international: -8
          }
        },
        {
          id: 'compromise',
          title: 'Chercher un compromis',
          description: 'Proposer une solution médiane combinant solidarité européenne et contrôles nationaux.',
          consequences: {
            positive: ['Consensus européen', 'Position d\'équilibre', 'Diplomatie réussie'],
            negative: ['Solution édulcorée', 'Mécontentement des extrêmes', 'Complexité d\'application'],
            uncertain: ['Acceptation par tous les partenaires']
          },
          requirements: {
            politicalCapital: 20
          },
          impact: {
            popularity: 2,
            economy: 0,
            stability: 5,
            international: 8
          }
        }
      ]
    }
  ];

  const currentEvents = gameEvents.slice(0, 3); // Limiter à 3 événements pour la démo

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleConfirmDecision = () => {
    if (activeEvent && selectedOption) {
      onDecision(activeEvent.id, selectedOption);
      setActiveEvent(null);
      setSelectedOption(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'var(--color-danger)';
      case 'high': return 'var(--color-warning)';
      case 'medium': return 'var(--color-info)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-gray-500)';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crisis': return '🚨';
      case 'opportunity': return '💡';
      case 'decision': return '⚖️';
      case 'meeting': return '🤝';
      default: return '📋';
    }
  };

  return (
    <div className="interactive-event-system">
      {!activeEvent ? (
        <>
          <div className="events-header">
            <h2>Événements en cours</h2>
            <p className="events-subtitle">
              Votre réactivité et vos décisions façonneront l'avenir de votre mandat
            </p>
          </div>

          <div className="events-grid">
            {currentEvents.map(event => (
              <div key={event.id} className={`event-card ${event.urgency}`}>
                <div className="event-header">
                  <div className="event-type">
                    <span className="type-icon">{getTypeIcon(event.type)}</span>
                    <span className="type-label">{event.type}</span>
                  </div>
                  <div className="event-urgency" style={{ color: getUrgencyColor(event.urgency) }}>
                    {event.urgency.toUpperCase()}
                  </div>
                </div>

                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>

                {event.deadline && (
                  <div className="event-deadline">
                    <span className="deadline-icon">⏰</span>
                    <span>Échéance : {event.deadline}</span>
                  </div>
                )}

                {event.stakeholders && (
                  <div className="event-stakeholders">
                    <span className="stakeholders-label">Parties concernées :</span>
                    <div className="stakeholders-list">
                      {event.stakeholders.map((stakeholder, index) => (
                        <span key={index} className="stakeholder-tag">
                          {stakeholder}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="event-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => setActiveEvent(event)}
                  >
                    Traiter cet événement
                  </button>
                  <button className="btn-secondary">
                    Reporter (1 jour)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="event-decision-modal">
          <div className="modal-overlay">
            <div className="decision-container">
              <div className="decision-header">
                <button 
                  className="close-btn"
                  onClick={() => {
                    setActiveEvent(null);
                    setSelectedOption(null);
                  }}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="event-context">
                  <h2>{activeEvent.title}</h2>
                  <p>{activeEvent.description}</p>
                  {activeEvent.deadline && (
                    <div className="deadline-warning">
                      ⚠️ Décision requise avant : {activeEvent.deadline}
                    </div>
                  )}
                </div>
              </div>

              <div className="decision-options">
                <h3>Options disponibles</h3>
                <div className="options-grid">
                  {activeEvent.options.map(option => (
                    <div 
                      key={option.id} 
                      className={`option-card ${selectedOption === option.id ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <div className="option-header">
                        <h4>{option.title}</h4>
                        {option.requirements && (
                          <div className="option-requirements">
                            {option.requirements.politicalCapital && (
                              <span className="requirement">
                                💼 {option.requirements.politicalCapital} pts politique
                              </span>
                            )}
                            {option.requirements.popularity && (
                              <span className="requirement">
                                📊 {option.requirements.popularity}% popularité
                              </span>
                            )}
                            {option.requirements.budget && (
                              <span className="requirement">
                                💰 {option.requirements.budget}M€ budget
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="option-description">{option.description}</p>

                      <div className="option-consequences">
                        <div className="consequences-section positive">
                          <h5>✅ Conséquences positives</h5>
                          <ul>
                            {option.consequences.positive.map((consequence, index) => (
                              <li key={index}>{consequence}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="consequences-section negative">
                          <h5>❌ Risques et conséquences négatives</h5>
                          <ul>
                            {option.consequences.negative.map((consequence, index) => (
                              <li key={index}>{consequence}</li>
                            ))}
                          </ul>
                        </div>

                        {option.consequences.uncertain.length > 0 && (
                          <div className="consequences-section uncertain">
                            <h5>❓ Incertitudes</h5>
                            <ul>
                              {option.consequences.uncertain.map((consequence, index) => (
                                <li key={index}>{consequence}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="impact-preview">
                        <h5>Impact prévu</h5>
                        <div className="impact-indicators">
                          <div className="impact-item">
                            <span className="impact-label">Popularité</span>
                            <span className={`impact-value ${option.impact.popularity >= 0 ? 'positive' : 'negative'}`}>
                              {option.impact.popularity > 0 ? '+' : ''}{option.impact.popularity}
                            </span>
                          </div>
                          <div className="impact-item">
                            <span className="impact-label">Économie</span>
                            <span className={`impact-value ${option.impact.economy >= 0 ? 'positive' : 'negative'}`}>
                              {option.impact.economy > 0 ? '+' : ''}{option.impact.economy}
                            </span>
                          </div>
                          <div className="impact-item">
                            <span className="impact-label">Stabilité</span>
                            <span className={`impact-value ${option.impact.stability >= 0 ? 'positive' : 'negative'}`}>
                              {option.impact.stability > 0 ? '+' : ''}{option.impact.stability}
                            </span>
                          </div>
                          <div className="impact-item">
                            <span className="impact-label">International</span>
                            <span className={`impact-value ${option.impact.international >= 0 ? 'positive' : 'negative'}`}>
                              {option.impact.international > 0 ? '+' : ''}{option.impact.international}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOption && (
                <div className="decision-confirmation">
                  <div className="confirmation-warning">
                    <h4>⚠️ Confirmation de décision</h4>
                    <p>Cette décision aura des conséquences durables sur votre mandat. Êtes-vous certain de votre choix ?</p>
                  </div>
                  <div className="confirmation-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => setSelectedOption(null)}
                    >
                      Reconsidérer
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={handleConfirmDecision}
                    >
                      Confirmer la décision
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};