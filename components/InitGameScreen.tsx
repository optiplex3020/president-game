import { useMemo, useState } from 'react';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import type { GameInitStep } from '../src/types/game';
import type { PoliticalParty } from '../src/types/party';
import type { PotentialMinister } from '../src/types/cabinet';
import type { PartyId } from '../src/types/parliament';
import { useMasterGame } from '../src/context/MasterGameContext';
import { PRIME_MINISTER_CANDIDATES } from '../src/data/primeMinisterCandidates';
import { PRESET_PARTIES } from '../src/store/gameState';
import { PartySelector } from './PartySelector';
import { PrimeMinisterSelectorAdvanced } from './PrimeMinisterSelectorAdvanced';
import { CabinetFormationRealistic } from './CabinetFormationRealistic';
import { ErrorBoundary } from './ErrorBoundary';
import { InitialContextScreen } from './InitialContextScreen';
import { ConfirmationScreen } from './ConfirmationScreen';
import '../src/styles/InitGameScreenModern.css';

export const InitGameScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<GameInitStep>('personal');
  const [playerInfo, setPlayerInfo] = useState({
    firstName: '',
    lastName: '',
    age: 30,
    previousRole: '',
    party: null as PoliticalParty | null
  });
  const [selectedPrimeMinister, setSelectedPrimeMinister] = useState<PotentialMinister | null>(null);

  const { parliament, opinion, media, ready: enginesReady } = useMasterGame();

  const initializeFormation = useCabinetFormationStore(state => state.initializeFormation);
  const selectedMinisters = useCabinetFormationStore(state => state.selectedMinisters);

  const selectedPartyId: PartyId | null = playerInfo.party ? (playerInfo.party.parliamentaryId ?? playerInfo.party.id) as PartyId : null;
  const fallbackSeatDistribution = useMemo(() => {
    return PRESET_PARTIES.reduce((acc, party) => {
      const id = party.parliamentaryId ?? party.id;
      acc[id] = party.seatsInParliament;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const seatDistribution = useMemo(() => {
    const groups = parliament?.parliamentaryGroups;
    if (!groups || Object.keys(groups).length === 0) {
      return {};
    }

    return Object.entries(groups).reduce((acc, [partyId, group]) => {
      acc[partyId] = group.seats;
      return acc;
    }, {} as Record<string, number>);
  }, [parliament?.parliamentaryGroups]);

  const steps = [
    { id: 'personal', name: 'Informations' },
    { id: 'party', name: 'Parti' },
    { id: 'prime-minister', name: 'Premier Ministre' },
    { id: 'cabinet', name: 'Gouvernement' },
    { id: 'context', name: 'Contexte Initial' },
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
      const partyId = (playerInfo.party.parliamentaryId ?? playerInfo.party.id) as string;
      const seats = Object.keys(seatDistribution).length > 0 ? seatDistribution : fallbackSeatDistribution;
      initializeFormation(partyId, seats, minister);
      setSelectedPrimeMinister(minister);
      setStep('cabinet');
    }
  };

  const handleCabinetComplete = () => {
    setStep('context');
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
            <PrimeMinisterSelectorAdvanced
              presidentParty={selectedPartyId ?? playerInfo.party.id}
              onSelect={handlePrimeMinisterSelect}
            />
          )}

          {step === 'cabinet' && (
            <ErrorBoundary>
              <CabinetFormationRealistic onComplete={handleCabinetComplete} />
            </ErrorBoundary>
          )}

          {step === 'context' && playerInfo.party && (
            <InitialContextScreen
              playerInfo={playerInfo}
              selectedParty={playerInfo.party}
              primeMinister={selectedPrimeMinister}
              enginesReady={enginesReady}
              onContinue={() => setStep('confirmation')}
            />
          )}

          {step === 'confirmation' && playerInfo.party && (
            <ConfirmationScreen
              playerInfo={playerInfo}
              selectedParty={playerInfo.party}
              primeMinister={selectedPrimeMinister}
              cabinetMinisters={selectedMinisters}
              onConfirm={onComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
};
