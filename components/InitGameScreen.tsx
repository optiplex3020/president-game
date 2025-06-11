import { useState } from 'react';
import { useGameState } from '../src/store/gameState';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import { getSeatDistribution } from '../src/utils/seatDistribution';
import type { GameInitStep, PoliticalParty } from '../src/types/game';
import type { PotentialMinister } from '../src/types/cabinet';
import { PartySelector } from './PartySelector';
import { PrimeMinisterSelector } from './PrimeMinisterSelector';
import { CabinetFormation } from './CabinetFormation';
import '../src/styles/InitGameScreen.css';

export const InitGameScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<GameInitStep>('personal');
  const [playerInfo, setPlayerInfo] = useState({
    firstName: '',
    lastName: '',
    age: 30,
    previousRole: '',
    party: null as PoliticalParty | null
  });

  const { initializeGame, setPlayerInfo: setPlayerInfoState } = useGameState();
  const { initializeFormation } = useCabinetFormationStore();

  const steps = [
    { id: 'personal', name: 'Informations' },
    { id: 'party', name: 'Parti' },
    { id: 'prime-minister', name: 'Premier Ministre' },
    { id: 'cabinet', name: 'Gouvernement' },
    { id: 'confirmation', name: 'Confirmation' }
  ];

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('party');
  };

  const handlePartySelect = (party: PoliticalParty) => {
    setPlayerInfo(prev => ({ ...prev, party }));
    setStep('prime-minister');
  };

  const handlePrimeMinisterSelect = (minister: PotentialMinister) => {
    if (playerInfo.party) {
      const seats = getSeatDistribution();
      initializeFormation(playerInfo.party.id, seats, minister);
      setStep('cabinet');
    }
  };

  const handleCabinetComplete = () => {
    setStep('confirmation');
  };

  return (
    <div className="init-game-screen">
      <div className="init-game-container">
        <div className="game-header">
          <h1 className="game-title">Bienvenue à l'Élysée</h1>
          <p className="game-subtitle">Préparez-vous à diriger la France</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="step-indicator">
          {steps.map((s, idx) => (
            <div key={s.id} className={`step ${step === s.id ? 'active' : ''}`}>
              <div className="step-number">{idx + 1}</div>
              <span className="step-name">{s.name}</span>
            </div>
          ))}
        </div>

        {/* Contenu selon l'étape */}
        <div className="game-content">
          {step === 'personal' && (
            <form onSubmit={handlePersonalSubmit} className="personal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    required
                    value={playerInfo.firstName}
                    onChange={e => setPlayerInfo(prev => ({ 
                      ...prev, 
                      firstName: e.target.value 
                    }))}
                  />
                </div>
                
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    required
                    value={playerInfo.lastName}
                    onChange={e => setPlayerInfo(prev => ({ 
                      ...prev, 
                      lastName: e.target.value 
                    }))}
                  />
                </div>

                <div className="form-group">
                  <label>Âge</label>
                  <input
                    type="number"
                    min="35"
                    max="80"
                    required
                    value={playerInfo.age}
                    onChange={e => setPlayerInfo(prev => ({ 
                      ...prev, 
                      age: parseInt(e.target.value) 
                    }))}
                  />
                </div>

                <div className="form-group">
                  <label>Fonction précédente</label>
                  <select
                    value={playerInfo.previousRole}
                    onChange={e => setPlayerInfo(prev => ({ 
                      ...prev, 
                      previousRole: e.target.value 
                    }))}
                  >
                    <option value="">Sélectionnez une fonction</option>
                    <option value="minister">Ministre</option>
                    <option value="deputy">Député</option>
                    <option value="mayor">Maire</option>
                    <option value="businessman">Chef d'entreprise</option>
                    <option value="teacher">Professeur</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-next">
                  Suivant
                  <span className="btn-icon">→</span>
                </button>
              </div>
            </form>
          )}

          {step === 'party' && (
            <PartySelector onSelect={handlePartySelect} />
          )}

          {step === 'prime-minister' && playerInfo.party && (
            <PrimeMinisterSelector 
              presidentParty={playerInfo.party.id}
              onSelect={handlePrimeMinisterSelect}
            />
          )}

          {step === 'cabinet' && (
            <CabinetFormation onComplete={handleCabinetComplete} />
          )}

          {step === 'confirmation' && (
            <div className="confirmation-section">
              <h2>Résumé de vos choix</h2>
              {/* ... affichage du résumé ... */}
              <button onClick={onComplete} className="btn-start">
                Commencer le mandat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};