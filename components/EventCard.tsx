// components/EventCard.tsx
import { useGameState } from '../src/store/gameState';
import { useCrisisSystem } from '../src/store/crisisSystem';
import React, { useState } from 'react';
import '../src/styles/EventCard.css';

interface Crisis {
  id: string;
  title: string;
  description: string;
  severity: number;
  solutions: Array<{
    action: string;
    effects: Record<string, number>;
    effectiveness: number;
  }>;
}

interface CrisisState {
  activeCrises: Crisis[];
  historicalCrises: Crisis[];
  handleCrisis: (crisisId: string, solutionIndex: number) => void;
  escalateCrisis: (crisisId: string) => void;
  addCrisis: (crisis: Crisis) => void;
  removeCrisis: (crisisId: string) => void;
}

// Nouveau composant DecisionImpact
const DecisionImpact: React.FC<{ effects: Record<string, number> }> = ({ effects }) => {
  return (
    <div className="decision-impacts">
      {Object.entries(effects).map(([key, value]) => (
        <div key={key} className="impact-item">
          <span className="impact-icon">
            {value > 0 ? '↗️' : '↘️'}
          </span>
          <span className="impact-label">{key}</span>
          <span className="impact-value">{value > 0 ? `+${value}` : value}</span>
        </div>
      ))}
    </div>
  );
};

const EventCard = () => {
  const { currentEvent, applyDecision, socialFeed } = useGameState();
  const [showImpacts, setShowImpacts] = useState<number | null>(null);

  if (!currentEvent) {
    return <div className="event-empty">Aucun événement en cours.</div>;
  }

  return (
    <div className="event-wrapper">
      <div className="event-header">
        <img src={currentEvent.image} alt="illustration" className="event-image" />
        <div className="event-badge">Événement en cours</div>
      </div>
      
      <div className="event-content">
        <h2 className="event-title">Situation actuelle</h2>
        <p className="event-description">{currentEvent.description}</p>
        
        <div className="event-options">
          {currentEvent.options.map((opt, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setShowImpacts(idx)}
              onMouseLeave={() => setShowImpacts(null)}
              onClick={() => applyDecision(currentEvent.id, idx)}
              className="event-button"
            >
              <span className="event-button-text">{opt.text}</span>
              <span className="event-button-arrow">→</span>
              {showImpacts === idx && (
                <DecisionImpact effects={opt.effects} />
              )}
            </button>
          ))}
        </div>
      </div>

      {socialFeed.length > 0 && (
        <div className="event-feedback">
          <div className="feedback-header">
            <span className="feedback-icon">📱</span>
            <h3 className="feedback-title">Réactions</h3>
          </div>
          <div className="feedback-content">
            {socialFeed[socialFeed.length - 1]}
          </div>
        </div>
      )}
    </div>
  );
};

const CrisisView: React.FC<{ crisis: Crisis }> = ({ crisis }) => {
  const handleCrisis = useCrisisSystem(state => state.handleCrisis);
  const handleCrisisEffect = useGameState(state => state.handleCrisisEffect);

  const onSolutionSelect = (solutionIndex: number) => {
    handleCrisis(crisis.id, solutionIndex);
    handleCrisisEffect(crisis.solutions[solutionIndex].effects);
  };

  return (
    <div className="crisis-card">
      <div className="crisis-header">
        <h3>{crisis.title}</h3>
        <span className={`crisis-severity ${crisis.severity > 50 ? 'high' : 'medium'}`}>
          Sévérité: {crisis.severity}%
        </span>
      </div>
      
      <p className="crisis-description">{crisis.description}</p>
      
      <div className="crisis-solutions">
        {crisis.solutions.map((solution, index) => (
          <button 
            key={index}
            onClick={() => onSolutionSelect(index)}
            className="crisis-solution-btn"
          >
            <span>{solution.action}</span>
            <DecisionImpact effects={solution.effects} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventCard;