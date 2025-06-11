import React from 'react';
import { useCrisisSystem } from '../src/store/crisisSystem';
import type { Crisis, CrisisSolution } from '../src/types/crisis';
import '../src/styles/CrisisView.css';

interface CrisisViewProps {
  crisis: Crisis;
}

export const CrisisView: React.FC<CrisisViewProps> = ({ crisis }) => {
  const handleCrisis = useCrisisSystem(state => state.handleCrisis);

  return (
    <div className="crisis-card">
      <div className="crisis-header">
        <div className="crisis-type">{crisis.type}</div>
        <div className="crisis-severity">
          <span>Sévérité:</span>
          <div className="severity-bar">
            <div 
              className="severity-fill"
              style={{ width: `${crisis.severity}%` }}
            />
          </div>
        </div>
      </div>

      <h2 className="crisis-title">{crisis.title}</h2>
      <p className="crisis-description">{crisis.description}</p>

      <div className="crisis-solutions">
        {crisis.solutions.map((solution: CrisisSolution, index) => (
          <button
            key={index}
            onClick={() => handleCrisis(crisis.id, index)}
            className="solution-button"
          >
            <span className="solution-text">{solution.text}</span>
            <span className="solution-cost">-{solution.cost}M€</span>
          </button>
        ))}
      </div>
    </div>
  );
};