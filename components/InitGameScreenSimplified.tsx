import React, { useState } from 'react';
import '../src/styles/InitGameScreenModern.css';

export const InitGameScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState<'personal' | 'party' | 'confirmation'>('personal');
  const [playerInfo, setPlayerInfo] = useState({
    firstName: '',
    lastName: '',
    age: 30,
    previousRole: '',
    party: 'Renaissance' // Parti par défaut
  });

  const steps = [
    { id: 'personal', name: 'Informations' },
    { id: 'party', name: 'Parti' },
    { id: 'confirmation', name: 'Confirmation' }
  ];

  const parties = [
    { id: 'renaissance', name: 'Renaissance', description: 'Centrisme européen et libéral' },
    { id: 'rn', name: 'Rassemblement National', description: 'Nationalisme et souveraineté' },
    { id: 'lfi', name: 'La France Insoumise', description: 'Gauche populaire et écologique' },
    { id: 'lr', name: 'Les Républicains', description: 'Droite traditionnelle' },
    { id: 'ps', name: 'Parti Socialiste', description: 'Social-démocratie' },
    { id: 'eelv', name: 'Europe Écologie Les Verts', description: 'Écologie politique' }
  ];

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('party');
  };

  const handlePartySelect = (partyId: string) => {
    setPlayerInfo(prev => ({ ...prev, party: partyId }));
    setStep('confirmation');
  };

  const handleFinalConfirmation = () => {
    console.log('Jeu initialisé avec:', playerInfo);
    onComplete();
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
                    required
                  >
                    <option value="">Sélectionnez une fonction</option>
                    <option value="minister">Ministre</option>
                    <option value="deputy">Député</option>
                    <option value="mayor">Maire</option>
                    <option value="businessman">Chef d'entreprise</option>
                    <option value="teacher">Professeur</option>
                    <option value="lawyer">Avocat</option>
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
            <div className="party-selection">
              <h2>Choisissez votre parti politique</h2>
              <div className="parties-grid">
                {parties.map(party => (
                  <div 
                    key={party.id}
                    className="party-card"
                    onClick={() => handlePartySelect(party.id)}
                  >
                    <h3>{party.name}</h3>
                    <p>{party.description}</p>
                    <div className="party-select-btn">
                      Choisir ce parti
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="confirmation-section">
              <h2>Résumé de vos choix</h2>
              
              <div className="summary-card">
                <div className="summary-item">
                  <strong>Nom :</strong> {playerInfo.firstName} {playerInfo.lastName}
                </div>
                <div className="summary-item">
                  <strong>Âge :</strong> {playerInfo.age} ans
                </div>
                <div className="summary-item">
                  <strong>Fonction précédente :</strong> {
                    playerInfo.previousRole === 'minister' ? 'Ministre' :
                    playerInfo.previousRole === 'deputy' ? 'Député' :
                    playerInfo.previousRole === 'mayor' ? 'Maire' :
                    playerInfo.previousRole === 'businessman' ? 'Chef d\'entreprise' :
                    playerInfo.previousRole === 'teacher' ? 'Professeur' :
                    playerInfo.previousRole === 'lawyer' ? 'Avocat' :
                    playerInfo.previousRole
                  }
                </div>
                <div className="summary-item">
                  <strong>Parti :</strong> {parties.find(p => p.id === playerInfo.party)?.name}
                </div>
              </div>

              <div className="game-preview">
                <h3>🎮 Prêt à gouverner ?</h3>
                <p>Vous allez diriger la France avec :</p>
                <ul>
                  <li>⚡ <strong>Événements politiques</strong> réalistes à gérer</li>
                  <li>📊 <strong>Indicateurs</strong> de popularité et économiques</li>
                  <li>🏛️ <strong>Agenda présidentiel</strong> complet</li>
                  <li>⚖️ <strong>Décisions</strong> aux conséquences réelles</li>
                  <li>📈 <strong>Capital politique</strong> à gérer stratégiquement</li>
                </ul>
              </div>

              <button onClick={handleFinalConfirmation} className="btn-start">
                Commencer le mandat présidentiel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};