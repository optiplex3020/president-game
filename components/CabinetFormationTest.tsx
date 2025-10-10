import React, { useState, useEffect } from 'react';
import { useCabinetFormationStore } from '../src/store/cabinetFormationStore';

interface CabinetFormationTestProps {
  onComplete: () => void;
}

export const CabinetFormationTest: React.FC<CabinetFormationTestProps> = ({ onComplete }) => {
  const [debugInfo, setDebugInfo] = useState<string>('Initialisation...');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Récupération du store avec gestion d'erreur
  let storeData;
  try {
    storeData = useCabinetFormationStore();
    console.log('Store data:', storeData);
  } catch (error) {
    console.error('Erreur lors de l\'accès au store:', error);
    return (
      <div style={{ padding: '2rem', color: 'white', backgroundColor: '#1e293b' }}>
        <h1>Erreur Store</h1>
        <p>Impossible d'accéder au store: {error?.toString()}</p>
      </div>
    );
  }

  const { availableCandidates, selectedMinisters, appointMinister } = storeData;

  useEffect(() => {
    console.log('=== CABINET FORMATION TEST DEBUG ===');
    console.log('availableCandidates:', availableCandidates);
    console.log('selectedMinisters:', selectedMinisters);
    console.log('appointMinister function:', typeof appointMinister);

    // Mise à jour des informations de debug
    const info = `
      Candidats disponibles: ${availableCandidates?.length || 0}
      Ministres sélectionnés: ${Object.keys(selectedMinisters || {}).length}
      Fonction appointMinister: ${typeof appointMinister}
    `;
    setDebugInfo(info);
  }, [availableCandidates, selectedMinisters, appointMinister]);

  const roles = [
    { id: 'interieur', name: 'Ministre de l\'Intérieur' },
    { id: 'economie', name: 'Ministre de l\'Économie' }
  ];

  const handleRoleClick = (roleId: string) => {
    console.log('Clic sur rôle:', roleId);
    setSelectedRole(roleId);
  };

  const handleNominate = async (candidate: any) => {
    if (selectedRole && appointMinister) {
      try {
        console.log('Tentative de nomination:', { role: selectedRole, candidate: candidate.name });
        await appointMinister(selectedRole, candidate);
        console.log('Nomination réussie');
        setSelectedRole(null);
      } catch (error) {
        console.error('Erreur nomination:', error);
        alert(`Erreur de nomination: ${error}`);
      }
    }
  };

  const handleBack = () => {
    console.log('Retour à la liste des rôles');
    setSelectedRole(null);
  };

  // Interface de test simple
  return (
    <div style={{ 
      padding: '2rem', 
      color: 'white', 
      backgroundColor: '#1e293b',
      minHeight: '100vh'
    }}>
      <h1>Test Cabinet Formation</h1>
      
      {/* Informations de debug */}
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '1rem', 
        marginBottom: '2rem',
        borderRadius: '8px'
      }}>
        <h3>Informations de debug:</h3>
        <pre>{debugInfo}</pre>
      </div>

      {!selectedRole ? (
        // Vue des rôles
        <div>
          <h2>Sélectionner un rôle:</h2>
          {roles.map(role => (
            <div 
              key={role.id}
              onClick={() => handleRoleClick(role.id)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '2px solid transparent'
              }}
            >
              <h3>{role.name}</h3>
              {selectedMinisters?.[role.id] ? (
                <p>Assigné: {selectedMinisters[role.id].name}</p>
              ) : (
                <p>Position vacante</p>
              )}
            </div>
          ))}
          
          <button 
            onClick={onComplete}
            style={{
              background: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '2rem'
            }}
          >
            Terminer le test
          </button>
        </div>
      ) : (
        // Vue des candidats
        <div>
          <button 
            onClick={handleBack}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
          >
            ← Retour
          </button>
          
          <h2>Candidats pour {roles.find(r => r.id === selectedRole)?.name}</h2>
          
          {availableCandidates && availableCandidates.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {availableCandidates.slice(0, 6).map(candidate => (
                <div 
                  key={candidate.id}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4>{candidate.name}</h4>
                    <p>{candidate.party}</p>
                    <p>Compétence: {candidate.competence}</p>
                  </div>
                  <button 
                    onClick={() => handleNominate(candidate)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Nommer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              padding: '2rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p>Aucun candidat disponible</p>
              <p>Vérifiez l'initialisation du store</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};