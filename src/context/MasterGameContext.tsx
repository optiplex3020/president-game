import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useMasterGameEngine } from '../systems/MasterGameEngine';
import { useParliamentEngine } from '../systems/ParliamentEngine';
import { useOpinionEngine } from '../systems/OpinionEngine';
import { useCharacterEngine } from '../systems/CharacterEngine';
import { useMediaEngine } from '../systems/MediaEngine';

type MasterEngineState = ReturnType<typeof useMasterGameEngine.getState>;
type ParliamentState = ReturnType<typeof useParliamentEngine.getState>;
type OpinionState = ReturnType<typeof useOpinionEngine.getState>;
type CharacterState = ReturnType<typeof useCharacterEngine.getState>;
type MediaState = ReturnType<typeof useMediaEngine.getState>;

type MasterGameContextValue = {
  master: MasterEngineState;
  parliament: ParliamentState;
  opinion: OpinionState;
  characters: CharacterState;
  media: MediaState;
  ready: boolean;
};

const MasterGameContext = createContext<MasterGameContextValue | null>(null);

export const MasterGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialized = useMasterGameEngine(state => state.initialized);
  const initializeGame = useMasterGameEngine(state => state.initializeGame);

  useEffect(() => {
    if (!initialized) {
      initializeGame();
    }
  }, [initialized, initializeGame]);

  const master = useMasterGameEngine();
  const parliament = useParliamentEngine();
  const opinion = useOpinionEngine();
  const characters = useCharacterEngine();
  const media = useMediaEngine();

  const value = useMemo<MasterGameContextValue>(
    () => ({
      master,
      parliament,
      opinion,
      characters,
      media,
      ready: initialized
    }),
    [master, parliament, opinion, characters, media, initialized]
  );

  return (
    <MasterGameContext.Provider value={value}>
      {children}
    </MasterGameContext.Provider>
  );
};

export const useMasterGame = (): MasterGameContextValue => {
  const context = useContext(MasterGameContext);
  if (!context) {
    throw new Error('useMasterGame must be used within a MasterGameProvider');
  }
  return context;
};

