import React, { useState } from 'react';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';
import '../src/styles/CabinetFormationBasic.css';

interface CabinetFormationBasicProps {
  onComplete: () => void;
}

export const CabinetFormationBasic: React.FC<CabinetFormationBasicProps> = ({ onComplete }) => {
  const { 
    availableCandidates, 
    selectedMinisters, 
    appointMinister
  } = useCabinetFormationStore();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Rôles ministériels de base
  const roles = [
    { id: 'interior', name: 'Ministre de l\'Intérieur' },
    { id: 'economy', name: 'Ministre de l\'Économie' },
    { id: 'foreign_affairs', name: 'Ministre des Affaires étrangères' },
    { id: 'justice', name: 'Garde des Sceaux' },
    { id: 'defense', name: 'Ministre des Armées' },
    { id: 'education', name: 'Ministre de l\'Éducation' },
    { id: 'health', name: 'Ministre de la Santé' },
    { id: 'ecology', name: 'Ministre de l\'Écologie' }
  ];

  const handleNominate = async (candidate: any) => {
    if (selectedRole) {
      try {
        await appointMinister(selectedRole, candidate);
        setSelectedRole(null);
      } catch (error) {
        console.error('Erreur nomination:', error);
      }
    }
  };

  const filledRoles = Object.keys(selectedMinisters).length;
  const totalRoles = roles.length;
  const isComplete = filledRoles === totalRoles;

  return (
    <div className="cabinet-formation-basic">
      <div className="header">
        <h1>Formation du Gouvernement</h1>
        <div className="progress">
          Postes pourvus: {filledRoles}/{totalRoles}
        </div>
      </div>

      {!selectedRole ? (
        <div className="roles-section">
          <div className="roles-list">
            {roles.map(role => {
              const minister = selectedMinisters[role.id];
              return (
                <div 
                  key={role.id} 
                  className={`role-item ${minister ? 'filled' : 'empty'}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <h3>{role.name}</h3>
                  {minister ? (
                    <div className="minister-info">
                      <p><strong>{minister.name}</strong></p>
                      <p>{minister.party} • Compétence: {minister.competence}</p>
                    </div>
                  ) : (
                    <p className="empty-text">Cliquer pour nommer</p>
                  )}
                </div>
              );
            })}
          </div>

          {isComplete && (
            <div className="complete-section">
              <h2>Gouvernement complet !</h2>
              <button className="complete-btn" onClick={onComplete}>
                Démarrer le mandat
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="candidates-section">
          <div className="section-header">
            <button onClick={() => setSelectedRole(null)} className="back-btn">
              ← Retour
            </button>
            <h2>Sélectionner un candidat pour {roles.find(r => r.id === selectedRole)?.name}</h2>
          </div>

          <div className="candidates-list">
            {availableCandidates && availableCandidates.length > 0 ? (
              availableCandidates.slice(0, 12).map(candidate => (
                <div key={candidate.id} className="candidate-item">
                  <div className="candidate-info">
                    <h4>{candidate.name}</h4>
                    <p>{candidate.party}</p>
                    <p>Compétence: {candidate.competence}</p>
                    <p>Loyauté: {candidate.personality?.loyalty || 'N/A'}</p>
                  </div>
                  <button 
                    onClick={() => handleNominate(candidate)}
                    className="nominate-btn"
                  >
                    Nommer
                  </button>
                </div>
              ))
            ) : (
              <div className="no-candidates">
                <p>Aucun candidat disponible</p>
                <p>Vérifiez que l'initialisation du jeu s'est bien déroulée</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};