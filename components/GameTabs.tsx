import React, { useState } from 'react';
import GameCalendar from './GameCalendar';
import CouncilScreen from './CouncilScreen';
import ParliamentScreen from './ParliamentScreen';
import DiplomacyScreen from './DiplomacyScreen';
import EconomyScreen from './EconomyScreen';
import '../src/styles/GameTabs.css';

const GameTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = {
    calendar: { label: 'Agenda', icon: '📅', component: <GameCalendar /> },
    cabinet: { label: 'Cabinet', icon: '👥', component: <CouncilScreen /> },
    parliament: { label: 'Parlement', icon: '🏛️', component: <ParliamentScreen /> },
    diplomacy: { label: 'Diplomatie', icon: '🌍', component: <DiplomacyScreen /> },
    economy: { label: 'Économie', icon: '📊', component: <EconomyScreen /> }
  };

  return (
    <div className="game-interface">
      <nav className="game-tabs">
        {Object.entries(tabs).map(([key, { label, icon }]) => (
          <button 
            key={key}
            onClick={() => setActiveTab(key)}
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
          >
            <span className="tab-icon">{icon}</span>
            <span className="tab-label">{label}</span>
          </button>
        ))}
      </nav>

      <div className="tab-content">
        {tabs[activeTab as keyof typeof tabs].component}
      </div>
    </div>
  );
};

export default GameTabs;