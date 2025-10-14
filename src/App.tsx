import React from 'react';
import { GameMain } from '../components/GameMain';
import { MasterGameProvider } from './context/MasterGameContext';

const App: React.FC = () => {
  return (
    <MasterGameProvider>
      <GameMain />
    </MasterGameProvider>
  );
};

export default App;
