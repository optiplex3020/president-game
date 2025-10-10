import React, { useState, useEffect } from 'react';
import { useGameEngine } from '../src/systems/GameEngine';
import type { GameEvent, Decision } from '../src/types/game';
import '../src/styles/InteractiveGameSystem.css';

interface InteractiveGameSystemProps {
  onDecision?: (decisionId: string, choiceId: string) => void;
}

export const InteractiveGameSystem: React.FC<InteractiveGameSystemProps> = ({ onDecision }) => {
  const { 
    gameState, 
    currentEvents, 
    pendingDecisions, 
    makeDecision, 
    processEvent, 
    advanceTime,
    triggerEvent
  } = useGameEngine();

  const [selectedEvent] = useState<GameEvent | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastConsequence, setLastConsequence] = useState<string | null>(null);

  // Simulation automatique du temps (optionnel)
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  useEffect(() => {
    if (autoAdvance) {
      const interval = setInterval(() => {
        advanceTime(1); // Avancer d'1 heure toutes les 10 secondes
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [autoAdvance, advanceTime]);

  // Déclencher quelques événements de test au démarrage
  useEffect(() => {
    const testEvents: GameEvent[] = [
      {
        id: 'transport_strike',
        title: 'Grève générale des transports',
        description: 'Les syndicats RATP et SNCF appellent à une grève générale de 48h pour protester contre la réforme des retraites. Plus de 80% des services sont perturbés.',
        category: 'social',
        severity: 'major',
        triggerDate: new Date(),
        requiresDecision: true,
        timeLimit: 24,
        options: [
          {
            id: 'negotiate',
            label: 'Négocier avec les syndicats',
            description: 'Organiser une table ronde d\'urgence avec les représentants syndicaux',
            consequences: { popularity: 3, politicalCapital: -10, socialStability: 15 },
            effects: {
              popularity: { overall: 1, byDemographic: { working_class: 3, middle_class: 1 } },
              social: { unrest: -12 },
              economy: { gdpGrowth: -0.1, budget: { balance: -800000000 } },
              international: { diplomaticRelations: { germany: 1 } },
              politicalCapitalDelta: -5
            },
            consequence: 'Les négociations aboutissent à un compromis. La grève est suspendue mais des concessions sont faites.',
            immediateEffects: ['Annulation de la grève', 'Réunion d\'urgence programmée'],
            delayedEffects: [
              { type: 'popularity', value: 2, delay: 24 },
              { afterHours: 48, effects: { social: { unrest: -5 }, popularity: { overall: 2 } } }
            ]
          },
          {
            id: 'firm',
            label: 'Maintenir la fermeté',
            description: 'Refuser toute négociation et maintenir la réforme telle que prévue',
            consequences: {
              popularity: -5,
              politicalCapital: 5,
              socialStability: -10
            },
            politicalCost: 15,
            consequence: 'La grève se durcit. L\'opinion se divise sur la fermeté du gouvernement.',
            effects: {
              social: { unrest: 10 },
              popularity: { overall: -2, byDemographic: { young_adults: -4, seniors: 1 } },
              international: { diplomaticRelations: { germany: -1 } },
              politicalCapitalDelta: 5
            },
            immediateEffects: ['Durcissement du mouvement social', 'Soutien de la droite'],
            delayedEffects: [
              { type: 'social_unrest', value: 10, delay: 24 }
            ]
          },
          {
            id: 'minimum_service',
            label: 'Imposer un service minimum',
            description: 'Réquisitionner une partie des transports pour assurer un service minimum',
            consequences: {
              popularity: -2,
              politicalCapital: -5,
              socialStability: 5
            },
            politicalCost: 10,
            consequence: 'Le service minimum apaise partiellement la situation mais crée des tensions juridiques.',
            immediateEffects: ['Service partiel rétabli', 'Débat sur le droit de grève'],
            effects: {
              social: { unrest: -4 },
              popularity: { overall: -1, byDemographic: { middle_class: 2 } },
              economy: { gdpGrowth: -0.05 }
            },
            outcomes: [
              { chance: 0.2, description: 'Recours rejeté par le juge administratif.', effects: { social: { unrest: 6 }, popularity: { overall: -2 } } },
              { chance: 0.8, description: 'Recours validé temporairement.', effects: { social: { unrest: -3 }, popularity: { overall: 1 } } }
            ]
          }
        ]
      },
      {
        id: 'european_summit',
        title: 'Sommet européen extraordinaire',
        description: 'L\'Allemagne propose une réforme majeure des traités européens. Votre position influencera l\'avenir de l\'Europe.',
        category: 'international',
        severity: 'major',
        triggerDate: new Date(),
        requiresDecision: true,
        timeLimit: 72,
        options: [
          {
            id: 'support_fully',
            label: 'Soutenir pleinement',
            description: 'Appuyer la proposition allemande sans réserve',
            consequences: { popularity: -3, politicalCapital: 10, economicImpact: 5 },
            effects: {
              international: { diplomaticRelations: { germany: 5, usa: 2 }, europeanInfluence: 3 },
              economy: { gdpGrowth: 0.1 },
              popularity: { overall: -1, byDemographic: { upper_class: 2, working_class: -3 } },
              politicalCapitalDelta: 5
            },
            consequence: 'La France renforce son influence européenne mais fait face à des critiques souverainistes.',
            immediateEffects: ['Alliance renforcée avec l\'Allemagne', 'Critiques de l\'opposition']
          },
          {
            id: 'conditional_support',
            label: 'Soutien conditionnel',
            description: 'Négocier des amendements favorables à la France',
            consequences: { popularity: 2, politicalCapital: 5, economicImpact: 2 },
            effects: {
              international: { diplomaticRelations: { germany: 2 }, europeanInfluence: 1 },
              economy: { gdpGrowth: 0.05 },
              politicalCapitalDelta: 2
            },
            consequence: 'Position équilibrée qui satisfait l\'opinion publique française.',
            immediateEffects: ['Négociations entamées', 'Soutien de l\'opinion publique']
          },
          {
            id: 'oppose',
            label: 'S\'opposer fermement',
            description: 'Rejeter la proposition et défendre la souveraineté française',
            consequences: { popularity: 5, politicalCapital: -10, economicImpact: -3 },
            effects: {
              international: { diplomaticRelations: { germany: -8, uk: 1 }, europeanInfluence: -4 },
              economy: { gdpGrowth: -0.1 },
              politicalCapitalDelta: -8
            },
            consequence: 'Position populaire en France mais qui isole le pays en Europe.',
            immediateEffects: ['Tensions avec l\'Allemagne', 'Soutien souverainiste']
          }
        ]
      }
    ];

    // Déclencher les événements avec un délai pour éviter l'overload
    testEvents.forEach((event, index) => {
      setTimeout(() => {
        triggerEvent(event);
      }, index * 2000);
    });
  }, [triggerEvent]);

  const handleMakeDecision = async (decisionId: string, choiceId: string) => {
    setIsProcessing(true);
    try {
      const consequence = await makeDecision(decisionId, choiceId);
      setLastConsequence(consequence.description);
      setSelectedDecision(null);
      
      // Callback pour le parent
      if (onDecision) {
        onDecision(decisionId, choiceId);
      }
    } catch (error) {
      console.error('Erreur lors de la décision:', error);
      alert(`Erreur: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessEvent = async (event: GameEvent) => {
    setIsProcessing(true);
    try {
      await processEvent(event.id);
      // setSelectedEvent(null); - Not needed since selectedEvent is unused
    } catch (error) {
      console.error('Erreur lors du traitement de l\'événement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)} jour(s)`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes} min`;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="interactive-game-system">
      {/* Contrôles de jeu */}
      <div className="game-controls">
        <div className="time-controls">
          <button 
            onClick={() => advanceTime(1)} 
            className="btn-secondary"
            disabled={isProcessing}
          >
            +1 heure
          </button>
          <button 
            onClick={() => advanceTime(6)} 
            className="btn-secondary"
            disabled={isProcessing}
          >
            +6 heures
          </button>
          <button 
            onClick={() => advanceTime(24)} 
            className="btn-secondary"
            disabled={isProcessing}
          >
            +1 jour
          </button>
          <label className="auto-advance">
            <input 
              type="checkbox" 
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
            />
            Avancement automatique
          </label>
        </div>

        <div className="game-status">
          <div className="status-item">
            <span className="status-label">Date actuelle:</span>
            <span className="status-value">{formatDate(gameState.currentDate)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Capital politique:</span>
            <span className="status-value">{gameState.politicalCapital}/200</span>
          </div>
          <div className="status-item">
            <span className="status-label">Phase du mandat:</span>
            <span className="status-value">{gameState.mandate.phase}</span>
          </div>
        </div>
      </div>

      {/* Dernière conséquence */}
      {lastConsequence && (
        <div className="consequence-banner">
          <div className="consequence-content">
            <strong>Conséquence de votre décision :</strong>
            <p>{lastConsequence}</p>
          </div>
          <button 
            onClick={() => setLastConsequence(null)}
            className="close-btn"
          >
            ✕
          </button>
        </div>
      )}

      {/* Vue des décisions en attente */}
      {!selectedDecision && (
        <div className="decisions-overview">
          <h2>Décisions en attente ({pendingDecisions.length})</h2>
          <div className="decisions-grid">
            {pendingDecisions.map(decision => {
              const isUrgent = new Date(decision.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;
              
              return (
                <div 
                  key={decision.id} 
                  className={`decision-card ${decision.priority} ${isUrgent ? 'urgent' : ''}`}
                  onClick={() => setSelectedDecision(decision)}
                >
                  <div className="decision-header">
                    <div className={`decision-priority ${decision.priority}`}>
                      {decision.priority === 'urgent' && '🚨 URGENT'}
                      {decision.priority === 'normal' && '⚠️ Important'}
                      {decision.priority === 'low' && '📋 Standard'}
                    </div>
                    <div className="decision-deadline">
                      ⏰ {getTimeRemaining(decision.deadline)}
                    </div>
                  </div>
                  
                  <h3 className="decision-title">{decision.title}</h3>
                  <p className="decision-description">{decision.description}</p>
                  
                  <div className="decision-category">
                    <span className={`category-tag ${decision.category}`}>
                      {decision.category === 'social' && '👥 Social'}
                      {decision.category === 'economic' && '💰 Économique'}
                      {decision.category === 'international' && '🌍 International'}
                      {decision.category === 'domestic' && '🏛️ Intérieur'}
                      {decision.category === 'crisis' && '🚨 Crise'}
                    </span>
                  </div>
                  
                  <div className="decision-options-count">
                    {decision.options.length} option(s) disponible(s)
                  </div>
                </div>
              );
            })}
            
            {pendingDecisions.length === 0 && (
              <div className="no-decisions">
                <p>Aucune décision en attente</p>
                <p>Le calme avant la tempête... ou la routine présidentielle ?</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vue détaillée d'une décision */}
      {selectedDecision && (
        <div className="decision-detail">
          <div className="decision-detail-header">
            <button 
              onClick={() => setSelectedDecision(null)}
              className="back-btn"
            >
              ← Retour aux décisions
            </button>
            
            <div className="decision-info">
              <h2>{selectedDecision.title}</h2>
              <div className="decision-meta">
                <span className={`priority-badge ${selectedDecision.priority}`}>
                  {selectedDecision.priority}
                </span>
                <span className="deadline-info">
                  Échéance : {getTimeRemaining(selectedDecision.deadline)}
                </span>
              </div>
            </div>
          </div>

          <div className="decision-content">
            <div className="decision-description">
              <p>{selectedDecision.description}</p>
              {selectedDecision.backgroundInfo && (
                <div className="background-info">
                  <strong>Contexte :</strong>
                  <p>{selectedDecision.backgroundInfo}</p>
                </div>
              )}
            </div>

            <div className="decision-options">
              <h3>Options disponibles :</h3>
              <div className="options-grid">
                {selectedDecision.options.map(option => {
                  const canAfford = !option.politicalCost || gameState.politicalCapital >= option.politicalCost;
                  const meetsRequirements = !option.requirements || 
                    ((!option.requirements.minPoliticalCapital || gameState.politicalCapital >= option.requirements.minPoliticalCapital) &&
                     (!option.requirements.minPopularity || gameState.indicators.popularity.overall >= option.requirements.minPopularity));
                  
                  const isEnabled = canAfford && meetsRequirements && !isProcessing;
                  
                  return (
                    <div key={option.id} className={`option-card ${!isEnabled ? 'disabled' : ''}`}>
                      <div className="option-header">
                        <h4>{option.label}</h4>
                        {option.politicalCost && (
                          <div className={`political-cost ${!canAfford ? 'insufficient' : ''}`}>
                            Coût: {option.politicalCost} pts
                          </div>
                        )}
                      </div>
                      
                      <p className="option-description">{option.description}</p>
                      
                      {option.consequences && (
                        <div className="option-consequences">
                          <strong>Conséquences prévisibles :</strong>
                          <ul>
                            {option.consequences.popularity && (
                              <li className={option.consequences.popularity > 0 ? 'positive' : 'negative'}>
                                Popularité : {option.consequences.popularity > 0 ? '+' : ''}{option.consequences.popularity}%
                              </li>
                            )}
                            {option.consequences.politicalCapital && (
                              <li className={option.consequences.politicalCapital > 0 ? 'positive' : 'negative'}>
                                Capital politique : {option.consequences.politicalCapital > 0 ? '+' : ''}{option.consequences.politicalCapital}
                              </li>
                            )}
                            {option.consequences.socialStability && (
                              <li className={option.consequences.socialStability > 0 ? 'positive' : 'negative'}>
                                Stabilité sociale : {option.consequences.socialStability > 0 ? '+' : ''}{option.consequences.socialStability}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {!meetsRequirements && (
                        <div className="requirements-warning">
                          ⚠️ Conditions non remplies
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleMakeDecision(selectedDecision.id, option.id)}
                        disabled={!isEnabled}
                        className={`option-btn ${isEnabled ? 'enabled' : 'disabled'}`}
                      >
                        {isProcessing ? 'Traitement...' : 'Choisir cette option'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Événements en cours */}
      <div className="current-events">
        <h3>Événements récents ({currentEvents.length})</h3>
        <div className="events-list">
          {currentEvents.slice(0, 5).map(event => (
            <div key={event.id} className={`event-item ${event.severity}`}>
              <div className="event-header">
                <span className={`event-category ${event.category}`}>
                  {event.category}
                </span>
                <span className={`event-severity ${event.severity}`}>
                  {event.severity}
                </span>
              </div>
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              
              {event.requiresDecision ? (
                <div className="event-status decision">
                  ⚖️ Décision créée
                </div>
              ) : (
                <button
                  onClick={() => handleProcessEvent(event)}
                  disabled={isProcessing}
                  className="btn-secondary"
                >
                  Traiter l'événement
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
