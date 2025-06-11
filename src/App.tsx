import React from 'react';
import { InitGameScreen } from '../components/InitGameScreen';
import GameLayout from "../components/GameLayout";
import { useGameState } from './store/gameState';

const App: React.FC = () => {
  const { gameStarted } = useGameState();

  return (
    <div className="app">
      {!gameStarted ? (
        <InitGameScreen onComplete={() => useGameState.setState({ gameStarted: true })} />
      ) : (
        <GameLayout />
      )}
    </div>
  );
};

export default App;