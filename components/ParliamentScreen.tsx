import React from 'react';
import { useGameState } from '../src/store/gameState';
import { useParliamentStore } from '../src/store/parliamentStore';
import type { Law } from '../src/types/laws';
import '../src/styles/ParliamentScreen.css';

const ParliamentScreen: React.FC = () => {
  const { party } = useGameState();
  const { parties, currentLaw, proposeLaw } = useParliamentStore();

  const pendingLaws: Law[] = [
    {
      id: 'law1',
      title: 'Réforme des retraites',
      description: "Report de l'âge légal à 65 ans",
      category: 'social',
      cost: 0,
      timeToImplement: 180,
      supportNeeded: 289,
      effects: {
        immediate: { popularity: -10, syndicats: -15 },
        longTerm: { budget: 15, stability: 5 }
      },
      oppositionLevel: 75
    },
    {
      id: 'law2',
      title: 'Loi sur le climat',
      description: "Réduction des émissions de CO₂ de 50% d'ici 2030",
      category: 'environmental',
      cost: 50000000,
      timeToImplement: 365,
      supportNeeded: 350,
      effects: {
        immediate: { popularity: 5, syndicats: -5 },
        longTerm: { budget: -20, stability: 10 }
      },
      oppositionLevel: 30
    },
    {
      id: 'law3',
      title: 'Loi sur la sécurité',
      description: 'Renforcement des mesures de sécurité intérieure',
      category: 'security',
      cost: 20000000,
      timeToImplement: 90,
      supportNeeded: 250,
      effects: {
        immediate: { popularity: 10, syndicats: -10 },
        longTerm: { budget: -5, stability: 15 }
      },
      oppositionLevel: 50
    },
    {
      id: 'law4',
      title: 'Plan national d’adaptation au changement climatique (PNACC-3)',
      description: 'Intégration obligatoire de la trajectoire +4°C dans les documents d’urbanisme',
      category: 'environmental',
      cost: 75000000,
      timeToImplement: 540,
      supportNeeded: 300,
      effects: {
        immediate: { popularity: 3, syndicats: -2 },
        longTerm: { budget: -10, stability: 8 }
      },
      oppositionLevel: 40
    },
    {
      id: 'law5',
      title: 'Création du parquet national contre le crime organisé',
      description: 'Mise en place d’un parquet spécialisé pour lutter contre le narcotrafic',
      category: 'security',
      cost: 15000000,
      timeToImplement: 120,
      supportNeeded: 270,
      effects: {
        immediate: { popularity: 8, syndicats: -5 },
        longTerm: { budget: -5, stability: 12 }
      },
      oppositionLevel: 35
    },
    {
      id: 'law6',
      title: 'Réforme de la fiscallityité des locations meublées',
      description: 'Réintégration des amortissements dans le calcul des plus-values',
      category: 'fiscallity',
      cost: 0,
      timeToImplement: 90,
      supportNeeded: 289,
      effects: {
        immediate: { popularity: -5, syndicats: 0 },
        longTerm: { budget: 10, stability: 3 }
      },
      oppositionLevel: 60
    },
    {
      id: 'law7',
      title: 'Loi d’orientation agricole',
      description: 'Régulation du foncier et soutien à l’agriculture paysanne',
      category: 'agriculture',
      cost: 30000000,
      timeToImplement: 365,
      supportNeeded: 310,
      effects: {
        immediate: { popularity: 6, syndicats: 4 },
        longTerm: { budget: -5, stability: 7 }
      },
      oppositionLevel: 45
    },
    {
      id: 'law8',
      title: 'Projet de loi de finances 2025',
      description: 'Réduction du déficit public à 5,4% du PIB',
      category: 'finance',
      cost: 0,
      timeToImplement: 180,
      supportNeeded: 289,
      effects: {
        immediate: { popularity: -8, syndicats: -10 },
        longTerm: { budget: 20, stability: 10 }
      },
      oppositionLevel: 70
    },
    {
      id: 'law9',
      title: 'Semaine de travail à 32 heures',
      description: 'Réduction du temps de travail sans baisse de salaire dans certaines branches',
      category: 'social',
      cost: 80000000,
      timeToImplement: 365,
      supportNeeded: 300,
      effects: {
        immediate: { popularity: 12, syndicats: 20 },
        longTerm: { budget: -25, stability: -5 }
      },
      oppositionLevel: 65
    },
  
    // LOI ÉCOLOGIQUE - TRANSITION
    {
      id: 'law10',
      title: 'Interdiction progressive des voitures thermiques',
      description: 'Fin de la vente des véhicules essence et diesel dès 2032',
      category: 'environmental',
      cost: 120000000,
      timeToImplement: 1825,
      supportNeeded: 320,
      effects: {
        immediate: { popularity: -5, entreprises: -10 },
        longTerm: { budget: -30, environmental: 30, stability: 5 }
      },
      oppositionLevel: 50
    },
  
    // LOI NUMÉRIQUE - IA
    {
      id: 'law11',
      title: 'Régulation de l’intelligence artificielle',
      description: 'Encadrement éthique et fiscallity des usages publics et privés de l’IA',
      category: 'technology',
      cost: 25000000,
      timeToImplement: 240,
      supportNeeded: 275,
      effects: {
        immediate: { popularity: 4, entreprises: -2 },
        longTerm: { budget: 5, stability: 10 }
      },
      oppositionLevel: 40
    },
  
    // LOI IMMIGRATION
    {
      id: 'law12',
      title: 'Réforme du droit d’asile',
      description: 'Accélération des procédures et renforcement des centres de rétention',
      category: 'immigration',
      cost: 10000000,
      timeToImplement: 150,
      supportNeeded: 290,
      effects: {
        immediate: { popularity: -3, security: 10 },
        longTerm: { stability: 5, budget: -5 }
      },
      oppositionLevel: 55
    },
  
    // LOI fiscallityE - NUMÉRIQUE
    {
      id: 'law13',
      title: 'Taxe sur les grandes plateformes numériques',
      description: 'Taxation accrue des bénéfices réalisés par les GAFAM',
      category: 'fiscallity',
      cost: 0,
      timeToImplement: 90,
      supportNeeded: 280,
      effects: {
        immediate: { popularity: 6, entreprises: -10 },
        longTerm: { budget: 15, stability: 3 }
      },
      oppositionLevel: 60
    },
  
    // LOI SANTÉ
    {
      id: 'law14',
      title: 'Rénovation des hôpitaux publics',
      description: 'Investissement massif dans les infrastructures hospitalières',
      category: 'health',
      cost: 150000000,
      timeToImplement: 730,
      supportNeeded: 310,
      effects: {
        immediate: { popularity: 15, syndicats: 10 },
        longTerm: { stability: 10, budget: -20 }
      },
      oppositionLevel: 25
    },
  
    // LOI OUTRE-MER
    {
      id: 'law15',
      title: 'Plan Marshall pour l’Outre-mer',
      description: 'Développement économique, infrastructures et désenclavement des territoires ultramarins',
      category: 'territoires',
      cost: 80000000,
      timeToImplement: 540,
      supportNeeded: 290,
      effects: {
        immediate: { popularity: 8, territoires: 20 },
        longTerm: { budget: -15, stability: 7 }
      },
      oppositionLevel: 35
    },
  
    // LOI DÉMOCRATIE
    {
      id: 'law16',
      title: 'Réforme institutionnelle',
      description: 'Proportionnelle intégrale, limitation du 49.3, réduction du nombre de députés',
      category: 'institution',
      cost: 0,
      timeToImplement: 270,
      supportNeeded: 350,
      effects: {
        immediate: { popularity: 10 },
        longTerm: { stability: 15 }
      },
      oppositionLevel: 70
    },
  
    // LOI ÉDUCATION - 2030
    {
      id: 'law17',
      title: 'École numérique 2030',
      description: 'Équipement informatique complet et formation numérique dès la 6e',
      category: 'education',
      cost: 90000000,
      timeToImplement: 730,
      supportNeeded: 300,
      effects: {
        immediate: { popularity: 6, syndicats: 5 },
        longTerm: { budget: -10, stability: 12 }
      },
      oppositionLevel: 40
    }
  ];
  

  const handleProposeLaw = (law: Law) => {
    proposeLaw(law);
  };

  return (
    <div className="parliament-screen">
      <div className="parliament-header">
        <h2>Assemblée Nationale</h2>
        <div className="parliament-stats">
          <div className="stat-item">
            <span className="stat-value">{party?.seatsInParliament}</span>
            <span className="stat-label">Sièges de votre groupe</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">577</span>
            <span className="stat-label">Total des sièges</span>
          </div>
        </div>
      </div>

      <div className="parliament-content">
        <div className="pending-laws">
          <h3>Projets de loi en cours</h3>
          {pendingLaws.map(law => (
            <div key={law.id} className="law-card">
              <div className="law-header">
                <h4>{law.title}</h4>
                <span className={`law-category ${law.category}`}>
                  {law.category}
                </span>
              </div>
              <p>{law.description}</p>
              <div className="law-stats">
                <div className="law-stat">
                  <span className="stat-label">Soutien requis</span>
                  <span className="stat-value">{law.supportNeeded} députés</span>
                </div>
                <div className="law-stat">
                  <span className="stat-label">Opposition</span>
                  <div className="opposition-bar">
                    <div 
                      className="opposition-fill"
                      style={{width: `${law.oppositionLevel}%`}}
                    />
                  </div>
                </div>
              </div>
              <div className="law-actions">
                <button 
                  className="btn-negotiate"
                  onClick={() => handleProposeLaw(pendingLaws[0])}
                >
                  Négocier
                </button>
                <button className="btn-vote">Mettre au vote</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParliamentScreen;
