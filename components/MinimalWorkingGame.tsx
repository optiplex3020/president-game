import React, { useState } from 'react';

// Composant d'initialisation minimal
const SimpleInit: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [name, setName] = useState('');
  
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '600px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>🏛️ Président - Le Jeu</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem' }}>
            Nom du Président :
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez votre nom"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '1.1rem',
              textAlign: 'center'
            }}
          />
        </div>

        <button
          onClick={() => name.trim() && onComplete()}
          disabled={!name.trim()}
          style={{
            background: name.trim() 
              ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              : 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '1rem 3rem',
            borderRadius: '15px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            textTransform: 'uppercase'
          }}
        >
          Commencer le Mandat
        </button>
      </div>
    </div>
  );
};

// Dashboard présidentiel complet
const PresidentialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'agenda'>('overview');
  const [currentTime] = useState(new Date());
  
  // États du jeu
  const [gameState, setGameState] = useState({
    popularity: 42,
    politicalCapital: 100,
    gdpGrowth: 1.2,
    unemployment: 7.4,
    socialUnrest: 25,
    dayInMandate: 1,
    phase: 'honeymoon'
  });

  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [showEventDecision, setShowEventDecision] = useState(false);
  const [lastDecision, setLastDecision] = useState('');

  // Événements politiques réalistes
  const politicalEvents = [
    {
      id: 'transport_strike',
      title: '🚇 Grève générale des transports',
      description: 'Les syndicats RATP et SNCF appellent à une grève générale de 48h pour protester contre la réforme des retraites. Plus de 80% des services sont perturbés.',
      options: [
        {
          id: 'negotiate',
          label: 'Négocier avec les syndicats',
          description: 'Organiser une table ronde d\'urgence',
          effects: { popularity: +3, politicalCapital: -10, socialUnrest: -15 }
        },
        {
          id: 'firm',
          label: 'Maintenir la fermeté',
          description: 'Refuser toute négociation',
          effects: { popularity: -5, politicalCapital: +5, socialUnrest: +10 }
        },
        {
          id: 'minimum_service',
          label: 'Imposer un service minimum',
          description: 'Réquisitionner les transports',
          effects: { popularity: -2, politicalCapital: -5, socialUnrest: +5 }
        }
      ]
    },
    {
      id: 'european_summit',
      title: '🌍 Sommet européen extraordinaire',
      description: 'L\'Allemagne propose une réforme majeure des traités européens. Votre position influencera l\'avenir de l\'Europe.',
      options: [
        {
          id: 'support',
          label: 'Soutenir pleinement',
          description: 'Appuyer la proposition allemande',
          effects: { popularity: -3, politicalCapital: +10, gdpGrowth: +0.2 }
        },
        {
          id: 'conditional',
          label: 'Soutien conditionnel',
          description: 'Négocier des amendements',
          effects: { popularity: +2, politicalCapital: +5, gdpGrowth: +0.1 }
        },
        {
          id: 'oppose',
          label: 'S\'opposer fermement',
          description: 'Défendre la souveraineté française',
          effects: { popularity: +5, politicalCapital: -10, gdpGrowth: -0.1 }
        }
      ]
    },
    {
      id: 'economic_crisis',
      title: '📉 Crise économique européenne',
      description: 'L\'inflation atteint des niveaux préoccupants. Les entreprises demandent des mesures d\'urgence.',
      options: [
        {
          id: 'stimulus',
          label: 'Plan de relance massif',
          description: 'Injecter 50 milliards d\'euros',
          effects: { popularity: +4, politicalCapital: -15, gdpGrowth: +0.5, unemployment: -1.2 }
        },
        {
          id: 'austerity',
          label: 'Mesures d\'austérité',
          description: 'Réduire les dépenses publiques',
          effects: { popularity: -8, politicalCapital: +5, gdpGrowth: -0.3, unemployment: +0.8 }
        },
        {
          id: 'targeted',
          label: 'Aides ciblées',
          description: 'Soutenir secteurs stratégiques',
          effects: { popularity: +1, politicalCapital: -5, gdpGrowth: +0.2, unemployment: -0.3 }
        }
      ]
    }
  ];

  const currentEvent = politicalEvents[currentEventIndex];

  // Actualités dynamiques basées sur l'état du jeu
  const generateNews = () => [
    {
      title: `Sondage : ${gameState.popularity}% de popularité pour le Président`,
      source: 'Le Figaro',
      impact: gameState.popularity > 45 ? 'positive' : 'negative',
      time: '09:30'
    },
    {
      title: `PIB en ${gameState.gdpGrowth > 0 ? 'croissance' : 'récession'} de ${Math.abs(gameState.gdpGrowth).toFixed(1)}%`,
      source: 'Les Échos', 
      impact: gameState.gdpGrowth > 0 ? 'positive' : 'negative',
      time: '11:15'
    },
    {
      title: `Chômage à ${gameState.unemployment.toFixed(1)}% : ${gameState.unemployment < 7 ? 'amélioration' : 'préoccupation'}`,
      source: 'France Info',
      impact: gameState.unemployment < 7 ? 'positive' : 'negative', 
      time: '14:20'
    }
  ];

  const news = generateNews();

  const handleDecision = (optionId: string) => {
    const option = currentEvent.options.find(o => o.id === optionId);
    if (!option) return;

    // Appliquer les effets
    setGameState(prev => {
      const newState = { ...prev };
      Object.entries(option.effects).forEach(([key, value]) => {
        if (key in newState) {
          newState[key as keyof typeof newState] = Math.max(0, Math.min(100, 
            (newState[key as keyof typeof newState] as number) + value
          ));
        }
      });
      return newState;
    });

    setLastDecision(`Vous avez choisi : "${option.label}" - Conséquences : ${Object.entries(option.effects).map(([k,v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}`);
    setShowEventDecision(false);
    
    // Passer à l'événement suivant
    setTimeout(() => {
      setCurrentEventIndex(i => (i + 1) % politicalEvents.length);
    }, 3000);
  };

  const advanceTime = (hours: number) => {
    setGameState(prev => ({ 
      ...prev, 
      dayInMandate: prev.dayInMandate + Math.floor(hours / 24)
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white'
    }}>
      {/* En-tête présidentiel */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}>
            RF
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Bureau du Président</h1>
            <p style={{ margin: 0, opacity: 0.8 }}>
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} • 
              Jour {gameState.dayInMandate} du mandat • Phase {gameState.phase}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { label: 'Popularité', value: `${gameState.popularity}%`, color: '#3b82f6' },
            { label: 'Capital Politique', value: `${gameState.politicalCapital}pts`, color: '#22c55e' },
            { label: 'PIB', value: `+${gameState.gdpGrowth}%`, color: '#f59e0b' },
            { label: 'Chômage', value: `${gameState.unemployment}%`, color: '#ef4444' }
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: '🏛️' },
            { id: 'events', label: 'Événements politiques', icon: '⚡' },
            { id: 'agenda', label: 'Agenda présidentiel', icon: '📅' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                color: 'white',
                border: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                padding: '1rem 2rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Dernière décision */}
      {lastDecision && (
        <div style={{
          margin: '2rem',
          padding: '1rem 2rem',
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '10px'
        }}>
          <strong>Conséquence de votre décision :</strong> {lastDecision}
          <button 
            onClick={() => setLastDecision('')}
            style={{
              float: 'right',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Contenu principal */}
      <main style={{ padding: '2rem' }}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Vue d'ensemble</h2>
            
            {/* Actualités */}
            <section style={{ marginBottom: '3rem' }}>
              <h3>📰 Actualités</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {news.map((article, index) => (
                  <div 
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      borderLeft: `5px solid ${article.impact === 'positive' ? '#22c55e' : article.impact === 'negative' ? '#ef4444' : '#6b7280'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{article.title}</h4>
                      <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        {article.source} • {article.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contrôles */}
            <section>
              <h3>⏰ Contrôles temporels</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => advanceTime(1)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  +1 heure
                </button>
                <button
                  onClick={() => setShowEventDecision(true)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ⚡ Nouvel événement politique
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h2>⚡ Événements politiques</h2>
            {showEventDecision ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '20px',
                border: '2px solid rgba(239, 68, 68, 0.5)'
              }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                  {currentEvent.title}
                </h3>
                <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                  {currentEvent.description}
                </p>
                
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {currentEvent.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleDecision(option.id)}
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
                        {option.description}
                      </div>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Effets: {Object.entries(option.effects).map(([k,v]) => `${k} ${v > 0 ? '+' : ''}${v}`).join(', ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                  Aucun événement politique en cours.
                </p>
                <button
                  onClick={() => setShowEventDecision(true)}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Déclencher un événement
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agenda' && (
          <div>
            <h2>📅 Agenda présidentiel</h2>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2rem', borderRadius: '15px' }}>
              <h3>Événements du jour</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { time: '10:00', title: 'Conseil des ministres', location: 'Salon Murat' },
                  { time: '14:30', title: 'Entretien diplomatique', location: 'Bureau présidentiel' },
                  { time: '18:00', title: 'Point presse', location: 'Salon des Fêtes' }
                ].map((event, index) => (
                  <div 
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '1rem',
                      borderRadius: '10px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <strong>{event.time}</strong> - {event.title}
                    </div>
                    <div style={{ opacity: 0.7 }}>
                      📍 {event.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Composant principal
export const MinimalWorkingGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return gameStarted 
    ? <PresidentialDashboard />
    : <SimpleInit onComplete={() => setGameStarted(true)} />;
};