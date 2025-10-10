import React, { useState } from 'react';

export const UltraSimpleDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [popularity, setPopularity] = useState(42);
  const [politicalCapital, setPoliticalCapital] = useState(100);
  
  const [events] = useState([
    {
      id: '1',
      title: '🚇 Grève des transports',
      description: 'Les syndicats RATP appellent à une grève générale. Comment réagissez-vous ?',
      options: [
        { id: 'negotiate', label: 'Négocier', effect: '+3 popularité, -10 capital' },
        { id: 'firm', label: 'Rester ferme', effect: '-5 popularité, +5 capital' }
      ]
    },
    {
      id: '2', 
      title: '🌍 Sommet européen',
      description: 'L\'UE propose une nouvelle réforme. Quelle position adopter ?',
      options: [
        { id: 'support', label: 'Soutenir', effect: '+2 popularité, +5 capital' },
        { id: 'oppose', label: 'S\'opposer', effect: '+3 popularité, -5 capital' }
      ]
    }
  ]);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showDecision, setShowDecision] = useState(false);
  const [lastDecision, setLastDecision] = useState('');

  const handleDecision = (eventId: string, optionId: string) => {
    const event = events.find(e => e.id === eventId);
    const option = event?.options.find(o => o.id === optionId);
    
    if (option) {
      // Appliquer les effets (simulation simple)
      if (option.effect.includes('+3 popularité')) setPopularity(p => Math.min(100, p + 3));
      if (option.effect.includes('-5 popularité')) setPopularity(p => Math.max(0, p - 5));
      if (option.effect.includes('+5 capital')) setPoliticalCapital(p => Math.min(200, p + 5));
      if (option.effect.includes('-10 capital')) setPoliticalCapital(p => Math.max(0, p - 10));
      
      setLastDecision(`Vous avez choisi : "${option.label}" - ${option.effect}`);
      setShowDecision(false);
      
      // Passer à l'événement suivant
      setTimeout(() => {
        setCurrentEventIndex(i => (i + 1) % events.length);
      }, 2000);
    }
  };

  const advanceTime = () => {
    const newTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // +1 heure
    setCurrentTime(newTime);
  };

  const currentEvent = events[currentEventIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🏛️ Bureau Présidentiel</h1>
        <p style={{ margin: '1rem 0', opacity: 0.8 }}>
          {currentTime.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </header>

      {/* Indicateurs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.2)',
          borderRadius: '15px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>📈 Popularité</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{popularity}%</div>
        </div>
        
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          borderRadius: '15px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>⚡ Capital Politique</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{politicalCapital} pts</div>
        </div>
      </div>

      {/* Dernière décision */}
      {lastDecision && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          borderRadius: '15px',
          padding: '1rem',
          marginBottom: '2rem',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <strong>Conséquence :</strong> {lastDecision}
        </div>
      )}

      {/* Contrôles de temps */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '1rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <button
          onClick={advanceTime}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          ⏰ Avancer d'1 heure
        </button>
        
        <button
          onClick={() => setShowDecision(true)}
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🚨 Nouvel Événement
        </button>
      </div>

      {/* Événement actuel */}
      {showDecision && currentEvent && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '2rem',
          border: '2px solid rgba(239, 68, 68, 0.5)'
        }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.8rem' }}>
            {currentEvent.title}
          </h2>
          <p style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', lineHeight: 1.6 }}>
            {currentEvent.description}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {currentEvent.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleDecision(currentEvent.id, option.id)}
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1.5rem',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {option.label}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {option.effect}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!showDecision && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3>🎮 Comment jouer</h3>
          <p>Cliquez sur "Nouvel Événement" pour faire face à une situation politique. Chaque décision affecte votre popularité et votre capital politique.</p>
        </div>
      )}
    </div>
  );
};