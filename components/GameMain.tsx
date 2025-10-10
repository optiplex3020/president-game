import React, { useState } from 'react';
import { PresidentialDashboard } from './PresidentialDashboardFixed';
import { InitGameScreen } from './InitGameScreen';

export const GameMain: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleGameStart = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return <InitGameScreen onComplete={handleGameStart} />;
  }

  return <PresidentialDashboard />;
};
