import React from 'react';

export const TestApp: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>
          🏛️ Test App Fonctionnelle !
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Si tu vois ce message, l'application React fonctionne correctement.
        </p>
        <button
          onClick={() => alert('Bouton fonctionnel !')}
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Test Interaction
        </button>
        
        <div style={{ marginTop: '2rem', fontSize: '1rem', opacity: 0.8 }}>
          <p>✅ React : Fonctionnel</p>
          <p>✅ TypeScript : Fonctionnel</p>
          <p>✅ CSS : Fonctionnel</p>
          <p>✅ Événements : Fonctionnel</p>
        </div>
      </div>
    </div>
  );
};